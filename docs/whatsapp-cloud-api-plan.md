# Plano: WhatsApp Cloud API (oficial) — migração do Evolution

> Status: **planejamento**. Evolution foi desligado no código (`WHATSAPP_MODE = "off"` em `lib/config.ts`).
> A tela `/oficina/whatsapp` mostra "Em breve" e as rotas não chamam mais o Railway.

## 1. Por que sair do Evolution

- Evolution/Baileys é **não-oficial** (usa WhatsApp Web por baixo) → **risco real de ban do número**.
- Parou de funcionar (sessão caindo no Railway) e a manutenção é frágil.
- **A Meta fechou o cerco em 2026**: desde abr/2026 o **Embedded Signup** virou o caminho padrão e a
  inscrição no **Tech Provider Program** passou a ser obrigatória para quem oferece WhatsApp a terceiros.
  O Embedded Signup **v2 será desativado em 15/out/2026** → nascer já no **v4**.

Conclusão: o caminho certo é **WhatsApp Cloud API oficial**.

## 2. Três arquiteturas possíveis

| # | Modelo | Cada oficina usa… | Precisa Tech Provider? | Esforço | Veredito |
|---|--------|-------------------|------------------------|---------|----------|
| A | **Número único Instauto** | UM número nosso ("Assistente Instauto") p/ todas | ❌ Não | 🟢 Baixo (dias) | MVP rápido, mas mensagem não sai do número da oficina |
| B | **Embedded Signup (multi-tenant)** | O **próprio número** de cada oficina | ✅ Sim | 🔴 Alto (semanas) | Produto ideal — cada oficina com a própria marca |
| C | **Coexistence API** | O número da oficina **sem perder o app no celular** | ✅ Sim | 🟠 Médio-alto | Ótimo p/ SMB que não quer largar o WhatsApp do celular |

**Recomendação:** mirar em **B (Embedded Signup)** como destino, mas considerar **A como Fase 0**
para colocar algo no ar rápido enquanto a papelada do Tech Provider/app review anda. A **C (Coexistence)**
é a que menos atrita com dono de oficina (ele continua usando o WhatsApp no celular) — avaliar na fase de
conexão, pois hoje é o modelo que a Meta mais empurra para pequenos negócios.

### DECISÃO FINAL (2026-09): Arquitetura C — Coexistence

- Motivo: as oficinas **não podem perder o WhatsApp no celular** (senão churn/atrito).
- **IA autoreply FUNCIONA** na Coexistence (envio/recebimento via Cloud API enquanto o dono usa o app).
  Cuidado de produto: dono + IA podem responder junto → usar o toggle `whatsapp_ai_autoreply` (já existe)
  e, depois, regra "IA só responde se ninguém respondeu em X min".
- App Meta: **"Oficinas Mecânicas"** (já verificado, mesmo Business Portfolio do outro SaaS "MotorGestor").
- Número oficial Instauto (suporte/testes): **(43) 99185-2779**.
- Conexão: Embedded Signup **com QR** escaneado do app WhatsApp **Business** da oficina (linka o número existente).
- Elegibilidade: número precisa estar no app **WhatsApp Business** e não estar em outra API/BSP.

## 3. Tech Provider: o que reaproveita do seu outro SaaS

Você já tem Tech Provider aprovado em outro app da Meta. O que carrega e o que **não** carrega:

**Carrega (nível do Business Portfolio / Business Manager):**
- ✅ **Business Verification** (verificação do negócio) — se o Instauto estiver **no mesmo Business Portfolio**.
- ✅ **Aprovação no Tech Provider Program** — é concedida ao **portfólio de negócios**, não ao app.

**NÃO carrega (é por-App):**
- ❌ Cada **App** precisa do próprio produto **WhatsApp** configurado.
- ❌ **Advanced Access** às permissões `whatsapp_business_management` e `whatsapp_business_messaging`
  (App Review por app).
- ❌ **Configuração do Embedded Signup** (Facebook Login for Business config + redirect URIs) por app.
- ❌ **Webhook URL** — um por app (não dá pra misturar dois produtos no mesmo webhook de forma limpa).

**Decisão a tomar (verificar no Meta):**
- [ ] O Instauto está no **mesmo Business Portfolio** do outro SaaS? (Business Settings → Business Info)
  - Se sim → herda verificação + Tech Provider; falta só configurar o app.
  - Se não → dá pra **mover/adicionar** o app do Instauto a esse portfólio, ou refazer a verificação.
- [ ] Usar **o mesmo App** (adicionando uma 2ª config de Embedded Signup) **ou** criar um **App novo**
  dentro do mesmo portfólio verificado?
  - Recomendado: **App novo** dedicado ao Instauto (webhook e logs separados), aproveitando a verificação
    de negócio já feita — o gargalo (dias/semanas) é a verificação, e essa você já tem.

> Ação: abrir o Business Manager do outro SaaS e conferir portfólio + onde o app do Instauto está hoje.

## 4. O que o Cloud API muda no PRODUTO (importante)

1. **Janela de 24h**: só dá pra mandar mensagem livre nas **24h após a última mensagem do cliente**.
   Fora disso, **só templates aprovados (HSM)**. Isso afeta:
   - A **resposta automática com IA** (só responde dentro da janela — o que é o caso normal, ok).
   - Follow-ups proativos (ex.: "seu orçamento saiu") → **precisam de template aprovado**.
