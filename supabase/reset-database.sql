-- ================================================
-- SCRIPT COMPLETO: RESET E RECRIAÇÃO DO BANCO INSTAUTO
-- ================================================
-- ATENÇÃO: Este script APAGA TODOS OS DADOS!
-- Execute no Supabase SQL Editor
-- ================================================

-- ================================================
-- PARTE 1: LIMPAR TUDO
-- ================================================

-- Desabilitar RLS temporariamente para limpar
ALTER TABLE IF EXISTS quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motorist_vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motorist_fueling DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motorist_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motorist_reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS maintenance_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diagnostics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motorists DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

-- Dropar views primeiro
DROP VIEW IF EXISTS public_workshops CASCADE;
DROP VIEW IF EXISTS motorist_stats CASCADE;
DROP VIEW IF EXISTS workshop_stats CASCADE;
DROP VIEW IF EXISTS pending_quotes_by_workshop CASCADE;
DROP VIEW IF EXISTS recent_service_orders CASCADE;
DROP VIEW IF EXISTS motorist_monthly_expenses CASCADE;
DROP VIEW IF EXISTS motorist_pending_reminders CASCADE;
DROP VIEW IF EXISTS motorist_vehicle_fuel_stats CASCADE;
DROP VIEW IF EXISTS motorist_vehicles_with_last_maintenance CASCADE;

-- Dropar todas as tabelas (ordem importa por causa das foreign keys)
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS motorist_vehicles CASCADE;
DROP TABLE IF EXISTS motorist_fueling CASCADE;
DROP TABLE IF EXISTS motorist_expenses CASCADE;
DROP TABLE IF EXISTS motorist_reminders CASCADE;
DROP TABLE IF EXISTS maintenance_history CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS diagnostics CASCADE;
DROP TABLE IF EXISTS motorists CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ================================================
-- PARTE 2: CRIAR TABELAS
-- ================================================

-- PROFILES (tabela principal de usuários)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('motorist', 'workshop')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORISTS (extensão de profiles para motoristas)
CREATE TABLE motorists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cpf TEXT,
  notification_preferences JSONB DEFAULT '{"email_quotes": true, "email_promotions": true, "email_reminders": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORKSHOPS (extensão de profiles para oficinas)
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  cep TEXT,
  description TEXT,
  specialties TEXT[],
  logo_url TEXT,
  cover_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  subscription_id TEXT,
  is_public BOOLEAN DEFAULT true,
  accepts_quotes BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_VEHICLES (veículos do motorista)
CREATE TABLE motorist_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  nickname TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT NOT NULL,
  color TEXT,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT DEFAULT 'gasoline' CHECK (fuel_type IN ('gasoline', 'ethanol', 'flex', 'diesel', 'gnv', 'electric', 'hybrid')),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_FUELING (abastecimentos)
