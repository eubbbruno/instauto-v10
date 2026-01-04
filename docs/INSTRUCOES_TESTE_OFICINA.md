# 🔧 INSTRUÇÕES PARA TESTAR OFICINA

## 📋 PROBLEMA IDENTIFICADO:

Você fez cadastro de oficina com Google OAuth e:
- ✅ Sessão funcionou
- ✅ Profile foi criado (`type: oficina`)
- ❌ **Workshop NÃO foi criado** (erro 406 - RLS bloqueando)
- ❌ Dashboard aparece bloqueado (PRO)

---

## 🚀 CORREÇÕES APLICADAS:

### 1. **Callback agora cria workshop automaticamente**
   - Ao fazer login com Google, o callback cria um workshop básico
   - Mesmo fluxo que motorista (cria motorist automaticamente)

### 2. **API `/api/create-profile` também cria workshop**
   - Backup para garantir que workshop é criado

### 3. **SQL para corrigir RLS de workshops**
   - Arquivo: `docs/SQL_CORRIGIR_RLS_WORKSHOPS.sql`

---

## 📝 PASSO A PASSO PARA TESTAR:

### **PASSO 1: Aguardar Deploy (2-3 minutos)**
   - Aguarde o Vercel fazer o deploy das correções

### **PASSO 2: Executar SQL no Supabase**

1. Acesse: **Supabase Dashboard > SQL Editor**
2. Copie e cole o conteúdo de `docs/SQL_CORRIGIR_RLS_WORKSHOPS.sql`
3. Clique em **Run**
4. Verifique se aparece: "Success. No rows returned" ou lista de policies

### **PASSO 3: Deletar usuário atual de teste**

No Supabase Dashboard:
1. **Authentication > Users**
2. Encontre o usuário `eubbbruno@gmail.com`
3. Clique nos 3 pontinhos > **Delete User**
4. Confirme

### **PASSO 4: Limpar cookies do navegador**

No navegador (F12):
1. **Application > Cookies**
2. Selecione `https://www.instauto.com.br`
3. Clique em **Clear All**

### **PASSO 5: Fazer novo cadastro de oficina com Google**

1. Acesse: `https://www.instauto.com.br/cadastro-oficina`
2. Clique em **Continuar com Google**
3. Selecione sua conta Google
4. Aguarde o redirecionamento

### **PASSO 6: Verificar no Console (F12)**

Procure por estas mensagens:
```
✅ Profile created
✅ Basic workshop created
Redirecting to: /completar-cadastro
```

### **PASSO 7: Completar cadastro**

1. Preencha os dados da oficina:
   - Nome da oficina
   - CNPJ/CPF
   - Telefone
   - Endereço
   - Cidade
   - Estado
   - Descrição (opcional)

2. Clique em **Salvar e Continuar**

### **PASSO 8: Verificar Dashboard**

Você deve ser redirecionado para `/oficina?welcome=true` e:
- ✅ Sidebar deve estar desbloqueada
- ✅ Plano deve aparecer como "FREE" ou "TRIAL"
- ✅ Sem erros 406 no console

---

## 🔍 SE AINDA HOUVER ERROS:

### **Verificar no Supabase Table Editor:**

1. **Tabela `profiles`**:
   ```sql
   SELECT * FROM profiles WHERE email = 'eubbbruno@gmail.com';
   ```
   - Deve ter: `id`, `email`, `name`, `type: oficina`

2. **Tabela `workshops`**:
   ```sql
   SELECT * FROM workshops WHERE profile_id = 'SEU_USER_ID';
   ```
   - Deve ter: `id`, `profile_id`, `name`, `plan_type: free`, `trial_ends_at`

3. **RLS Policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'workshops';
   ```
   - Deve ter 4 policies: insert, select, update, delete

---

## 📊 LOGS ESPERADOS NO CONSOLE:

### **Durante OAuth:**
```
========== AUTH CALLBACK ==========
Code: SIM
Type: oficina
User: [user_id] [email]
Session access_token exists: true
✅ Session cookies set in response
User type: oficina
Creating profile...
✅ Profile created
Creating basic workshop entry...
✅ Basic workshop created
Redirecting to: /completar-cadastro
```

### **No Dashboard:**
```
AuthContext: Session found for user: [user_id]
AuthContext: Loading profile for user: [user_id]
Workshop: { id: '...', name: '...', plan_type: 'free' }
```

---

## 🎯 RESULTADO ESPERADO:

1. ✅ Cadastro com Google funciona
2. ✅ Workshop é criado automaticamente
3. ✅ Redirecionamento para `/completar-cadastro`
4. ✅ Após completar, vai para `/oficina`
5. ✅ Dashboard funciona sem erros
6. ✅ Sidebar desbloqueada

---

## 🆘 SE CONTINUAR COM ERRO 406:

Execute este SQL adicional:
```sql
-- Desabilitar RLS temporariamente para testar
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;

-- Testar se funciona

-- Se funcionar, o problema é RLS. Reabilitar e ajustar policies:
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Criar policy super permissiva para debug:
CREATE POLICY "Workshops: allow all for authenticated" ON workshops
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
```

**⚠️ ATENÇÃO**: Esta policy é MUITO permissiva. Use apenas para debug!

---

Após testar, me envie:
1. ✅ ou ❌ para cada passo
2. Logs do console (F12)
3. Print do Table Editor (profiles + workshops)

