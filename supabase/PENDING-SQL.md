# 📋 SQLs Pendentes de Execução

Este documento lista todos os scripts SQL que foram criados e podem precisar ser executados no Supabase.

---

## 🔴 CRÍTICOS (Executar Primeiro)

### 1. financeiro-tables.sql
**Status**: ⚠️ PENDENTE  
**Descrição**: Cria estrutura completa do módulo financeiro

**Tabelas criadas:**
- `transactions` - Receitas e despesas
- `bills` - Contas a pagar
- `receivables` - Contas a receber

**Inclui:**
- Índices para performance
- RLS e policies por workshop
- Triggers para updated_at

**Como executar:**
1. Abrir Supabase Dashboard
2. SQL Editor
3. Copiar conteúdo de `supabase/financeiro-tables.sql`
4. Executar
5. Verificar se não há erros

---

### 2. service-orders-tables.sql
**Status**: ⚠️ PENDENTE  
**Descrição**: Cria estrutura completa do módulo de Ordens de Serviço

**Tabelas criadas:**
- `service_orders` - OS principal
- `service_order_items` - Serviços e peças
- `service_order_checklist` - Checklist de verificação
- `service_order_history` - Histórico de mudanças

**Inclui:**
- 7 status possíveis (pending, approved, in_progress, waiting_parts, completed, delivered, cancelled)
- Índices para performance
- RLS e policies por workshop
- Triggers automáticos (updated_at, histórico de status)

**Como executar:**
1. Abrir Supabase Dashboard
2. SQL Editor
3. Copiar conteúdo de `supabase/service-orders-tables.sql`
4. Executar
5. Verificar se não há erros

---

## 🟡 IMPORTANTES (Executar se Necessário)

### 3. fix-vehicles-km.sql
**Status**: ✅ PROVAVELMENTE EXECUTADO  
**Descrição**: Adiciona coluna `km` na tabela `vehicles`

```sql
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS km INTEGER DEFAULT 0;
```

**Verificar se foi executado:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'vehicles' AND column_name = 'km';
```

---

### 4. add-avatar-column.sql
**Status**: ⚠️ VERIFICAR  
**Descrição**: Adiciona coluna `avatar_url` na tabela `profiles`

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

**Verificar se foi executado:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'avatar_url';
```

---

### 5. recreate-reviews-table.sql
**Status**: ✅ PROVAVELMENTE EXECUTADO  
**Descrição**: Recria tabela `reviews` com todas as colunas necessárias

**Atenção**: Este SQL faz DROP TABLE, então só executar se realmente necessário.

---

### 6. add-admin-role.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Adiciona coluna `role` em `profiles` e define admin

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
UPDATE profiles SET role = 'admin' WHERE email = 'eubbbruno@gmail.com';
```

---

## 🟢 OPCIONAIS (Fixes e Melhorias)

### 7. fix-notifications-rls.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Corrige RLS da tabela `notifications`

---

### 8. fix-quotes-rls.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Corrige RLS da tabela `quotes`

---

### 9. fix-workshops-public-rls.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Permite leitura pública de oficinas com `is_public = true`

---

### 10. fix-rls-profiles.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Corrige RLS da tabela `profiles`

---

### 11. fix-reviews-rls.sql
**Status**: ✅ EXECUTADO  
**Descrição**: Corrige RLS da tabela `reviews`

---

## 📝 Como Verificar o Schema Atual

Execute no SQL Editor do Supabase:

```sql
-- Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar colunas de uma tabela específica
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'NOME_DA_TABELA' 
ORDER BY ordinal_position;

-- Verificar policies
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

---

## ⚠️ Colunas que Podem Estar Faltando

Baseado no código, estas colunas são usadas mas podem não existir:

### vehicles
- ✅ `km` - Adicionada recentemente
- ⚠️ `notes` - Verificar se existe

### service_orders
- ⚠️ `services` - Código antigo usa, mas novo schema não tem
- ⚠️ `notes` - Código antigo usa, mas novo schema tem `internal_notes` e `client_notes`

### profiles
- ✅ `avatar_url` - Deve existir
- ✅ `role` - Deve existir

---

## 🔧 Script de Verificação Rápida

Execute para verificar se as tabelas principais existem:

```sql
-- Verificar tabelas do financeiro
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'transactions'
) AS transactions_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'bills'
) AS bills_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'receivables'
) AS receivables_exists;

-- Verificar tabelas de OS
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'service_orders'
) AS service_orders_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'service_order_items'
) AS items_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'service_order_checklist'
) AS checklist_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'service_order_history'
) AS history_exists;
```

---

## 📌 Ordem Recomendada de Execução

1. ✅ `setup-v10.sql` (já executado - schema base)
2. ⚠️ `fix-vehicles-km.sql` (se coluna km não existir)
3. ⚠️ `add-avatar-column.sql` (se coluna avatar_url não existir)
4. ⚠️ `add-admin-role.sql` (se coluna role não existir)
5. 🔴 **`financeiro-tables.sql`** (EXECUTAR)
6. 🔴 **`service-orders-tables.sql`** (EXECUTAR)

---

## 🆘 Em Caso de Erro

### "relation already exists"
- Tabela já foi criada
- Pode ignorar ou usar `CREATE TABLE IF NOT EXISTS`

### "column already exists"
- Coluna já foi adicionada
- Pode ignorar ou usar `ADD COLUMN IF NOT EXISTS`

### "permission denied"
- Usar service_role_key ao invés de anon_key
- Ou executar via Dashboard (já tem permissões)

### "foreign key constraint"
- Tabela referenciada não existe
- Executar SQLs na ordem correta

---

**Última atualização**: 15/02/2026  
**Responsável**: Bruno (eubbbruno@gmail.com)
