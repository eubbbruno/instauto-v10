-- =====================================================
-- FIX: Google OAuth - Corrigir criação de profile
-- =====================================================
-- Problema: Ao fazer login com Google, o trigger falha
-- porque não sabe se é 'oficina' ou 'motorista'
-- Solução: Não criar profile automaticamente, deixar
-- para a página /completar-cadastro
-- =====================================================

-- 1. REMOVER trigger automático (causa erro no OAuth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. REMOVER função antiga
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. REMOVER trigger de criar workshop automaticamente
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- 4. REMOVER função antiga
DROP FUNCTION IF EXISTS handle_new_workshop_profile();

-- 5. Tornar o campo 'type' NULLABLE temporariamente
-- (será preenchido na página /completar-cadastro)
ALTER TABLE profiles ALTER COLUMN type DROP NOT NULL;

-- =====================================================
-- PRONTO! Agora o Google OAuth vai funcionar
-- =====================================================
-- O fluxo será:
-- 1. Usuário faz login com Google
-- 2. auth.users é criado (sem profile ainda)
-- 3. Redireciona para /completar-cadastro
-- 4. Usuário escolhe tipo (oficina/motorista)
-- 5. Profile é criado manualmente
-- 6. Workshop ou Motorist é criado
-- =====================================================

