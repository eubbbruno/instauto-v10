# 🔐 CONFIGURAR VARIÁVEIS DE AMBIENTE

## ⚠️ **CRÍTICO: ADICIONE ESTA VARIÁVEL NO VERCEL**

O callback precisa da `SUPABASE_SERVICE_ROLE_KEY` para funcionar!

---

## 📋 **PASSO A PASSO:**

### **1. Pegue a Service Role Key no Supabase:**

1. Acesse: https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw/settings/api
2. Procure por **"service_role"** (secret)
3. Copie a chave (começa com `eyJ...`)

### **2. Adicione no Vercel:**

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione nova variável:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Cole a chave que você copiou
   - **Environment**: Production, Preview, Development (marque todos)
3. Salve

### **3. Redeploy:**

Depois de adicionar a variável, faça um redeploy:
- Vá em: Deployments
- Clique nos 3 pontinhos do último deploy
- Clique em "Redeploy"

---

## ✅ **VARIÁVEIS NECESSÁRIAS:**

Certifique-se de ter TODAS essas variáveis no Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://nzvvkbvmyttlixswwaqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (NOVA - ADICIONE AGORA!)
```

---

## 🔍 **VERIFICAR SE ESTÁ FUNCIONANDO:**

Depois do redeploy, teste:
1. Cadastro motorista (email)
2. Cadastro motorista (Google)
3. Verifique no Supabase se criou profile + motorist automaticamente

---

**SEM ESSA VARIÁVEL, O CALLBACK NÃO CONSEGUE CRIAR PROFILES/MOTORISTS!**

