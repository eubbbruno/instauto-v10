-- ============================================
-- INSTAUTO V10 - SCHEMA DO BANCO DE DADOS
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('oficina', 'motorista', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: workshops
-- ============================================
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  address TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================
-- TABELA: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: vehicles
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  km INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: service_orders
-- ============================================
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  services TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workshops_profile_id ON workshops(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_workshop_id ON clients(workshop_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_client_id ON vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_workshop_id ON service_orders(workshop_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_id ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle_id ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POLICIES: workshops
-- ============================================

-- Oficinas podem ver seus próprios dados
CREATE POLICY "Workshops can view own data"
  ON workshops FOR SELECT
  USING (profile_id = auth.uid());

-- Oficinas podem atualizar seus próprios dados
CREATE POLICY "Workshops can update own data"
  ON workshops FOR UPDATE
  USING (profile_id = auth.uid());

-- Oficinas podem inserir seus próprios dados
CREATE POLICY "Workshops can insert own data"
  ON workshops FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- ============================================
-- POLICIES: clients
-- ============================================

-- Oficinas podem ver seus próprios clientes
CREATE POLICY "Workshops can view own clients"
  ON clients FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem criar clientes
CREATE POLICY "Workshops can insert clients"
  ON clients FOR INSERT
  WITH CHECK (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar seus clientes
CREATE POLICY "Workshops can update own clients"
  ON clients FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar seus clientes
CREATE POLICY "Workshops can delete own clients"
  ON clients FOR DELETE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES: vehicles
-- ============================================

-- Oficinas podem ver veículos de seus clientes
CREATE POLICY "Workshops can view client vehicles"
  ON vehicles FOR SELECT
  USING (
    client_id IN (
      SELECT c.id FROM clients c
      INNER JOIN workshops w ON w.id = c.workshop_id
      WHERE w.profile_id = auth.uid()
    )
  );

-- Oficinas podem criar veículos para seus clientes
CREATE POLICY "Workshops can insert client vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT c.id FROM clients c
      INNER JOIN workshops w ON w.id = c.workshop_id
      WHERE w.profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar veículos de seus clientes
CREATE POLICY "Workshops can update client vehicles"
  ON vehicles FOR UPDATE
  USING (
    client_id IN (
      SELECT c.id FROM clients c
      INNER JOIN workshops w ON w.id = c.workshop_id
      WHERE w.profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar veículos de seus clientes
CREATE POLICY "Workshops can delete client vehicles"
  ON vehicles FOR DELETE
  USING (
    client_id IN (
      SELECT c.id FROM clients c
      INNER JOIN workshops w ON w.id = c.workshop_id
      WHERE w.profile_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES: service_orders
-- ============================================

-- Oficinas podem ver suas próprias ordens de serviço
CREATE POLICY "Workshops can view own service orders"
  ON service_orders FOR SELECT
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem criar ordens de serviço
CREATE POLICY "Workshops can insert service orders"
  ON service_orders FOR INSERT
  WITH CHECK (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem atualizar suas ordens de serviço
CREATE POLICY "Workshops can update own service orders"
  ON service_orders FOR UPDATE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- Oficinas podem deletar suas ordens de serviço
CREATE POLICY "Workshops can delete own service orders"
  ON service_orders FOR DELETE
  USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE profile_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTION: Criar profile automaticamente após signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'type', 'oficina')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Criar profile após signup
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Criar workshop automaticamente para oficinas
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_workshop_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'oficina' THEN
    INSERT INTO public.workshops (profile_id, name, plan_type)
    VALUES (
      NEW.id,
      NEW.name,
      'free'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Criar workshop após criar profile de oficina
-- ============================================
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_workshop_profile();

-- ============================================
-- FUNCTION: Atualizar completed_at quando status = completed
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_service_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Atualizar completed_at
-- ============================================
DROP TRIGGER IF EXISTS on_service_order_completed ON service_orders;
CREATE TRIGGER on_service_order_completed
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_service_order_completion();

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Estatísticas da oficina
CREATE OR REPLACE VIEW workshop_stats AS
SELECT
  w.id AS workshop_id,
  w.profile_id,
  w.name AS workshop_name,
  w.plan_type,
  COUNT(DISTINCT c.id) AS total_clients,
  COUNT(DISTINCT v.id) AS total_vehicles,
  COUNT(DISTINCT so.id) AS total_service_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'pending' THEN so.id END) AS pending_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'in_progress' THEN so.id END) AS in_progress_orders,
  COUNT(DISTINCT CASE WHEN so.status = 'completed' THEN so.id END) AS completed_orders,
  COALESCE(SUM(CASE WHEN so.status = 'completed' THEN so.total ELSE 0 END), 0) AS total_revenue
FROM workshops w
LEFT JOIN clients c ON c.workshop_id = w.id
LEFT JOIN vehicles v ON v.client_id = c.id
LEFT JOIN service_orders so ON so.workshop_id = w.id
GROUP BY w.id, w.profile_id, w.name, w.plan_type;

-- Permitir acesso à view
GRANT SELECT ON workshop_stats TO authenticated;

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir um usuário admin (descomente e ajuste se necessário)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
-- VALUES (
--   uuid_generate_v4(),
--   'admin@instauto.com',
--   crypt('senha_segura', gen_salt('bf')),
--   NOW(),
--   '{"name": "Admin", "type": "admin"}'::jsonb
-- );

