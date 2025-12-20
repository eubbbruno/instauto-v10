-- =====================================================
-- MIGRATION: FASE 2A - DASHBOARD PROFISSIONAL COMPLETO
-- =====================================================
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. INVENTORY (ESTOQUE DE PEÇAS)
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  brand TEXT,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  cost_price DECIMAL(10,2) DEFAULT 0,
  sell_price DECIMAL(10,2) DEFAULT 0,
  location TEXT,
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_workshop ON inventory(workshop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_inventory_updated_at ON inventory;
CREATE TRIGGER trigger_update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_updated_at();

-- RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workshop manage inventory" ON inventory;
CREATE POLICY "Workshop manage inventory" ON inventory FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- =====================================================
-- 2. TRANSACTIONS (FINANCEIRO)
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  reference_id UUID,
  reference_type TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_workshop ON transactions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workshop manage transactions" ON transactions;
CREATE POLICY "Workshop manage transactions" ON transactions FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- =====================================================
-- 3. APPOINTMENTS (AGENDA/CALENDÁRIO)
-- =====================================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_workshop ON appointments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workshop manage appointments" ON appointments;
CREATE POLICY "Workshop manage appointments" ON appointments FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- =====================================================
-- 4. SERVICE_ORDER_ITEMS (ITENS DA OS - PEÇAS)
-- =====================================================

CREATE TABLE IF NOT EXISTS service_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_order_items_order ON service_order_items(service_order_id);
CREATE INDEX IF NOT EXISTS idx_service_order_items_inventory ON service_order_items(inventory_id);

-- RLS
ALTER TABLE service_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workshop manage service order items" ON service_order_items;
CREATE POLICY "Workshop manage service order items" ON service_order_items FOR ALL TO authenticated
USING (
  service_order_id IN (
    SELECT id FROM service_orders 
    WHERE workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  )
)
WITH CHECK (
  service_order_id IN (
    SELECT id FROM service_orders 
    WHERE workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  )
);

-- Trigger para descontar do estoque quando item é adicionado
CREATE OR REPLACE FUNCTION decrease_inventory_on_item_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.inventory_id IS NOT NULL THEN
    UPDATE inventory 
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decrease_inventory ON service_order_items;
CREATE TRIGGER trigger_decrease_inventory
  AFTER INSERT ON service_order_items
  FOR EACH ROW
  EXECUTE FUNCTION decrease_inventory_on_item_insert();

-- Trigger para devolver ao estoque quando item é deletado
CREATE OR REPLACE FUNCTION increase_inventory_on_item_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.inventory_id IS NOT NULL THEN
    UPDATE inventory 
    SET quantity = quantity + OLD.quantity
    WHERE id = OLD.inventory_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increase_inventory ON service_order_items;
CREATE TRIGGER trigger_increase_inventory
  AFTER DELETE ON service_order_items
  FOR EACH ROW
  EXECUTE FUNCTION increase_inventory_on_item_delete();

-- =====================================================
-- 5. VIEWS ÚTEIS PARA DASHBOARD
-- =====================================================

-- View: Resumo financeiro por mês
CREATE OR REPLACE VIEW monthly_financial_summary AS
SELECT 
  workshop_id,
  DATE_TRUNC('month', date) as month,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
FROM transactions
GROUP BY workshop_id, DATE_TRUNC('month', date);

-- View: Estatísticas do dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  w.id as workshop_id,
  (SELECT COUNT(*) FROM clients WHERE workshop_id = w.id) as total_clients,
  (SELECT COUNT(*) FROM vehicles v JOIN clients c ON v.client_id = c.id WHERE c.workshop_id = w.id) as total_vehicles,
  (SELECT COUNT(*) FROM service_orders WHERE workshop_id = w.id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())) as orders_this_month,
  (SELECT COUNT(*) FROM service_orders WHERE workshop_id = w.id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW()) AND status = 'completed') as completed_orders_this_month,
  (SELECT COALESCE(SUM(total), 0) FROM service_orders WHERE workshop_id = w.id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW()) AND status = 'completed') as revenue_this_month,
  (SELECT COUNT(*) FROM appointments WHERE workshop_id = w.id AND date = CURRENT_DATE) as appointments_today,
  (SELECT COUNT(*) FROM inventory WHERE workshop_id = w.id AND quantity <= min_quantity) as low_stock_items
FROM workshops w;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE inventory IS 'Estoque de peças das oficinas';
COMMENT ON TABLE transactions IS 'Transações financeiras (receitas e despesas)';
COMMENT ON TABLE appointments IS 'Agendamentos e calendário da oficina';
COMMENT ON TABLE service_order_items IS 'Itens/peças utilizadas em cada ordem de serviço';
COMMENT ON VIEW monthly_financial_summary IS 'Resumo financeiro mensal por oficina';
COMMENT ON VIEW dashboard_stats IS 'Estatísticas consolidadas para o dashboard';

