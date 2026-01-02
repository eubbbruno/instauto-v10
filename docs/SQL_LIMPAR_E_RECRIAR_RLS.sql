-- ============================================
-- LIMPAR TUDO E RECRIAR RLS DO ZERO
-- Execute no Supabase SQL Editor
-- ============================================

-- ============================================
-- PASSO 1: REMOVER TODAS AS POLICIES
-- ============================================

-- Desabilitar RLS temporariamente para limpar
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE motorists DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;

-- Remover TODAS as policies de profiles
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Remover TODAS as policies de motorists
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'motorists' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON motorists';
    END LOOP;
END $$;

-- Remover TODAS as policies de workshops
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'workshops' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON workshops';
    END LOOP;
END $$;

-- ============================================
-- PASSO 2: REATIVAR RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 3: CRIAR POLICIES NOVAS E SIMPLES
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
-- PASSO 4: VERIFICAR POLICIES CRIADAS
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

