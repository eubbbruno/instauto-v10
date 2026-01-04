-- ============================================
-- CRIAR TABELAS PARA MOTORISTA
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- TABELA: motorists
-- Dados adicionais dos motoristas
CREATE TABLE IF NOT EXISTS motorists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  cpf TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_motorists_profile_id ON motorists(profile_id);

-- Comentários
COMMENT ON TABLE motorists IS 'Dados adicionais dos motoristas';

-- ============================================
-- TABELA: motorist_vehicles
-- Veículos dos motoristas
CREATE TABLE IF NOT EXISTS motorist_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  nickname TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT,
  color TEXT,
  mileage INTEGER,
  fuel_type TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_motorist_vehicles_motorist_id ON motorist_vehicles(motorist_id);
CREATE INDEX IF NOT EXISTS idx_motorist_vehicles_plate ON motorist_vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_motorist_vehicles_is_active ON motorist_vehicles(is_active);

-- Comentários
COMMENT ON TABLE motorist_vehicles IS 'Veículos cadastrados pelos motoristas';
COMMENT ON COLUMN motorist_vehicles.nickname IS 'Apelido do veículo (ex: Meu Fusca)';
COMMENT ON COLUMN motorist_vehicles.make IS 'Marca (ex: Volkswagen, Fiat)';
COMMENT ON COLUMN motorist_vehicles.model IS 'Modelo (ex: Gol, Uno)';

-- ============================================
-- TABELA: quotes
-- Solicitações de orçamento dos motoristas
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES motorist_vehicles(id) ON DELETE SET NULL,
  workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'accepted', 'rejected', 'cancelled')),
  workshop_response TEXT,
  estimated_price DECIMAL(10,2),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quotes_motorist_id ON quotes(motorist_id);
CREATE INDEX IF NOT EXISTS idx_quotes_workshop_id ON quotes(workshop_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

-- Comentários
COMMENT ON TABLE quotes IS 'Solicitações de orçamento dos motoristas para oficinas';
COMMENT ON COLUMN quotes.urgency IS 'Urgência: low (baixa), normal, high (alta)';
COMMENT ON COLUMN quotes.status IS 'Status: pending (aguardando), responded (respondido), accepted (aceito), rejected (rejeitado), cancelled (cancelado)';

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorist_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- MOTORISTS: Usuário pode ver e editar apenas seu próprio registro
DROP POLICY IF EXISTS "Motorists: select own" ON motorists;
CREATE POLICY "Motorists: select own" ON motorists
  FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Motorists: insert own" ON motorists;
CREATE POLICY "Motorists: insert own" ON motorists
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Motorists: update own" ON motorists;
CREATE POLICY "Motorists: update own" ON motorists
  FOR UPDATE USING (auth.uid() = profile_id);

-- MOTORIST_VEHICLES: Usuário pode gerenciar apenas seus próprios veículos
DROP POLICY IF EXISTS "Vehicles: select own" ON motorist_vehicles;
CREATE POLICY "Vehicles: select own" ON motorist_vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = motorist_vehicles.motorist_id
      AND motorists.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Vehicles: insert own" ON motorist_vehicles;
CREATE POLICY "Vehicles: insert own" ON motorist_vehicles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = motorist_vehicles.motorist_id
      AND motorists.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Vehicles: update own" ON motorist_vehicles;
CREATE POLICY "Vehicles: update own" ON motorist_vehicles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = motorist_vehicles.motorist_id
      AND motorists.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Vehicles: delete own" ON motorist_vehicles;
CREATE POLICY "Vehicles: delete own" ON motorist_vehicles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = motorist_vehicles.motorist_id
      AND motorists.profile_id = auth.uid()
    )
  );

-- QUOTES: Motorista vê seus orçamentos, Oficina vê orçamentos enviados a ela
DROP POLICY IF EXISTS "Quotes: select own or workshop" ON quotes;
CREATE POLICY "Quotes: select own or workshop" ON quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = quotes.motorist_id
      AND motorists.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = quotes.workshop_id
      AND workshops.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Quotes: insert own" ON quotes;
CREATE POLICY "Quotes: insert own" ON quotes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = quotes.motorist_id
      AND motorists.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Quotes: update own or workshop" ON quotes;
CREATE POLICY "Quotes: update own or workshop" ON quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM motorists
      WHERE motorists.id = quotes.motorist_id
      AND motorists.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = quotes.workshop_id
      AND workshops.profile_id = auth.uid()
    )
  );

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_motorists_updated_at ON motorists;
CREATE TRIGGER update_motorists_updated_at
  BEFORE UPDATE ON motorists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_motorist_vehicles_updated_at ON motorist_vehicles;
CREATE TRIGGER update_motorist_vehicles_updated_at
  BEFORE UPDATE ON motorist_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ============================================

-- Marcas de veículos mais comuns no Brasil
COMMENT ON COLUMN motorist_vehicles.make IS 'Marcas comuns: Volkswagen, Fiat, Chevrolet, Ford, Renault, Toyota, Honda, Hyundai, Nissan, Jeep, Peugeot, Citroën, BMW, Mercedes-Benz, Audi';

-- Tipos de combustível
COMMENT ON COLUMN motorist_vehicles.fuel_type IS 'Tipos: Gasolina, Etanol, Flex, Diesel, Elétrico, Híbrido';

-- Tipos de serviço para orçamentos
COMMENT ON COLUMN quotes.service_type IS 'Tipos: Revisão, Troca de óleo, Freios, Suspensão, Motor, Elétrica, Ar condicionado, Alinhamento, Balanceamento, Pneus, Funilaria, Pintura, Outro';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

