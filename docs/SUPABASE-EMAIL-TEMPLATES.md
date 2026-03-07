# 📧 Templates de Email - Supabase

Guia completo para customizar os emails enviados pelo Supabase Authentication.

---

## 🔧 Como Configurar

1. Ir no [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecionar seu projeto
3. Ir em **Authentication** → **Email Templates**
4. Copiar e colar os templates abaixo

---

## 📨 Template 1: Confirmação de Email

**Nome**: Confirm signup

**Assunto**:
```
Confirme sua conta no Instauto 🚗
```

**Corpo HTML**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      background-color: #F9FAFB;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo { 
      font-size: 36px; 
      font-weight: bold;
      margin-bottom: 10px;
    }
    .logo-inst { color: white; }
    .logo-auto { color: #FCD34D; }
    .content {
      padding: 40px 30px;
    }
    h2 {
      color: #1F2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #4B5563;
      margin-bottom: 16px;
    }
    .btn { 
      display: inline-block; 
      background: linear-gradient(to right, #3B82F6, #2563EB);
      color: white !important; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .btn:hover {
      background: linear-gradient(to right, #2563EB, #1D4ED8);
    }
    .link-box {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      color: #3B82F6;
      font-size: 14px;
      margin: 20px 0;
    }
    .footer { 
      background: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer p {
      font-size: 13px;
      color: #6B7280;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
      </div>
      <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
    </div>
    
    <div class="content">
      <h2>Bem-vindo ao Instauto! 🚗</h2>
      
      <p>Olá,</p>
      
      <p>Você está quase lá! Clique no botão abaixo para <strong>confirmar sua conta</strong> e começar a usar o Instauto:</p>
      
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="btn">✅ Confirmar minha conta</a>
      </p>
      
      <div class="divider"></div>
      
      <p><strong>Ou copie e cole este link no seu navegador:</strong></p>
      <div class="link-box">{{ .ConfirmationURL }}</div>
      
      <p style="color: #6B7280; font-size: 14px;">
        ⚠️ Se você não criou esta conta, ignore este email.
      </p>
      
      <div class="divider"></div>
      
      <p>Abraços,<br><strong>Equipe Instauto</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>© 2024 Instauto</strong></p>
      <p>Conectando motoristas e oficinas mecânicas.</p>
      <p style="margin-top: 15px;">
        <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 📨 Template 2: Redefinir Senha

**Nome**: Reset password

**Assunto**:
```
Redefinir sua senha - Instauto 🔐
```

**Corpo HTML**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      background-color: #F9FAFB;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo { 
      font-size: 36px; 
      font-weight: bold;
      margin-bottom: 10px;
    }
    .logo-inst { color: white; }
    .logo-auto { color: #FCD34D; }
    .content {
      padding: 40px 30px;
    }
    h2 {
      color: #1F2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #4B5563;
      margin-bottom: 16px;
    }
    .btn { 
      display: inline-block; 
      background: linear-gradient(to right, #3B82F6, #2563EB);
      color: white !important; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .btn:hover {
      background: linear-gradient(to right, #2563EB, #1D4ED8);
    }
    .link-box {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      color: #3B82F6;
      font-size: 14px;
      margin: 20px 0;
    }
    .warning-box {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer { 
      background: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer p {
      font-size: 13px;
      color: #6B7280;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
      </div>
      <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
    </div>
    
    <div class="content">
      <h2>Redefinir sua senha 🔐</h2>
      
      <p>Olá,</p>
      
      <p>Recebemos uma solicitação para <strong>redefinir a senha</strong> da sua conta no Instauto.</p>
      
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="btn">🔑 Redefinir senha</a>
      </p>
      
      <div class="warning-box">
        <p style="margin: 0; color: #92400E;">
          ⏰ <strong>Este link expira em 24 horas.</strong>
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p><strong>Ou copie e cole este link no seu navegador:</strong></p>
      <div class="link-box">{{ .ConfirmationURL }}</div>
      
      <p style="color: #6B7280; font-size: 14px;">
        ⚠️ Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá inalterada.
      </p>
      
      <div class="divider"></div>
      
      <p>Abraços,<br><strong>Equipe Instauto</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>© 2024 Instauto</strong></p>
      <p>Conectando motoristas e oficinas mecânicas.</p>
      <p style="margin-top: 15px;">
        <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 📨 Template 3: Convite (Magic Link)

**Nome**: Magic Link

**Assunto**:
```
Seu link de acesso ao Instauto 🔗
```

**Corpo HTML**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      background-color: #F9FAFB;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo { 
      font-size: 36px; 
      font-weight: bold;
      margin-bottom: 10px;
    }
    .logo-inst { color: white; }
    .logo-auto { color: #FCD34D; }
    .content {
      padding: 40px 30px;
    }
    h2 {
      color: #1F2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #4B5563;
      margin-bottom: 16px;
    }
    .btn { 
      display: inline-block; 
      background: linear-gradient(to right, #3B82F6, #2563EB);
      color: white !important; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .link-box {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      color: #3B82F6;
      font-size: 14px;
      margin: 20px 0;
    }
    .warning-box {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer { 
      background: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer p {
      font-size: 13px;
      color: #6B7280;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
      </div>
      <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
    </div>
    
    <div class="content">
      <h2>Seu link de acesso 🔗</h2>
      
      <p>Olá,</p>
      
      <p>Clique no botão abaixo para <strong>acessar sua conta</strong> no Instauto:</p>
      
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="btn">🔓 Acessar minha conta</a>
      </p>
      
      <div class="warning-box">
        <p style="margin: 0; color: #92400E;">
          ⏰ <strong>Este link expira em 1 hora.</strong>
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p><strong>Ou copie e cole este link no seu navegador:</strong></p>
      <div class="link-box">{{ .ConfirmationURL }}</div>
      
      <p style="color: #6B7280; font-size: 14px;">
        ⚠️ Se você não solicitou este link, ignore este email.
      </p>
      
      <div class="divider"></div>
      
      <p>Abraços,<br><strong>Equipe Instauto</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>© 2024 Instauto</strong></p>
      <p>Conectando motoristas e oficinas mecânicas.</p>
      <p style="margin-top: 15px;">
        <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 📨 Template 4: Mudança de Email

**Nome**: Change Email Address

**Assunto**:
```
Confirme a mudança de email - Instauto
```

**Corpo HTML**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1F2937;
      background-color: #F9FAFB;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo { 
      font-size: 36px; 
      font-weight: bold;
      margin-bottom: 10px;
    }
    .logo-inst { color: white; }
    .logo-auto { color: #FCD34D; }
    .content {
      padding: 40px 30px;
    }
    h2 {
      color: #1F2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #4B5563;
      margin-bottom: 16px;
    }
    .btn { 
      display: inline-block; 
      background: linear-gradient(to right, #3B82F6, #2563EB);
      color: white !important; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .link-box {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      color: #3B82F6;
      font-size: 14px;
      margin: 20px 0;
    }
    .footer { 
      background: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer p {
      font-size: 13px;
      color: #6B7280;
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
      </div>
      <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
    </div>
    
    <div class="content">
      <h2>Confirme a mudança de email 📧</h2>
      
      <p>Olá,</p>
      
      <p>Recebemos uma solicitação para <strong>alterar o email</strong> da sua conta no Instauto.</p>
      
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="btn">✅ Confirmar novo email</a>
      </p>
      
      <div class="divider"></div>
      
      <p><strong>Ou copie e cole este link no seu navegador:</strong></p>
      <div class="link-box">{{ .ConfirmationURL }}</div>
      
      <p style="color: #6B7280; font-size: 14px;">
        ⚠️ Se você não solicitou esta mudança, ignore este email ou entre em contato conosco.
      </p>
      
      <div class="divider"></div>
      
      <p>Abraços,<br><strong>Equipe Instauto</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>© 2024 Instauto</strong></p>
      <p>Conectando motoristas e oficinas mecânicas.</p>
      <p style="margin-top: 15px;">
        <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🎨 Cores da Marca

- **Azul Principal**: `#3B82F6` (blue-600)
- **Azul Escuro**: `#2563EB` (blue-700)
- **Amarelo**: `#FCD34D` (yellow-300)
- **Cinza Texto**: `#1F2937` (gray-900)

---

## 📋 Checklist de Configuração

- [ ] Copiar template "Confirm signup"
- [ ] Copiar template "Reset password"
- [ ] Copiar template "Magic Link"
- [ ] Copiar template "Change Email Address"
- [ ] Testar enviando email de confirmação
- [ ] Testar enviando email de redefinir senha
- [ ] Verificar se emails chegam na caixa de entrada (não spam)

---

## 🔗 Links Úteis

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Variáveis disponíveis](https://supabase.com/docs/guides/auth/auth-email-templates#variables)

---

## ⚙️ Configurações Recomendadas

### Desenvolvimento:
- ✅ Desabilitar confirmação de email (mais rápido para testar)
- ✅ Usar emails de teste

### Produção:
- ✅ Habilitar confirmação de email
- ✅ Configurar SMTP próprio ou provedor (SendGrid, Resend, etc)
- ✅ Customizar templates com as cores da marca
- ✅ Testar emails em diferentes clientes (Gmail, Outlook, etc)

---

## 🎯 Próximos Passos

1. Acessar Supabase Dashboard
2. Ir em Authentication → Email Templates
3. Copiar e colar cada template
4. Salvar
5. Testar criando uma nova conta
