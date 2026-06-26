-- appointments: a página de Agenda + calendário são construídos em torno de date/start_time/end_time.
-- Banco estava no modelo scheduled_at/duration (nunca usado pelo código). Alinhar banco->código.
ALTER TABLE public.appointments
  ALTER COLUMN scheduled_at DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS date date,
  ADD COLUMN IF NOT EXISTS start_time text,
  ADD COLUMN IF NOT EXISTS end_time text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS notes text;
-- scheduled_at e duration_minutes ficam como colunas legadas/órfãs (não removidas p/ não arriscar dados).
