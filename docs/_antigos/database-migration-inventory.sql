-- ============================================
-- INSTAUTO V10 - MIGRATION: INVENTORY
-- ============================================
-- Adiciona tabela de estoque de peças
-- Data: 22/12/2024
-- ============================================

-- Criar tabela de estoque
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100),
  category VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier VARCHAR(255),
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_inventory_workshop ON inventory(workshop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);

-- Comentários
COMMENT ON TABLE inventory IS 'Estoque de peças e produtos das oficinas';
COMMENT ON COLUMN inventory.name IS 'Nome da peça/produto';
COMMENT ON COLUMN inventory.code IS 'Código/SKU da peça';
COMMENT ON COLUMN inventory.category IS 'Categoria (Motor, Freios, Suspensão, etc)';
COMMENT ON COLUMN inventory.quantity IS 'Quantidade atual em estoque';
COMMENT ON COLUMN inventory.min_quantity IS 'Quantidade mínima (alerta de reposição)';
COMMENT ON COLUMN inventory.unit_price IS 'Preço unitário';
COMMENT ON COLUMN inventory.supplier IS 'Fornecedor';
COMMENT ON COLUMN inventory.location IS 'Localização física no estoque';

-- Habilitar RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Policy: Workshop pode gerenciar seu estoque
CREATE POLICY "Workshop manage inventory" ON inventory FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

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

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Tabela inventory criada com sucesso!';
  RAISE NOTICE '📦 Gestão de estoque habilitada';
  RAISE NOTICE '🔒 RLS e policies configuradas';
  RAISE NOTICE '⚡ Triggers configurados';
  RAISE NOTICE '🎯 Pronto para uso!';
END $$;
