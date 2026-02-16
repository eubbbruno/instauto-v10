# 🎯 TESTE FOCADO - CRIAÇÃO DE ORÇAMENTOS

Execute cada passo e me envie os resultados.

---

## PASSO 1: Verificar Policies Atuais

**Execute no Supabase SQL Editor:**
```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'quotes';
```

**ME ENVIE O RESULTADO!**

---

## PASSO 2: Remover Policies Antigas

**Execute no Supabase SQL Editor:**
```sql
-- Dropar TODAS as policies
DROP POLICY IF EXISTS "Motoristas podem criar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Motoristas podem ver seus orçamentos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem ver orçamentos recebidos" ON quotes;
DROP POLICY IF EXISTS "Oficinas podem atualizar orçamentos" ON quotes;
DROP POLICY IF EXISTS "Public can create quotes" ON quotes;
DROP POLICY IF EXISTS "Workshop manage quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can create quotes" ON quotes;
DROP POLICY IF EXISTS "Motorists can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can view quotes" ON quotes;
DROP POLICY IF EXISTS "Workshops can update quotes" ON quotes;

-- Verificar se removeu tudo
SELECT policyname FROM pg_policies WHERE tablename = 'quotes';
```

**Resultado esperado:** 0 linhas (nenhuma policy)

---

## PASSO 3: Criar Policies Simples

**Execute no Supabase SQL Editor:**
```sql
-- Habilitar RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy 1: Qualquer usuário autenticado pode criar
CREATE POLICY "quotes_insert_public" ON quotes
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Policy 2: Motoristas veem seus orçamentos
CREATE POLICY "quotes_select_motorist" ON quotes
  FOR SELECT TO authenticated
  USING (
    motorist_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Policy 3: Oficinas veem orçamentos recebidos
CREATE POLICY "quotes_select_workshop" ON quotes
  FOR SELECT TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- Policy 4: Oficinas podem atualizar
CREATE POLICY "quotes_update_workshop" ON quotes
  FOR UPDATE TO authenticated
  USING (
    workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid())
  );

-- Verificar
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'quotes';
```

**Resultado esperado:** 4 policies criadas

---

## PASSO 4: Testar INSERT Manual

**Execute no Supabase SQL Editor:**
```sql
-- 4.1 Pegar dados
SELECT id, name FROM workshops WHERE is_public = true LIMIT 1;
-- Copie o ID: _______________

SELECT email FROM auth.users LIMIT 1;
-- Copie o email: _______________

-- 4.2 Testar INSERT (SUBSTITUA OS VALORES!)
INSERT INTO quotes (
  workshop_id,
  motorist_name,
  motorist_email,
  motorist_phone,
  vehicle_brand,
  vehicle_model,
  vehicle_year,
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
  'Revisão',
  'Teste',
  'normal',
  'pending'
) RETURNING *;
```

**Funcionou?**
- ✅ SIM → Policies estão corretas, problema é no frontend
- ❌ NÃO → Qual erro apareceu?

---

## PASSO 5: Testar no Frontend

1. Abra o app: http://localhost:3000
2. Login como motorista
3. Buscar Oficinas → Clicar em uma
4. **Abrir Console (F12) ANTES de solicitar orçamento**
5. Solicitar Orçamento → Preencher → Enviar
6. **Verificar logs no console**

**Logs esperados:**
```
=== CRIANDO ORÇAMENTO ===
Workshop ID: ...
Motorist Email: ...
Dados completos: {...}
✅ Orçamento criado com sucesso
```

**Se der erro:**
```
❌ ERRO ao inserir orçamento:
Código: ...
Mensagem: ...
```

**ME ENVIE O ERRO COMPLETO!**

---

## PASSO 6: Se Nada Funcionar - Desabilitar RLS

**TEMPORÁRIO - apenas para teste:**
```sql
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
```

Testar criar orçamento no app.

**Funcionou?**
- ✅ SIM → Confirma que é problema de RLS
- ❌ NÃO → Problema é no código

**Depois reabilitar:**
```sql
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
```

---

## 📊 CHECKLIST

- [ ] PASSO 1: Ver policies atuais → resultado: _______________
- [ ] PASSO 2: Dropar policies → resultado: 0 policies
- [ ] PASSO 3: Criar policies simples → resultado: 4 policies
- [ ] PASSO 4: INSERT manual → funcionou? _______________
- [ ] PASSO 5: Teste no frontend → funcionou? _______________
- [ ] PASSO 6: (se necessário) Desabilitar RLS → funcionou? _______________

---

## 🆘 INFORMAÇÕES PARA DEBUG

Se ainda não funcionar, me envie:

1. **Resultado do PASSO 1** (policies atuais)
2. **Erro do INSERT manual** (se houver)
3. **Logs completos do console** ao tentar criar orçamento
4. **Estrutura da tabela quotes:**
```sql
\d quotes
-- ou
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes';
```

---

**Execute cada passo e me reporte os resultados!**
