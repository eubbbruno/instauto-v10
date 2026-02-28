-- =====================================================
-- FIX: Quotes RLS + Adicionar coluna images
-- =====================================================

-- 1. Adicionar coluna images se não existir
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS images TEXT[];

-- 2. Remover policies antigas problemáticas
DROP POLICY IF EXISTS "quotes_create" ON quotes;
DROP POLICY IF EXISTS "quotes_insert" ON quotes;
DROP POLICY IF EXISTS "quotes_insert_policy" ON quotes;

-- 3. Criar policy correta para INSERT (permite qualquer usuário autenticado)
CREATE POLICY "quotes_insert_authenticated" ON quotes
FOR INSERT TO authenticated
WITH CHECK (true);

-- 4. Verificar se existe policy para SELECT
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'quotes_select_own'
    ) THEN
        CREATE POLICY "quotes_select_own" ON quotes
        FOR SELECT TO authenticated
        USING (
            motorist_email = auth.email() OR
            workshop_id IN (
                SELECT id FROM workshops WHERE profile_id = auth.uid()
            )
        );
    END IF;
END $$;

-- 5. Verificar se existe policy para UPDATE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'quotes_update_workshop'
    ) THEN
        CREATE POLICY "quotes_update_workshop" ON quotes
        FOR UPDATE TO authenticated
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
    END IF;
END $$;

-- 6. Verificar policies criadas
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
WHERE tablename = 'quotes'
ORDER BY policyname;

-- 7. Verificar estrutura da tabela
\d quotes;
