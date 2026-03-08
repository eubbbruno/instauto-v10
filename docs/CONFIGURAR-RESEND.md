# 📧 Configurar Resend para Envio de Emails

Guia rápido para ativar o sistema de notificações por email.

---

## ✅ Status Atual

- ✅ Pacote `resend` instalado
- ✅ API route criada (`/api/send-notification-email`)
- ✅ Integrado ao enviar orçamento
- ✅ Integrado ao responder orçamento
- ✅ `RESEND_API_KEY` configurada no `.env.local`

---

## 🚀 Configurar na Vercel (Produção)

### 1. Acessar Vercel Dashboard
- Ir em [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecionar o projeto **instauto-v10**

### 2. Adicionar Variável de Ambiente
- Ir em **Settings** → **Environment Variables**
- Clicar em **Add New**
- Preencher:
  - **Key**: `RESEND_API_KEY`
  - **Value**: `re_N3QqTPhn_Exq4BTgeo2VKFL37TDQRuLsu`
  - **Environment**: Selecionar **Production**, **Preview** e **Development**
- Clicar em **Save**

### 3. Redeployar
- Ir em **Deployments**
- Clicar nos 3 pontinhos do último deploy
- Clicar em **Redeploy**
- ✅ Pronto! Emails funcionando em produção

---

## 📨 Tipos de Email Enviados

### 1. Novo Orçamento Recebido
**Quando**: Motorista solicita orçamento
**Para**: Email da oficina
**Conteúdo**:
- Nome do motorista
- Veículo (marca, modelo, ano)
- Tipo de serviço
- Descrição do problema
- Urgência
- Botão "Ver orçamento completo"

### 2. Orçamento Respondido
**Quando**: Oficina responde orçamento
**Para**: Email do motorista
**Conteúdo**:
- Nome da oficina
- Veículo
- Valor estimado
- Prazo estimado
- Mensagem da oficina
- Botão "Ver resposta completa"

---

## 🎨 Design dos Emails

- **Header**: Gradiente azul com logo Instauto
- **Corpo**: Fundo branco com informações em cards
- **Botão**: Gradiente azul com sombra
- **Footer**: Informações da empresa
- **Responsivo**: Funciona em mobile e desktop

---

## 🧪 Testar Localmente

### 1. Verificar se a chave está no .env.local
```bash
# Deve mostrar: re_N3QqTPhn_Exq4BTgeo2VKFL37TDQRuLsu
cat .env.local | grep RESEND
```

### 2. Reiniciar servidor de desenvolvimento
```bash
npm run dev
```

### 3. Testar fluxo
- Solicitar orçamento → verificar console para logs de email
- Responder orçamento → verificar console para logs de email
- Verificar caixa de entrada do email

---

## 📊 Monitorar Envios

### No Resend Dashboard:
- Acessar [resend.com/emails](https://resend.com/emails)
- Ver todos os emails enviados
- Status: Delivered, Bounced, etc
- Logs de erro se houver

### Nos Logs da Aplicação:
```
✅ [Email API] Email enviado com sucesso: { id: '...' }
❌ [Email API] Erro ao enviar email: ...
```

---

## 🔒 Segurança

- ✅ API key nunca exposta no frontend
- ✅ Rota protegida (apenas chamadas internas)
- ✅ Validação de dados antes de enviar
- ✅ Tratamento de erros adequado

---

## 💰 Limites do Resend

### Plano Gratuito:
- **100 emails/dia**
- **3.000 emails/mês**
- Ideal para testes e MVP

### Plano Pago:
- A partir de $20/mês
- 50.000 emails/mês
- Domínio customizado
- Suporte prioritário

---

## 🎯 Próximos Passos (Opcional)

1. **Configurar domínio próprio**:
   - Adicionar registros DNS no seu provedor
   - Verificar domínio no Resend
   - Mudar `from` para `noreply@instauto.com.br`

2. **Adicionar mais tipos de email**:
   - Lembrete de manutenção
   - Confirmação de agendamento
   - Avaliação após serviço
   - Newsletter

3. **Melhorar templates**:
   - Adicionar imagens (logo, ícones)
   - Personalizar mais o conteúdo
   - A/B testing de assuntos

---

## 🆘 Troubleshooting

### Email não chega:
1. Verificar se API key está correta
2. Verificar logs no console
3. Verificar pasta de spam
4. Verificar status no Resend Dashboard

### Erro "Missing API key":
1. Adicionar `RESEND_API_KEY` no `.env.local`
2. Reiniciar servidor (`npm run dev`)
3. Verificar se não tem espaços extras na chave

### Email vai para spam:
1. Configurar domínio próprio (SPF, DKIM)
2. Evitar palavras "spam" no assunto
3. Incluir link de unsubscribe (opcional)

---

## 📚 Documentação Oficial

- [Resend Docs](https://resend.com/docs)
- [Next.js + Resend](https://resend.com/docs/send-with-nextjs)
- [Email Templates](https://resend.com/docs/dashboard/emails/templates)
