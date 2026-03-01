-- =====================================================
-- FIX: Workshops Public RLS
-- Permitir leitura de oficinas públicas sem autenticação
-- =====================================================

-- 1. Verificar policies atuais
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'workshops'
ORDER BY policyname;

-- 2. Remover policy antiga se existir
DROP POLICY IF EXISTS "workshops_public" ON workshops;
DROP POLICY IF EXISTS "workshops_public_read" ON workshops;
DROP POLICY IF EXISTS "workshops_select_public" ON workshops;

-- 3. Criar policy para leitura pública de oficinas públicas
CREATE POLICY "workshops_public_read" ON workshops
FOR SELECT
USING (is_public = true);

-- 4. Verificar se existe policy para SELECT autenticado
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workshops' AND policyname = 'workshops_select_own'
    ) THEN
        CREATE POLICY "workshops_select_own" ON workshops
        FOR SELECT TO authenticated
        USING (profile_id = auth.uid());
    END IF;
END $$;

-- 5. Verificar se existe policy para UPDATE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workshops' AND policyname = 'workshops_update_own'
    ) THEN
        CREATE POLICY "workshops_update_own" ON workshops
        FOR UPDATE TO authenticated
        USING (profile_id = auth.uid())
        WITH CHECK (profile_id = auth.uid());
    END IF;
END $$;

-- 6. Verificar policies criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'workshops'
ORDER BY policyname;

-- 7. Testar query pública (deve retornar oficinas públicas)
SELECT id, name, city, state, is_public 
FROM workshops 
WHERE is_public = true 
LIMIT 5;
