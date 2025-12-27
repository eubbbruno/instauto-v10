-- ============================================
-- SQL ÚNICO PARA EXECUTAR NO SUPABASE
-- ============================================
-- COPIE E COLE TUDO DE UMA VEZ NO SQL EDITOR
-- ============================================

-- 1. GARANTIR QUE A COLUNA TYPE PERMITE NULL
ALTER TABLE profiles ALTER COLUMN type DROP NOT NULL;

-- 2. CRIAR TABELA MOTORISTS (se não existir)
CREATE TABLE IF NOT EXISTS motorists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- 3. HABILITAR RLS NA TABELA MOTORISTS
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

-- 4. REMOVER POLÍTICAS ANTIGAS (se existirem)
DROP POLICY IF EXISTS "Motoristas podem ver seus próprios dados" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem atualizar seus próprios dados" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem inserir seus próprios dados" ON motorists;

-- 5. CRIAR POLÍTICAS CORRETAS
CREATE POLICY "Motoristas podem ver seus próprios dados"
  ON motorists FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Motoristas podem atualizar seus próprios dados"
  ON motorists FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Motoristas podem inserir seus próprios dados"
  ON motorists FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- 6. CRIAR ÍNDICE PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_motorists_profile_id ON motorists(profile_id);

-- 7. REMOVER POLÍTICAS ANTIGAS DA TABELA PROFILES (se existirem)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON profiles;

-- 8. CRIAR POLÍTICAS CORRETAS PARA PROFILES
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 9. REMOVER TRIGGERS ANTIGOS (se existirem)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- ============================================
-- PRONTO! AGORA TESTE O CADASTRO
-- ============================================

