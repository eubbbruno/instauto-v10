# 🚨 CONTEXTO COMPLETO PARA CLAUDE OPUS 4.5

## 📋 RESUMO DO PROJETO

**Nome:** Instauto v10  
**Stack:** Next.js 14 (App Router) + Supabase + TypeScript + Tailwind CSS  
**Deploy:** Vercel  
**Repositório:** https://github.com/eubbbruno/instauto-v10  

---

## 🎯 O QUE É O PROJETO

Marketplace de oficinas mecânicas com dois tipos de usuários:

### **1. Motorista (Gratuito para sempre)**
- Busca oficinas por localização
- Solicita orçamentos
- Gerencia veículos na garagem
- Histórico de manutenções
- Dashboard: `/motorista`

### **2. Oficina (Freemium - 14 dias trial)**
- Sistema completo de gestão (OS, estoque, financeiro)
- Aparece no marketplace
- Recebe orçamentos de motoristas
- Plano FREE ou PRO (R$ 97/mês)
- Dashboard: `/oficina`

---

## 🔥 PROBLEMA ATUAL - AUTENTICAÇÃO BUGADA

### **Sintomas:**
1. ❌ Cadastro oficina (email/senha) redireciona para `/login` (404)
2. ❌ Cadastro oficina (Google) estava criando motorista
3. ❌ Redirecionamentos inconsistentes
4. ❌ Profile `type` não sendo definido corretamente

### **O que já foi feito (últimas 3 horas):**
1. ✅ Renomeado `/login` → `/login-oficina`
2. ✅ Renomeado `/cadastro` → `/cadastro-oficina`
3. ✅ Adicionado parâmetro `userType` no `signInWithGoogle()`
4. ✅ Adicionado parâmetro `userType` no `signUp()`
5. ✅ Atualizado callback para detectar tipo pela URL
6. ✅ Corrigido todos `router.push("/login")` → `router.push("/login-oficina")`
7. ✅ Criado layout dedicado para motorista com padding correto
8. ✅ Redesenhado dashboard do motorista (gradientes, glassmorphism)

---

## 📂 ESTRUTURA DE ARQUIVOS IMPORTANTES

### **Autenticação:**
```
contexts/AuthContext.tsx          # Context global de autenticação
app/auth/callback/route.ts        # Callback OAuth e confirmação email
middleware.ts                     # Intercepta code= para callback
lib/supabase/server.ts            # Cliente Supabase server-side
```

### **Páginas de Cadastro/Login:**
```
app/cadastro-motorista/page.tsx   # Cadastro motorista
app/cadastro-oficina/page.tsx     # Cadastro oficina
app/login-motorista/page.tsx      # Login motorista
app/login-oficina/page.tsx        # Login oficina
app/completar-cadastro/page.tsx   # Completar dados (oficina)
```

### **Dashboards:**
```
app/(motorista)/layout.tsx        # Layout motorista (Header/Footer)
app/(motorista)/motorista/page.tsx # Dashboard motorista
app/(dashboard)/layout.tsx        # Layout oficina (Sidebar)
app/(dashboard)/oficina/page.tsx  # Dashboard oficina
```

### **Componentes:**
```
components/auth/UserTypeModal.tsx # Modal escolha motorista/oficina
components/layout/Header.tsx      # Header global
components/layout/Footer.tsx      # Footer global
```

---

## 🗄️ ESTRUTURA DO SUPABASE

### **Tabelas:**

#### **auth.users** (Supabase Auth)
- Gerenciado pelo Supabase
- Contém email, password hash, OAuth providers

#### **profiles** (public)
```sql
id UUID PRIMARY KEY (FK auth.users.id)
email TEXT
name TEXT
type TEXT ('motorista' | 'oficina')
created_at TIMESTAMP
```

#### **motorists** (public)
```sql
id UUID PRIMARY KEY
profile_id UUID (FK profiles.id)
name TEXT
phone TEXT
created_at TIMESTAMP
```

#### **workshops** (public)
```sql
id UUID PRIMARY KEY
profile_id UUID (FK profiles.id)
name TEXT
cnpj TEXT
address TEXT
plan_type TEXT ('free' | 'pro')
subscription_status TEXT
trial_ends_at TIMESTAMP
created_at TIMESTAMP
```

