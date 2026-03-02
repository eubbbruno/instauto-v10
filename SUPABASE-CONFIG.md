# 🔧 Configurações do Supabase

## Desabilitar Confirmação de Email (Para Testes)

Se você quer que os usuários possam fazer login imediatamente após o cadastro, sem precisar confirmar o email:

### Passo 1: Acessar Configurações
1. Ir para [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecionar seu projeto
3. Ir em **Authentication** → **Providers** → **Email**

### Passo 2: Desabilitar Confirmação
Procurar por **"Confirm email"** e:
- ✅ **Desmarcar** a opção "Enable email confirmations"

OU

Procurar por **"Email confirmation"** e:
- ✅ Mudar para **"Disabled"**

### Passo 3: Salvar
- Clicar em **Save**

---

## Alternativa: Configurar Email Provider

Se você quer manter a confirmação de email mas enviar emails reais:

### Opção 1: Usar SMTP Próprio
1. Ir em **Project Settings** → **Auth** → **SMTP Settings**
2. Configurar:
   - Host: smtp.gmail.com (ou seu provedor)
   - Port: 587
   - Username: seu-email@gmail.com
   - Password: sua-senha-de-app
   - Sender email: seu-email@gmail.com
   - Sender name: Instauto

### Opção 2: Usar SendGrid / Resend / Mailgun
1. Criar conta no provedor
2. Obter API Key
3. Configurar no Supabase

---

## Verificar Configuração Atual

Para ver se a confirmação de email está ativa:

1. Criar uma conta de teste
2. Verificar no console do navegador:
   - Se `data.session` existe → Confirmação desabilitada ✅
   - Se `data.session` é null → Confirmação habilitada ⚠️

---

## Configuração Recomendada para Produção

- ✅ **Habilitar** confirmação de email
- ✅ Configurar SMTP ou provedor de email
- ✅ Customizar templates de email
- ✅ Configurar redirect URL correta

## Configuração Recomendada para Desenvolvimento

- ✅ **Desabilitar** confirmação de email
- ✅ Facilita testes rápidos
- ✅ Não precisa verificar email toda vez
