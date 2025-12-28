# 🔍 CHECKLIST - DIAGNÓSTICO IA

## ✅ Verificações para fazer funcionar:

### 1️⃣ **Tabela no Supabase**
- [x] Executou o SQL no Supabase? ✅ (você já fez)
- [ ] Verificar se a tabela `diagnostics` aparece no Table Editor
- [ ] Verificar se as policies (RLS) estão ativas

**Como verificar:**
1. Acesse: https://supabase.com/dashboard
2. Vá em **Table Editor**
3. Procure pela tabela `diagnostics`
4. Deve ter as colunas: `id`, `workshop_id`, `symptoms`, `diagnosis`, etc.

---

### 2️⃣ **Chave da OpenAI no Vercel**
- [ ] A variável `OPENAI_API_KEY` está configurada no Vercel?

**Como verificar:**
1. Acesse: https://vercel.com
2. Entre no projeto **instauto-v10**
3. Vá em **Settings** → **Environment Variables**
4. Procure por `OPENAI_API_KEY`
5. Deve estar com o valor: `sk-proj-...`

**Se não estiver:**
1. Clique em **Add New**
2. Name: `OPENAI_API_KEY`
3. Value: `sk-proj-...` (sua chave)
4. Environment: **Production**, **Preview**, **Development** (marcar todos)
5. Clique em **Save**
6. **IMPORTANTE:** Faça um novo deploy (ou espere o próximo push)

---

### 3️⃣ **Testar no Console do Navegador**

**Abra a página de Diagnóstico e:**
1. Pressione `F12` (abrir DevTools)
2. Vá na aba **Console**
3. Preencha os sintomas
4. Clique em **Gerar Diagnóstico**
5. Veja o que aparece no console

**Erros possíveis:**

#### ❌ **"Diagnóstico com IA não disponível"**
→ A chave da OpenAI não está configurada no Vercel
→ Solução: Adicionar `OPENAI_API_KEY` no Vercel e fazer redeploy

#### ❌ **"Chave da API OpenAI inválida"**
→ A chave está errada ou expirada
→ Solução: Gerar nova chave em https://platform.openai.com/api-keys

#### ❌ **"Cota da API OpenAI excedida"**
→ Você atingiu o limite de uso da OpenAI
→ Solução: Adicionar créditos na conta OpenAI

#### ❌ **404 na rota `/api/ai/diagnose`**
→ A API route não foi deployada
→ Solução: Fazer novo push e aguardar deploy

#### ❌ **Erro ao salvar no Supabase**
→ Problema com RLS ou tabela
→ Solução: Verificar policies no Supabase

---

### 4️⃣ **Testar a API diretamente**

**No terminal (ou Postman):**

```bash
curl -X POST https://www.instauto.com.br/api/ai/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "Carro fazendo barulho estranho ao frear"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "diagnosis": "**DIAGNÓSTICOS PROVÁVEIS:**...",
  "metadata": {
    "severity": "medium",
    "safeToDrive": false,
    "estimatedCost": "R$ 300,00 - R$ 800,00",
    "model": "gpt-4"
  }
}
```

---

### 5️⃣ **Verificar logs no Vercel**

1. Acesse: https://vercel.com
2. Entre no projeto **instauto-v10**
3. Vá em **Deployments**
4. Clique no último deployment
5. Vá em **Functions**
6. Clique em `/api/ai/diagnose`
7. Veja os logs de execução

---

## 🐛 **TESTE RÁPIDO:**

1. Acesse: https://www.instauto.com.br/oficina/diagnostico
2. Abra o console (`F12`)
3. Digite nos sintomas: "Motor falhando e luz do painel acesa"
4. Clique em "Gerar Diagnóstico"
5. **Me diga o que aparece no console!**

---

## 📝 **Possíveis problemas:**

### Problema 1: Select não funciona
- **Causa:** SelectItem com value vazio
- **Status:** ✅ JÁ CORRIGIDO no último commit

### Problema 2: Tabela não existe
- **Causa:** SQL não foi executado no Supabase
- **Status:** ✅ VOCÊ JÁ EXECUTOU

### Problema 3: API não responde
- **Causa:** Chave OpenAI não configurada no Vercel
- **Status:** ⚠️ VERIFICAR

### Problema 4: Erro de permissão
- **Causa:** RLS policies incorretas
- **Status:** ⚠️ VERIFICAR

---

## 🚀 **PRÓXIMO PASSO:**

**Me diga qual erro aparece agora** (se ainda tiver erro) e eu resolvo! 

Ou se funcionou, me avise para continuarmos com a **Fase 2B - Landing Pages**! 💙💛✨

