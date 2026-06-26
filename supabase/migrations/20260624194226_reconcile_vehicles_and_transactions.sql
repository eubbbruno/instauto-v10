-- Garante a função de updated_at (idempotente, schema-qualificada, search_path fixo)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- vehicles: coluna usada pelo formulário mas inexistente no banco
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS notes text;

-- transactions: colunas usadas pelo TransactionModal mas ausentes
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS payment_method varchar(30),
  ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS reference_id uuid,
  ADD COLUMN IF NOT EXISTS reference_type varchar(30),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
