# 🔐 FLUXO DE AUTENTICAÇÃO COM GOOGLE OAUTH

## ⚠️ IMPORTANTE: CADASTRO = LOGIN

**Não existe diferença entre "Cadastrar com Google" e "Fazer Login com Google"!**

Quando você clica em "Continuar com Google":
1. Se a conta **não existe** → Cria a conta e faz login automaticamente
2. Se a conta **já existe** → Faz login automaticamente

**Você NÃO precisa clicar duas vezes!**

---

## 🔄 FLUXO CORRETO - MOTORISTA

### **Primeira Vez (Cadastro):**

1. Acesse: `/cadastro-motorista`
2. Clique em **"Continuar com Google"**
3. Escolha sua conta Google
4. **Aguarde o redirecionamento automático**
5. Deve ir para: `/motorista?welcome=true`

**O que acontece nos bastidores:**
```
1. Redireciona para Google OAuth
2. Google autentica
3. Redireciona para /auth/callback?type=motorista&code=...
4. Callback:
   - Troca code por sessão ✅
   - Cria user no auth.users ✅
   - Cria profile (type: motorista) ✅
   - Cria motorist ✅
   - Estabelece sessão ✅
   - Redireciona para /motorista?welcome=true ✅
```

### **Próximas Vezes (Login):**

1. Acesse: `/login-motorista`
2. Clique em **"Continuar com Google"**
3. Escolha sua conta Google
4. **Aguarde o redirecionamento automático**
5. Deve ir para: `/motorista`

**O que acontece nos bastidores:**
```
1. Redireciona para Google OAuth
2. Google autentica
3. Redireciona para /auth/callback?type=motorista&code=...
4. Callback:
   - Troca code por sessão ✅
   - Encontra profile existente ✅
   - Encontra motorist existente ✅
   - Estabelece sessão ✅
   - Redireciona para /motorista ✅
```

---

## 🔄 FLUXO CORRETO - OFICINA

### **Primeira Vez (Cadastro):**

1. Acesse: `/cadastro-oficina`
2. Clique em **"Continuar com Google"**
3. Escolha sua conta Google
4. **Aguarde o redirecionamento automático**
5. Deve ir para: `/completar-cadastro`
6. Preencha os dados da oficina
7. Clique em "Começar a usar"
8. Deve ir para: `/oficina?welcome=true`

**O que acontece nos bastidores:**
```
1. Redireciona para Google OAuth
2. Google autentica
3. Redireciona para /auth/callback?type=oficina&code=...
4. Callback:
   - Troca code por sessão ✅
   - Cria user no auth.users ✅
   - Cria profile (type: oficina) ✅
   - Verifica se tem workshop ❌ (não tem)
   - Estabelece sessão ✅
   - Redireciona para /completar-cadastro ✅
5. Usuário preenche dados da oficina
6. Cria workshop ✅
7. Redireciona para /oficina?welcome=true ✅
```

### **Próximas Vezes (Login):**

1. Acesse: `/login-oficina`
2. Clique em **"Continuar com Google"**
3. Escolha sua conta Google
4. **Aguarde o redirecionamento automático**
5. Deve ir para: `/oficina`

**O que acontece nos bastidores:**
```
1. Redireciona para Google OAuth
2. Google autentica
3. Redireciona para /auth/callback?type=oficina&code=...
4. Callback:
   - Troca code por sessão ✅
   - Encontra profile existente ✅
   - Encontra workshop existente ✅
   - Estabelece sessão ✅
   - Redireciona para /oficina ✅
```

---

## 🐛 PROBLEMAS COMUNS

### **1. "Redireciona para login após Google OAuth"**

**Causa:** A sessão não foi estabelecida corretamente.

**Solução:**
1. Verifique se o `SUPABASE_SERVICE_ROLE_KEY` está configurado no Vercel
2. Verifique os logs do console do navegador (F12)
3. Verifique se o callback está sendo chamado

### **2. "Criou user e profile, mas não criou motorist/workshop"**

**Causa:** Erro no callback ao criar motorist/workshop.

**Solução:**
1. Verifique os logs do Vercel (https://vercel.com/dashboard)
2. Verifique se as policies RLS estão corretas
3. Execute o SQL: `docs/SQL_RLS_DEFINITIVO.sql`

### **3. "Não redireciona para /completar-cadastro (oficina)"**

**Causa:** O callback não está detectando que é oficina.

**Solução:**
1. Verifique se o `?type=oficina` está na URL do callback
2. Verifique os logs do console
3. Verifique se o profile foi criado com `type: oficina`

---

## 🔍 COMO DEBUGAR

### **1. Abrir Console do Navegador (F12)**

Procure por logs como:
```
✅ Session established for user: xxx
User email: xxx@gmail.com
User metadata: {...}
Final user type: motorista/oficina
Creating profile: {...}
Profile created successfully
Motorist created successfully
Motorista, redirecting to /motorista
```

### **2. Verificar no Supabase**

Após o Google OAuth, verifique:

**Authentication > Users:**
- Deve ter o usuário com o email do Google

**Table Editor > profiles:**
- Deve ter o registro com `type = 'motorista'` ou `'oficina'`

**Table Editor > motorists (se motorista):**
- Deve ter o registro com `profile_id`

**Table Editor > workshops (se oficina, após completar cadastro):**
- Deve ter o registro com `profile_id`

### **3. Verificar Logs do Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto
3. Vá em "Logs"
4. Procure por erros no `/auth/callback`

---

## ✅ CHECKLIST DE TESTE

### **Motorista:**
- [ ] Cadastro com Google cria user
- [ ] Cadastro com Google cria profile (type: motorista)
- [ ] Cadastro com Google cria motorist
- [ ] Cadastro com Google redireciona para /motorista?welcome=true
- [ ] Login com Google redireciona para /motorista
- [ ] Dashboard motorista carrega corretamente

### **Oficina:**
- [ ] Cadastro com Google cria user
- [ ] Cadastro com Google cria profile (type: oficina)
- [ ] Cadastro com Google redireciona para /completar-cadastro
- [ ] Completar cadastro cria workshop
- [ ] Completar cadastro redireciona para /oficina?welcome=true
- [ ] Login com Google redireciona para /oficina
- [ ] Dashboard oficina carrega corretamente

---

## 🚀 PRÓXIMOS PASSOS

Se tudo estiver funcionando:
1. ✅ Autenticação está 100% funcional
2. 🔜 Implementar pagamentos (Stripe)
3. 🔜 Configurar emails (Resend)
4. 🔜 Melhorar dashboards

**Qualquer problema, me avise com os logs do console!** 🙏

