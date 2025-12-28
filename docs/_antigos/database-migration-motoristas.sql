-- ============================================
-- INSTAUTO V10 - MIGRATION: MOTORISTAS
-- ============================================
-- Adiciona suporte para motoristas (role separado de oficinas)
-- Data: 2025-01-24
--
-- ⚠️ ATENÇÃO: Execute PRIMEIRO o database-migration-marketplace.sql
-- Este script depende da tabela 'quotes' criada no marketplace
-- ============================================

-- =====================================================
-- 1. TABELA: motorists (dados do motorista)
-- =====================================================

CREATE TABLE IF NOT EXISTS motorists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cpf VARCHAR(14) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

CREATE INDEX IF NOT EXISTS idx_motorists_profile ON motorists(profile_id);
CREATE INDEX IF NOT EXISTS idx_motorists_cpf ON motorists(cpf);

ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para motorists
CREATE POLICY "Motorists can view own data" ON motorists FOR SELECT TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Motorists can update own data" ON motorists FOR UPDATE TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_motorists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_motorists_updated_at
BEFORE UPDATE ON motorists
FOR EACH ROW
EXECUTE FUNCTION update_motorists_updated_at();

-- =====================================================
-- 2. TABELA: motorist_vehicles (garagem do motorista)
-- =====================================================

CREATE TABLE IF NOT EXISTS motorist_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  nickname VARCHAR(100), -- Ex: "Meu Fusca", "Carro da Família"
  make VARCHAR(100) NOT NULL, -- Marca
  model VARCHAR(100) NOT NULL, -- Modelo
  year INTEGER NOT NULL,
  plate VARCHAR(20),
  color VARCHAR(50),
  mileage INTEGER, -- Quilometragem atual
  fuel_type VARCHAR(50), -- Gasolina, Diesel, Flex, Elétrico
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_motorist_vehicles_motorist ON motorist_vehicles(motorist_id);
CREATE INDEX IF NOT EXISTS idx_motorist_vehicles_plate ON motorist_vehicles(plate);

ALTER TABLE motorist_vehicles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para motorist_vehicles
CREATE POLICY "Motorists can manage own vehicles" ON motorist_vehicles FOR ALL TO authenticated
USING (motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid()))
WITH CHECK (motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid()));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_motorist_vehicles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_motorist_vehicles_updated_at
BEFORE UPDATE ON motorist_vehicles
FOR EACH ROW
EXECUTE FUNCTION update_motorist_vehicles_updated_at();

-- =====================================================
-- 3. TABELA: maintenance_history (histórico de manutenções)
-- =====================================================

CREATE TABLE IF NOT EXISTS maintenance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES motorist_vehicles(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL, -- Opcional
  service_type VARCHAR(100) NOT NULL, -- Ex: "Troca de Óleo", "Revisão"
  description TEXT,
  mileage INTEGER, -- Quilometragem no momento do serviço
  cost DECIMAL(10,2),
  service_date DATE NOT NULL,
  next_service_date DATE, -- Próxima manutenção recomendada
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_history_motorist ON maintenance_history(motorist_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_vehicle ON maintenance_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_workshop ON maintenance_history(workshop_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_date ON maintenance_history(service_date DESC);

ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para maintenance_history
CREATE POLICY "Motorists can manage own maintenance history" ON maintenance_history FOR ALL TO authenticated
USING (motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid()))
WITH CHECK (motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid()));

-- Oficinas podem ver histórico de manutenções que fizeram
CREATE POLICY "Workshops can view their maintenance history" ON maintenance_history FOR SELECT TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_maintenance_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_maintenance_history_updated_at
BEFORE UPDATE ON maintenance_history
FOR EACH ROW
EXECUTE FUNCTION update_maintenance_history_updated_at();

-- =====================================================
-- 4. ATUALIZAR TABELA quotes (adicionar vehicle_id)
-- =====================================================

-- Adicionar referência ao veículo do motorista
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES motorist_vehicles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quotes_vehicle ON quotes(vehicle_id);

-- =====================================================
-- 5. FUNÇÃO: Criar motorista automaticamente após cadastro
-- =====================================================

CREATE OR REPLACE FUNCTION create_motorist_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Só cria motorista se o role for 'motorista'
  IF NEW.role = 'motorista' THEN
    INSERT INTO motorists (profile_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar motorista automaticamente
DROP TRIGGER IF EXISTS trigger_create_motorist_on_signup ON profiles;
CREATE TRIGGER trigger_create_motorist_on_signup
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_motorist_on_signup();

-- =====================================================
-- 6. VIEWS ÚTEIS
-- =====================================================

-- View: Veículos com última manutenção
CREATE OR REPLACE VIEW motorist_vehicles_with_last_maintenance AS
SELECT 
  v.*,
  m.service_type as last_service_type,
  m.service_date as last_service_date,
  m.mileage as last_service_mileage,
  m.next_service_date
FROM motorist_vehicles v
LEFT JOIN LATERAL (
  SELECT *
  FROM maintenance_history
  WHERE vehicle_id = v.id
  ORDER BY service_date DESC
  LIMIT 1
) m ON true;

-- View: Estatísticas do motorista
CREATE OR REPLACE VIEW motorist_stats AS
SELECT 
  m.id as motorist_id,
  m.profile_id,
  COUNT(DISTINCT v.id) as total_vehicles,
  COUNT(DISTINCT mh.id) as total_maintenances,
  SUM(mh.cost) as total_spent,
  MAX(mh.service_date) as last_maintenance_date
FROM motorists m
LEFT JOIN motorist_vehicles v ON v.motorist_id = m.id
LEFT JOIN maintenance_history mh ON mh.motorist_id = m.id
GROUP BY m.id, m.profile_id;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Migration motoristas completed successfully!' as status;

