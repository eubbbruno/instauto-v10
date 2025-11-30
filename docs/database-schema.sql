-- ============================================
-- INSTAUTO V10 - DATABASE SCHEMA
-- ============================================
-- Versão: 1.0
-- Data: 2024-11-29
-- Descrição: Schema completo do banco de dados
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: profiles
-- ============================================
-- Estende os dados do auth.users do Supabase
-- Armazena informações adicionais do usuário

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('oficina', 'motorista', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);

-- Comentários
COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema';
COMMENT ON COLUMN profiles.type IS 'Tipo de usuário: oficina, motorista ou admin';

-- ============================================
-- TABELA: workshops
-- ============================================
-- Dados das oficinas cadastradas

CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_workshops_plan_type ON workshops(plan_type);
CREATE INDEX IF NOT EXISTS idx_workshops_cnpj ON workshops(cnpj);

-- Comentários
COMMENT ON TABLE workshops IS 'Oficinas cadastradas no sistema';
COMMENT ON COLUMN workshops.plan_type IS 'Plano da oficina: free (10 clientes, 30 OS/mês) ou pro (ilimitado)';
COMMENT ON COLUMN workshops.trial_ends_at IS 'Data de término do período de teste';

-- ============================================
-- TABELA: clients
-- ============================================
-- Clientes das oficinas

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_workshop_id ON clients(workshop_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_cpf ON clients(cpf);

-- Comentários
COMMENT ON TABLE clients IS 'Clientes das oficinas';
COMMENT ON COLUMN clients.workshop_id IS 'Oficina à qual o cliente pertence';

-- ============================================
-- TABELA: vehicles
-- ============================================
-- Veículos dos clientes

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  color TEXT,
  km INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_vehicles_client_id ON vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_workshop_id ON vehicles(workshop_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

-- Comentários
COMMENT ON TABLE vehicles IS 'Veículos dos clientes';
COMMENT ON COLUMN vehicles.workshop_id IS 'Oficina que gerencia o veículo (desnormalizado para performance)';
COMMENT ON COLUMN vehicles.plate IS 'Placa do veículo';

-- ============================================
-- TABELA: service_orders
-- ============================================
-- Ordens de serviço

CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
  services JSONB DEFAULT '[]'::jsonb,
  parts JSONB DEFAULT '[]'::jsonb,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workshop_id, order_number)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_service_orders_workshop_id ON service_orders(workshop_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_id ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle_id ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_order_number ON service_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_service_orders_created_at ON service_orders(created_at DESC);

-- Comentários
COMMENT ON TABLE service_orders IS 'Ordens de serviço das oficinas';
COMMENT ON COLUMN service_orders.order_number IS 'Número sequencial da OS por oficina (ex: OS-2024-0001)';
COMMENT ON COLUMN service_orders.status IS 'Status: pending, approved, in_progress, completed, cancelled';
COMMENT ON COLUMN service_orders.services IS 'Array JSON de serviços: [{name, price, quantity}]';
COMMENT ON COLUMN service_orders.parts IS 'Array JSON de peças: [{name, price, quantity}]';

-- ============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workshops_updated_at ON workshops;
CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_orders_updated_at ON service_orders;
CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO: Criar profile automaticamente após signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'type', 'oficina')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- FUNÇÃO: Criar workshop automaticamente para oficinas
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_workshop_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'oficina' THEN
    INSERT INTO public.workshops (profile_id, name, plan_type)
    VALUES (
      NEW.id,
      NEW.name,
      'free'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_workshop_profile();

-- ============================================
-- FUNÇÃO: Gerar número sequencial de OS
-- ============================================

CREATE OR REPLACE FUNCTION generate_order_number(p_workshop_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INTEGER;
  v_order_number TEXT;
BEGIN
  -- Ano atual
  v_year := TO_CHAR(NOW(), 'YYYY');
  
  -- Contar OS do ano atual para esta oficina
  SELECT COUNT(*) + 1 INTO v_count
  FROM service_orders
  WHERE workshop_id = p_workshop_id
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  -- Formatar: OS-2024-0001
  v_order_number := 'OS-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');
  
  RETURN v_order_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_order_number IS 'Gera número sequencial de OS por oficina e ano';

-- ============================================
-- FUNÇÃO: Atualizar total da OS automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION calculate_service_order_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total := COALESCE(NEW.labor_cost, 0) + COALESCE(NEW.parts_cost, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_total_before_insert ON service_orders;
CREATE TRIGGER calculate_total_before_insert
  BEFORE INSERT ON service_orders
  FOR EACH ROW EXECUTE FUNCTION calculate_service_order_total();

DROP TRIGGER IF EXISTS calculate_total_before_update ON service_orders;
CREATE TRIGGER calculate_total_before_update
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION calculate_service_order_total();

-- ============================================
-- FUNÇÃO: Atualizar datas de início e conclusão
-- ============================================

CREATE OR REPLACE FUNCTION handle_service_order_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Se mudou para in_progress e não tem started_at, define agora
  IF NEW.status = 'in_progress' AND OLD.status != 'in_progress' AND NEW.started_at IS NULL THEN
    NEW.started_at := NOW();
  END IF;
  
  -- Se mudou para completed e não tem completed_at, define agora
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_status_change ON service_orders;
CREATE TRIGGER handle_status_change
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION handle_service_order_status();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins podem ver todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- ============================================
-- POLICIES: workshops
-- ============================================

-- Oficinas podem ver seus próprios dados
DROP POLICY IF EXISTS "Workshops can view own data" ON workshops;
CREATE POLICY "Workshops can view own data"
  ON workshops FOR SELECT
  USING (profile_id = auth.uid());

-- Oficinas podem atualizar seus próprios dados
DROP POLICY IF EXISTS "Workshops can update own data" ON workshops;
CREATE POLICY "Workshops can update own data"
  ON workshops FOR UPDATE
  USING (profile_id = auth.uid());

-- Oficinas podem inserir seus próprios dados
DROP POLICY IF EXISTS "Workshops can insert own data" ON workshops;
CREATE POLICY "Workshops can insert own data"
  ON workshops FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Admins podem ver todas as oficinas
DROP POLICY IF EXISTS "Admins can view all workshops" ON workshops;
CREATE POLICY "Admins can view all workshops"
  ON workshops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- ============================================
-- POLICIES: clients
-- ============================================

-- Oficinas podem ver seus próprios clientes
DROP POLICY IF EXISTS "Workshops can view own clients" ON clients;
CREATE POLICY "Workshops can view own clients"
  ON clients FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem criar clientes
DROP POLICY IF EXISTS "Workshops can insert clients" ON clients;
CREATE POLICY "Workshops can insert clients"
  ON clients FOR INSERT
  WITH CHECK (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar seus clientes
DROP POLICY IF EXISTS "Workshops can update own clients" ON clients;
CREATE POLICY "Workshops can update own clients"
  ON clients FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar seus clientes
DROP POLICY IF EXISTS "Workshops can delete own clients" ON clients;
CREATE POLICY "Workshops can delete own clients"
  ON clients FOR DELETE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES: vehicles
-- ============================================

-- Oficinas podem ver veículos de seus clientes
DROP POLICY IF EXISTS "Workshops can view client vehicles" ON vehicles;
CREATE POLICY "Workshops can view client vehicles"
  ON vehicles FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem criar veículos para seus clientes
DROP POLICY IF EXISTS "Workshops can insert client vehicles" ON vehicles;
CREATE POLICY "Workshops can insert client vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar veículos de seus clientes
DROP POLICY IF EXISTS "Workshops can update client vehicles" ON vehicles;
CREATE POLICY "Workshops can update client vehicles"
  ON vehicles FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar veículos de seus clientes
DROP POLICY IF EXISTS "Workshops can delete client vehicles" ON vehicles;
CREATE POLICY "Workshops can delete client vehicles"
  ON vehicles FOR DELETE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES: service_orders
-- ============================================

-- Oficinas podem ver suas próprias ordens de serviço
DROP POLICY IF EXISTS "Workshops can view own service orders" ON service_orders;
CREATE POLICY "Workshops can view own service orders"
  ON service_orders FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem criar ordens de serviço
DROP POLICY IF EXISTS "Workshops can insert service orders" ON service_orders;
CREATE POLICY "Workshops can insert service orders"
  ON service_orders FOR INSERT
  WITH CHECK (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar suas ordens de serviço
DROP POLICY IF EXISTS "Workshops can update own service orders" ON service_orders;
CREATE POLICY "Workshops can update own service orders"
  ON service_orders FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar suas ordens de serviço
DROP POLICY IF EXISTS "Workshops can delete own service orders" ON service_orders;
CREATE POLICY "Workshops can delete own service orders"
  ON service_orders FOR DELETE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Estatísticas da oficina
CREATE OR REPLACE VIEW workshop_stats AS
SELECT
  w.id AS workshop_id,
  w.profile_id,
  w.name AS workshop_name,
  w.plan_type,
  COUNT(DISTINCT c.id) AS total_clients,
  COUNT(DISTINCT v.id) AS total_vehicles,
  COUNT(DISTINCT so.id) AS total_service_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'pending' THEN so.id END) AS pending_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'approved' THEN so.id END) AS approved_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'in_progress' THEN so.id END) AS in_progress_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'completed' THEN so.id END) AS completed_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'cancelled' THEN so.id END) AS cancelled_orders,
  COALESCE(SUM(CASE WHEN so.status = 'completed' THEN so.total ELSE 0 END), 0) AS total_revenue,
  COALESCE(AVG(CASE WHEN so.status = 'completed' THEN so.total END), 0) AS avg_order_value
