# 🚗 INSTRUÇÕES PARA CORRIGIR DASHBOARD MOTORISTA

## 🐛 PROBLEMA:

Dashboard do motorista carrega mas fica com **tela branca** (só header e botão sair visíveis, sem conteúdo).

---

## 🔍 POSSÍVEIS CAUSAS:

1. **RLS bloqueando acesso à tabela `motorists`** (erro 406)
2. **Motorista não foi criado no banco**
3. **Profile não está carregando corretamente**

---

## 🚀 SOLUÇÃO - PASSO A PASSO:

### **PASSO 1: Aguardar Deploy (2-3 minutos)**
   - Deploy em andamento com logs adicionados

### **PASSO 2: Executar SQL para corrigir RLS de `motorists`**

1. Acesse: **Supabase Dashboard > SQL Editor**
2. Copie e cole o conteúdo de `docs/SQL_CORRIGIR_RLS_MOTORISTS.sql`:

```sql
-- Remover policies antigas
DROP POLICY IF EXISTS "Enable all for motorist owner" ON motorists;
DROP POLICY IF EXISTS "Users can insert own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can view own motorist" ON motorists;
DROP POLICY IF EXISTS "Users can update own motorist" ON motorists;
DROP POLICY IF EXISTS "Motorists: insert own" ON motorists;
DROP POLICY IF EXISTS "Motorists: select own" ON motorists;
DROP POLICY IF EXISTS "Motorists: update own" ON motorists;

-- Criar policies corretas
CREATE POLICY "Motorists: insert own" ON motorists FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: select own" ON motorists FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Motorists: update own" ON motorists FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Motorists: delete own" ON motorists FOR DELETE TO authenticated
  USING (profile_id = auth.uid());

-- Ativar RLS
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

-- Verificar
SELECT * FROM pg_policies WHERE tablename = 'motorists';
```

3. Clique em **Run**

### **PASSO 3: Verificar se motorista existe no banco**

No Supabase Dashboard > SQL Editor:

```sql
-- Substituir 'SEU_EMAIL' pelo email que você usou no cadastro
SELECT 
  p.id as profile_id,
  p.email,
  p.name,
  p.type,
  m.id as motorist_id
FROM profiles p
LEFT JOIN motorists m ON m.profile_id = p.id
WHERE p.email = 'SEU_EMAIL';
```

**Resultado esperado:**
- `profile_id`: deve ter um UUID
- `email`: seu email
- `name`: seu nome
- `type`: `motorista`
- `motorist_id`: deve ter um UUID

**Se `motorist_id` for NULL:**
```sql
-- Criar motorista manualmente (substituir USER_ID pelo profile_id acima)
INSERT INTO motorists (profile_id)
VALUES ('USER_ID');
```

### **PASSO 4: Limpar cookies e testar novamente**

1. No navegador (F12):
   - **Application > Cookies**
   - Selecione `https://www.instauto.com.br`
   - Clique em **Clear All**

2. Feche o navegador completamente

3. Abra novamente e acesse: `https://www.instauto.com.br/login-motorista`

4. Faça login

### **PASSO 5: Verificar logs no console (F12)**

Abra o console (F12) e procure por:

```
🔄 Dashboard motorista - Profile: { ... }
✅ Profile encontrado, carregando stats...
🔍 Carregando stats para profile: [user_id]
Motorist: { id: '...' } Error: null
✅ Stats carregadas: { vehiclesCount: 0, quotesCount: 0, maintenancesCount: 0 }
```

**Se aparecer erro:**
```
Motorist: null Error: { code: 'PGRST116', ... }
```
→ Significa que o motorista não existe ou RLS está bloqueando

**Se aparecer:**
```
⚠️ Sem profile, redirecionando para login...
```
→ Significa que a sessão não está carregando

---

## 🆘 TROUBLESHOOTING:

### **Problema 1: Motorista não existe no banco**

**Solução:**
```sql
-- Buscar seu user_id
SELECT id, email FROM profiles WHERE email = 'SEU_EMAIL';

-- Criar motorista (substituir USER_ID)
INSERT INTO motorists (profile_id)
VALUES ('USER_ID');
```

### **Problema 2: RLS bloqueando (erro 406)**

**Solução temporária (apenas para debug):**
```sql
-- DESABILITAR RLS temporariamente
ALTER TABLE motorists DISABLE ROW LEVEL SECURITY;

-- Testar se funciona

-- Se funcionar, reabilitar e criar policy permissiva:
ALTER TABLE motorists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorists: allow all for authenticated" ON motorists
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
```

**⚠️ ATENÇÃO**: Esta policy é MUITO permissiva. Use apenas para debug!

### **Problema 3: Sessão não persiste**

**Solução:**
1. Limpar TODOS os cookies do navegador
2. Fazer logout da conta Google
3. Fazer login novamente

### **Problema 4: Profile não carrega**

**Verificar no console:**
```
AuthContext: Session found for user: [user_id]
AuthContext: Loading profile for user: [user_id]
```

Se não aparecer, o problema é no `AuthContext`.

---

## 📊 VERIFICAÇÃO FINAL:

Após seguir todos os passos, o dashboard deve mostrar:

✅ Header com logo e botão "Sair"
✅ Mensagem de boas-vindas: "Olá, [Seu Nome]! 👋"
✅ 3 cards de estatísticas:
   - Meus Veículos: 0
   - Orçamentos: 0
   - Manutenções: 0
✅ Botões de ação:
   - Adicionar Veículo
   - Buscar Oficinas
   - Ver Orçamentos
   - Ver Histórico

---

## 📝 ME ENVIE:

1. ✅ ou ❌ para cada passo
2. **Logs completos do console (F12)** após o login
3. **Print do resultado do SQL** (verificação se motorista existe)
4. Se ainda não funcionar, **print da tela branca**

---

**Deploy em andamento! Aguarde 2-3 minutos e siga os passos! 🚀**

