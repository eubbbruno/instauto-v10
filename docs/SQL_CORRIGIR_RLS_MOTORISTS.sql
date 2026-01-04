-- ========================================
-- CORRIGIR RLS PARA MOTORISTS
-- ========================================
-- Execute este SQL no Supabase SQL Editor

-- 1. Remover policies antigas de motorists
DROP POLICY IF EXISTS "Enable all for motorist owner" ON motorists;
DROP POLICY IF EXISTS "Users can insert own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can view own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can update own motorist" ON motorists;
DROP POLICY IF EXISTS "Motorists: insert own" ON motorists;
DROP POLICY IF EXISTS "Motorists: select own" ON motorists;
DROP POLICY IF EXISTS "Motorists: update own" ON motorists;

-- 2. Criar policies simples e permissivas para motorists
CREATE POLICY "Motorists: insert own" ON motorists FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: select own" ON motorists FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists: update own" ON motorists FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: delete own" ON motorists FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- 3. Garantir que RLS está ativado
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

-- 4. Verificar policies criadas
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
WHERE tablename = 'motorists'
ORDER BY policyname;

