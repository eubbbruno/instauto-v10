-- ============================================
-- FIX: RLS Policies para Notifications
-- ============================================

-- 1. Ver policies atuais
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'notifications';

-- 2. Dropar policies antigas se existirem
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
DROP POLICY IF EXISTS "notifications_insert" ON notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON notifications;

-- 3. Criar policies corretas

-- SELECT: Usuário pode ver suas próprias notificações
CREATE POLICY "notifications_select_own" ON notifications
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- INSERT: Qualquer usuário autenticado pode criar notificações
-- (necessário para criar notificações para outros usuários)
CREATE POLICY "notifications_insert" ON notifications
FOR INSERT TO authenticated
WITH CHECK (true);

-- UPDATE: Usuário pode atualizar suas próprias notificações (marcar como lida)
CREATE POLICY "notifications_update_own" ON notifications
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. Verificar se funcionou
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'notifications';
