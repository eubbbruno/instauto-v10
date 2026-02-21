# 🗄️ Supabase Database Setup

## Script de Reset Completo

O arquivo `reset-database.sql` contém um script completo para resetar e recriar todo o banco de dados do Instauto do zero.

---

## ⚠️ ATENÇÃO

**Este script APAGA TODOS OS DADOS do banco!**

Use apenas quando:
- Estiver configurando um novo ambiente
- Precisar resetar o banco completamente
- Houver problemas graves de estrutura/RLS

---

## 📋 Como Usar

### 1. Acessar o Supabase Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto Instauto
3. Vá em **SQL Editor** no menu lateral

### 2. Executar o Script

1. Clique em **New Query**
2. Copie TODO o conteúdo do arquivo `reset-database.sql`
3. Cole no editor SQL
4. Clique em **Run** (ou pressione `Ctrl+Enter`)
5. Aguarde a execução (pode levar 10-30 segundos)
6. Verifique se apareceu a mensagem: `Database reset completo! ✅`

### 3. Limpar Usuários (Importante!)

Após executar o script, você DEVE limpar os usuários antigos:

1. Vá em **Authentication** → **Users** no menu lateral
2. Delete TODOS os usuários existentes
3. Isso garante que novos logins via Google criarão os profiles corretamente

### 4. Testar Login Google

Agora você pode testar o login Google:

**Para Oficina:**
1. Acesse `/login-oficina`
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Verifique os logs no console do navegador
5. Deve redirecionar para `/oficina?welcome=true`

**Para Motorista:**
1. Acesse `/login-motorista`
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Verifique os logs no console do navegador
5. Deve redirecionar para `/motorista?welcome=true`

---

## 🔍 Verificar se Funcionou

### No Supabase Dashboard:

**1. Verificar Tabelas:**
- Vá em **Table Editor**
- Deve ver todas as tabelas: `profiles`, `motorists`, `workshops`, `quotes`, etc.

**2. Verificar RLS:**
- Vá em **Authentication** → **Policies**
- Cada tabela deve ter suas policies listadas

**3. Após Login Google:**
- Vá em **Table Editor** → `profiles`
- Deve aparecer um novo registro com seu email
- Verifique o campo `type` (deve ser `motorist` ou `workshop`)
- Vá em `motorists` ou `workshops` e verifique se o registro foi criado

### No Console do Navegador:

Você deve ver logs como:
```
🔵 [Login Oficina] Salvando tipo no localStorage: oficina
=== CALLBACK GOOGLE START ===
Code: presente
Type: oficina
🔨 CRIANDO NOVO PROFILE
✅ Profile criado com sucesso!
🔨 Criando workshop...
✅ Workshop criado com sucesso
🔄 [AuthContext] Carregando profile (tentativa 1/3)...
✅ [AuthContext] Profile encontrado: workshop
✅ Redirecionando para /oficina
```

---

## 📊 Estrutura do Banco

O script cria:

### Tabelas Principais:
- `profiles` - Usuários (motoristas e oficinas)
- `motorists` - Dados específicos de motoristas
- `workshops` - Dados específicos de oficinas
- `motorist_vehicles` - Veículos dos motoristas
- `clients` - Clientes das oficinas
- `vehicles` - Veículos das oficinas
- `quotes` - Orçamentos
- `service_orders` - Ordens de serviço
- `inventory` - Estoque
- `transactions` - Financeiro
- `appointments` - Agenda
- `notifications` - Notificações
- E mais...

### RLS (Row Level Security):
- ✅ Motoristas só veem seus próprios dados
- ✅ Oficinas só veem seus próprios dados
- ✅ Orçamentos são visíveis para ambos (motorista que criou e oficina que recebeu)
- ✅ Oficinas públicas são visíveis para todos
- ✅ Promoções ativas são visíveis para todos

### Views:
- `public_workshops` - Oficinas públicas (sem RLS)

### Triggers:
- `update_updated_at` - Atualiza automaticamente o campo `updated_at`

---

## 🐛 Troubleshooting

### Erro: "relation already exists"
**Solução:** O script já trata disso com `DROP TABLE IF EXISTS`. Execute novamente.

### Erro: "permission denied"
**Solução:** Certifique-se de estar usando o SQL Editor do Supabase Dashboard (não o CLI).

### Login Google não cria profile
**Solução:**
1. Verifique se executou o script completo
2. Delete o usuário em Authentication → Users
3. Tente fazer login novamente
4. Verifique os logs no console do navegador

### Profile criado mas workshop/motorist não
**Solução:**
1. Verifique os logs no console
2. Vá em SQL Editor e execute:
   ```sql
   SELECT * FROM profiles WHERE email = 'seu-email@gmail.com';
   SELECT * FROM workshops WHERE profile_id = 'UUID-DO-PROFILE';
   -- ou
   SELECT * FROM motorists WHERE profile_id = 'UUID-DO-PROFILE';
   ```
3. Se não existir, o callback teve erro. Verifique os logs do servidor.

---

## 📝 Notas Importantes

1. **Backup:** Sempre faça backup antes de executar o script em produção
2. **Desenvolvimento:** Este script é seguro para ambientes de desenvolvimento
3. **Produção:** NUNCA execute em produção sem backup completo
4. **Dados de Teste:** Após o reset, você precisará criar novos dados de teste

---

## 🔄 Atualizações Futuras

Se precisar adicionar novas tabelas ou campos:

1. Edite o arquivo `reset-database.sql`
2. Execute novamente no Supabase SQL Editor
3. Faça commit das alterações no Git
4. Documente as mudanças neste README

---

## 📚 Documentação Adicional

Para mais detalhes sobre a estrutura do banco, consulte:
- `docs/DATABASE_STRUCTURE.md` - Documentação completa de todas as tabelas

---

**Última atualização:** 2026-02-15
**Versão do Script:** 1.0.0
