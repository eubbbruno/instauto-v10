-- =============================================
-- CORREÇÃO FOCADA: TABELA QUOTES
-- Execute linha por linha no Supabase SQL Editor
-- =============================================

-- PASSO 1: Ver policies atuais
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'quotes';

-- COPIE O RESULTADO E ME ENVIE!

-- =============================================

-- PASSO 2: Dropar TODAS as policies de quotes
DROP POLICY IF EXISTS "Motoristas podem criar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Motoristas podem ver seus orçamentos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem ver orçamentos recebidos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem atualizar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Users can create quotes" ON quotes;
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can view received quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can update quotes" ON quotes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON quotes;
DROP POLICY IF EXISTS "Enable read access for all users" ON quotes;
DROP POLICY IF EXISTS "quotes_insert_policy" ON quotes;
DROP POLICY IF EXISTS "quotes_select_policy" ON quotes;
DROP POLICY IF EXISTS "quotes_update_policy" ON quotes;
DROP POLICY IF EXISTS "Public can create quotes" ON quotes;
DROP POLICY IF EXISTS "Workshop manage quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can create quotes" ON quotes;
DROP POLICY IF EXISTS "Motorists can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can view quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can update quotes" ON quotes;

-- Verificar se removeu tudo
SELECT policyname FROM pg_policies WHERE tablename = 'quotes';
-- Resultado esperado: nenhuma linha (0 policies)

-- =============================================

-- PASSO 3: Criar policies SIMPLES e funcionais

-- Garantir que RLS está habilitado
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy 1: QUALQUER usuário autenticado pode CRIAR orçamento
-- (sem validação complexa - deixa o código validar)
CREATE POLICY "Anyone authenticated can create quotes" ON quotes
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Policy 2: Motoristas podem ver orçamentos pelo email
-- Usa auth.users diretamente ao invés de profiles
CREATE POLICY "Motorists view own quotes by email" ON quotes
  FOR SELECT TO authenticated
  USING (
    motorist_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Policy 3: Oficinas podem ver orçamentos recebidos
CREATE POLICY "Workshops view received quotes" ON quotes
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- Policy 4: Oficinas podem atualizar orçamentos (responder)
CREATE POLICY "Workshops update quotes" ON quotes
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- =============================================

-- PASSO 4: Verificar se criou corretamente
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'quotes';
-- Resultado esperado: 4 policies

-- =============================================

-- PASSO 5: Testar INSERT direto

-- 5.1 Pegar IDs necessários
SELECT id, name FROM workshops WHERE is_public = true LIMIT 1;
SELECT email FROM auth.users LIMIT 1;

-- 5.2 Testar INSERT (SUBSTITUA OS VALORES!)
INSERT INTO quotes (
  workshop_id,
  motorist_name,
  motorist_email,
  motorist_phone,
  vehicle_brand,
  vehicle_model,
  vehicle_year,
  vehicle_plate,
  service_type,
  description,
  urgency,
  status
) VALUES (
  'COLAR_WORKSHOP_ID_AQUI',
  'Teste SQL',
  'COLAR_EMAIL_AQUI',
  '11999999999',
  'Fiat',
  'Uno',
  2020,
  'ABC-1234',
  'Revisão',
  'Teste de INSERT direto no SQL',
  'normal',
  'pending'
);

-- Se funcionar, verá: "INSERT 0 1"
-- Se não funcionar, verá erro de RLS

-- =============================================

-- PASSO 6: Verificar o orçamento criado
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1;

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- SE AINDA NÃO FUNCIONAR, execute:
-- ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
-- (temporariamente para testar)
