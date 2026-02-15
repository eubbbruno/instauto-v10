-- =============================================
-- SCRIPT COMPLETO DE CORREÇÃO DE RLS POLICIES
-- Execute este script no Supabase SQL Editor
-- =============================================

-- =============================================
-- FASE 1: LIMPAR POLICIES ANTIGAS
-- =============================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles: select own" ON profiles;
DROP POLICY IF EXISTS "Profiles: update own" ON profiles;
DROP POLICY IF EXISTS "Profiles: insert own" ON profiles;

-- MOTORISTS
DROP POLICY IF EXISTS "Motorists can view own data" ON motorists;
DROP POLICY IF EXISTS "Motorists can update own data" ON motorists;
DROP POLICY IF EXISTS "Motorists can insert own data" ON motorists;
DROP POLICY IF EXISTS "Motorists: select own" ON motorists;
DROP POLICY IF EXISTS "Motorists: update own" ON motorists;
DROP POLICY IF EXISTS "Motorists: insert own" ON motorists;
DROP POLICY IF EXISTS "Motorists: delete own" ON motorists;

-- WORKSHOPS
DROP POLICY IF EXISTS "Workshops can view own data" ON workshops;
DROP POLICY IF EXISTS "Workshops can update own data" ON workshops;
DROP POLICY IF EXISTS "Workshops can insert own data" ON workshops;
DROP POLICY IF EXISTS "Anyone can view public workshops" ON workshops;
DROP POLICY IF EXISTS "Workshops: select own" ON workshops;
DROP POLICY IF EXISTS "Workshops: update own" ON workshops;
DROP POLICY IF EXISTS "Workshops: insert own" ON workshops;
DROP POLICY IF EXISTS "Workshops: delete own" ON workshops;
DROP POLICY IF EXISTS "Workshops: select all for marketplace" ON workshops;

-- QUOTES (CRÍTICO!)
DROP POLICY IF EXISTS "Motoristas podem criar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Motoristas podem ver seus orçamentos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem ver orçamentos recebidos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem atualizar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Public can create quotes" ON quotes;
DROP POLICY IF EXISTS "Workshop manage quotes" ON quotes;

-- MOTORIST_VEHICLES
DROP POLICY IF EXISTS "Users can view own vehicles" ON motorist_vehicles;
DROP POLICY IF EXISTS "Users can insert own vehicles" ON motorist_vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON motorist_vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON motorist_vehicles;
DROP POLICY IF EXISTS "Motoristas podem ver seus próprios veículos" ON motorist_vehicles;
DROP POLICY IF EXISTS "Motoristas podem criar seus próprios veículos" ON motorist_vehicles;
DROP POLICY IF EXISTS "Motoristas podem atualizar seus próprios veículos" ON motorist_vehicles;
DROP POLICY IF EXISTS "Motorists can manage own vehicles" ON motorist_vehicles;

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can create notifications" ON notifications;
DROP POLICY IF EXISTS "Usuários podem ver suas notificações" ON notifications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas notificações" ON notifications;
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON notifications;

-- =============================================
-- FASE 2: CRIAR POLICIES CORRETAS
-- =============================================

-- =============================================
-- PROFILES
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- =============================================
-- MOTORISTS
-- =============================================
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own data" ON motorists
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists can update own data" ON motorists
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists can insert own data" ON motorists
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists can delete own data" ON motorists
  FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- =============================================
-- WORKSHOPS
-- =============================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Oficinas podem ver/editar seus próprios dados
CREATE POLICY "Workshops can view own data" ON workshops
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Workshops can update own data" ON workshops
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Workshops can insert own data" ON workshops
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Workshops can delete own data" ON workshops
  FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- QUALQUER USUÁRIO AUTENTICADO pode ver oficinas públicas
CREATE POLICY "Anyone can view public workshops" ON workshops
  FOR SELECT TO authenticated
  USING (is_public = true);

