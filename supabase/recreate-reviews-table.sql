-- ============================================
-- RECRIAR TABELA REVIEWS COMPLETA
-- ============================================
-- Este script recria a tabela reviews do zero com TODAS as colunas
-- necessárias para o sistema de avaliações funcionar corretamente
-- ============================================

-- ATENÇÃO: Este script vai APAGAR todos os dados da tabela reviews!
-- Se você tem dados importantes, faça backup antes de executar.

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS reviews CASCADE;

-- 2. Criar tabela reviews com TODAS as colunas necessárias
CREATE TABLE reviews (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_id UUID NULL REFERENCES profiles(id) ON DELETE SET NULL,
  quote_id UUID NULL REFERENCES quotes(id) ON DELETE SET NULL,
  
  -- Dados do motorista (para avaliações públicas sem login)
  motorist_name TEXT,
  motorist_email TEXT,
  
  -- Avaliação
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_type TEXT,
  
  -- Resposta da oficina
  workshop_response TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar índices para melhor performance
CREATE INDEX idx_reviews_workshop_id ON reviews(workshop_id);
CREATE INDEX idx_reviews_motorist_id ON reviews(motorist_id);
CREATE INDEX idx_reviews_quote_id ON reviews(quote_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- 4. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 6. Remover policies antigas (se existirem)
DROP POLICY IF EXISTS "reviews_select_public" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_public" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON reviews;
DROP POLICY IF EXISTS "reviews_update_workshop_response" ON reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON reviews;

-- 7. Criar policies de segurança

-- Permitir leitura pública de todas as avaliações
CREATE POLICY "reviews_select_public" 
ON reviews 
FOR SELECT 
USING (true);

-- Permitir qualquer pessoa criar avaliações (público ou autenticado)
-- Isso permite que motoristas avaliem sem precisar estar logados
CREATE POLICY "reviews_insert_public" 
ON reviews 
FOR INSERT 
WITH CHECK (true);

-- Permitir oficinas responderem suas próprias avaliações
CREATE POLICY "reviews_update_workshop_response" 
ON reviews 
FOR UPDATE 
TO authenticated
USING (
  workshop_id IN (
    SELECT id FROM workshops WHERE profile_id = auth.uid()
  )
)
WITH CHECK (
  workshop_id IN (
    SELECT id FROM workshops WHERE profile_id = auth.uid()
  )
);

-- 8. Verificar estrutura criada
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'reviews'
ORDER BY ordinal_position;

-- 9. Verificar policies criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'reviews'
ORDER BY policyname;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- A tabela reviews agora tem:
-- ✅ id (UUID, primary key)
-- ✅ workshop_id (UUID, obrigatório)
-- ✅ motorist_id (UUID, opcional - para usuários logados)
-- ✅ quote_id (UUID, opcional - se veio de um orçamento)
-- ✅ motorist_name (TEXT, opcional - para avaliações públicas)
-- ✅ motorist_email (TEXT, opcional - para avaliações públicas)
-- ✅ rating (INTEGER 1-5, obrigatório)
-- ✅ comment (TEXT, opcional)
-- ✅ service_type (TEXT, opcional)
-- ✅ workshop_response (TEXT, opcional)
-- ✅ responded_at (TIMESTAMPTZ, opcional)
-- ✅ created_at (TIMESTAMPTZ, automático)
-- ✅ updated_at (TIMESTAMPTZ, automático)
--
-- Policies:
-- ✅ Qualquer pessoa pode VER avaliações
-- ✅ Qualquer pessoa pode CRIAR avaliações
-- ✅ Apenas oficinas podem RESPONDER suas avaliações
-- ============================================
