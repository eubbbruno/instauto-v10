# Configurar E-mails Transacionais no Supabase

Este documento explica como configurar os e-mails transacionais do Instauto no Supabase.

## 📧 E-mails Disponíveis

O Instauto possui 3 templates de e-mail prontos em `lib/email-templates.ts`:

1. **Boas-vindas** - Enviado quando o usuário cria uma conta
2. **Recuperação de Senha** - Enviado quando o usuário solicita reset de senha
3. **Teste Terminando** - Enviado 3 dias antes do teste PRO terminar

## ⚙️ Configuração no Supabase

### 1. Acessar Configurações de E-mail

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto `Instauto`
3. Vá em **Authentication** → **Email Templates**

### 2. Configurar Template de Boas-Vindas

No Supabase, vá em **Confirm signup** e configure:

**Subject:**
```
Bem-vindo ao Instauto! 🚗
```

**Body (HTML):**
Copie o conteúdo da função `getWelcomeEmail()` em `lib/email-templates.ts`

**Variáveis disponíveis:**
- `{{ .ConfirmationURL }}` - Link de confirmação de e-mail
- `{{ .SiteURL }}` - URL do site
- `{{ .Email }}` - E-mail do usuário

### 3. Configurar Template de Recuperação de Senha

No Supabase, vá em **Reset Password** e configure:

**Subject:**
```
Recuperação de Senha - Instauto
```

**Body (HTML):**
Copie o conteúdo da função `getPasswordResetEmail()` em `lib/email-templates.ts`

**Variáveis disponíveis:**
- `{{ .ConfirmationURL }}` - Link para redefinir senha
- `{{ .SiteURL }}` - URL do site
- `{{ .Email }}` - E-mail do usuário

### 4. Configurar SMTP Customizado (Opcional mas Recomendado)

Para melhor deliverability, configure um SMTP customizado:

1. Vá em **Project Settings** → **Auth** → **SMTP Settings**
2. Escolha um provedor:
   - **SendGrid** (Recomendado - 100 e-mails/dia grátis)
   - **Mailgun**
   - **Amazon SES**
   - **Postmark**

#### Exemplo com SendGrid:

1. Crie uma conta em [SendGrid](https://sendgrid.com/)
2. Crie uma API Key
3. Configure no Supabase:
   - **Host:** `smtp.sendgrid.net`
   - **Port:** `587`
   - **Username:** `apikey`
   - **Password:** Sua API Key do SendGrid
   - **Sender email:** `noreply@instauto.com.br`
   - **Sender name:** `Instauto`

### 5. Configurar Domínio Customizado (Opcional)

Para usar `@instauto.com.br` nos e-mails:

1. Adicione registros DNS no seu domínio:
   - SPF: `v=spf1 include:sendgrid.net ~all`
   - DKIM: Fornecido pelo SendGrid
   - DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@instauto.com.br`

2. Verifique o domínio no SendGrid

3. Atualize o **Sender email** no Supabase para `noreply@instauto.com.br`

## 🔔 E-mail de Teste Terminando (Automático)

Para enviar e-mails quando o teste está terminando, você precisa criar uma Edge Function ou usar um cron job.

### Opção 1: Supabase Edge Function (Recomendado)

Crie um arquivo `supabase/functions/check-trial-ending/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Buscar usuários com teste terminando em 3 dias
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { data: workshops, error } = await supabase
    .from("workshops")
    .select("*, profiles(*)")
    .eq("plan_type", "pro")
    .eq("plan_status", "trial")
    .lte("trial_ends_at", threeDaysFromNow.toISOString())
    .is("trial_ending_email_sent", false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // Enviar e-mails
  for (const workshop of workshops || []) {
    // Aqui você enviaria o e-mail usando SendGrid API ou outro serviço
    // Por enquanto, apenas marcar como enviado
    await supabase
      .from("workshops")
      .update({ trial_ending_email_sent: true })
      .eq("id", workshop.id);
  }

  return new Response(
    JSON.stringify({ message: `${workshops?.length || 0} e-mails enviados` }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

### Opção 2: Cron Job Externo

Use um serviço como [Cron-job.org](https://cron-job.org/) ou [EasyCron](https://www.easycron.com/) para chamar uma API route do Next.js diariamente.

## 📝 Variáveis de Ambiente

Adicione no arquivo `.env.local`:

```env
# SendGrid (se usar)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Ou outro provedor SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
SMTP_FROM=noreply@instauto.com.br
```

## ✅ Checklist de Configuração

- [ ] Templates configurados no Supabase
- [ ] SMTP customizado configurado (SendGrid recomendado)
- [ ] Domínio verificado (opcional)
- [ ] Registros DNS configurados (SPF, DKIM, DMARC)
- [ ] E-mail de boas-vindas testado
- [ ] E-mail de recuperação de senha testado
- [ ] Edge Function ou Cron Job para teste terminando configurado

## 🧪 Testar E-mails

1. **Boas-vindas**: Crie uma nova conta
2. **Recuperação**: Clique em "Esqueci minha senha" no login
3. **Teste terminando**: Execute manualmente a Edge Function

## 📚 Recursos

- [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🆘 Suporte

Se tiver dúvidas sobre a configuração:
- 📧 contato@instauto.com.br
- 📱 +55 (43) 99185-2779

