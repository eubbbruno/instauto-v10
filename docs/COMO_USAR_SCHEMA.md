# 🗄️ Como Usar o Schema SQL

## 📋 Passo a Passo

### 1. Acesse o Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

### 2. Abra o SQL Editor

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**

### 3. Execute o Schema

1. Abra o arquivo `docs/database-schema.sql`
2. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a execução (pode levar 10-30 segundos)

### 4. Verifique se Funcionou

Você deve ver a mensagem:

```
✅ Schema criado com sucesso!
📊 Tabelas: profiles, workshops, clients, vehicles, service_orders
🔒 RLS habilitado em todas as tabelas
⚡ Triggers configurados
📈 Views criadas: workshop_stats, recent_service_orders
🎯 Pronto para uso!
```

### 5. Verifique as Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - ✅ profiles
   - ✅ workshops
   - ✅ clients
   - ✅ vehicles
   - ✅ service_orders

---

## 📊 O que foi criado?

### Tabelas

1. **profiles** - Perfis de usuários
   - Estende auth.users do Supabase
   - Tipos: oficina, motorista, admin

2. **workshops** - Dados das oficinas
   - Vinculado ao profile
   - Planos: free (10 clientes, 30 OS/mês) ou pro (ilimitado)
   - Trial de 14 dias

3. **clients** - Clientes das oficinas
   - Nome, email, telefone, CPF
   - Notas/observações

4. **vehicles** - Veículos dos clientes
   - Placa, marca, modelo, ano
   - Quilometragem, cor
   - Vinculado ao cliente e oficina

5. **service_orders** - Ordens de serviço
   - Número sequencial automático (OS-2024-0001)
   - Status: pending, approved, in_progress, completed, cancelled
   - Serviços e peças em JSON
   - Cálculo automático de total

### Triggers Automáticos

1. **Criar profile** - Ao fazer signup, cria automaticamente o profile
2. **Criar workshop** - Se o tipo for "oficina", cria automaticamente a workshop
3. **Atualizar updated_at** - Atualiza automaticamente em todas as tabelas
4. **Calcular total** - Calcula automaticamente labor_cost + parts_cost
5. **Atualizar datas** - Define started_at e completed_at automaticamente

### Funções Úteis

1. **generate_order_number(workshop_id)** - Gera número sequencial de OS
   ```sql
   SELECT generate_order_number('uuid-da-oficina');
   -- Retorna: OS-2024-0001
   ```

2. **check_free_plan_limits(workshop_id)** - Verifica limites do plano FREE
   ```sql
   SELECT * FROM check_free_plan_limits('uuid-da-oficina');
   -- Retorna: can_add_client, can_add_order, contadores, etc.
   ```

### Views

1. **workshop_stats** - Estatísticas agregadas por oficina
   ```sql
   SELECT * FROM workshop_stats WHERE profile_id = 'seu-uuid';
   ```

2. **recent_service_orders** - Últimas OS com dados do cliente/veículo
   ```sql
   SELECT * FROM recent_service_orders WHERE workshop_id = 'uuid-da-oficina' LIMIT 10;
   ```

### Row Level Security (RLS)

✅ **Totalmente configurado e ativo!**

- Usuários só veem seus próprios dados
- Oficinas só acessam seus clientes/veículos/OS
- Admins têm acesso total
- Proteção automática em todas as operações

---

## 🧪 Testar o Schema

### 1. Criar um usuário de teste

No Next.js, use a página de cadastro:
- Acesse http://localhost:3000/cadastro
- Crie uma conta de teste
- Faça login

### 2. Verificar no Supabase

1. Vá em **Table Editor** > **profiles**
2. Você deve ver seu usuário criado
3. Vá em **workshops**
4. Você deve ver sua oficina criada automaticamente

### 3. Testar CRUD de Clientes

1. No dashboard, vá em **Clientes**
2. Clique em **Novo Cliente**
3. Preencha os dados
4. Salve
5. Verifique no Supabase: **Table Editor** > **clients**

---

## 🔧 Comandos SQL Úteis

### Ver todos os dados

```sql
-- Ver todos os perfis
SELECT * FROM profiles;

-- Ver todas as oficinas
SELECT * FROM workshops;

-- Ver clientes de uma oficina
SELECT * FROM clients WHERE workshop_id = 'uuid-da-oficina';

-- Ver estatísticas de uma oficina
SELECT * FROM workshop_stats WHERE profile_id = 'uuid-do-usuario';
```

### Limpar dados de teste

```sql
-- ATENÇÃO: Isso apaga TODOS os dados!
DELETE FROM service_orders;
DELETE FROM vehicles;
DELETE FROM clients;
DELETE FROM workshops;
DELETE FROM profiles;
```

### Verificar RLS

```sql
-- Ver policies ativas
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar triggers

```sql
-- Ver todos os triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

---

## 🐛 Troubleshooting

### Erro: "relation already exists"

**Solução**: Algumas tabelas já existem. Você pode:

1. **Opção 1**: Dropar as tabelas existentes primeiro
   ```sql
   DROP TABLE IF EXISTS service_orders CASCADE;
   DROP TABLE IF EXISTS vehicles CASCADE;
   DROP TABLE IF EXISTS clients CASCADE;
   DROP TABLE IF EXISTS workshops CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```

2. **Opção 2**: Executar apenas as partes que faltam do schema

### Erro: "permission denied"

**Solução**: Você precisa ter permissões de admin no Supabase.

### Erro: "function already exists"

**Solução**: Normal! O schema usa `CREATE OR REPLACE`, então pode executar múltiplas vezes.

### RLS não está funcionando

**Solução**: Verifique se:
1. RLS está habilitado: `ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;`
2. Policies foram criadas corretamente
3. Você está autenticado no frontend

---

## 📝 Modificar o Schema

Se precisar fazer alterações:

1. **Adicionar coluna**:
   ```sql
   ALTER TABLE clients ADD COLUMN whatsapp TEXT;
   ```

2. **Remover coluna**:
   ```sql
   ALTER TABLE clients DROP COLUMN whatsapp;
   ```

3. **Modificar coluna**:
   ```sql
   ALTER TABLE clients ALTER COLUMN phone TYPE VARCHAR(20);
   ```

4. **Adicionar índice**:
   ```sql
   CREATE INDEX idx_clients_whatsapp ON clients(whatsapp);
   ```

---

## 🎯 Próximos Passos

Após executar o schema:

1. ✅ Configure as variáveis de ambiente (.env.local)
2. ✅ Teste o cadastro/login
3. ✅ Crie alguns clientes de teste
4. ✅ Verifique as estatísticas no dashboard
5. ✅ Continue o desenvolvimento (veículos, OS, etc.)

---

## 📚 Recursos

- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)

---

**✅ Schema pronto para uso em produção!**


