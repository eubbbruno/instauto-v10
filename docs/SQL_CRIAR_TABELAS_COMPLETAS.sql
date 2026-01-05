-- =====================================================
-- SCRIPT SQL COMPLETO - INSTAUTO V10
-- Tabelas: Promoções, Mensagens/Chat, Notificações
-- =====================================================

-- =====================================================
-- 1. TABELA DE PROMOÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  discount VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  valid_until DATE NOT NULL,
  color VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
  icon VARCHAR(10) DEFAULT '🎁',
  terms TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_promotions_category ON promotions(category);
CREATE INDEX IF NOT EXISTS idx_promotions_featured ON promotions(featured);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_until ON promotions(valid_until);

-- RLS Policies (público - todos podem ler)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoções são públicas"
  ON promotions FOR SELECT
  USING (is_active = true AND valid_until >= CURRENT_DATE);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();

-- =====================================================
-- 2. TABELA DE CONVERSAS (CHATS)
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  motorist_unread_count INTEGER DEFAULT 0,
  workshop_unread_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(motorist_id, workshop_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversations_motorist ON conversations(motorist_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workshop ON conversations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(is_active);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motoristas podem ver suas conversas"
  ON conversations FOR SELECT
  USING (
    motorist_id IN (
      SELECT id FROM motorists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Oficinas podem ver suas conversas"
  ON conversations FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Motoristas podem criar conversas"
  ON conversations FOR INSERT
  WITH CHECK (
    motorist_id IN (
      SELECT id FROM motorists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Motoristas podem atualizar suas conversas"
  ON conversations FOR UPDATE
  USING (
    motorist_id IN (
      SELECT id FROM motorists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Oficinas podem atualizar suas conversas"
  ON conversations FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();

-- =====================================================
-- 3. TABELA DE MENSAGENS
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('motorist', 'workshop')),
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(is_read) WHERE is_read = false;

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver mensagens de suas conversas"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
         OR workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Usuários podem enviar mensagens"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
         OR workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Usuários podem atualizar suas mensagens"
  ON messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
         OR workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

-- Trigger para atualizar conversa quando nova mensagem
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.message,
    last_message_at = NEW.created_at,
    motorist_unread_count = CASE 
      WHEN NEW.sender_type = 'workshop' THEN motorist_unread_count + 1
      ELSE motorist_unread_count
    END,
    workshop_unread_count = CASE 
      WHEN NEW.sender_type = 'motorist' THEN workshop_unread_count + 1
      ELSE workshop_unread_count
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- =====================================================
-- 4. TABELA DE NOTIFICAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('quote_response', 'message', 'maintenance', 'alert', 'promotion')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas notificações"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas notificações"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Sistema pode criar notificações"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 5. INSERIR PROMOÇÕES INICIAIS
-- =====================================================

INSERT INTO promotions (partner, title, description, discount, category, valid_until, color, icon, terms, featured) VALUES
('Uber', '15% OFF em manutenções preventivas', 'Parceiros Uber têm desconto especial em todos os serviços de manutenção preventiva', '15%', 'Manutenção', '2025-03-31', 'from-black to-gray-800', '🚗', 'Válido para parceiros Uber ativos. Apresentar comprovante de parceria.', true),
('Mercado Livre', '10% OFF + Frete Grátis em peças', 'Compre peças automotivas originais com desconto exclusivo e frete grátis', '10%', 'Peças', '2025-02-28', 'from-yellow-400 to-yellow-500', '📦', 'Válido para compras acima de R$ 200. Código: INSTAUTO10', true),
('iFood', '20% OFF em revisões completas', 'Entregadores parceiros economizam mais em revisões completas', '20%', 'Revisão', '2025-04-30', 'from-red-500 to-red-600', '🍔', 'Válido para entregadores iFood com mais de 100 entregas/mês.', true),
('99', '12% OFF em troca de óleo', 'Motoristas 99 têm desconto especial em troca de óleo e filtros', '12%', 'Manutenção', '2025-03-15', 'from-orange-500 to-orange-600', '🚕', 'Válido para motoristas 99 ativos.', false),
('Rappi', '18% OFF em alinhamento e balanceamento', 'Parceiros Rappi economizam em serviços de alinhamento', '18%', 'Manutenção', '2025-02-20', 'from-pink-500 to-pink-600', '🛵', 'Válido para parceiros Rappi com cadastro ativo.', false),
('Loggi', '25% OFF em manutenção de freios', 'Desconto especial para motoristas Loggi em serviços de freios', '25%', 'Manutenção', '2025-03-25', 'from-green-500 to-green-600', '📦', 'Válido para motoristas Loggi com mais de 50 entregas/mês.', false),
('Lalamove', '15% OFF em diagnóstico completo', 'Diagnóstico completo com desconto para parceiros Lalamove', '15%', 'Diagnóstico', '2025-04-10', 'from-blue-500 to-blue-600', '🔧', 'Válido para parceiros Lalamove ativos.', false),
('Zé Delivery', '20% OFF em troca de pneus', 'Parceiros Zé Delivery economizam na troca de pneus', '20%', 'Pneus', '2025-03-31', 'from-yellow-600 to-yellow-700', '🍺', 'Válido para parceiros Zé Delivery com cadastro ativo.', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. FUNÇÃO PARA CRIAR NOTIFICAÇÃO AUTOMÁTICA
-- =====================================================

CREATE OR REPLACE FUNCTION create_quote_notification()
RETURNS TRIGGER AS $$
DECLARE
  motorist_profile_id UUID;
  workshop_name TEXT;
BEGIN
  -- Buscar profile_id do motorista
  SELECT p.id INTO motorist_profile_id
  FROM motorists m
  JOIN profiles p ON p.id = m.profile_id
  WHERE m.id = NEW.motorist_id;
  
  -- Buscar nome da oficina
  SELECT name INTO workshop_name
  FROM workshops
  WHERE id = NEW.workshop_id;
  
  -- Criar notificação quando orçamento for respondido
  IF NEW.status = 'responded' AND OLD.status != 'responded' THEN
    INSERT INTO notifications (user_id, type, title, message, link, data)
    VALUES (
      motorist_profile_id,
      'quote_response',
      'Orçamento Respondido',
      workshop_name || ' respondeu seu orçamento',
      '/motorista/orcamentos',
      jsonb_build_object('quote_id', NEW.id, 'workshop_name', workshop_name)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quote_notification_trigger
  AFTER UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION create_quote_notification();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Verificar tabelas criadas
SELECT 
  'promotions' as table_name,
  COUNT(*) as total_records
FROM promotions
UNION ALL
SELECT 
  'conversations' as table_name,
  COUNT(*) as total_records
FROM conversations
UNION ALL
SELECT 
  'messages' as table_name,
  COUNT(*) as total_records
FROM messages
UNION ALL
SELECT 
  'notifications' as table_name,
  COUNT(*) as total_records
FROM notifications;

