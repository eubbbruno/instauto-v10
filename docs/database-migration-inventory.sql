-- =====================================================
-- MIGRATION: INVENTORY (ESTOQUE DE PEÇAS)
-- =====================================================
-- Este arquivo adiciona a tabela de estoque de peças
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Criar tabela inventory
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  brand TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  cost_price DECIMAL(10,2) DEFAULT 0,
  sell_price DECIMAL(10,2) DEFAULT 0,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_inventory_workshop_id ON inventory(workshop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_updated_at();

-- RLS (Row Level Security)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Política: Oficina pode gerenciar seu próprio estoque
CREATE POLICY "Workshop can manage own inventory"
ON inventory FOR ALL
TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Comentários
COMMENT ON TABLE inventory IS 'Estoque de peças das oficinas';
COMMENT ON COLUMN inventory.workshop_id IS 'ID da oficina dona do item';
COMMENT ON COLUMN inventory.name IS 'Nome da peça';
COMMENT ON COLUMN inventory.code IS 'Código/SKU da peça';
COMMENT ON COLUMN inventory.brand IS 'Marca da peça';
COMMENT ON COLUMN inventory.quantity IS 'Quantidade em estoque';
COMMENT ON COLUMN inventory.min_quantity IS 'Quantidade mínima (alerta de estoque baixo)';
COMMENT ON COLUMN inventory.cost_price IS 'Preço de custo';
COMMENT ON COLUMN inventory.sell_price IS 'Preço de venda';
COMMENT ON COLUMN inventory.location IS 'Localização física no estoque';
COMMENT ON COLUMN inventory.notes IS 'Observações gerais';

