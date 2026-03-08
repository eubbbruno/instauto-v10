# 📊 Google Analytics - Configuração

Guia para ativar o Google Analytics no Instauto.

---

## ✅ Status Atual

- ✅ Componente `GoogleAnalytics.tsx` criado
- ✅ Integrado no `app/layout.tsx`
- ⏳ Aguardando ID do Google Analytics

---

## 🚀 Como Ativar

### 1. Criar Propriedade no Google Analytics

1. Acessar [Google Analytics](https://analytics.google.com/)
2. Criar nova propriedade ou usar existente
3. Copiar o **ID de Medição** (formato: `G-XXXXXXXXXX`)

### 2. Configurar Localmente

Editar o arquivo `.env.local`:

```bash
# Descomentar e adicionar o ID:
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Configurar na Vercel (Produção)

1. Acessar [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecionar o projeto **instauto-v10**
3. Ir em **Settings** → **Environment Variables**
4. Adicionar:
   - **Key**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`
   - **Environments**: Production, Preview, Development
5. **Redeploy** o projeto

### 4. Reiniciar Servidor de Desenvolvimento

```bash
npm run dev
```

---

## 🧪 Testar se Está Funcionando

### 1. Verificar no Console do Navegador

Abrir DevTools (F12) → Console:

```javascript
// Deve existir o objeto gtag
console.log(typeof gtag); // "function"

// Deve existir o dataLayer
console.log(window.dataLayer); // Array com eventos
```

### 2. Verificar na Network Tab

DevTools → Network:
- Filtrar por `google-analytics.com`
- Deve aparecer requisições para `collect` e `gtag/js`

### 3. Usar Extensão do Chrome

Instalar: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### 4. Verificar no Google Analytics

- Ir em **Relatórios** → **Tempo real**
- Navegar no site
- Deve aparecer usuário ativo

---

## 📊 Eventos Rastreados Automaticamente

O Google Analytics 4 rastreia automaticamente:

- **page_view**: Visualizações de página
- **session_start**: Início de sessão
- **first_visit**: Primeira visita
- **scroll**: Rolagem de página (90%)
- **click**: Cliques em links externos
- **file_download**: Downloads de arquivos
- **video_start**: Início de vídeos
- **video_complete**: Vídeos completos

---

## 🎯 Eventos Personalizados (Futuros)

Você pode adicionar eventos personalizados no código:

```typescript
// Exemplo: Rastrear solicitação de orçamento
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'quote_request', {
    workshop_id: workshopId,
    service_type: serviceType,
    value: estimatedPrice,
  });
}
```

### Eventos Sugeridos:

1. **Cadastro**:
   - `sign_up` (tipo: motorista/oficina)

2. **Orçamentos**:
   - `quote_request` (motorista solicita)
   - `quote_response` (oficina responde)
   - `quote_accepted` (motorista aceita)

3. **Avaliações**:
   - `review_submitted` (motorista avalia)
   - `rating_given` (estrelas)

4. **Busca**:
   - `search` (busca de oficinas)
   - `filter_applied` (filtros usados)

5. **Conversão**:
   - `upgrade_to_pro` (oficina upgrade)
   - `payment_success` (pagamento)

---

## 🔒 Privacidade e LGPD

### Configurações Recomendadas:

1. **Anonimizar IPs** (já configurado):
```typescript
gtag('config', 'G-XXXXXXXXXX', {
  anonymize_ip: true,
});
```

2. **Respeitar Do Not Track**:
```typescript
if (navigator.doNotTrack === '1') {
  // Não carregar GA
  return null;
}
```

3. **Cookie Consent**:
- Adicionar banner de cookies
- Só carregar GA após consentimento
- Permitir opt-out

### Dados Coletados:

- Páginas visitadas
- Tempo de permanência
- Origem do tráfego
- Dispositivo e navegador
- Localização aproximada (cidade)
- **NÃO** coleta dados pessoais identificáveis

---

## 📈 Relatórios Úteis

### 1. Aquisição
- De onde vêm os usuários?
- Quais campanhas funcionam?

### 2. Engajamento
- Quais páginas são mais visitadas?
- Quanto tempo ficam no site?

### 3. Conversão
- Quantos cadastros por dia?
- Taxa de conversão de visitante → cadastro

### 4. Retenção
- Quantos usuários retornam?
- Frequência de uso

---

## 🆘 Troubleshooting

### GA não carrega:

1. **Verificar variável de ambiente**:
```bash
echo $NEXT_PUBLIC_GA_ID
```

2. **Verificar console do navegador**:
- Erros de carregamento?
- Bloqueador de anúncios ativo?

3. **Verificar Network tab**:
- Requisições bloqueadas?
- CORS errors?

### Dados não aparecem no GA:

1. **Aguardar 24-48h**: Dados podem demorar
2. **Usar Tempo Real**: Para ver dados imediatos
3. **Verificar filtros**: Remover filtros de IP

### Ad Blockers:

- Extensões como uBlock bloqueiam GA
- Testar em modo anônimo sem extensões
- Considerar alternativas (Plausible, Fathom)

---

## 🔄 Alternativas ao Google Analytics

Se quiser mais privacidade:

1. **Plausible Analytics**
   - Foco em privacidade
   - Não usa cookies
   - GDPR compliant
   - Pago: $9/mês

2. **Fathom Analytics**
   - Similar ao Plausible
   - Interface simples
   - Pago: $14/mês

3. **Umami**
   - Open source
   - Self-hosted
   - Gratuito

---

## 📚 Links Úteis

- [Google Analytics 4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js + GA4](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [LGPD e Analytics](https://www.gov.br/anpd/pt-br)

---

## ✅ Checklist de Ativação

- [ ] Criar propriedade no Google Analytics
- [ ] Copiar ID de Medição (G-XXXXXXXXXX)
- [ ] Adicionar `NEXT_PUBLIC_GA_ID` no `.env.local`
- [ ] Adicionar `NEXT_PUBLIC_GA_ID` na Vercel
- [ ] Reiniciar servidor (`npm run dev`)
- [ ] Testar no console do navegador
- [ ] Verificar Network tab
- [ ] Confirmar em Tempo Real no GA
- [ ] Adicionar banner de cookies (opcional)
- [ ] Configurar eventos personalizados (futuro)