-- =============================================
-- QUOTES (ORÇAMENTOS) - CRÍTICO!
-- =============================================
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- MOTORISTAS podem CRIAR orçamentos (INSERT)
-- A policy verifica se o motorist_email corresponde ao email do usuário logado
CREATE POLICY "Motoristas podem criar orçamentos" ON quotes
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- MOTORISTAS podem VER seus orçamentos (SELECT)
CREATE POLICY "Motoristas podem ver seus orçamentos" ON quotes
  FOR SELECT TO authenticated
  USING (
    motorist_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- OFICINAS podem VER orçamentos recebidos (SELECT)
CREATE POLICY "Oficinas podem ver orçamentos recebidos" ON quotes
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- OFICINAS podem ATUALIZAR orçamentos (UPDATE) - para responder
CREATE POLICY "Oficinas podem atualizar orçamentos" ON quotes
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- MOTORIST_VEHICLES
-- =============================================
ALTER TABLE motorist_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own vehicles" ON motorist_vehicles
  FOR SELECT TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can insert own vehicles" ON motorist_vehicles
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can update own vehicles" ON motorist_vehicles
  FOR UPDATE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can delete own vehicles" ON motorist_vehicles
  FOR DELETE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

-- =============================================
-- NOTIFICATIONS
-- =============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Qualquer usuário autenticado pode criar notificação
CREATE POLICY "Anyone can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- =============================================
-- CLIENTS (da oficina)
-- =============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own clients" ON clients
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own clients" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own clients" ON clients
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own clients" ON clients
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- VEHICLES (da oficina)
-- =============================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own vehicles" ON vehicles
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own vehicles" ON vehicles
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own vehicles" ON vehicles
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own vehicles" ON vehicles
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- SERVICE_ORDERS
-- =============================================
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own service_orders" ON service_orders
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own service_orders" ON service_orders
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own service_orders" ON service_orders
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own service_orders" ON service_orders
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- INVENTORY
-- =============================================
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own inventory" ON inventory
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own inventory" ON inventory
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own inventory" ON inventory
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own inventory" ON inventory
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- TRANSACTIONS
-- =============================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own transactions" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own transactions" ON transactions
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own transactions" ON transactions
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- APPOINTMENTS
-- =============================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own appointments" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own appointments" ON appointments
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can delete own appointments" ON appointments
  FOR DELETE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================
-- MOTORIST_FUELING
-- =============================================
ALTER TABLE motorist_fueling ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own fueling" ON motorist_fueling
  FOR SELECT TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can insert own fueling" ON motorist_fueling
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can update own fueling" ON motorist_fueling
  FOR UPDATE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can delete own fueling" ON motorist_fueling
  FOR DELETE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

-- =============================================
-- MOTORIST_EXPENSES
-- =============================================
ALTER TABLE motorist_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own expenses" ON motorist_expenses
  FOR SELECT TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can insert own expenses" ON motorist_expenses
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can update own expenses" ON motorist_expenses
  FOR UPDATE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can delete own expenses" ON motorist_expenses
  FOR DELETE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

-- =============================================
-- MOTORIST_REMINDERS
-- =============================================
ALTER TABLE motorist_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own reminders" ON motorist_reminders
  FOR SELECT TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can insert own reminders" ON motorist_reminders
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can update own reminders" ON motorist_reminders
  FOR UPDATE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can delete own reminders" ON motorist_reminders
  FOR DELETE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

-- =============================================
-- MAINTENANCE_HISTORY
-- =============================================
ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists can view own history" ON maintenance_history
  FOR SELECT TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can insert own history" ON maintenance_history
  FOR INSERT TO authenticated
  WITH CHECK (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

CREATE POLICY "Motorists can update own history" ON maintenance_history
  FOR UPDATE TO authenticated
  USING (
    motorist_id IN (SELECT id FROM motorists WHERE profile_id = auth.uid())
  );

-- =============================================
-- PROMOTIONS
-- =============================================
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Oficinas podem gerenciar suas promoções
CREATE POLICY "Workshops can view own promotions" ON promotions
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can insert own promotions" ON promotions
  FOR INSERT TO authenticated
  WITH CHECK (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

CREATE POLICY "Workshops can update own promotions" ON promotions
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- QUALQUER usuário pode VER promoções ativas
CREATE POLICY "Anyone can view active promotions" ON promotions
  FOR SELECT TO authenticated
  USING (is_active = true);

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- Para verificar as policies criadas, execute:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, cmd;
