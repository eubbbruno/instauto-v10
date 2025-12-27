-- ============================================
-- LIMPAR TODOS OS USUÁRIOS DE TESTE
-- ============================================
-- ⚠️ CUIDADO: Isso vai DELETAR TODOS os usuários!
-- Use apenas em desenvolvimento/teste
-- ============================================

-- 1. DELETAR TODOS OS MOTORISTAS
DELETE FROM motorists;

-- 2. DELETAR TODOS OS PROFILES
DELETE FROM profiles;

-- 3. DELETAR TODOS OS USUÁRIOS DO AUTH
-- (Isso também deleta automaticamente os profiles e motoristas por CASCADE)
DELETE FROM auth.users;

-- ============================================
-- PRONTO! TODOS OS USUÁRIOS FORAM REMOVIDOS
-- Agora você pode usar os mesmos emails novamente
-- ============================================

-- OPCIONAL: Verificar se está tudo limpo
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_motorists FROM motorists;

-- Deve retornar 0 em todos

