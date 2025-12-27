-- ============================================
-- TRIGGER PARA CRIAR MOTORISTA AUTOMATICAMENTE
-- ============================================
-- Execute este SQL DEPOIS do SQL_UNICO_EXECUTAR.sql
-- ============================================

-- 1. CRIAR FUNÇÃO QUE SERÁ EXECUTADA QUANDO O EMAIL FOR CONFIRMADO
CREATE OR REPLACE FUNCTION handle_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o email foi confirmado (mudou de NULL para uma data)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Criar profile se não existir
    INSERT INTO public.profiles (id, email, name, type)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'motorista'
    )
    ON CONFLICT (id) DO UPDATE
    SET type = 'motorista';
    
    -- Criar motorista
    INSERT INTO public.motorists (profile_id, name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (profile_id) DO NOTHING;
    
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

