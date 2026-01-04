-- ============================================
-- LIMPAR HISTÓRICO DE QUERIES NO SUPABASE
-- ============================================
-- Este script limpa o histórico de queries
-- salvas no SQL Editor do Supabase
-- ============================================

-- IMPORTANTE: Este script NÃO deleta dados!
-- Ele apenas limpa o histórico de queries salvas.

-- Para limpar o histórico:
-- 1. Vá em: SQL Editor no Supabase
-- 2. Clique nos 3 pontinhos (...) ao lado de cada query salva
-- 3. Clique em "Delete"

-- OU

-- Você pode criar uma nova pasta para organizar:
-- 1. Clique em "New folder"
-- 2. Nomeie como "Antigas" ou "Arquivo"
-- 3. Arraste as queries antigas para lá

-- ============================================
-- QUERIES ESSENCIAIS PARA MANTER
-- ============================================

-- 1. Verificar estrutura das tabelas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'motorists', 'workshops')
ORDER BY table_name, ordinal_position;

-- 2. Verificar usuários e profiles
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.name,
  p.type,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- 3. Verificar motoristas
SELECT 
  m.id,
  m.profile_id,
  p.name,
  p.email,
  m.created_at
FROM motorists m
JOIN profiles p ON p.id = m.profile_id
ORDER BY m.created_at DESC;

-- 4. Verificar oficinas
SELECT 
  w.id,
  w.profile_id,
  w.name,
  w.cnpj,
  w.phone,
  w.city,
  w.state,
  w.plan_type,
  w.created_at
FROM workshops w
ORDER BY w.created_at DESC;

-- 5. Verificar RLS policies
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

-- ============================================
-- FIM
-- ============================================

