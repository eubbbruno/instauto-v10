-- Histórico de manutenção do motorista: tabela não existia (página de histórico quebrava ao ler).
-- vehicle_id referencia motorist_vehicles (não vehicles), conforme o join da página.
CREATE TABLE IF NOT EXISTS public.maintenance_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  motorist_id uuid REFERENCES public.motorists(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.motorist_vehicles(id) ON DELETE SET NULL,
  workshop_id uuid REFERENCES public.workshops(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  description text,
  mileage integer,
  cost numeric(10,2),
  service_date date NOT NULL,
  next_service_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_history_motorist ON public.maintenance_history(motorist_id);

ALTER TABLE public.maintenance_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS motorist_maintenance_history ON public.maintenance_history;
CREATE POLICY motorist_maintenance_history ON public.maintenance_history FOR ALL USING (
  motorist_id IN (SELECT id FROM public.motorists WHERE profile_id = auth.uid())
);
