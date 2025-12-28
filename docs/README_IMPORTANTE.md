# 📚 DOCUMENTAÇÃO INSTAUTO - LEIA ISTO PRIMEIRO

## 🎯 ARQUIVOS ESSENCIAIS (USE APENAS ESTES!)

### **1. CONFIGURAÇÃO INICIAL DO SUPABASE**

Execute nesta ordem:

1. **`SQL_UNICO_EXECUTAR.sql`**
   - Cria tabelas (profiles, motorists, workshops)
   - Configura RLS (Row Level Security)
   - Configura políticas de acesso
   - ⏱️ Execute UMA VEZ apenas

2. **`SQL_REMOVER_TRIGGER_PROBLEMA.sql`** ⚠️ **IMPORTANTE!**
   - Remove trigger problemático que causa erro
   - Atualiza policies de RLS
   - ⏱️ Execute UMA VEZ apenas

3. **CONFIGURAR CALLBACK URL (MANUAL)**
   - No Supabase: Authentication → URL Configuration
   - Site URL: `https://www.instauto.com.br`
   - Redirect URLs:
     ```
     https://www.instauto.com.br/auth/callback
     https://instauto.com.br/auth/callback
     http://localhost:3000/auth/callback
     ```
   - ⚠️ **ESTE PASSO É OBRIGATÓRIO!**

---

### **2. UTILITÁRIOS**

- **`SQL_LIMPAR_USUARIOS.sql`**
  - Deleta todos os usuários de teste
  - Use quando quiser resetar e testar novamente
  - ⚠️ NÃO use em produção!

- **`SQL_REMOVER_TRIGGER_PROBLEMA.sql`** ⚠️
  - Remove trigger que causa erro "Error confirming user"
  - Atualiza policies de RLS
  - **EXECUTE ESTE ANTES DE TESTAR!**

- **`SQL_CONFIGURAR_REDIRECT.sql`**
  - Apenas referência (não precisa executar)
  - Mostra como configurar redirect URLs

---

### **3. GUIAS**

- **`GUIA_SIMPLES_EXECUTAR.md`**
  - Passo a passo completo
  - Como configurar tudo
  - Como testar

- **`GUIA_TESTE.md`**
  - Testes detalhados
  - Troubleshooting

- **`PANORAMA_PROJETO.md`**
  - Visão geral do projeto
  - Arquitetura
  - Funcionalidades

---

### **4. CONFIGURAÇÕES EXTERNAS**

- **`CONFIGURAR_EMAILS.md`**
  - Como personalizar emails transacionais
  - Templates de email

- **`CONFIGURAR_GOOGLE_OAUTH.md`**
  - Como configurar login com Google
  - Passo a passo no Google Cloud Console

---

## 🚀 INÍCIO RÁPIDO (3 PASSOS)

### **PASSO 1: Executar SQLs**
```
1. Abra Supabase → SQL Editor
2. Execute: SQL_UNICO_EXECUTAR.sql
3. Execute: SQL_REMOVER_TRIGGER_PROBLEMA.sql (IMPORTANTE!)
```

### **PASSO 2: Configurar Callback URL**
```
1. Supabase → Authentication → URL Configuration
2. Site URL: https://www.instauto.com.br
3. Redirect URLs: (cole as 3 URLs acima)
4. Save
```

### **PASSO 3: Testar**
```
1. Acesse: https://www.instauto.com.br/cadastro-motorista
2. Cadastre um usuário
3. Confirme o email
4. Faça login
```

---

## 🆘 PROBLEMAS COMUNS

### **Erro: "Error confirming user"**
**Causa:** Callback URL não configurado
**Solução:** Execute o PASSO 2 acima

### **Erro: "Email not confirmed"**
**Causa:** Usuário não clicou no link do email
**Solução:** Verifique a caixa de entrada e spam

### **Erro: "Erro ao criar perfil de motorista"**
**Causa:** Trigger não foi executado
**Solução:** Execute `SQL_TRIGGER_MOTORISTA.sql`

### **Link do email não é clicável**
**Causa:** Cliente de email
**Solução:** Copie e cole o link no navegador

### **Google OAuth não funciona**
**Causa:** Callback não configurado no Google Cloud
**Solução:** Veja `CONFIGURAR_GOOGLE_OAUTH.md`

---

## 📁 ESTRUTURA DE PASTAS

```
docs/
├── README_IMPORTANTE.md          ← VOCÊ ESTÁ AQUI
├── GUIA_SIMPLES_EXECUTAR.md     ← Guia completo
├── SQL_UNICO_EXECUTAR.sql       ← Execute PRIMEIRO
├── SQL_TRIGGER_MOTORISTA.sql    ← Execute DEPOIS
├── SQL_LIMPAR_USUARIOS.sql      ← Para resetar testes
├── PANORAMA_PROJETO.md          ← Visão geral
├── CONFIGURAR_EMAILS.md         ← Emails transacionais
├── CONFIGURAR_GOOGLE_OAUTH.md   ← Login com Google
└── _antigos/                     ← Arquivos antigos (ignore)
```

---

## ✅ CHECKLIST

Antes de testar, confirme que:

- [ ] Executou `SQL_UNICO_EXECUTAR.sql`
- [ ] Executou `SQL_REMOVER_TRIGGER_PROBLEMA.sql` ⚠️
- [ ] Configurou Callback URL no Supabase
- [ ] Site URL: `https://www.instauto.com.br`
- [ ] Redirect URLs: 3 URLs configuradas
- [ ] Salvou as configurações

Se todos os itens estão marcados, pode testar! 🚀

---

## 📞 FLUXO COMPLETO

```
1. Usuário cadastra
        ↓
2. Supabase cria usuário (email_confirmed_at = NULL)
        ↓
3. Supabase envia email de confirmação
        ↓
4. Usuário clica no link
        ↓
5. Supabase redireciona para: /auth/callback
        ↓
6. Callback confirma email (email_confirmed_at = NOW)
        ↓
7. TRIGGER cria automaticamente:
   - Profile (type="motorista")
   - Motorista
        ↓
8. Callback redireciona para: /motorista?confirmed=true
        ↓
9. Dashboard mostra: "🎉 Email confirmado!"
        ↓
10. Usuário pode usar o sistema
```

---

## 🎉 PRONTO!

Agora você tem tudo organizado e documentado.

**Próximo passo:** Execute os 3 passos do Início Rápido acima! 🚀

