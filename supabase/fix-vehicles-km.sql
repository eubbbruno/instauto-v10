-- ============================================
-- FIX: Adicionar coluna km na tabela vehicles
-- ============================================

-- Adicionar coluna km se não existir
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS km INTEGER DEFAULT 0;

-- Adicionar coluna km na tabela motorist_vehicles também (se existir)
ALTER TABLE motorist_vehicles ADD COLUMN IF NOT EXISTS km INTEGER DEFAULT 0;

-- Verificar estrutura da tabela vehicles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela motorist_vehicles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'motorist_vehicles'
ORDER BY ordinal_position;

-- ============================================
-- INSTRUÇÕES:
-- 1. Copie este SQL
-- 2. Execute no SQL Editor do Supabase
-- 3. Verifique se a coluna km aparece nas tabelas
-- ============================================