FROM workshops w
LEFT JOIN clients c ON c.workshop_id = w.id
LEFT JOIN vehicles v ON v.workshop_id = w.id
LEFT JOIN service_orders so ON so.workshop_id = w.id
GROUP BY w.id, w.profile_id, w.name, w.plan_type;

-- Permitir acesso à view
GRANT SELECT ON workshop_stats TO authenticated;

COMMENT ON VIEW workshop_stats IS 'Estatísticas agregadas por oficina';

-- View: Últimas OS por oficina
CREATE OR REPLACE VIEW recent_service_orders AS
SELECT
  so.id,
  so.workshop_id,
  so.order_number,
  so.status,
  so.total,
  so.created_at,
  c.name AS client_name,
  v.plate AS vehicle_plate,
  v.brand || ' ' || v.model AS vehicle_info
FROM service_orders so
LEFT JOIN clients c ON c.id = so.client_id
LEFT JOIN vehicles v ON v.id = so.vehicle_id
ORDER BY so.created_at DESC;

-- Permitir acesso à view
GRANT SELECT ON recent_service_orders TO authenticated;

COMMENT ON VIEW recent_service_orders IS 'Últimas ordens de serviço com informações do cliente e veículo';

-- ============================================
-- FUNÇÃO: Verificar limites do plano FREE
-- ============================================

