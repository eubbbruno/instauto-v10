# 🚨 INSTRUÇÕES CRÍTICAS - CORREÇÃO DE RLS POLICIES

## ⚠️ PROBLEMA ATUAL
O sistema está com erro: **"new row violates row-level security policy for table quotes"**

Isso significa que as RLS (Row Level Security) policies do Supabase estão mal configuradas e impedem a criação de orçamentos.

---

## 📋 PASSO A PASSO PARA CORRIGIR

### 1. Abrir o Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **instauto-v10**
3. No menu lateral, clique em **SQL Editor**

### 2. Executar o Script de Correção

1. Abra o arquivo: `supabase-rls-fix.sql` (está na raiz do projeto)
2. Copie TODO o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (ou pressione Ctrl+Enter)

**IMPORTANTE:** O script vai:
- Dropar todas as policies antigas (que estão causando o erro)
- Criar policies novas e corretas para TODAS as tabelas
- Habilitar RLS em todas as tabelas necessárias

### 3. Verificar se as Policies Foram Criadas

Execute esta query no SQL Editor:

```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

**Resultado esperado:** Você deve ver policies para:
- profiles (3 policies: SELECT, UPDATE, INSERT)
- motorists (4 policies: SELECT, UPDATE, INSERT, DELETE)
- workshops (5 policies: SELECT, UPDATE, INSERT, DELETE + public SELECT)
- quotes (4 policies: SELECT motorista, SELECT oficina, INSERT motorista, UPDATE oficina)
- motorist_vehicles (4 policies)
- notifications (3 policies)
- E todas as outras tabelas...

### 4. Testar a Criação de Orçamento

1. Faça login como motorista
2. Vá em "Buscar Oficinas"
3. Clique em uma oficina
4. Clique em "Solicitar Orçamento"
5. Preencha o formulário
6. Clique em "Enviar"

**Abra o Console do Navegador (F12)** e verifique os logs:

✅ **Se funcionar**, você verá:
```
=== CRIANDO ORÇAMENTO ===
Workshop ID: ...
Motorist Email: ...
✅ Orçamento criado com sucesso: {...}
```

❌ **Se ainda der erro**, você verá:
```
❌ ERRO ao inserir orçamento:
Código: ...
Mensagem: ...
```

**Se ainda der erro**, copie TODA a mensagem de erro e me envie.

---

## 🔍 DIAGNÓSTICO ADICIONAL

### Verificar se o usuário está autenticado corretamente:

Execute no SQL Editor:

```sql
-- Ver usuários autenticados
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver profiles
SELECT id, email, type 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver motoristas
SELECT m.id, p.email, p.name 
FROM motorists m
JOIN profiles p ON m.profile_id = p.id;

-- Ver oficinas
SELECT w.id, w.name, w.is_public, w.accepts_quotes
FROM workshops w;
```

### Testar INSERT manual de orçamento:

```sql
-- Pegar um motorista
SELECT id, email FROM profiles WHERE type = 'motorista' LIMIT 1;

-- Pegar uma oficina
SELECT id, name FROM workshops WHERE is_public = true LIMIT 1;

-- Testar insert (SUBSTITUA OS VALORES)
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
  '<WORKSHOP_ID_AQUI>',
  'Teste Manual',
  '<EMAIL_DO_MOTORISTA_AQUI>',
  '11999999999',
  'Fiat',
  'Uno',
  2020,
  'Revisão',
  'Teste de criação de orçamento via SQL',
  'normal',
  'pending'
);
```

Se o INSERT manual funcionar, o problema está no código frontend.
Se o INSERT manual NÃO funcionar, o problema está nas RLS policies.

---

## 📊 CHECKLIST DE VERIFICAÇÃO

- [ ] Script SQL executado sem erros
- [ ] Policies verificadas (query acima)
- [ ] Teste de criação de orçamento realizado
- [ ] Console do navegador verificado (F12)
- [ ] Se erro persistir: mensagem de erro copiada

---

## 🆘 SE AINDA NÃO FUNCIONAR

1. Copie a mensagem de erro COMPLETA do console
2. Execute a query de verificação de policies
3. Execute o teste de INSERT manual
4. Me envie todos os resultados

---

## ✅ APÓS CORRIGIR

Quando funcionar:
1. Teste criar 2-3 orçamentos
2. Verifique se aparecem no dashboard da oficina
3. Teste responder um orçamento (oficina)
4. Verifique se a notificação é criada (motorista)

---

**Criado em:** 15/02/2026  
**Arquivo SQL:** `supabase-rls-fix.sql`  
**Status:** Aguardando execução no Supabase
