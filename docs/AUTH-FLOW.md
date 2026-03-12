# 🔐 FLUXO DE AUTENTICAÇÃO - INSTAUTO

## VISÃO GERAL

O sistema possui 3 fluxos principais de autenticação:
1. **Cadastro por Email** (requer confirmação)
2. **Cadastro por Google** (OAuth)
3. **Login** (usuário existente)

---

## 1. CADASTRO POR EMAIL

### Passo a Passo:

**1.1. Usuário acessa `/login`**
- Pode vir com parâmetro `?tipo=motorista` ou `?tipo=oficina`
- Se vier com parâmetro, a aba correta é pré-selecionada

**1.2. Usuário preenche formulário**
- Nome
- Email
- Senha
- Seleciona tipo (Motorista ou Oficina)

**1.3. Clica em "Criar conta"**

**1.4. Sistema executa (`app/login/page.tsx`):**
```typescript
// Salva cookie ANTES do signUp
document.cookie = `instauto_user_type=${userType}; path=/; max-age=3600`;

// SignUp com user_metadata
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      name: name,
      user_type: userType === "oficina" ? "workshop" : "motorist",
    },
  },
});

// Se não tem session, mostra tela de confirmação
if (!data.session) {
  setRegisteredEmail(email);
  setShowEmailConfirmation(true);
}
```

**1.5. Tela de Confirmação**
- Mostra email registrado
- Instrui usuário a verificar email
- Botão "Entendi, vou verificar"

**1.6. Usuário clica no link do email**

**1.7. Callback executa (`app/auth/callback/route.ts`):**
```typescript
// Troca código por sessão
const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

// Verifica se profile existe
const { data: existingProfile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", session.user.id)
  .maybeSingle();

if (existingProfile) {
  // Profile já existe, redireciona
  const redirectUrl = existingProfile.type === "workshop" ? "/oficina" : "/motorista";
  return NextResponse.redirect(redirectUrl);
}

// Profile não existe, determina tipo
// Prioridade 1: user_metadata.user_type
// Prioridade 2: cookie instauto_user_type
// Padrão: motorist

// Cria profile
await supabase.from("profiles").insert({
  id: session.user.id,
  email: session.user.email,
  name: userName,
  type: userType,
});

// Se falhar, tenta via API (service role key)
if (profileError) {
  await fetch("/api/create-profile", {
    method: "POST",
    body: JSON.stringify({ userType, email, name }),
  });
}

// Cria workshop ou motorist
if (userType === "workshop") {
  await supabase.from("workshops").insert({
    profile_id: session.user.id,
    name: userName,
    plan_type: "free",
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    is_public: true,
    accepts_quotes: true,
  });
  return NextResponse.redirect("/oficina");
} else {
  await supabase.from("motorists").insert({
    profile_id: session.user.id,
  });
  return NextResponse.redirect("/motorista");
}
```

---

## 2. CADASTRO POR GOOGLE

### Passo a Passo:

**2.1. Usuário acessa `/login`**
- Seleciona tipo (Motorista ou Oficina)

**2.2. Clica em "Continuar com Google"**

**2.3. Sistema executa (`app/login/page.tsx`):**
```typescript
// Salva tipo no cookie E localStorage
localStorage.setItem("instauto_user_type", userType);
document.cookie = `instauto_user_type=${userType}; path=/; max-age=3600`;

// OAuth
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

**2.4. Google redireciona para `/auth/callback`**

**2.5. Callback executa:**
- Mesmo fluxo do cadastro por email
- Lê tipo do cookie (Google não passa user_metadata customizado)
- Cria profile + workshop/motorist
- Redireciona para dashboard correto

---

## 3. LOGIN (Usuário Existente)

### Passo a Passo:

**3.1. Usuário acessa `/login`**
- Clica na aba "Entrar"

**3.2. Preenche email e senha**

**3.3. Clica em "Entrar"**

**3.4. Sistema executa (`app/login/page.tsx`):**
```typescript
// Login
const { data } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Busca profile para saber o tipo
const { data: profile } = await supabase
  .from("profiles")
  .select("type")
  .eq("id", data.user.id)
  .single();

