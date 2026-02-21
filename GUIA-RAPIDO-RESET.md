# 🚀 GUIA RÁPIDO: RESETAR BANCO E TESTAR LOGIN GOOGLE

## ✅ PASSO A PASSO (5 MINUTOS)

### 1️⃣ Abrir Supabase Dashboard
```
1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: Instauto
3. Clique em: SQL Editor (menu lateral)
```

---

### 2️⃣ Executar Script de Reset
```
1. Clique em: "New Query"
2. Abra o arquivo: supabase/reset-database.sql
3. Copie TUDO (Ctrl+A, Ctrl+C)
4. Cole no SQL Editor (Ctrl+V)
5. Clique em: "Run" (ou Ctrl+Enter)
6. Aguarde 10-30 segundos
7. Verifique se apareceu: "Database reset completo! ✅"
```

**✅ PRONTO! Banco resetado com sucesso!**

---

### 3️⃣ Limpar Usuários Antigos (IMPORTANTE!)
```
1. Clique em: Authentication (menu lateral)
2. Clique em: Users
3. Delete TODOS os usuários (se houver)
4. Confirme a exclusão
```

**✅ PRONTO! Usuários limpos!**

---

### 4️⃣ Testar Login Google - OFICINA

**No navegador:**
```
1. Abra: http://localhost:3000/login-oficina
2. Abra o Console (F12 → Console)
3. Clique em: "Entrar com Google"
4. Faça login com sua conta Google
5. Observe os logs no console
```

**✅ LOGS ESPERADOS:**
```
🔵 [Login Oficina] Salvando tipo no localStorage: oficina
=== CALLBACK GOOGLE START ===
Code: presente
Type: oficina
User ID: xxx-xxx-xxx
User email: seu-email@gmail.com
🔨 CRIANDO NOVO PROFILE
✅ Profile criado com sucesso!
🔨 Criando workshop...
✅ Workshop criado com sucesso: xxx-xxx-xxx
✅ Redirecionando para /oficina
🔄 [AuthContext] Carregando profile (tentativa 1/3)...
✅ [AuthContext] Profile encontrado: workshop
```

**✅ RESULTADO ESPERADO:**
- Deve redirecionar para: `/oficina?welcome=true`
- Dashboard da oficina deve carregar normalmente
- Sidebar deve mostrar "Instauto" com badge "FREE"

---

### 5️⃣ Verificar no Supabase

**Volte ao Supabase Dashboard:**
```
1. Clique em: Table Editor (menu lateral)
2. Selecione tabela: profiles
3. Verifique se seu email apareceu
4. Verifique o campo "type" = "workshop"
5. Copie o "id" (UUID)

6. Selecione tabela: workshops
7. Verifique se existe um registro com "profile_id" = UUID copiado
8. Verifique os campos:
   - name: seu nome do Google
   - plan_type: "free"
   - subscription_status: "trial"
   - is_public: true
   - accepts_quotes: true
```

**✅ SUCESSO! Login Google funcionando perfeitamente!**

---

### 6️⃣ Testar Login Google - MOTORISTA

**Repita o processo para motorista:**
```
1. Volte ao Supabase → Authentication → Users
2. Delete o usuário criado (para testar do zero)
3. Abra: http://localhost:3000/login-motorista
4. Console aberto (F12)
5. Clique em: "Entrar com Google"
6. Observe os logs
```

**✅ LOGS ESPERADOS:**
```
🔵 [Login Motorista] Salvando tipo no localStorage: motorista
=== CALLBACK GOOGLE START ===
Type: motorista
🔨 CRIANDO NOVO PROFILE
✅ Profile criado com sucesso!
🔨 Criando motorist...
✅ Motorist criado com sucesso!
✅ Redirecionando para /motorista
🔄 [AuthContext] Carregando profile (tentativa 1/3)...
✅ [AuthContext] Profile encontrado: motorist
```

**✅ RESULTADO ESPERADO:**
- Deve redirecionar para: `/motorista?welcome=true`
- Dashboard do motorista deve carregar
- Sidebar deve mostrar "Instauto" com badge "@ Motorista"

---

## 🐛 SE DER ERRO

### Erro: "Profile não encontrado após 3 tentativas"
**Solução:**
1. Verifique se executou o script SQL completo
2. Verifique se limpou os usuários antigos
3. Tente fazer logout e login novamente
4. Verifique os logs no console para ver onde travou

### Erro: "Callback não cria workshop/motorist"
**Solução:**
1. Vá no Supabase SQL Editor
2. Execute:
   ```sql
   SELECT * FROM profiles WHERE email = 'seu-email@gmail.com';
   ```
3. Se não retornar nada, o callback falhou
4. Verifique os logs no console do navegador
5. Verifique se o arquivo `app/auth/callback/route.ts` está correto

### Erro: "Infinite loading"
**Solução:**
1. O AuthContext está tentando carregar o profile
2. Verifique se o profile foi criado no banco
3. Se não foi criado, o callback falhou
4. Delete o usuário e tente novamente

---

## 📊 CHECKLIST FINAL

- [ ] Script SQL executado com sucesso
- [ ] Usuários antigos deletados
- [ ] Login Google oficina funcionando
- [ ] Profile + Workshop criados no banco
- [ ] Dashboard oficina carregando
- [ ] Login Google motorista funcionando
- [ ] Profile + Motorist criados no banco
- [ ] Dashboard motorista carregando

---

## 🎉 TUDO FUNCIONANDO!

Se todos os itens acima estão ✅, parabéns! O sistema está 100% funcional!

Agora você pode:
- Cadastrar veículos
- Solicitar orçamentos
- Gerenciar clientes (oficina)
- Criar ordens de serviço (oficina)
- E muito mais!

---

**Última atualização:** 2026-02-15
**Tempo estimado:** 5-10 minutos
