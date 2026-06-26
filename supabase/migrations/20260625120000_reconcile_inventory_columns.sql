-- inventory: form do Estoque grava colunas que o banco (setup-v10) não tinha.
-- Alinhar o banco ao código (aditivo). cost_price/sell_price ficam para evolução futura (margem de custo/venda).
ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS unit_price numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supplier text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS description text;