// Redireciona baseado no tipo do profile
if (profile?.type === "workshop") {
  router.push("/oficina");
} else {
  router.push("/motorista");
}
```

---

## 4. CTAs NO SITE

### Header (todos os usuários):
- **Botão "Entrar"**: Abre modal → escolhe tipo → vai para `/login?tipo=X`
- **Botão "Cadastrar"**: Abre modal → escolhe tipo → vai para `/login?tipo=X`

### Landing Page (`/`):
- **"Começar Teste Grátis"**: `/login?tipo=oficina` (para oficinas)
- **"Buscar Oficinas"**: `/buscar-oficinas` (público)

### Para Oficinas (`/para-oficinas`):
- **Todos os CTAs**: `/login?tipo=oficina`

### Buscar Oficinas (`/buscar-oficinas`):
- **"Solicitar Orçamento"**: Se não logado, vai para `/login?tipo=motorista`

---

## 5. LOGS DE DEBUG

### No Login/Cadastro:
```
🔵 [Cadastro] Criando conta...
🔵 [Cadastro] Email: user@example.com
🔵 [Cadastro] Nome: João Silva
🔵 [Cadastro] Tipo: oficina
🍪 [Cadastro] Cookie salvo: oficina
✅ [Cadastro] Usuário criado: user@example.com
⚠️ [Cadastro] Sem session - confirmação de email necessária
```

### No Callback:
```
🔐 [Callback] Iniciando...
🔄 [Callback] Trocando código por sessão...
✅ [Callback] Sessão obtida para: user@example.com
🔍 [Callback] Verificando se profile existe...
🔨 [Callback] Profile NÃO existe, criando...
🔍 [Callback] DETERMINANDO TIPO:
   1. Cookie instauto_user_type: oficina
   2. user_metadata.user_type: workshop
✅ [Callback] TIPO DETERMINADO: WORKSHOP (via metadata)
🔨 [Callback] CRIANDO PROFILE
✅ [Callback] Profile criado com sucesso!
🔨 [Callback] Verificando/criando WORKSHOP...
✅ [Callback] Workshop criado com sucesso!
🔀 [Callback] Redirecionando para /oficina
```

---

## 6. TROUBLESHOOTING

### Problema: Profile não é criado
**Possíveis causas:**
1. RLS bloqueando INSERT em profiles
2. Cookie não persiste entre cadastro e callback
3. user_metadata não está sendo passado

**Solução:**
- API `/api/create-profile` usa service role key (bypass RLS)
- Callback tenta criar via Supabase, se falhar usa API
- Prioridade para user_metadata sobre cookie

### Problema: Tipo errado é criado
**Possíveis causas:**
1. Cookie com valor errado
2. user_metadata não foi passado no signUp

**Solução:**
- Verificar logs do callback
- Prioridade: user_metadata > cookie > padrão (motorist)

### Problema: Não redireciona após confirmar email
**Possíveis causas:**
1. Callback não está sendo executado
2. Erro na criação do profile/workshop/motorist

**Solução:**
- Verificar logs do console do navegador
- Verificar logs do servidor (terminal)
- Callback não bloqueia redirect mesmo se workshop/motorist falhar

---

## 7. ESTRUTURA DE DADOS

### Tabela `profiles`:
```sql
- id (UUID, PK) - mesmo ID do auth.users
- email (TEXT)
- name (TEXT)
- phone (TEXT)
- avatar_url (TEXT)
- type (TEXT) - "motorist" ou "workshop"
- role (TEXT) - "user" ou "admin"
- created_at (TIMESTAMPTZ)
```

### Tabela `workshops`:
```sql
- id (UUID, PK)
- profile_id (UUID, FK -> profiles.id)
- name (TEXT)
- plan_type (TEXT) - "free" ou "pro"
- subscription_status (TEXT) - "trial", "active", "cancelled"
- trial_ends_at (TIMESTAMPTZ)
- is_public (BOOLEAN)
- accepts_quotes (BOOLEAN)
- ...
```

### Tabela `motorists`:
```sql
- id (UUID, PK)
- profile_id (UUID, FK -> profiles.id)
- created_at (TIMESTAMPTZ)
```

---

## 8. TESTES

### Checklist de Testes:

- [ ] Cadastro motorista por email → confirma email → vai para /motorista
- [ ] Cadastro oficina por email → confirma email → vai para /oficina
- [ ] Cadastro motorista por Google → vai para /motorista
- [ ] Cadastro oficina por Google → vai para /oficina
- [ ] Login motorista existente → vai para /motorista
- [ ] Login oficina existente → vai para /oficina
- [ ] CTA "Para Oficinas" → vai para /login?tipo=oficina
- [ ] Modal Header "Cadastrar" → escolhe tipo → vai para /login?tipo=X

### Como Testar:

1. Abrir console do navegador (F12)
2. Executar ação
3. Verificar logs detalhados
4. Verificar redirecionamento
5. Verificar se profile foi criado no banco
6. Verificar se workshop/motorist foi criado

---

## 9. ARQUIVOS PRINCIPAIS

- `app/login/page.tsx` - Página de login/cadastro
- `app/auth/callback/route.ts` - Callback após confirmação de email/OAuth
- `app/api/create-profile/route.ts` - API fallback para criar profile (service role)
- `middleware.ts` - Proteção de rotas
- `components/auth/UserTypeModal.tsx` - Modal de seleção de tipo
- `components/layout/Header.tsx` - Header com CTAs
