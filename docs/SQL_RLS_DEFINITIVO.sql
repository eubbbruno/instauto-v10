-- ============================================
-- SQL PARA GARANTIR RLS CORRETO
-- Execute no Supabase SQL Editor
-- ============================================

-- Remover policies antigas conflitantes de profiles
DROP POLICY IF EXISTS "Enable all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable all for authenticated users on profiles" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;

-- Remover policies antigas conflitantes de motorists
DROP POLICY IF EXISTS "Enable all for authenticated users on motorists" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem atualizar seu próprio perfil" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem atualizar seus próprios dados" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem inserir seus próprios dados" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem ver seu próprio perfil" ON motorists;
DROP POLICY IF EXISTS "Motoristas podem ver seus próprios dados" ON motorists;
DROP POLICY IF EXISTS "Motorists can update own data" ON motorists;
DROP POLICY IF EXISTS "Motorists can view own data" ON motorists;
DROP POLICY IF EXISTS "Qualquer um pode criar motorista" ON motorists;

-- Remover policies antigas conflitantes de workshops
DROP POLICY IF EXISTS "Enable all for authenticated users on workshops" ON workshops;
DROP POLICY IF EXISTS "Enable all for workshop owner" ON workshops;
DROP POLICY IF EXISTS "Allow authenticated to read workshops" ON workshops;

-- ============================================
-- CRIAR POLICIES SIMPLES E PERMISSIVAS
-- ============================================

-- Profiles: usuários autenticados podem gerenciar seu próprio perfil
CREATE POLICY "Profiles: insert own" ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: select own" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles: update own" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Motorists: usuários autenticados podem gerenciar seus próprios dados
CREATE POLICY "Motorists: insert own" ON motorists FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: select own" ON motorists FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists: update own" ON motorists FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Workshops: usuários autenticados podem gerenciar seus próprios dados
CREATE POLICY "Workshops: insert own" ON workshops FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Workshops: select own" ON workshops FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Workshops: update own" ON workshops FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Workshops: usuários autenticados podem ver todas as oficinas (para marketplace)
CREATE POLICY "Workshops: select all for marketplace" ON workshops FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- VERIFICAR SE RLS ESTÁ ATIVADO
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICAR POLICIES CRIADAS
-- ============================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'motorists', 'workshops')
ORDER BY tablename, policyname;

