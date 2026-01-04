-- ========================================
-- CORRIGIR RLS PARA WORKSHOPS
-- ========================================
-- Execute este SQL no Supabase SQL Editor

-- 1. Remover policies antigas de workshops
DROP POLICY IF EXISTS "Enable all for workshop owner" ON workshops;
DROP POLICY IF EXISTS "Users can insert own workshop" ON workshops;
DROP POLICY IF EXISTS "Users can view own workshop" ON workshops;
DROP POLICY IF EXISTS "Users can update own workshop" ON workshops;
DROP POLICY IF EXISTS "Workshops: insert own" ON workshops;
DROP POLICY IF EXISTS "Workshops: select own" ON workshops;
DROP POLICY IF EXISTS "Workshops: update own" ON workshops;

-- 2. Criar policies simples e permissivas para workshops
CREATE POLICY "Workshops: insert own" ON workshops FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Workshops: select own" ON workshops FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Workshops: update own" ON workshops FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Workshops: delete own" ON workshops FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- 3. Garantir que RLS está ativado
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

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
WHERE tablename = 'workshops'
ORDER BY policyname;

