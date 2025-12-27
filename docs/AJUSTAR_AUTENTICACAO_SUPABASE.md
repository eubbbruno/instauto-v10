# 🔧 Ajustar Autenticação no Supabase

## ⚠️ PROBLEMA ATUAL

O cadastro de motoristas está criando usuários, mas eles não conseguem fazer login porque:
1. O email não está sendo confirmado automaticamente
2. O perfil de motorista não está sendo criado corretamente
3. O Google OAuth não está redirecionando para o dashboard correto

---

## 📋 PASSOS PARA CORRIGIR NO SUPABASE

### 1️⃣ DESABILITAR CONFIRMAÇÃO DE EMAIL (para desenvolvimento)

**Caminho:** Authentication → Settings → Email Auth

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** (menu lateral esquerdo)
4. Clique em **Settings** (submenu)
5. Role até a seção **"Email Auth"**
6. **DESMARQUE** a opção: **"Enable email confirmations"**
7. Clique em **Save**

> ⚠️ **IMPORTANTE:** Em produção, você deve MANTER a confirmação de email ativada e implementar um fluxo de confirmação por email.

---

### 2️⃣ VERIFICAR TABELA PROFILES

**Caminho:** Table Editor → profiles

Execute este SQL no **SQL Editor** para garantir que a tabela `profiles` está correta:

```sql
-- Verificar estrutura da tabela profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

A tabela deve ter estas colunas:
- `id` (uuid, NOT NULL) - Primary Key
- `email` (text, NULLABLE)
- `name` (text, NULLABLE)
- `type` (text, NULLABLE) - Pode ser 'oficina' ou 'motorista'
- `phone` (text, NULLABLE)
- `created_at` (timestamp, NOT NULL)
- `updated_at` (timestamp, NOT NULL)

Se a coluna `type` não permitir NULL, execute:

```sql
-- Permitir que type seja NULL
ALTER TABLE profiles ALTER COLUMN type DROP NOT NULL;
```

---

### 3️⃣ VERIFICAR TABELA MOTORISTS

Execute este SQL para verificar a tabela `motorists`:

```sql
-- Verificar estrutura da tabela motorists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'motorists'
ORDER BY ordinal_position;
```

A tabela deve ter:
- `id` (uuid, NOT NULL) - Primary Key
- `profile_id` (uuid, NOT NULL) - Foreign Key para profiles(id)
- `name` (text, NULLABLE)
- `phone` (text, NULLABLE)
- `created_at` (timestamp, NOT NULL)
- `updated_at` (timestamp, NOT NULL)

Se a tabela não existir ou estiver incorreta, execute:

```sql
-- Criar tabela motorists (se não existir)
CREATE TABLE IF NOT EXISTS motorists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Habilitar RLS
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

-- Política: Motoristas podem ver e editar apenas seus próprios dados
CREATE POLICY "Motoristas podem ver seus próprios dados"
  ON motorists FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Motoristas podem atualizar seus próprios dados"
  ON motorists FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Motoristas podem inserir seus próprios dados"
  ON motorists FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_motorists_profile_id ON motorists(profile_id);
```

---

### 4️⃣ VERIFICAR RLS (Row Level Security) NA TABELA PROFILES

Execute este SQL para verificar as políticas:

```sql
-- Ver políticas da tabela profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

Se não houver políticas ou estiverem incorretas, execute:

```sql
-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON profiles;

-- Criar políticas corretas
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

### 5️⃣ REMOVER TRIGGERS ANTIGOS (se existirem)

Execute este SQL para verificar e remover triggers que podem estar causando conflito:

```sql
-- Ver todos os triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'motorists', 'workshops');
```

Se houver triggers como `on_auth_user_created` ou similares, remova-os:

```sql
-- Remover trigger antigo (se existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
```

---

### 6️⃣ VERIFICAR CONFIGURAÇÃO DO GOOGLE OAUTH

**Caminho:** Authentication → Providers → Google

1. Vá em **Authentication** → **Providers**
2. Clique em **Google**
3. Verifique se está **Enabled**
4. Confirme que o **Redirect URL** está correto:
   - Para desenvolvimento: `http://localhost:3000/auth/callback`
   - Para produção: `https://www.instauto.com.br/auth/callback`
5. Verifique se o **Client ID** e **Client Secret** estão preenchidos

---

### 7️⃣ TESTAR MANUALMENTE NO SQL EDITOR

Após fazer os ajustes acima, teste criar um usuário manualmente:

```sql
-- 1. Verificar se há usuários na tabela auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. Verificar profiles criados
SELECT id, email, name, type, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 3. Verificar motoristas criados
SELECT m.id, m.profile_id, m.name, p.email
FROM motorists m
LEFT JOIN profiles p ON m.profile_id = p.id
ORDER BY m.created_at DESC
LIMIT 5;

-- 4. Se precisar limpar dados de teste, use:
-- DELETE FROM motorists WHERE profile_id = 'UUID_DO_USUARIO';
-- DELETE FROM profiles WHERE id = 'UUID_DO_USUARIO';
-- DELETE FROM auth.users WHERE id = 'UUID_DO_USUARIO';
```

---

## ✅ CHECKLIST FINAL

Antes de testar o cadastro novamente, confirme que:

- [ ] Confirmação de email está DESABILITADA (para desenvolvimento)
- [ ] Coluna `type` na tabela `profiles` permite NULL
- [ ] Tabela `motorists` existe e tem a estrutura correta
- [ ] RLS está habilitado e as políticas estão corretas
- [ ] Não há triggers antigos causando conflito
- [ ] Google OAuth está configurado corretamente
- [ ] Você executou os SQLs de teste e verificou que não há erros

---

## 🧪 COMO TESTAR

1. **Limpe o cache do navegador** ou use uma aba anônima
2. Acesse: `https://www.instauto.com.br/cadastro-motorista`
3. Preencha o formulário e clique em "Criar Conta Grátis"
4. Deve aparecer "Conta criada com sucesso!" e redirecionar para `/motorista`
5. Tente fazer logout e login novamente com as mesmas credenciais
6. Deve funcionar sem erros

---

## 🆘 SE AINDA HOUVER PROBLEMAS

Execute este SQL para ver logs de erro:

```sql
-- Ver últimos usuários criados e seus status
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.type,
  m.id as motorist_id,
  w.id as workshop_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
LEFT JOIN workshops w ON u.id = w.profile_id
ORDER BY u.created_at DESC
LIMIT 10;
```

Se você ver usuários sem `motorist_id` ou `workshop_id`, significa que o perfil não foi criado corretamente.

---

## 📞 PRÓXIMOS PASSOS

Após executar todos esses passos, me avise e vou corrigir o código da aplicação para garantir que:
1. O cadastro de motorista funcione perfeitamente
2. O login funcione sem erros
3. O Google OAuth redirecione corretamente