2. **Templates (HSM)**: criar e submeter à aprovação da Meta (categorias: utility/marketing/authentication).
   Ex.: template de boas-vindas, de orçamento pronto, de lembrete de agendamento.
3. **Webhook oficial**: verificação via `GET` com `hub.challenge` + validação de assinatura
   `X-Hub-Signature-256` nos `POST`. Payload **diferente** do Evolution.
4. **IDs por oficina**: cada oficina passa a ter `waba_id` + `phone_number_id`; o envio usa esses IDs
   com um **System User token** (via Tech Provider) — não é mais QR.
5. **Custo por conversa/mensagem** (ver seção 8).

## 5. Modelo de dados (mudanças)

Reaproveita a tabela **`whatsapp_messages`** como está (histórico + UI de conversa).

Novas colunas em **`workshops`** (migration nova):
```sql
alter table workshops
  add column if not exists wa_waba_id            text,   -- WhatsApp Business Account ID
  add column if not exists wa_phone_number_id    text,   -- ID do número (envio)
  add column if not exists wa_display_number     text,   -- número exibido (E.164)
  add column if not exists wa_verified_name      text,   -- nome verificado na Meta
  add column if not exists wa_status             text,   -- 'connected' | 'pending' | 'disconnected'
  add column if not exists wa_token              text;   -- se por-oficina; senão usar system user global
```
> `whatsapp_number` e `whatsapp_ai_autoreply` já existem e continuam válidos.
> Guardar `wa_token` cifrado ou preferir **System User token único** com acesso às WABAs dos clientes
> (padrão Tech Provider) — decidir na Fase 2.

## 6. Fases de implementação

**Fase 0 — MVP número único (opcional, rápido):**
- Criar 1 WABA + 1 número Instauto no Cloud API.
- `lib/whatsapp-cloud.ts` com `sendMessage(phoneNumberId, to, text)` e `sendTemplate(...)`.
- Webhook `/api/webhooks/whatsapp` (verificação + assinatura).
- Ligar `WHATSAPP_MODE = "cloud"` só para um piloto.

**Fase 1 — Infra do app (pré-requisito de tudo):**
- App novo no portfólio verificado; produto WhatsApp; System User + token.
- Webhook oficial no ar e assinando corretamente.
- Migration das colunas `wa_*`.

**Fase 2 — Embedded Signup (conexão da oficina):**
- Facebook Login for Business + JS SDK na tela `/oficina/whatsapp` (substitui o QR).
- Callback troca `code` → captura `waba_id` + `phone_number_id`, registra o número, salva em `workshops`.
- **Subscribe** do app à WABA da oficina (para receber os webhooks dela).

**Fase 3 — Envio/Recebimento:**
- `send/route.ts` → trocar `sendText` (Evolution) por Cloud API (`phone_number_id` da oficina).
- Webhook → parsear payload da Meta e gravar em `whatsapp_messages` (mesma tabela).
- Manter rate-limit e o registro de `from_me`.

**Fase 4 — Templates (HSM):**
- CRUD/registro dos templates aprovados; envio proativo (orçamento pronto, lembrete) via template.

**Fase 5 — IA autoreply no Cloud:**
- Reaproveitar `maybeAutoReply` (o prompt e guardrails já estão prontos), respeitando a **janela de 24h**.

## 7. Mapa: código atual → novo

| Hoje (Evolution) | Amanhã (Cloud API) |
|---|---|
| `lib/evolution.ts` | **`lib/whatsapp-cloud.ts`** (sendMessage/sendTemplate/subscribe) |
| `/api/whatsapp/connect` (QR) | **Embedded Signup** (SDK no client) + `/api/whatsapp/onboard` (troca de code) |
| `/api/whatsapp/status` (connectionState) | status via `wa_status` no banco / Graph API do número |
| `/api/webhooks/evolution` | **`/api/webhooks/whatsapp`** (verify + assinatura + payload Meta) |
| `/api/whatsapp/send` (Baileys) | mesma rota, corpo troca p/ Graph API |
| **`whatsapp_messages`** | ✅ **reaproveita igual** |
| UI de conversas + composer | ✅ **reaproveita** (só troca o card de conexão) |
| `maybeAutoReply` (IA) | ✅ **reaproveita** (respeitar janela 24h) |
| toggle `whatsapp_ai_autoreply` | ✅ **reaproveita** |

Reaproveitamento alto: o miolo (dados, UI, IA) fica; troca o **transporte** e a **conexão**.

## 8. Custos (ordem de grandeza — confirmar na tabela vigente da Meta/BR)

- Cobrança por **conversa/mensagem** conforme categoria (utility/marketing/service).
- Conversas iniciadas pelo cliente (service) costumam ter faixa gratuita mensal; marketing é pago.
- Repassar/absorver: definir se entra no plano PRO ou é add-on. **Não** promocionar como "ilimitado".

## 9. Pré-requisitos que dependem de você (Bruno)

- [ ] Conferir portfólio/Tech Provider do outro SaaS (seção 3) e decidir app novo × reuso.
- [ ] Definir número do WhatsApp para Fase 0 (se formos de MVP número único).
- [ ] Aprovar a decisão de arquitetura final (A → B, ou já direto B, ou C/Coexistence).
- [ ] Business Manager: adicionar o Instauto ao portfólio verificado (se ainda não estiver).

---
_Referências: Meta for Developers — Embedded Signup (overview/implementation), WhatsApp Cloud API changelog._
