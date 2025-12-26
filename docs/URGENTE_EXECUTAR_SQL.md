# 🚨 URGENTE: Executar SQL para Corrigir Google OAuth

## ❌ PROBLEMA

Ao fazer login com Google, aparece o erro:
```
Database error saving new user
```

## ✅ SOLUÇÃO

Execute o SQL abaixo no Supabase **AGORA**:

### 📍 Como Executar:

1. Acesse [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Clique em **New query**
4. Copie e cole o conteúdo de: `docs/database-fix-oauth.sql`
5. Clique em **Run** (Ctrl+Enter)

---

## 📄 SQL a Executar:

```sql
-- =====================================================
-- FIX: Google OAuth - Corrigir criação de profile
-- =====================================================

-- 1. REMOVER trigger automático (causa erro no OAuth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. REMOVER função antiga
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. REMOVER trigger de criar workshop automaticamente
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- 4. REMOVER função antiga
DROP FUNCTION IF EXISTS handle_new_workshop_profile();

-- 5. Tornar o campo 'type' NULLABLE temporariamente
ALTER TABLE profiles ALTER COLUMN type DROP NOT NULL;
```

---

## 🎯 O QUE MUDA?

### ANTES (com erro):
1. Usuário faz login com Google
2. ❌ Sistema tenta criar profile automaticamente
3. ❌ Falha porque não sabe se é "oficina" ou "motorista"
4. ❌ Erro: "Database error saving new user"

### DEPOIS (corrigido):
1. Usuário faz login com Google ✅
2. Sistema cria apenas o `auth.users` ✅
3. Redireciona para `/completar-cadastro` ✅
4. Usuário escolhe: **Oficina** 🏢 ou **Motorista** 🚗 ✅
5. Profile é criado com o tipo correto ✅
6. Redireciona para o dashboard correto ✅

---

## 🧪 TESTAR APÓS EXECUTAR:

1. Ir em: `instauto.com.br/login`
2. Clicar em "Continuar com Google"
3. Autorizar no Google
4. **DEVE REDIRECIONAR PARA**: `/completar-cadastro`
5. Escolher "Oficina" ou "Motorista"
6. Preencher dados
7. Clicar em "Começar a usar"
8. **DEVE IR PARA**: Dashboard correto

---

## ⚠️ IMPORTANTE

**Execute este SQL ANTES de testar o Google OAuth novamente!**

Sem executar este SQL, o erro vai continuar acontecendo.

---

## 📊 STATUS

- ✅ Código corrigido (já no deploy)
- ⏳ **SQL precisa ser executado no Supabase**
- ⏳ Testar Google OAuth após executar SQL

---

**Qualquer dúvida, me avisa!** 🚀

