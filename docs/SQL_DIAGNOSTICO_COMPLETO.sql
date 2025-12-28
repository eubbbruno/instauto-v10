-- ============================================
-- DIAGNÓSTICO COMPLETO DO SUPABASE
-- ============================================
-- Execute este SQL e me mande TODO o resultado
-- ============================================

-- 1. VER TODOS OS USUÁRIOS
SELECT 
  'USERS' as tabela,
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  NULL as type,
  NULL as motorist_id,
  NULL as workshop_id
FROM auth.users u
ORDER BY u.created_at DESC;

-- 2. VER TODOS OS PROFILES
SELECT 
  'PROFILES' as tabela,
  p.id,
  p.email,
  NULL as email_confirmed_at,
  p.created_at,
  p.type,
  NULL as motorist_id,
  NULL as workshop_id
FROM profiles p
ORDER BY p.created_at DESC;

-- 3. VER TODOS OS MOTORISTS
SELECT 
  'MOTORISTS' as tabela,
  m.id,
  NULL as email,
  NULL as email_confirmed_at,
  m.created_at,
  NULL as type,
  m.profile_id as motorist_id,
  NULL as workshop_id
FROM motorists m
ORDER BY m.created_at DESC;

-- 4. VER TODOS OS WORKSHOPS
SELECT 
  'WORKSHOPS' as tabela,
  w.id,
  NULL as email,
  NULL as email_confirmed_at,
  w.created_at,
  NULL as type,
  NULL as motorist_id,
  w.profile_id as workshop_id
FROM workshops w
ORDER BY w.created_at DESC;

-- 5. VER RELAÇÃO COMPLETA
SELECT 
  u.email,
  u.email_confirmed_at,
  p.type as profile_type,
  m.id as motorist_id,
  w.id as workshop_id,
  CASE 
    WHEN m.id IS NOT NULL THEN 'TEM MOTORIST'
    WHEN w.id IS NOT NULL THEN 'TEM WORKSHOP'
    ELSE 'SEM NADA'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
LEFT JOIN workshops w ON u.id = w.profile_id
ORDER BY u.created_at DESC;

-- 6. VER TRIGGERS ATIVOS
SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('profiles', 'motorists', 'workshops')
ORDER BY event_object_table, trigger_name;

-- 7. VER POLICIES DE RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'motorists', 'workshops')
ORDER BY tablename, policyname;

-- ============================================
-- COPIE E COLE TODO O RESULTADO AQUI
-- ============================================

