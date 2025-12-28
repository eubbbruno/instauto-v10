-- ============================================
-- INSTAUTO V10 - MIGRATION: TRANSACTIONS
-- ============================================
-- Adiciona tabela de transações financeiras
-- Data: 22/12/2024
-- ============================================

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50),
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_workshop ON transactions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);

-- Comentários
COMMENT ON TABLE transactions IS 'Transações financeiras das oficinas';
COMMENT ON COLUMN transactions.type IS 'Tipo: income (receita) ou expense (despesa)';
COMMENT ON COLUMN transactions.category IS 'Categoria (Serviços, Peças, Salários, etc)';
COMMENT ON COLUMN transactions.description IS 'Descrição da transação';
COMMENT ON COLUMN transactions.amount IS 'Valor da transação';
COMMENT ON COLUMN transactions.date IS 'Data da transação';
COMMENT ON COLUMN transactions.payment_method IS 'Forma de pagamento (Dinheiro, PIX, Cartão, etc)';
COMMENT ON COLUMN transactions.reference IS 'Referência (número da OS, nota fiscal, etc)';

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Workshop pode gerenciar suas transações
CREATE POLICY "Workshop manage transactions" ON transactions FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Tabela transactions criada com sucesso!';
  RAISE NOTICE '💰 Gestão financeira habilitada';
  RAISE NOTICE '🔒 RLS e policies configuradas';
  RAISE NOTICE '⚡ Triggers configurados';
  RAISE NOTICE '🎯 Pronto para uso!';
END $$;

