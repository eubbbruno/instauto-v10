# 🔐 CONFIGURAR GOOGLE OAUTH - PASSO A PASSO

## ❌ ERRO ATUAL
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**Causa**: Google OAuth não está habilitado no Supabase.

---

## ✅ SOLUÇÃO - 3 ETAPAS

### ETAPA 1: Criar Credenciais no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto (ou crie um novo)
3. Vá em: **APIs & Services** → **Credentials**
4. Clique em: **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Tipo: **Web application**
6. Nome: `Instauto V10`

7. **Authorized JavaScript origins**:
   - `https://instauto.com.br`
   - `https://www.instauto.com.br`
   - `http://localhost:3000` (para testes locais)

8. **Authorized redirect URIs**:
   - `https://nzvvkbvmyttlixswwaqw.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (para testes locais)

9. Clique em **CREATE**
10. **COPIE** o `Client ID` e `Client Secret`

---

### ETAPA 2: Configurar no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw
2. Vá em: **Authentication** → **Providers**
3. Encontre **Google** na lista
4. Clique para expandir
5. **Habilite** o toggle "Enable Sign in with Google"
6. Cole:
   - **Client ID** (do Google Cloud Console)
   - **Client Secret** (do Google Cloud Console)
7. Clique em **Save**

---

### ETAPA 3: Adicionar no .env.local (OPCIONAL)

Se quiser usar as variáveis no código:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id_aqui
```

**MAS NÃO É NECESSÁRIO** - O Supabase gerencia tudo automaticamente.

---

## 🧪 TESTAR

1. Acesse: https://instauto.com.br/login
2. Clique em "Continuar com Google"
3. Deve abrir popup do Google
4. Após autorizar, deve redirecionar para `/oficina`

---

## 📝 NOTAS IMPORTANTES

- O redirect URI do Supabase é sempre: `https://SEU_PROJETO.supabase.co/auth/v1/callback`
- Não precisa adicionar variáveis de ambiente no Vercel
- Após configurar, pode demorar 1-2 minutos para propagar

---

## ❓ PROBLEMAS COMUNS

### "redirect_uri_mismatch"
- Verifique se adicionou EXATAMENTE: `https://nzvvkbvmyttlixswwaqw.supabase.co/auth/v1/callback`

### "Access blocked: This app's request is invalid"
- Verifique se habilitou o Google Provider no Supabase
- Verifique se o Client ID e Secret estão corretos

### "Unsupported provider"
- O Google Provider não está habilitado no Supabase Dashboard
- Siga a ETAPA 2 acima

