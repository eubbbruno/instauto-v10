-- ================================================
-- INSTAUTO V10 - BANCO LIMPO E FUNCIONAL
-- ================================================

-- ================================================
-- TABELAS PRINCIPAIS
-- ================================================

-- PROFILES (usuários)
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

-- MOTORISTS (extensão para motoristas)
CREATE TABLE motorists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cpf TEXT,
  notification_preferences JSONB DEFAULT '{"email_quotes": true, "email_promotions": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORKSHOPS (extensão para oficinas)
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
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
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
  fuel_type TEXT DEFAULT 'flex' CHECK (fuel_type IN ('gasoline', 'ethanol', 'flex', 'diesel', 'gnv', 'electric', 'hybrid')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_FUELING (abastecimentos)
CREATE TABLE motorist_fueling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES motorist_vehicles(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'ethanol', 'diesel', 'gnv')),
  liters NUMERIC(10,2) NOT NULL,
  price_per_liter NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  odometer INTEGER,
  station_name TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOTORIST_EXPENSES (despesas)
CREATE TABLE motorist_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorist_id UUID NOT NULL REFERENCES motorists(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES motorist_vehicles(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('fuel', 'maintenance', 'insurance', 'ipva', 'fine', 'parking', 'toll', 'wash', 'other')),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
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
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VEHICLES (veículos da oficina)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  plate TEXT,
  color TEXT,
  mileage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTES (orçamentos)
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  motorist_name TEXT NOT NULL,
  motorist_email TEXT NOT NULL,
  motorist_phone TEXT,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_plate TEXT,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'rejected', 'accepted', 'expired')),
  workshop_response TEXT,
  estimated_price NUMERIC(10,2),
  estimated_days INTEGER,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE_ORDERS (ordens de serviço)
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'waiting_parts', 'completed', 'delivered', 'cancelled')),
  services JSONB DEFAULT '[]'::jsonb,
  parts JSONB DEFAULT '[]'::jsonb,
  labor_total NUMERIC(10,2) DEFAULT 0,
  parts_total NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  observations TEXT,
  warranty TEXT DEFAULT '90 dias',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVENTORY (estoque)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  cost_price NUMERIC(10,2),
  sell_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS (financeiro)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
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
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS (notificações)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('quote_received', 'quote_response', 'quote_rejected', 'service_completed', 'reminder', 'promotion', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMOTIONS (promoções)
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ÍNDICES
-- ================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_type ON profiles(type);
CREATE INDEX idx_motorists_profile ON motorists(profile_id);
CREATE INDEX idx_workshops_profile ON workshops(profile_id);
CREATE INDEX idx_workshops_public ON workshops(is_public) WHERE is_public = true;
CREATE INDEX idx_quotes_workshop ON quotes(workshop_id);
CREATE INDEX idx_quotes_email ON quotes(motorist_email);
CREATE INDEX idx_service_orders_workshop ON service_orders(workshop_id);
CREATE INDEX idx_clients_workshop ON clients(workshop_id);
CREATE INDEX idx_vehicles_workshop ON vehicles(workshop_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ================================================
-- RLS (Row Level Security) - SIMPLES E FUNCIONAL
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

-- PROFILES: Usuário acessa próprio perfil
CREATE POLICY "profiles_policy" ON profiles FOR ALL USING (auth.uid() = id);

-- MOTORISTS: Usuário acessa próprio registro
CREATE POLICY "motorists_policy" ON motorists FOR ALL USING (profile_id = auth.uid());

-- WORKSHOPS: Dono acessa + público lê oficinas públicas
CREATE POLICY "workshops_owner" ON workshops FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "workshops_public" ON workshops FOR SELECT USING (is_public = true);

-- MOTORIST_VEHICLES: Dono acessa
CREATE POLICY "motorist_vehicles_policy" ON motorist_vehicles FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_FUELING: Dono acessa
CREATE POLICY "motorist_fueling_policy" ON motorist_fueling FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_EXPENSES: Dono acessa
CREATE POLICY "motorist_expenses_policy" ON motorist_expenses FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- MOTORIST_REMINDERS: Dono acessa
CREATE POLICY "motorist_reminders_policy" ON motorist_reminders FOR ALL USING (
  motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
);

-- CLIENTS: Oficina gerencia seus clientes
CREATE POLICY "clients_policy" ON clients FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- VEHICLES: Oficina gerencia seus veículos
CREATE POLICY "vehicles_policy" ON vehicles FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- QUOTES: Autenticado pode criar, motorista vê seus, oficina gerencia
CREATE POLICY "quotes_create" ON quotes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "quotes_motorist" ON quotes FOR SELECT USING (
  motorist_email IN (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "quotes_workshop" ON quotes FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- SERVICE_ORDERS: Oficina gerencia
CREATE POLICY "service_orders_policy" ON service_orders FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- INVENTORY: Oficina gerencia
CREATE POLICY "inventory_policy" ON inventory FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- TRANSACTIONS: Oficina gerencia
CREATE POLICY "transactions_policy" ON transactions FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- APPOINTMENTS: Oficina gerencia
CREATE POLICY "appointments_policy" ON appointments FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);

-- NOTIFICATIONS: Usuário gerencia suas notificações
CREATE POLICY "notifications_policy" ON notifications FOR ALL USING (user_id = auth.uid());

-- PROMOTIONS: Oficina gerencia + público vê ativas
CREATE POLICY "promotions_owner" ON promotions FOR ALL USING (
  workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
);
CREATE POLICY "promotions_public" ON promotions FOR SELECT USING (is_active = true);

-- ================================================
-- VIEW PÚBLICA
-- ================================================

CREATE VIEW public_workshops AS
SELECT id, name, city, state, description, specialties, rating, reviews_count, is_public, accepts_quotes, plan_type
FROM workshops WHERE is_public = true;

-- ================================================
-- PRONTO!
-- ================================================

SELECT 'Banco instauto-v10 criado com sucesso!' as status;
