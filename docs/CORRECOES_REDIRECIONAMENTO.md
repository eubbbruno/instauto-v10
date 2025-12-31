# 🔧 CORREÇÕES DE REDIRECIONAMENTO - GOOGLE OAUTH

## ❌ PROBLEMA IDENTIFICADO

Ao fazer cadastro de **oficina** pelo Google OAuth, o sistema estava:
1. ❌ Criando o profile como `type: "motorista"` (errado!)
2. ❌ Criando automaticamente um `motorist` (errado!)
3. ❌ Redirecionando para `/motorista` (errado!)

**Causa raiz:** O callback não sabia diferenciar se era cadastro de motorista ou oficina.

---

## ✅ SOLUÇÃO IMPLEMENTADA

### **1. Adicionar parâmetro `type` no Google OAuth**

**Arquivo:** `contexts/AuthContext.tsx`

```typescript
const signInWithGoogle = async (userType?: 'motorista' | 'oficina') => {
  const redirectUrl = userType 
    ? `${window.location.origin}/auth/callback?type=${userType}`
    : `${window.location.origin}/auth/callback`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      // ...
    },
  });
};
```

**O que mudou:**
- ✅ Agora aceita parâmetro `userType` ('motorista' ou 'oficina')
- ✅ Passa o tipo na URL de callback como `?type=motorista` ou `?type=oficina`

---

### **2. Atualizar callback para usar o parâmetro**

**Arquivo:** `app/auth/callback/route.ts`

**Antes:**
```typescript
// SEMPRE criava como motorista
type: "motorista",
```

**Depois:**
```typescript
// Pega o tipo da URL
const userType = requestUrl.searchParams.get("type") as 'motorista' | 'oficina' | null;
const profileType = userType || "motorista";

// Cria profile com o tipo correto
type: profileType,

// Se for motorista, cria motorist
if (profileType === "motorista") {
  // ... criar motorist
  return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));
} else {
  // Se for oficina, vai para completar cadastro
  return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
}
```

**O que mudou:**
- ✅ Lê o parâmetro `type` da URL
- ✅ Cria o profile com o tipo correto
- ✅ Só cria `motorist` se for tipo "motorista"
- ✅ Redireciona para o dashboard correto

---

### **3. Atualizar todas as páginas de cadastro/login**

**Páginas atualizadas:**

#### **Motorista:**
- `app/cadastro-motorista/page.tsx` → `signInWithGoogle('motorista')`
- `app/login-motorista/page.tsx` → `signInWithGoogle('motorista')`

#### **Oficina:**
- `app/cadastro-oficina/page.tsx` → `signInWithGoogle('oficina')`
- `app/login-oficina/page.tsx` → `signInWithGoogle('oficina')`

---

## 🎯 FLUXO CORRETO AGORA

### **Cadastro Motorista (Google):**
1. Usuário clica em "Continuar com Google" em `/cadastro-motorista`
2. `signInWithGoogle('motorista')` é chamado
3. Redireciona para Google OAuth
4. Retorna para `/auth/callback?type=motorista&code=...`
5. Callback cria:
   - ✅ `auth.users` (Google)
   - ✅ `profiles` com `type: "motorista"`
   - ✅ `motorists` (manualmente)
6. Redireciona para `/motorista?welcome=true`

### **Cadastro Oficina (Google):**
1. Usuário clica em "Continuar com Google" em `/cadastro-oficina`
2. `signInWithGoogle('oficina')` é chamado
3. Redireciona para Google OAuth
4. Retorna para `/auth/callback?type=oficina&code=...`
5. Callback cria:
   - ✅ `auth.users` (Google)
   - ✅ `profiles` com `type: "oficina"`
   - ❌ **NÃO** cria `motorists`
6. Redireciona para `/completar-cadastro`
7. Usuário preenche dados da oficina
8. Cria `workshops` e redireciona para `/oficina`

---

## 📊 ESTRUTURA DE DADOS

### **Motorista:**
```
auth.users (Google)
  └─ profiles (type: "motorista")
       └─ motorists
```

### **Oficina:**
```
auth.users (Google)
  └─ profiles (type: "oficina")
       └─ workshops (criado em /completar-cadastro)
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [x] Cadastro motorista (Google) cria profile tipo "motorista"
- [x] Cadastro motorista (Google) cria motorist automaticamente
- [x] Cadastro motorista (Google) redireciona para `/motorista`
- [x] Cadastro oficina (Google) cria profile tipo "oficina"
- [x] Cadastro oficina (Google) NÃO cria motorist
- [x] Cadastro oficina (Google) redireciona para `/completar-cadastro`
- [x] Login motorista (Google) redireciona para `/motorista`
- [x] Login oficina (Google) redireciona para `/oficina`

---

## 🧪 COMO TESTAR

### **Teste 1: Cadastro Oficina (Google)**
1. Acesse: https://www.instauto.com.br/cadastro-oficina
2. Clique em "Continuar com Google"
3. ✅ Deve redirecionar para `/completar-cadastro`
4. ✅ Preencha os dados da oficina
5. ✅ Deve redirecionar para `/oficina`

### **Teste 2: Verificar no Supabase**
```sql
SELECT 
  u.email,
  p.type,
  m.id as motorist_id,
  w.id as workshop_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN motorists m ON u.id = m.profile_id
LEFT JOIN workshops w ON u.id = w.profile_id
WHERE u.email = 'SEU_EMAIL@gmail.com';
```

**Resultado esperado para oficina:**
- `type`: 'oficina'
- `motorist_id`: NULL
- `workshop_id`: UUID válido (após completar cadastro)

---

**Deploy realizado em:** 30/12/2025
**Commit:** `aaea8a7`