### **Triggers Removidos (estavam causando conflitos):**
- ❌ `on_email_confirmed` (deletado)
- ❌ `create_motorist_on_signup` (deletado)
- ❌ Outros triggers antigos (deletados)

### **RLS Policies (Permissivas):**
```sql
-- profiles: authenticated users podem tudo
-- motorists: authenticated users podem tudo
-- workshops: authenticated users podem tudo
```

---

## 🔄 FLUXO DE AUTENTICAÇÃO ESPERADO

### **Cadastro Motorista (Email/Senha):**
```
1. Usuário preenche formulário em /cadastro-motorista
2. signUp(email, password, name, 'motorista')
3. Cria auth.users + profiles (type: 'motorista')
4. Envia email de confirmação
5. Redireciona para /login-motorista com mensagem
6. Usuário clica no link do email
7. Callback detecta code e confirma email
8. Cria motorists manualmente
9. Redireciona para /motorista?welcome=true
```

### **Cadastro Motorista (Google):**
```
1. Usuário clica "Continuar com Google" em /cadastro-motorista
2. signInWithGoogle('motorista')
3. Redireciona para Google OAuth
4. Retorna para /auth/callback?type=motorista&code=...
5. Callback cria auth.users + profiles (type: 'motorista') + motorists
6. Redireciona para /motorista?welcome=true
```

### **Cadastro Oficina (Email/Senha):**
```
1. Usuário preenche formulário em /cadastro-oficina
2. signUp(email, password, name, 'oficina')
3. Cria auth.users + profiles (type: 'oficina')
4. Envia email de confirmação
5. Redireciona para /completar-cadastro
6. Usuário clica no link do email
7. Callback detecta code e confirma email
8. Redireciona para /completar-cadastro
9. Usuário preenche dados da oficina
10. Cria workshops
11. Redireciona para /oficina
```

### **Cadastro Oficina (Google):**
```
1. Usuário clica "Continuar com Google" em /cadastro-oficina
2. signInWithGoogle('oficina')
3. Redireciona para Google OAuth
4. Retorna para /auth/callback?type=oficina&code=...
5. Callback cria auth.users + profiles (type: 'oficina')
6. NÃO cria motorists
7. Redireciona para /completar-cadastro
8. Usuário preenche dados da oficina
9. Cria workshops
10. Redireciona para /oficina
```

---

## 🐛 BUGS CONHECIDOS (PRECISAM SER CORRIGIDOS)

### **1. Cadastro Oficina (Email/Senha) redireciona para /login (404)**
**Onde:** Provavelmente no `signUp()` ou no callback de confirmação de email  
**Esperado:** Deve redirecionar para `/completar-cadastro`

### **2. Google OAuth pode não estar passando o type corretamente**
**Onde:** `app/auth/callback/route.ts`  
**Verificar:** Se o parâmetro `type` está sendo lido corretamente da URL

### **3. Profile type pode não estar sendo salvo**
**Onde:** `contexts/AuthContext.tsx` → `signUp()`  
**Verificar:** Se o `type` está sendo inserido no banco

---

## 🔧 ARQUIVOS QUE PRECISAM DE ATENÇÃO

### **1. contexts/AuthContext.tsx**
```typescript
// Verificar se signUp está criando profile com type correto
const signUp = async (email: string, password: string, name: string, userType?: 'motorista' | 'oficina') => {
  // ... código
  await supabase.from("profiles").insert({
    id: data.user.id,
    email: data.user.email,
    name: name,
    type: userType || 'motorista', // ← VERIFICAR SE ESTÁ SALVANDO
  });
};
```

### **2. app/auth/callback/route.ts**
```typescript
// Verificar se está lendo o type da URL
const userType = requestUrl.searchParams.get("type") as 'motorista' | 'oficina' | null;

// Verificar se está criando profile com type correto
type: profileType, // ← VERIFICAR

// Verificar redirecionamentos
if (profileType === "motorista") {
  return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));
} else {
  return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
}
```

### **3. app/completar-cadastro/page.tsx**
```typescript
// Verificar se está redirecionando corretamente após não autenticado
if (!loading && !user) {
  router.push("/login-oficina"); // ← DEVE SER /login-oficina
}
```

---

## 🧪 COMO TESTAR

