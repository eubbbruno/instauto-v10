-- =====================================================
-- SCRIPT SQL DEFINITIVO - INSTAUTO
-- =====================================================
-- Execute este script no Supabase SQL Editor para
-- configurar as políticas RLS de forma limpa e correta
-- =====================================================

-- PASSO 1: Remover todas as policies antigas que podem estar causando conflito
-- =====================================================

-- Remover policies antigas de profiles
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles: insert own" ON profiles;
DROP POLICY IF EXISTS "Profiles: select own" ON profiles;
DROP POLICY IF EXISTS "Profiles: update own" ON profiles;

-- Remover policies antigas de motorists
DROP POLICY IF EXISTS "Enable all for motorist owner" ON motorists;
DROP POLICY IF EXISTS "Users can insert own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can view own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can update own motorist" ON motorists;
DROP POLICY IF EXISTS "Motorists: insert own" ON motorists;
DROP POLICY IF EXISTS "Motorists: select own" ON motorists;
DROP POLICY IF EXISTS "Motorists: update own" ON motorists;

-- Remover policies antigas de workshops
DROP POLICY IF EXISTS "Workshops: insert own" ON workshops;
DROP POLICY IF EXISTS "Workshops: select own" ON workshops;
DROP POLICY IF EXISTS "Workshops: update own" ON workshops;
DROP POLICY IF EXISTS "Workshops: select all for marketplace" ON workshops;

-- PASSO 2: Criar policies simples e permissivas para PROFILES
-- =====================================================

CREATE POLICY "Profiles: insert own" ON profiles 
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: select own" ON profiles 
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles: update own" ON profiles 
  FOR UPDATE TO authenticated
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- PASSO 3: Criar policies para MOTORISTS
-- =====================================================

CREATE POLICY "Motorists: insert own" ON motorists 
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: select own" ON motorists 
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists: update own" ON motorists 
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) 
  WITH CHECK (profile_id = auth.uid());

-- PASSO 4: Criar policies para WORKSHOPS
-- =====================================================

-- Inserir apenas o próprio workshop
CREATE POLICY "Workshops: insert own" ON workshops 
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Ver o próprio workshop
CREATE POLICY "Workshops: select own" ON workshops 
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- Atualizar apenas o próprio workshop
CREATE POLICY "Workshops: update own" ON workshops 
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) 
  WITH CHECK (profile_id = auth.uid());

-- Todos podem ver workshops no marketplace (para motoristas)
CREATE POLICY "Workshops: select all for marketplace" ON workshops 
  FOR SELECT TO authenticated
  USING (true);

-- PASSO 5: Garantir que RLS está ativado
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- PASSO 6: Verificar se as policies foram criadas corretamente
-- =====================================================

-- Execute esta query para verificar:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'motorists', 'workshops')
-- ORDER BY tablename, policyname;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- Após executar este script:
-- 1. Verifique se não há erros
-- 2. Teste o cadastro de motorista
-- 3. Teste o cadastro de oficina
-- 4. Teste o login com Google
-- =====================================================
