-- ============================================
-- REMOVER TRIGGER PROBLEMÁTICO
-- ============================================
-- Este trigger está causando o erro "Error confirming user"
-- ============================================

-- 1. REMOVER TRIGGER DA TABELA auth.users
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users CASCADE;

-- 2. REMOVER FUNÇÃO ASSOCIADA
DROP FUNCTION IF EXISTS handle_email_confirmed() CASCADE;

-- 3. VERIFICAR SE FOI REMOVIDO
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Deve retornar vazio (nenhum resultado)

-- ============================================
-- ATUALIZAR POLICIES DE RLS
-- ============================================

-- Permitir usuário criar seu próprio profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Permitir usuário ler seu próprio profile  
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Permitir usuário atualizar seu próprio profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Permitir criar motorist vinculado ao próprio profile
DROP POLICY IF EXISTS "Users can insert own motorist" ON motorists;
CREATE POLICY "Users can insert own motorist" ON motorists
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Permitir ler próprio motorist
DROP POLICY IF EXISTS "Users can view own motorist" ON motorists;
CREATE POLICY "Users can view own motorist" ON motorists
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- Permitir atualizar próprio motorist
DROP POLICY IF EXISTS "Users can update own motorist" ON motorists;
CREATE POLICY "Users can update own motorist" ON motorists
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================
-- PRONTO! AGORA O CALLBACK VAI FUNCIONAR
-- ============================================

