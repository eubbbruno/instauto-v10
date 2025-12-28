# 📨 CONTEXTO PARA CLAUDE OPUS 4.5

## 🎯 SITUAÇÃO ATUAL

Olá Claude Opus! Estou trabalhando no projeto **Instauto** - um marketplace que conecta motoristas e oficinas mecânicas no Brasil.

---

## 🏗️ ARQUITETURA DO PROJETO

### **Stack Tecnológica:**
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Deploy:** Vercel
- **Domínio:** https://www.instauto.com.br

### **Estrutura de Usuários:**
1. **Motoristas** (gratuito para sempre)
   - Buscar oficinas próximas
   - Solicitar orçamentos
   - Gerenciar veículos
   - Histórico de manutenções
   - Dashboard: `/motorista`

2. **Oficinas** (free/pro com trial de 14 dias)
   - Receber pedidos de orçamento
   - Gerenciar clientes
   - Sistema de avaliações
   - Dashboard: `/oficina`

---

## 🔴 PROBLEMA ATUAL

Estamos com um problema crítico no **fluxo de confirmação de email**:

### **O que acontece:**
1. ✅ Usuário se cadastra em `/cadastro-motorista`
2. ✅ Supabase cria usuário em `auth.users`
3. ✅ Email de confirmação é enviado
4. ❌ **Link do email não é clicável** (problema do cliente de email)
5. ❌ Quando clica/cola o link, dá erro: `Error confirming user`
6. ❌ URL fica: `https://www.instauto.com.br/?error=server_error&error_code=unexpected_failure&error_description=Error+confirming+user`
7. ❌ Login falha com: `Email not confirmed`

### **O que NÃO está funcionando:**
- ❌ Callback URL não está redirecionando corretamente
- ❌ Trigger não está criando perfil de motorista automaticamente
- ❌ Google OAuth também não funciona (não cria usuário)

### **O que JÁ está criado:**
- ✅ Usuário em `auth.users` (mas `email_confirmed_at` = NULL)
- ❌ NÃO cria em `profiles`
- ❌ NÃO cria em `motorists`

---

## 📁 ARQUIVOS IMPORTANTES

### **SQLs para executar no Supabase:**
1. `docs/SQL_UNICO_EXECUTAR.sql` - Cria tabelas e RLS
2. `docs/SQL_TRIGGER_MOTORISTA.sql` - Trigger para criar motorista ao confirmar email
3. `docs/SQL_LIMPAR_USUARIOS.sql` - Limpar usuários de teste

### **Código da aplicação:**
- `app/cadastro-motorista/page.tsx` - Cadastro de motorista
- `app/login-motorista/page.tsx` - Login de motorista
- `app/auth/callback/route.ts` - Callback de confirmação de email
- `app/(motorista)/motorista/page.tsx` - Dashboard do motorista
- `contexts/AuthContext.tsx` - Contexto de autenticação

### **Documentação:**
- `docs/README_IMPORTANTE.md` - Guia principal
- `docs/GUIA_SIMPLES_EXECUTAR.md` - Passo a passo
- `docs/PANORAMA_PROJETO.md` - Visão geral do projeto

---

## 🔧 O QUE PRECISA SER CORRIGIDO

### **1. Callback URL no Supabase**
O usuário precisa configurar manualmente:
- **Site URL:** `https://www.instauto.com.br`
- **Redirect URLs:**
  ```
  https://www.instauto.com.br/auth/callback
  https://instauto.com.br/auth/callback
  http://localhost:3000/auth/callback
  ```

### **2. Fluxo esperado:**
```
Cadastro → Email → Clica link → /auth/callback → Confirma email → 
Trigger cria profile + motorist → Redireciona para /motorista → 
Mostra mensagem de sucesso
```

### **3. Fluxo atual (quebrado):**
```
Cadastro → Email → Clica link → ERRO: "Error confirming user" → 
Redireciona para home com erro → Nada é criado nas tabelas
```

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### **Tabelas principais:**

```sql
-- Tabela de perfis (todos os usuários)
profiles (
  id UUID PRIMARY KEY,           -- Mesmo ID do auth.users
  email TEXT,
  name TEXT,
  type TEXT,                     -- 'motorista' ou 'oficina'
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tabela de motoristas
motorists (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),  -- FK para profiles
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(profile_id)
)

-- Tabela de oficinas
workshops (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  name TEXT,
  phone TEXT,
  plan_type TEXT,                -- 'free' ou 'pro'
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(profile_id)
)
```

### **Trigger que deveria funcionar:**
```sql
-- Quando email_confirmed_at muda de NULL para uma data:
-- 1. Cria profile com type='motorista'
-- 2. Cria motorist com profile_id
```

---

## 🆘 O QUE O USUÁRIO JÁ TENTOU

1. ✅ Executou `SQL_UNICO_EXECUTAR.sql`
2. ✅ Executou `SQL_TRIGGER_MOTORISTA.sql`
3. ❓ **NÃO configurou Callback URL no Supabase** (pode ser o problema!)
4. ✅ Limpou usuários várias vezes
5. ✅ Testou com múltiplos emails
6. ✅ Verificou que usuário é criado em `auth.users`
7. ❌ Mas nada é criado em `profiles` ou `motorists`

---

## 🎯 O QUE PRECISA DE AJUDA

1. **Confirmar se o Callback URL é o problema principal**
2. **Verificar se o trigger está correto**
3. **Garantir que o fluxo de confirmação funcione**
4. **Fazer Google OAuth funcionar também**
5. **Simplificar o processo ao máximo**

---

## 📝 OBSERVAÇÕES IMPORTANTES

- O usuário está em **desenvolvimento/teste** (pode deletar usuários à vontade)
- Já foram criadas **26 queries no SQL Editor** (pode limpar se necessário)
- Pasta `docs/_antigos/` tem arquivos antigos (ignore)
- O usuário quer **manter confirmação de email** (não desabilitar)
- Mensagem de boas-vindas já está implementada
- Deploy automático no Vercel funciona

---

## 🚀 PRÓXIMOS PASSOS SUGERIDOS

1. Confirmar que o usuário configurou Callback URL no Supabase
2. Testar novamente o fluxo completo
3. Se ainda não funcionar, debugar o trigger
4. Verificar logs do Supabase
5. Considerar criar perfil manualmente no callback se trigger falhar

---

## 💬 MENSAGEM DO USUÁRIO

> "Não quero ter que começar meu projeto do zero DE NOVO!"

O usuário está frustrado mas determinado. O projeto está 90% pronto, só falta resolver este problema de autenticação.

---

## 📞 COMO VOCÊ PODE AJUDAR

1. Analisar o código do callback (`app/auth/callback/route.ts`)
2. Verificar o trigger (`docs/SQL_TRIGGER_MOTORISTA.sql`)
3. Sugerir melhorias ou alternativas
4. Ajudar a debugar o problema
5. Propor uma solução definitiva

---

## ✅ O QUE JÁ ESTÁ FUNCIONANDO

- ✅ Cadastro cria usuário no Supabase
- ✅ Email é enviado corretamente
- ✅ Design das páginas está pronto
- ✅ Dashboard de motorista está implementado
- ✅ Rotas estão corretas
- ✅ AuthContext funciona
- ✅ Deploy no Vercel funciona

**Só falta o callback de confirmação funcionar! 🙏**

---

Espero que este contexto ajude! Qualquer dúvida, é só perguntar.

**Obrigado pela ajuda! 🚀**

