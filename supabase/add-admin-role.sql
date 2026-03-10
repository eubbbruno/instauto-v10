-- ============================================
-- ADICIONAR ROLE DE ADMIN
-- ============================================
-- Este script adiciona a coluna "role" na tabela profiles
-- e define o primeiro admin do sistema
-- ============================================

-- 1. Adicionar coluna role (se não existir)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. Definir admin principal
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'eubbbruno@gmail.com';

-- 4. Verificar se foi aplicado
SELECT id, email, name, type, role, created_at 
FROM profiles 
WHERE role = 'admin';

-- ============================================
-- COMENTÁRIOS:
-- ============================================
-- role = 'user' (padrão) - Usuário normal (motorista ou oficina)
-- role = 'admin' - Administrador do sistema (acesso total)
--
-- Para adicionar mais admins no futuro:
-- UPDATE profiles SET role = 'admin' WHERE email = 'outro@email.com';
-- ============================================
