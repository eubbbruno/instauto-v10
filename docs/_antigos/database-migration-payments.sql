-- ============================================
-- MIGRATION: Adicionar campos de pagamento
-- ============================================

-- Adicionar campos para integração com MercadoPago
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS 
  mercadopago_subscription_id TEXT;

ALTER TABLE workshops ADD COLUMN IF NOT EXISTS 
  subscription_status TEXT DEFAULT 'none' 
  CHECK (subscription_status IN ('none', 'pending', 'active', 'cancelled', 'paused'));

-- Adicionar índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_workshops_subscription_status 
  ON workshops(subscription_status);

-- Comentários
COMMENT ON COLUMN workshops.mercadopago_subscription_id IS 'ID da assinatura no MercadoPago';
COMMENT ON COLUMN workshops.subscription_status IS 'Status da assinatura: none, pending, active, cancelled, paused';

-- Atualizar trial para 14 dias (ao invés de 30)
ALTER TABLE workshops ALTER COLUMN trial_ends_at 
  SET DEFAULT (NOW() + INTERVAL '14 days');

-- Função para verificar se tem acesso PRO
CREATE OR REPLACE FUNCTION has_pro_access(p_workshop_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_type TEXT;
  v_trial_ends_at TIMESTAMPTZ;
  v_subscription_status TEXT;
BEGIN
  SELECT plan_type, trial_ends_at, subscription_status
  INTO v_plan_type, v_trial_ends_at, v_subscription_status
  FROM workshops
  WHERE id = p_workshop_id;
  
  -- Se é PRO e assinatura ativa
  IF v_plan_type = 'pro' AND v_subscription_status = 'active' THEN
    RETURN TRUE;
  END IF;
  
  -- Se ainda está no trial
  IF v_trial_ends_at > NOW() THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION has_pro_access IS 'Verifica se a oficina tem acesso aos recursos PRO';

-- ============================================
-- FIM DA MIGRATION
-- ============================================

