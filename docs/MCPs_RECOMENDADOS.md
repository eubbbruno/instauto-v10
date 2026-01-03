# 🔌 MCPs RECOMENDADOS PARA O PROJETO

## ✅ MCPs QUE VOCÊ JÁ TEM INSTALADOS:

### 1. **Supabase MCP** ⭐⭐⭐⭐⭐
- **Status**: ✅ Instalado e funcionando perfeitamente!
- **O que faz**: Conecta diretamente com o banco de dados Supabase
- **Por que é essencial**: Permite executar SQL, listar tabelas, verificar logs, etc.
- **Como foi útil**: Resolvemos todos os problemas de autenticação com ele!

### 2. **21st.dev Magic** ⭐⭐⭐⭐
- **Status**: ✅ Instalado
- **O que faz**: Gera componentes UI prontos e bonitos
- **Quando usar**: Para criar novos componentes rapidamente

### 3. **Cursor Browser Extension** ⭐⭐⭐⭐
- **Status**: ✅ Instalado
- **O que faz**: Permite interagir com o navegador (testar páginas, fazer screenshots, etc)
- **Quando usar**: Para testar funcionalidades no navegador

---

## 🚀 MCPs QUE EU RECOMENDO INSTALAR:

### 1. **GitHub MCP** ⭐⭐⭐⭐⭐
**Por que instalar:**
- Criar issues automaticamente
- Fazer PRs
- Gerenciar branches
- Ver histórico de commits

**Como instalar:**
```bash
npx @modelcontextprotocol/create-server github
```

**Configuração no Cursor:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

---

### 2. **Stripe MCP** ⭐⭐⭐⭐⭐
**Por que instalar:**
- Você vai precisar para implementar pagamentos (plano PRO das oficinas)
- Gerenciar assinaturas
- Webhooks de pagamento
- Testar pagamentos

**Como instalar:**
```bash
npm install @stripe/stripe-js
```

**Configuração no Cursor:**
```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_..."
      }
    }
  }
}
```

---

### 3. **Sentry MCP** ⭐⭐⭐⭐
**Por que instalar:**
- Monitorar erros em produção
- Ver stack traces
- Performance monitoring
- Alertas de erros

**Como instalar:**
```bash
npm install @sentry/nextjs
```

---

### 4. **Vercel MCP** ⭐⭐⭐⭐
**Por que instalar:**
- Ver logs de deploy
- Gerenciar environment variables
- Ver analytics
- Rollback de deploys

**Configuração no Cursor:**
```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": {
        "VERCEL_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

---

### 5. **Resend MCP** ⭐⭐⭐⭐
**Por que instalar:**
- Gerenciar emails transacionais
- Ver logs de emails enviados
- Testar templates de email
- Essencial quando você configurar o SMTP

**Como instalar:**
```bash
npm install resend
```

---

### 6. **Slack MCP** ⭐⭐⭐
**Por que instalar (opcional):**
- Notificações de novos cadastros
- Alertas de erros
- Novos orçamentos recebidos

---

## 📊 PRIORIDADE DE INSTALAÇÃO:

### **AGORA (Essencial):**
1. ✅ Supabase MCP (já tem!)
2. 🔜 Stripe MCP (para pagamentos)

### **EM BREVE (Importante):**
3. GitHub MCP (para gerenciar o projeto)
4. Vercel MCP (para monitorar deploys)
5. Resend MCP (para emails)

### **DEPOIS (Útil):**
6. Sentry MCP (para monitorar erros)
7. Slack MCP (para notificações)

---

## 🎯 PRÓXIMOS PASSOS:

### **1. Implementar Pagamentos (Stripe)**
- Plano FREE vs PRO
- Checkout
- Webhooks
- Gerenciar assinaturas

### **2. Configurar Emails (Resend)**
- Email de boas-vindas
- Confirmação de cadastro
- Notificações de orçamentos
- Lembretes

### **3. Monitoramento (Sentry)**
- Capturar erros em produção
- Performance monitoring
- Alertas

---

## 💡 DICA:

Não instale todos de uma vez! Instale conforme a necessidade:
1. **Agora**: Stripe (para pagamentos)
2. **Semana que vem**: Resend (para emails)
3. **Depois**: Sentry (para monitoramento)

---

## 🔗 LINKS ÚTEIS:

- **MCP Registry**: https://github.com/modelcontextprotocol/servers
- **Stripe Docs**: https://stripe.com/docs
- **Resend Docs**: https://resend.com/docs
- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

**Quer que eu te ajude a configurar algum desses MCPs?** 🚀

