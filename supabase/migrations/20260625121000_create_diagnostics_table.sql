-- Diagnóstico IA: a tabela não existia (a IA respondia, mas salvar/histórico quebrava)
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id uuid REFERENCES public.workshops(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  symptoms text NOT NULL,
  diagnosis text,
  recommendations text,
  severity text,
  estimated_cost text,
  safe_to_drive boolean,
  ai_model text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnostics_workshop ON public.diagnostics(workshop_id);

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS workshop_diagnostics ON public.diagnostics;
CREATE POLICY workshop_diagnostics ON public.diagnostics FOR ALL USING (
  workshop_id IN (SELECT id FROM public.workshops WHERE profile_id = auth.uid())
);
