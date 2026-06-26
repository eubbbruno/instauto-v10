-- Itens da OS (serviços e peças)
CREATE TABLE IF NOT EXISTS public.service_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('service','part')),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_order_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  notes TEXT,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_order_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.service_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_checklist_order ON public.service_order_checklist(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order ON public.service_order_history(order_id);

ALTER TABLE public.service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workshop_order_items ON public.service_order_items;
CREATE POLICY workshop_order_items ON public.service_order_items FOR ALL USING (
  order_id IN (SELECT id FROM public.service_orders
    WHERE workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid()))
);

DROP POLICY IF EXISTS workshop_order_checklist ON public.service_order_checklist;
CREATE POLICY workshop_order_checklist ON public.service_order_checklist FOR ALL USING (
  order_id IN (SELECT id FROM public.service_orders
    WHERE workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid()))
);

DROP POLICY IF EXISTS workshop_order_history ON public.service_order_history;
CREATE POLICY workshop_order_history ON public.service_order_history FOR ALL USING (
  order_id IN (SELECT id FROM public.service_orders
    WHERE workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid()))
);

-- Função + trigger de histórico automático de mudança de status
CREATE OR REPLACE FUNCTION public.log_service_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.service_order_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_order_status_change ON public.service_orders;
CREATE TRIGGER log_order_status_change AFTER UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.log_service_order_status_change();
