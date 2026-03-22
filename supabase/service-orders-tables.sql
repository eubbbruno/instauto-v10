-- ====================================
-- MÓDULO ORDENS DE SERVIÇO - INSTAUTO
-- ====================================

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  vehicle_id UUID REFERENCES vehicles(id),
  
  -- Identificação
  order_number SERIAL,
  
  -- Status
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'approved',
    'in_progress',
    'waiting_parts',
    'completed',
    'delivered',
    'cancelled'
  )),
  
  -- Datas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  estimated_completion DATE,
  
  -- Valores
  labor_cost DECIMAL(10,2) DEFAULT 0,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  
  -- Informações
  description TEXT,
  internal_notes TEXT,
  client_notes TEXT,
  km_entry INTEGER,
  km_exit INTEGER,
  
  -- Diagnóstico
  diagnosis TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itens da OS (serviços e peças)
CREATE TABLE IF NOT EXISTS service_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('service', 'part')),
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist da OS
CREATE TABLE IF NOT EXISTS service_order_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de mudanças de status
CREATE TABLE IF NOT EXISTS service_order_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_workshop ON service_orders(workshop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_client ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_vehicle ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON service_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON service_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_checklist_order ON service_order_checklist(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order ON service_order_history(order_id);

-- Habilitar RLS
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_history ENABLE ROW LEVEL SECURITY;

-- Policies: oficina vê apenas suas próprias OS
CREATE POLICY "workshop_service_orders" ON service_orders
  FOR ALL USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "workshop_order_items" ON service_order_items
  FOR ALL USING (
    order_id IN (
      SELECT id FROM service_orders 
      WHERE workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "workshop_order_checklist" ON service_order_checklist
  FOR ALL USING (
    order_id IN (
      SELECT id FROM service_orders 
      WHERE workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "workshop_order_history" ON service_order_history
  FOR ALL USING (
    order_id IN (
      SELECT id FROM service_orders 
      WHERE workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_service_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_service_orders_updated_at 
  BEFORE UPDATE ON service_orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_service_order_updated_at();

-- Função para registrar histórico de mudança de status
CREATE OR REPLACE FUNCTION log_service_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO service_order_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico
CREATE TRIGGER log_order_status_change 
  AFTER UPDATE ON service_orders
  FOR EACH ROW 
  EXECUTE FUNCTION log_service_order_status_change();
