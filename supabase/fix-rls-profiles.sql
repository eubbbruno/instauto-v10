-- ================================================
-- CORRIGIR RLS DA TABELA PROFILES
-- ================================================

-- Ver policies atuais
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Remover policies antigas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users" ON profiles;

-- Criar policies corretas
-- SELECT: Usuário pode ver SEU PRÓPRIO profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- INSERT: Usuário pode inserir SEU PRÓPRIO profile
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Usuário pode atualizar SEU PRÓPRIO profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Verificar se RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Testar
SELECT 'RLS corrigido!' as status;