CREATE OR REPLACE FUNCTION check_free_plan_limits(p_workshop_id UUID)
RETURNS TABLE(
  can_add_client BOOLEAN,
  can_add_order BOOLEAN,
  clients_count INTEGER,
  clients_limit INTEGER,
  orders_this_month INTEGER,
  orders_limit INTEGER
) AS $$
DECLARE
  v_plan_type TEXT;
  v_clients_count INTEGER;
  v_orders_count INTEGER;
BEGIN
  -- Buscar tipo de plano
  SELECT plan_type INTO v_plan_type
  FROM workshops
  WHERE id = p_workshop_id;
  
  -- Se for PRO, sem limites
  IF v_plan_type = 'pro' THEN
    RETURN QUERY SELECT true, true, 0, -1, 0, -1;
    RETURN;
  END IF;
  
  -- Contar clientes
  SELECT COUNT(*) INTO v_clients_count
  FROM clients
  WHERE workshop_id = p_workshop_id;
  
  -- Contar OS do mês atual
  SELECT COUNT(*) INTO v_orders_count
  FROM service_orders
  WHERE workshop_id = p_workshop_id
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW());
  
  -- Retornar limites
  RETURN QUERY SELECT
    (v_clients_count < 10)::BOOLEAN,
    (v_orders_count < 30)::BOOLEAN,
    v_clients_count,
    10,
    v_orders_count,
    30;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_free_plan_limits IS 'Verifica limites do plano FREE (10 clientes, 30 OS/mês)';

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir um usuário admin de exemplo (DESCOMENTE SE NECESSÁRIO)
-- ATENÇÃO: Altere o email e senha antes de usar em produção!

/*
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@instauto.com',
  crypt('Admin@123', gen_salt('bf')),
  NOW(),
  '{"name": "Admin Instauto", "type": "admin"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Verificar se tudo foi criado corretamente
DO $$
BEGIN
  RAISE NOTICE '✅ Schema criado com sucesso!';
  RAISE NOTICE '📊 Tabelas: profiles, workshops, clients, vehicles, service_orders';
  RAISE NOTICE '🔒 RLS habilitado em todas as tabelas';
  RAISE NOTICE '⚡ Triggers configurados';
  RAISE NOTICE '📈 Views criadas: workshop_stats, recent_service_orders';
  RAISE NOTICE '🎯 Pronto para uso!';
END $$;


