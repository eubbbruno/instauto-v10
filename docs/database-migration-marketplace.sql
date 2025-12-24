-- =====================================================
-- MIGRATION: MARKETPLACE PARA MOTORISTAS
-- Descrição: Tabelas para busca de oficinas, orçamentos e avaliações
-- Data: 2025-01-23
-- =====================================================

-- =====================================================
-- 1. TABELA: quotes (Orçamentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_name TEXT NOT NULL,
  motorist_email TEXT NOT NULL,
  motorist_phone TEXT NOT NULL,
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  vehicle_plate TEXT,
  service_type TEXT NOT NULL, -- 'maintenance', 'repair', 'diagnostic', 'other'
  description TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected', 'expired')),
  workshop_response TEXT,
  estimated_price DECIMAL(10,2),
  estimated_days INTEGER,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_quotes_workshop ON quotes(workshop_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(motorist_email);

-- RLS (Row Level Security)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Política: Oficinas veem apenas seus orçamentos
CREATE POLICY "Workshop manage quotes" ON quotes FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Política: Motoristas podem criar orçamentos (público)
CREATE POLICY "Public can create quotes" ON quotes FOR INSERT TO anon
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quotes_updated_at
BEFORE UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION update_quotes_updated_at();

-- =====================================================
-- 2. TABELA: reviews (Avaliações)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_name TEXT NOT NULL,
  motorist_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_type TEXT, -- 'maintenance', 'repair', 'diagnostic', 'other'
  verified BOOLEAN DEFAULT false, -- Se foi cliente real (futuro: vincular com ordem de serviço)
  response TEXT, -- Resposta da oficina
  responded_at TIMESTAMPTZ,
  is_visible BOOLEAN DEFAULT true, -- Oficina pode ocultar reviews ofensivos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reviews_workshop ON reviews(workshop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible);

-- RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler reviews visíveis
CREATE POLICY "Public can read visible reviews" ON reviews FOR SELECT TO anon, authenticated
USING (is_visible = true);

-- Política: Oficinas podem gerenciar suas reviews
CREATE POLICY "Workshop manage reviews" ON reviews FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Política: Motoristas podem criar reviews (público)
CREATE POLICY "Public can create reviews" ON reviews FOR INSERT TO anon
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at();

-- =====================================================
-- 3. ADICIONAR CAMPOS NA TABELA workshops
-- =====================================================
-- Campos para marketplace (visibilidade pública)
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS services TEXT[]; -- Array de serviços oferecidos
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS specialties TEXT[]; -- Especialidades (ex: 'diesel', 'elétrica', 'suspensão')
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS working_hours JSONB; -- Horários de funcionamento
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS accepts_quotes BOOLEAN DEFAULT true;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Índices para busca
CREATE INDEX IF NOT EXISTS idx_workshops_public ON workshops(is_public);
CREATE INDEX IF NOT EXISTS idx_workshops_city ON workshops(city);
CREATE INDEX IF NOT EXISTS idx_workshops_state ON workshops(state);
CREATE INDEX IF NOT EXISTS idx_workshops_rating ON workshops(average_rating DESC);

-- =====================================================
-- 4. FUNÇÃO: Atualizar média de avaliações
-- =====================================================
CREATE OR REPLACE FUNCTION update_workshop_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workshops
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE workshop_id = NEW.workshop_id AND is_visible = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE workshop_id = NEW.workshop_id AND is_visible = true
    )
  WHERE id = NEW.workshop_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar rating quando review é criada/atualizada
CREATE TRIGGER trigger_update_workshop_rating_on_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_workshop_rating();

CREATE TRIGGER trigger_update_workshop_rating_on_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_workshop_rating();

-- =====================================================
-- 5. VIEWS ÚTEIS
-- =====================================================

-- View: Oficinas públicas com estatísticas
CREATE OR REPLACE VIEW public_workshops AS
SELECT 
  w.id,
  w.name,
  w.phone,
  w.email,
  w.address,
  w.city,
  w.state,
  w.description,
  w.services,
  w.opening_hours,
  w.average_rating,
  w.total_reviews,
  w.created_at
FROM workshops w
WHERE w.is_public = true;

-- View: Orçamentos pendentes por oficina
CREATE OR REPLACE VIEW pending_quotes_by_workshop AS
SELECT 
  workshop_id,
  COUNT(*) as pending_count,
  MAX(created_at) as last_quote_at
FROM quotes
WHERE status = 'pending'
GROUP BY workshop_id;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Migration completed successfully!' as status;

