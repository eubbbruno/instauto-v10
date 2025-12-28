-- ============================================
-- CONFIGURAR REDIRECT URL NO SUPABASE
-- ============================================
-- Este SQL não é necessário executar.
-- É apenas para referência das configurações.
-- ============================================

-- IMPORTANTE: Você precisa configurar isso manualmente no painel do Supabase!

-- 1. Vá em: Authentication → URL Configuration
-- 2. Em "Site URL", coloque: https://www.instauto.com.br
-- 3. Em "Redirect URLs", adicione:
--    - https://www.instauto.com.br/auth/callback
--    - https://instauto.com.br/auth/callback
--    - http://localhost:3000/auth/callback (para desenvolvimento)

-- 4. Salve as configurações

-- ============================================
-- VERIFICAR SE O REDIRECT ESTÁ FUNCIONANDO
-- ============================================

-- Execute este SQL para ver os últimos usuários e seus status:
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  confirmation_sent_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Se email_confirmed_at estiver NULL, o usuário ainda não confirmou o email
-- Se email_confirmed_at tiver uma data, o email foi confirmado

-- ============================================
-- FORÇAR CONFIRMAÇÃO DE EMAIL (APENAS TESTE)
-- ============================================

-- ⚠️ Use isso APENAS para testar, não em produção!
-- Isso confirma o email de um usuário específico:

-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE email = 'seu-email@teste.com';

-- Depois de executar isso, o trigger vai criar automaticamente
-- o profile e o motorista

-- ============================================

