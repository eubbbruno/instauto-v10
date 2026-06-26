-- Despesas: form grava notes (inexistente)
ALTER TABLE public.motorist_expenses ADD COLUMN IF NOT EXISTS notes text;

-- Lembretes: form grava amount/notes/reminder_days_before; lista filtra/atualiza is_completed/completed_at
ALTER TABLE public.motorist_reminders
  ADD COLUMN IF NOT EXISTS amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS reminder_days_before integer[],
  ADD COLUMN IF NOT EXISTS is_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Abastecimento: form grava total_amount/gas_station/city/state/notes
-- (banco tinha total_price/station_name, que ficam como legado/órfão)
ALTER TABLE public.motorist_fueling
  ADD COLUMN IF NOT EXISTS total_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS gas_station text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS notes text;

-- total_price (legado) era NOT NULL e o código nunca o preenche -> insert real falhava.
ALTER TABLE public.motorist_fueling ALTER COLUMN total_price DROP NOT NULL;
