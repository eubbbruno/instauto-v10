-- service_orders: banco ficou na versão setup-v10; código (NewOSModal + detalhe) espera a versão rica
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS order_number serial;

ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS client_notes text,
  ADD COLUMN IF NOT EXISTS diagnosis text,
  ADD COLUMN IF NOT EXISTS km_entry integer,
  ADD COLUMN IF NOT EXISTS km_exit integer,
  ADD COLUMN IF NOT EXISTS estimated_completion date,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS labor_cost numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parts_cost numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- relaxa o CHECK para incluir 'approved' (usado no código)
ALTER TABLE public.service_orders DROP CONSTRAINT IF EXISTS service_orders_status_check;
ALTER TABLE public.service_orders ADD CONSTRAINT service_orders_status_check
  CHECK (status IN ('pending','approved','in_progress','waiting_parts','completed','delivered','cancelled'));

DROP TRIGGER IF EXISTS update_service_orders_updated_at ON public.service_orders;
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
