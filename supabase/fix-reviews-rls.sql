-- ============================================
-- CORRIGIR RLS DA TABELA REVIEWS
-- ============================================
-- Este script corrige as políticas de segurança da tabela reviews
-- para permitir que qualquer pessoa possa criar avaliações
-- ============================================

-- 1. Remover policies antigas (se existirem)
DROP POLICY IF EXISTS "reviews_select_public" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_public" ON reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON reviews;

-- 2. Habilitar RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3. Permitir leitura pública de todas as avaliações
CREATE POLICY "reviews_select_public" 
ON reviews 
FOR SELECT 
USING (true);

-- 4. Permitir qualquer pessoa criar avaliações (público ou autenticado)
CREATE POLICY "reviews_insert_public" 
ON reviews 
FOR INSERT 
WITH CHECK (true);

-- 5. Permitir oficinas responderem suas próprias avaliações
-- (apenas se tiver motorist_id, para identificar que é da oficina)
CREATE POLICY "reviews_update_workshop_response" 
ON reviews 
FOR UPDATE 
TO authenticated
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
WHERE tablename = 'reviews'
ORDER BY policyname;

-- ============================================
-- COMENTÁRIOS:
-- ============================================
-- A tabela reviews agora permite:
-- - Qualquer pessoa pode VER avaliações (público)
-- - Qualquer pessoa pode CRIAR avaliações (público ou autenticado)
-- - Apenas oficinas podem RESPONDER suas próprias avaliações (autenticado)
--
-- Isso permite que motoristas avaliem sem precisar estar logados,
-- mas ainda mantém controle sobre quem pode responder.
-- ============================================
