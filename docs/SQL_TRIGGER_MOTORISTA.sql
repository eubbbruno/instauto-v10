-- ============================================
-- TRIGGER PARA CRIAR MOTORISTA AUTOMATICAMENTE
-- ============================================
-- Execute este SQL DEPOIS do SQL_UNICO_EXECUTAR.sql
-- ============================================

-- 1. CRIAR FUNÇÃO QUE SERÁ EXECUTADA QUANDO O EMAIL FOR CONFIRMADO
CREATE OR REPLACE FUNCTION handle_email_confirmed()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Verificar se o email foi confirmado (mudou de NULL para uma data)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Extrair nome do usuário
    user_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    );
    
    -- Criar profile se não existir
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (
      NEW.id,
      NEW.email,
      user_name,
      'motorista'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      type = COALESCE(profiles.type, 'motorista'),
      name = COALESCE(profiles.name, user_name);
    
    -- Criar motorista se não existir
    INSERT INTO public.motorists (profile_id, name)
    VALUES (
      NEW.id,
      user_name
    )
    ON CONFLICT (profile_id) DO NOTHING;
    
    -- Log de sucesso
    RAISE NOTICE 'Motorista criado para: %', NEW.email;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CRIAR TRIGGER NA TABELA auth.users
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_email_confirmed();

-- ============================================
-- PRONTO! AGORA QUANDO O USUÁRIO CONFIRMAR O EMAIL
-- O PERFIL DE MOTORISTA SERÁ CRIADO AUTOMATICAMENTE
-- ============================================

