-- ============================================
-- CRIAR MOTORIST PARA USUÁRIOS QUE NÃO TEM
-- ============================================

-- 1. VER USUÁRIOS SEM MOTORIST
SELECT 
  u.id,
  u.email,
  p.type,
  p.name
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
WHERE p.type = 'motorista' AND m.id IS NULL;

-- 2. CRIAR MOTORIST PARA TODOS QUE NÃO TEM
INSERT INTO motorists (profile_id, name)
SELECT 
  p.id,
  COALESCE(p.name, split_part(u.email, '@', 1))
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
WHERE p.type = 'motorista' AND m.id IS NULL;

-- 3. VERIFICAR SE FOI CRIADO
SELECT 
  u.email,
  p.type,
  m.id as motorist_id,
  m.name
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
INNER JOIN motorists m ON u.id = m.profile_id
WHERE p.type = 'motorista'
ORDER BY u.created_at DESC;

-- ============================================

