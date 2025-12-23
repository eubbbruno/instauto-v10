# 🚗 MARKETPLACE PARA MOTORISTAS

## 📋 VISÃO GERAL

O Marketplace é a funcionalidade que conecta **motoristas** com **oficinas**, permitindo:
- Busca de oficinas por localização e serviços
- Solicitação de orçamentos online
- Sistema de avaliações e reviews
- Comparação de preços e prazos

---

## 🗄️ BANCO DE DADOS

### Tabelas Criadas:

#### 1. `quotes` (Orçamentos)
Armazena solicitações de orçamento de motoristas para oficinas.

**Campos principais:**
- `workshop_id` - Oficina que receberá o orçamento
- `motorist_name`, `motorist_email`, `motorist_phone` - Dados do motorista
- `vehicle_brand`, `vehicle_model`, `vehicle_year` - Dados do veículo
- `service_type` - Tipo de serviço (maintenance, repair, diagnostic, other)
- `description` - Descrição detalhada do problema
- `urgency` - Urgência (low, medium, high)
- `status` - Status (pending, quoted, accepted, rejected, expired)
- `workshop_response` - Resposta da oficina
- `estimated_price` - Valor estimado pela oficina
- `estimated_days` - Prazo estimado em dias
- `expires_at` - Data de expiração (7 dias após criação)

#### 2. `reviews` (Avaliações)
Armazena avaliações de motoristas sobre oficinas.

**Campos principais:**
- `workshop_id` - Oficina avaliada
- `motorist_name`, `motorist_email` - Dados do avaliador
- `rating` - Nota de 1 a 5 estrelas
- `comment` - Comentário opcional
- `service_type` - Tipo de serviço avaliado
- `verified` - Se foi cliente real (futuro)
- `response` - Resposta da oficina
- `is_visible` - Se a avaliação está visível

#### 3. Novos campos em `workshops`
- `is_public` - Se a oficina aparece no marketplace
- `description` - Descrição da oficina
- `services` - Array de serviços oferecidos
- `specialties` - Especialidades (diesel, elétrica, etc)
- `working_hours` - Horários de funcionamento (JSON)
- `accepts_quotes` - Se aceita orçamentos online
- `average_rating` - Média de avaliações (calculado automaticamente)
- `total_reviews` - Total de avaliações (calculado automaticamente)

---

## 🌐 PÁGINAS PÚBLICAS (Motoristas)

### 1. `/buscar-oficinas`
**Funcionalidades:**
- Busca por nome, cidade ou serviço
- Filtros por cidade, estado e tipo de serviço
- Listagem de oficinas com rating e informações
- Botões para solicitar orçamento ou ver detalhes

### 2. `/oficina/[id]`
**Funcionalidades:**
- Detalhes completos da oficina
- Serviços oferecidos e especialidades
- Horário de funcionamento
- Avaliações de clientes
- Botão para solicitar orçamento
- Botão para deixar avaliação

### 3. `/solicitar-orcamento`
**Funcionalidades:**
- Formulário completo de solicitação
- Dados do motorista (nome, email, telefone)
- Dados do veículo (marca, modelo, ano, placa)
- Tipo de serviço e urgência
- Descrição detalhada do problema
- Envio direto para a oficina

### 4. `/avaliar-oficina`
**Funcionalidades:**
- Sistema de 1 a 5 estrelas
- Comentário opcional
- Tipo de serviço avaliado
- Dados do avaliador

---

## 🏢 PAINEL DA OFICINA (Dashboard)

### `/oficina/orcamentos`
**Funcionalidades:**
- Listagem de todos os orçamentos recebidos
- Filtros por status (pendentes, respondidos, aceitos)
- Detalhes completos de cada solicitação
- Responder orçamentos com:
  - Texto de resposta
  - Valor estimado
  - Prazo em dias
- Marcar orçamentos como aceitos ou recusados
- Badges de urgência e status

**Proteção:**
- Recurso exclusivo do plano PRO
- Protegido por `PlanGuard`

---

## 🔒 SEGURANÇA (RLS)

### Políticas Implementadas:

#### Tabela `quotes`:
- ✅ Oficinas veem apenas seus próprios orçamentos
- ✅ Qualquer pessoa pode criar orçamentos (público)
- ✅ Apenas oficinas podem atualizar orçamentos

#### Tabela `reviews`:
- ✅ Qualquer pessoa pode ler reviews visíveis
- ✅ Qualquer pessoa pode criar reviews (público)
- ✅ Oficinas podem gerenciar suas reviews (ocultar ofensivos, responder)

#### Tabela `workshops`:
- ✅ Apenas oficinas públicas aparecem no marketplace
- ✅ Dados sensíveis não são expostos

---

## 🤖 AUTOMAÇÕES

### Triggers Criados:

#### 1. Atualização automática de rating
Quando uma review é criada ou atualizada:
- Calcula a média de `rating` de todas as reviews visíveis
- Atualiza `average_rating` na tabela `workshops`
- Atualiza `total_reviews` na tabela `workshops`

#### 2. Atualização de timestamps
- `updated_at` é atualizado automaticamente em `quotes` e `reviews`

---

## 📊 VIEWS ÚTEIS

### `public_workshops`
Lista todas as oficinas públicas com estatísticas.

### `pending_quotes_by_workshop`
Conta orçamentos pendentes por oficina.

---

## 🎯 FLUXO COMPLETO

### Para Motoristas:
1. Acessa `/buscar-oficinas`
2. Filtra por cidade/serviço
3. Clica em "Ver Detalhes" ou "Solicitar Orçamento"
4. Preenche formulário com dados do veículo e problema
5. Recebe resposta por email em até 48h
6. Após o serviço, pode deixar avaliação

### Para Oficinas:
1. Recebe notificação de novo orçamento
2. Acessa `/oficina/orcamentos` no dashboard
3. Vê detalhes da solicitação
4. Responde com valor e prazo estimados
5. Aguarda aceitação do cliente
6. Pode responder avaliações recebidas

---

## 🚀 PRÓXIMOS PASSOS

### Melhorias Futuras:
- [ ] Integração com WhatsApp para notificações
- [ ] Sistema de chat em tempo real
- [ ] Verificação de reviews (apenas clientes reais)
- [ ] Geolocalização e busca por proximidade
- [ ] Sistema de agendamento direto
- [ ] Pagamento online integrado
- [ ] Programa de fidelidade
- [ ] Cupons de desconto

---

## 📝 NOTAS IMPORTANTES

1. **Orçamentos expiram em 7 dias** - Após isso, status muda para "expired"
2. **Reviews podem ser ocultados** - Oficinas podem ocultar reviews ofensivos
3. **Oficinas podem responder reviews** - Boa prática para engajamento
4. **Rating é calculado automaticamente** - Não precisa atualizar manualmente
5. **Dados de contato são obrigatórios** - Para oficina poder responder

---

## 🐛 TROUBLESHOOTING

### Oficina não aparece no marketplace:
- Verificar se `is_public = true`
- Verificar se tem `plan_type = 'free'` ou `'pro'`

### Orçamentos não aparecem:
- Executar migration SQL completa
- Verificar políticas RLS no Supabase
- Verificar se `workshop_id` está correto

### Rating não atualiza:
- Verificar se trigger está ativo
- Verificar se review está com `is_visible = true`
- Rodar manualmente a função `update_workshop_rating()`

---

**Documentação criada em:** 23/01/2025  
**Última atualização:** 23/01/2025

