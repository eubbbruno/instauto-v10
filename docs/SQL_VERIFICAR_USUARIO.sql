-- ============================================
-- VERIFICAR SE USUÁRIO FOI CRIADO CORRETAMENTE
-- ============================================

-- 1. VER TODOS OS USUÁRIOS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.type as profile_type,
  m.id as motorist_id,
  w.id as workshop_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
LEFT JOIN workshops w ON u.id = w.profile_id
ORDER BY u.created_at DESC
LIMIT 10;

-- 2. VER APENAS MOTORISTAS
SELECT 
  u.email,
  u.email_confirmed_at,
  p.name as profile_name,
  p.type,
  m.id as motorist_id,
  m.name as motorist_name
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
WHERE p.type = 'motorista'
ORDER BY u.created_at DESC;

-- 3. VER USUÁRIOS SEM MOTORIST (PROBLEMA!)
SELECT 
  u.email,
  u.email_confirmed_at,
  p.type,
  m.id as motorist_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
WHERE p.type = 'motorista' AND m.id IS NULL;

-- Se retornar algum resultado, significa que o perfil foi criado
-- mas o motorist não foi. Execute o SQL abaixo para corrigir:

-- 4. CRIAR MOTORIST PARA USUÁRIOS QUE NÃO TEM
-- (Substitua 'seu-email@teste.com' pelo email do usuário)
/*
INSERT INTO motorists (profile_id, name)
SELECT 
  u.id,
  COALESCE(p.name, split_part(u.email, '@', 1))
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
WHERE u.email = 'seu-email@teste.com'
  AND NOT EXISTS (
    SELECT 1 FROM motorists m WHERE m.profile_id = u.id
  );
*/

-- 5. VERIFICAR SE FOI CRIADO
SELECT 
  u.email,
  m.id as motorist_id,
  m.name
FROM auth.users u
INNER JOIN motorists m ON u.id = m.profile_id
WHERE u.email = 'seu-email@teste.com';

-- ============================================

