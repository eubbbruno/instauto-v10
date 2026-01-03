# 📧 CONFIGURAR EMAIL NO SUPABASE

## 🎯 RECOMENDAÇÃO: DEIXE A CONFIRMAÇÃO DE EMAIL **DESLIGADA** POR ENQUANTO

Agora o sistema funciona perfeitamente **COM OU SEM** confirmação de email! 

### ✅ Vantagens de deixar DESLIGADA:
- Cadastro instantâneo
- Usuário pode fazer login imediatamente
- Não depende de configuração de email
- Perfeito para testes e desenvolvimento

### ⚠️ Desvantagens:
- Qualquer pessoa pode cadastrar com qualquer email
- Não valida se o email é real

---

## 🔧 COMO DESABILITAR CONFIRMAÇÃO DE EMAIL (RECOMENDADO AGORA):

1. Acesse: https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw/auth/providers
2. Clique em **Email** (na seção Auth Providers)
3. **DESMARQUE** a opção **"Enable email confirmations"**
4. Clique em **Save**

---

## 📨 COMO HABILITAR CONFIRMAÇÃO DE EMAIL (PARA PRODUÇÃO):

### Passo 1: Configurar SMTP (Recomendado para Produção)

Para produção, você precisa configurar um serviço de email próprio (SMTP). Opções:

#### **Opção 1: Resend (Recomendado - Grátis até 3.000 emails/mês)**
1. Crie conta em: https://resend.com
2. Verifique seu domínio
3. Copie a API Key
4. No Supabase:
   - Vá em: Settings → Auth → SMTP Settings
   - Enable Custom SMTP
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `sua-api-key`
   - Sender email: `noreply@seudominio.com`
   - Sender name: `Instauto`

#### **Opção 2: SendGrid (Grátis até 100 emails/dia)**
1. Crie conta em: https://sendgrid.com
2. Crie uma API Key
3. No Supabase:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `sua-api-key`

#### **Opção 3: Gmail (Apenas para testes)**
⚠️ **NÃO use Gmail em produção!** Limite de 500 emails/dia.

1. Ative "App Passwords" no Gmail
2. No Supabase:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `seu-email@gmail.com`
   - Password: `senha-de-app` (não sua senha normal)

### Passo 2: Habilitar Confirmação

1. Acesse: https://supabase.com/dashboard/project/nzvvkbvmyttlixswwaqw/auth/providers
2. Clique em **Email**
3. **MARQUE** a opção **"Enable email confirmations"**
4. Clique em **Save**

### Passo 3: Personalizar Template de Email (Opcional)

1. Vá em: Auth → Email Templates
2. Edite o template "Confirm signup"
3. Personalize com sua marca

---

## 🧪 TESTAR EMAILS

Depois de configurar SMTP:

1. Faça um cadastro de teste
2. Verifique se o email chegou
3. Clique no link de confirmação
4. Deve redirecionar para o dashboard correto

---

## 🚨 IMPORTANTE:

**Para desenvolvimento/testes**: Deixe a confirmação **DESLIGADA**
**Para produção**: Configure SMTP e **LIGUE** a confirmação

O sistema agora funciona perfeitamente nos dois cenários! 🎉

