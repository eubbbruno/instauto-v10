-- ====================================
-- 🔍 DEBUG: VERIFICAR OFICINAS PÚBLICAS
-- ====================================
-- Execute este script no Supabase SQL Editor para diagnosticar o problema

-- 1. VERIFICAR SE TABELA WORKSHOPS EXISTE
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'workshops'
) AS workshops_table_exists;

-- 2. CONTAR TOTAL DE OFICINAS
SELECT 
  COUNT(*) AS total_workshops,
  COUNT(*) FILTER (WHERE is_public = true) AS public_workshops,
  COUNT(*) FILTER (WHERE is_public = false OR is_public IS NULL) AS private_workshops
FROM workshops;

-- 3. LISTAR OFICINAS PÚBLICAS (primeiras 10)
SELECT 
  id,
  name,
  city,
  state,
  is_public,
  rating,
  reviews_count,
  created_at
FROM workshops
WHERE is_public = true
ORDER BY rating DESC NULLS LAST
LIMIT 10;

-- 4. VERIFICAR POLICIES RLS DA TABELA WORKSHOPS
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

-- 5. VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'workshops';

-- ====================================
-- 🔧 CORREÇÃO RÁPIDA (se necessário)
-- ====================================

-- Se não houver oficinas públicas, tornar TODAS públicas temporariamente:
-- DESCOMENTE A LINHA ABAIXO APENAS SE NECESSÁRIO:
-- UPDATE workshops SET is_public = true WHERE is_public IS NULL OR is_public = false;

-- Se não houver policy pública, criar:
-- DESCOMENTE AS LINHAS ABAIXO APENAS SE NECESSÁRIO:
/*
DROP POLICY IF EXISTS "workshops_public_read" ON workshops;

CREATE POLICY "workshops_public_read"
ON workshops
FOR SELECT
USING (is_public = true);
*/

-- ====================================
-- 📊 RESULTADO ESPERADO
-- ====================================
-- Você deve ver:
-- ✅ workshops_table_exists = true
-- ✅ public_workshops > 0
-- ✅ Lista com pelo menos 1 oficina
-- ✅ Policy "workshops_public_read" existe
-- ✅ rowsecurity = true (RLS habilitado)

-- Se algum desses não for verdadeiro, use as correções acima!