### **Teste 1: Cadastro Oficina (Email/Senha)**
```
1. Acesse: https://www.instauto.com.br/cadastro-oficina
2. Preencha: nome, email, senha
3. Clique em "Começar Teste Grátis"
4. ✅ Deve mostrar mensagem de sucesso
5. ✅ Deve redirecionar para /completar-cadastro (NÃO /login!)
6. ✅ Deve receber email de confirmação
7. Clique no link do email
8. ✅ Deve confirmar email e ir para /completar-cadastro
9. Preencha dados da oficina
10. ✅ Deve criar workshop e ir para /oficina
```

### **Teste 2: Cadastro Oficina (Google)**
```
1. Acesse: https://www.instauto.com.br/cadastro-oficina
2. Clique em "Continuar com Google"
3. ✅ Deve autenticar com Google
4. ✅ Deve redirecionar para /completar-cadastro
5. ✅ NÃO deve criar motorist
6. Preencha dados da oficina
7. ✅ Deve criar workshop e ir para /oficina
```

### **Verificar no Supabase:**
```sql
-- Ver se profile foi criado com type correto
SELECT 
  u.email,
  p.type,
  m.id as motorist_id,
  w.id as workshop_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
LEFT JOIN workshops w ON u.id = w.profile_id
WHERE u.email = 'EMAIL_DE_TESTE@gmail.com';
```

**Resultado esperado para oficina:**
- `type`: 'oficina'
- `motorist_id`: NULL
- `workshop_id`: UUID (após completar cadastro)

---

## 📝 CONFIGURAÇÕES DO SUPABASE

### **URL Configuration:**
```
Site URL: https://www.instauto.com.br
Redirect URLs:
  - https://www.instauto.com.br/auth/callback
  - http://localhost:3000/auth/callback
```

### **Email Templates:**
```
Confirmation Email:
Subject: Confirme seu email - Instauto
Body: {{ .ConfirmationURL }}
```

---

## 🎯 O QUE PRECISA SER FEITO AGORA

1. ✅ **Corrigir redirecionamento após cadastro oficina (email/senha)**
   - Deve ir para `/completar-cadastro` e NÃO para `/login`

2. ✅ **Garantir que profile.type está sendo salvo corretamente**
   - Verificar no `signUp()` do AuthContext
   - Verificar no callback

3. ✅ **Testar todos os fluxos de autenticação**
   - Cadastro motorista (email + Google)
   - Cadastro oficina (email + Google)
   - Login motorista
   - Login oficina

4. ✅ **Verificar se motorist/workshop estão sendo criados corretamente**
   - Motorista: deve criar `motorists` automaticamente
   - Oficina: deve criar `workshops` em `/completar-cadastro`

---

## 💡 SUGESTÕES PARA CLAUDE OPUS

1. **Revisar TODOS os redirecionamentos** no código
2. **Verificar se o `type` está sendo persistido** no banco
3. **Testar o fluxo completo** de cadastro/login
4. **Simplificar a lógica de autenticação** se necessário
5. **Adicionar logs detalhados** para debug

---

## 📦 COMANDOS ÚTEIS

```bash
# Ver logs do Vercel
vercel logs

# Rodar localmente
npm run dev

# Build de produção
npm run build

# Acessar Supabase SQL Editor
# https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw/sql

# Ver usuários no Supabase
SELECT * FROM auth.users ORDER BY created_at DESC;
SELECT * FROM profiles ORDER BY created_at DESC;
SELECT * FROM motorists ORDER BY created_at DESC;
SELECT * FROM workshops ORDER BY created_at DESC;
```

---

## 🔗 LINKS IMPORTANTES

- **Site:** https://www.instauto.com.br
- **GitHub:** https://github.com/eubbbruno/instauto-v10
- **Supabase:** https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw
- **Vercel:** https://vercel.com/dashboard

---

## ✅ ÚLTIMAS ALTERAÇÕES (Commit: 3ab515c)

1. ✅ Corrigido `router.push("/login")` → `router.push("/login-oficina")`
2. ✅ Adicionado `userType` no `signUp()`
3. ✅ Adicionado `userType` no `signInWithGoogle()`
4. ✅ Atualizado callback para criar profile com type correto
5. ✅ Atualizado todas páginas de cadastro para passar o tipo

---

**BOA SORTE, CLAUDE OPUS! 🚀**

**Por favor, revise TODO o fluxo de autenticação e corrija os bugs restantes!**