CREATE TABLE motorist_fueling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES motorist_vehicles(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'ethanol', 'diesel', 'gnv')),
  liters NUMERIC(10,2) NOT NULL CHECK (liters > 0),
  price_per_liter NUMERIC(10,2) NOT NULL CHECK (price_per_liter > 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
  odometer INTEGER CHECK (odometer >= 0),
  station_name TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_EXPENSES (despesas)
CREATE TABLE motorist_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES motorist_vehicles(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('fuel', 'maintenance', 'insurance', 'ipva', 'fine', 'parking', 'toll', 'wash', 'other')),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_REMINDERS (lembretes)
CREATE TABLE motorist_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES motorist_vehicles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('oil_change', 'revision', 'tire_rotation', 'insurance', 'ipva', 'licensing', 'inspection', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS (clientes da oficina)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VEHICLES (veículos da oficina)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT NOT NULL,
  plate TEXT NOT NULL,
  color TEXT,
  km TEXT,
  chassis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTES (orçamentos)
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_name TEXT NOT NULL,
  motorist_email TEXT NOT NULL,
  motorist_phone TEXT,
  vehicle_id UUID,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_plate TEXT,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'rejected', 'accepted', 'expired')),
  workshop_response TEXT,
  estimated_price NUMERIC(10,2),
  estimated_days INTEGER,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE_ORDERS (ordens de serviço)
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'waiting_parts', 'completed', 'delivered', 'cancelled')),
  services TEXT,
  parts TEXT,
  labor_cost NUMERIC(10,2) DEFAULT 0,
  parts_cost NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  warranty TEXT DEFAULT '90 dias para serviços realizados',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY (estoque)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  category TEXT,
  brand TEXT,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  min_quantity INTEGER DEFAULT 5,
  cost_price NUMERIC(10,2),
  sell_price NUMERIC(10,2),
  location TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS (financeiro)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT,
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPOINTMENTS (agenda)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'service' CHECK (type IN ('service', 'quote', 'delivery', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS (notificações)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('quote_received', 'quote_response', 'quote_rejected', 'service_completed', 'reminder', 'promotion', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMOTIONS (promoções)
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percent INTEGER CHECK (discount_percent > 0 AND discount_percent <= 100),
  discount_value NUMERIC(10,2),
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS (avaliações)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  workshop_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DIAGNOSTICS (diagnóstico IA)
CREATE TABLE diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  symptoms TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  recommendations TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MAINTENANCE_HISTORY (histórico de manutenção)
CREATE TABLE maintenance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES motorist_vehicles(id) ON DELETE CASCADE,
  workshop_name TEXT,
  service_type TEXT NOT NULL,
  description TEXT,
  mileage INTEGER,
  cost NUMERIC(10,2),
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- PARTE 3: CRIAR ÍNDICES
-- ================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_type ON profiles(type);
CREATE INDEX idx_motorists_profile ON motorists(profile_id);
CREATE INDEX idx_workshops_profile ON workshops(profile_id);
CREATE INDEX idx_workshops_public ON workshops(is_public) WHERE is_public = true;
CREATE INDEX idx_quotes_workshop ON quotes(workshop_id);
CREATE INDEX idx_quotes_email ON quotes(motorist_email);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_service_orders_workshop ON service_orders(workshop_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_clients_workshop ON clients(workshop_id);
CREATE INDEX idx_vehicles_workshop ON vehicles(workshop_id);
CREATE INDEX idx_inventory_workshop ON inventory(workshop_id);
CREATE INDEX idx_transactions_workshop ON transactions(workshop_id);
CREATE INDEX idx_appointments_workshop ON appointments(workshop_id);
CREATE INDEX idx_motorist_vehicles_motorist ON motorist_vehicles(motorist_id);

-- ================================================
-- PARTE 4: HABILITAR RLS
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorist_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorist_fueling ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorist_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorist_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PARTE 5: CRIAR POLICIES (RLS)
-- ================================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- MOTORISTS
CREATE POLICY "Motorists view own record" ON motorists FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Motorists update own record" ON motorists FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Motorists insert own record" ON motorists FOR INSERT WITH CHECK (profile_id = auth.uid());

-- WORKSHOPS
CREATE POLICY "Workshops view own record" ON workshops FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Workshops update own record" ON workshops FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Workshops insert own record" ON workshops FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Public can view public workshops" ON workshops FOR SELECT USING (is_public = true);

-- MOTORIST_VEHICLES
CREATE POLICY "Motorists manage own vehicles" ON motorist_vehicles FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_FUELING
CREATE POLICY "Motorists manage own fueling" ON motorist_fueling FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_EXPENSES
CREATE POLICY "Motorists manage own expenses" ON motorist_expenses FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_REMINDERS
CREATE POLICY "Motorists manage own reminders" ON motorist_reminders FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- CLIENTS
CREATE POLICY "Workshops manage own clients" ON clients FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- VEHICLES
CREATE POLICY "Workshops manage own vehicles" ON vehicles FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- QUOTES
CREATE POLICY "Anyone authenticated can create quotes" ON quotes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Motorists view own quotes" ON quotes FOR SELECT USING (
  motorist_email IN (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Workshops view received quotes" ON quotes FOR SELECT USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);
CREATE POLICY "Workshops update received quotes" ON quotes FOR UPDATE USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- SERVICE_ORDERS
CREATE POLICY "Workshops manage own orders" ON service_orders FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- INVENTORY
CREATE POLICY "Workshops manage own inventory" ON inventory FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- TRANSACTIONS
CREATE POLICY "Workshops manage own transactions" ON transactions FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- APPOINTMENTS
CREATE POLICY "Workshops manage own appointments" ON appointments FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- NOTIFICATIONS
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- PROMOTIONS
CREATE POLICY "Workshops manage own promotions" ON promotions FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);
CREATE POLICY "Public view active promotions" ON promotions FOR SELECT USING (is_active = true);

-- REVIEWS
CREATE POLICY "Public view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Motorists create reviews" ON reviews FOR INSERT WITH CHECK (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);
CREATE POLICY "Workshops respond to reviews" ON reviews FOR UPDATE USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- DIAGNOSTICS
CREATE POLICY "Workshops manage own diagnostics" ON diagnostics FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- MAINTENANCE_HISTORY
CREATE POLICY "Motorists manage own history" ON maintenance_history FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- ================================================
-- PARTE 6: CRIAR VIEWS
-- ================================================

CREATE VIEW public_workshops AS
SELECT 
  id, name, city, state, phone, specialties, rating, reviews_count, 
  description, logo_url, plan_type, is_public, accepts_quotes
FROM workshops 
WHERE is_public = true;

-- ================================================
-- PARTE 7: TRIGGER PARA UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_motorists_updated_at BEFORE UPDATE ON motorists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_motorist_vehicles_updated_at BEFORE UPDATE ON motorist_vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- PRONTO!
-- ================================================
SELECT 'Database reset completo! ✅' as status;
