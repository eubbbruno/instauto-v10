# 🚀 Contexto do Projeto Instauto

## 📋 Visão Geral
Plataforma de gestão para oficinas mecânicas e motoristas, conectando clientes a oficinas e oferecendo ferramentas de gestão completas.

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 16.0.10** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 3.4.1**
- **Framer Motion 12.23.26** (animações)
- **shadcn/ui** (componentes Radix UI)
- **Lucide React** (ícones)
- **Recharts 3.6.0** (gráficos)

### Backend & Database
- **Supabase** (cajmcennpocqcrffzoms.supabase.co)
  - PostgreSQL
  - Auth (email + Google OAuth)
  - Storage (avatars, imagens)
  - RLS (Row Level Security)

### Integrações
- **Resend** (envio de emails)
- **MercadoPago** (pagamentos/assinaturas)
- **OpenAI API** (diagnóstico IA)
- **Google Analytics** (G-KCSK1LL1WZ)

### Bibliotecas Auxiliares
- **date-fns** (manipulação de datas)
- **sonner** (toast notifications)
- **jspdf + jspdf-autotable** (geração de PDFs)
- **react-calendar** (calendários)

---

## 📁 Estrutura de Pastas

```
instauto-v10/
├── app/
│   ├── (dashboard)/          # Dashboard Oficina
│   │   ├── layout.tsx        # Layout com sidebar escura
│   │   └── oficina/
│   │       ├── page.tsx      # Dashboard principal
│   │       ├── clientes/
│   │       ├── veiculos/
│   │       ├── orcamentos/
│   │       ├── ordens/       # Ordens de Serviço
│   │       ├── financeiro/   # Módulo Financeiro
│   │       ├── diagnostico/  # IA Diagnóstico
│   │       ├── configuracoes/
│   │       └── planos/
│   │
│   ├── (motorista)/          # Dashboard Motorista
│   │   ├── layout.tsx
│   │   └── motorista/
│   │       ├── page.tsx
│   │       ├── garagem/
│   │       ├── orcamentos/
│   │       └── configuracoes/
│   │
│   ├── (admin)/              # Painel Admin
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── oficinas/
│   │       ├── motoristas/
│   │       └── orcamentos/
│   │
│   ├── api/                  # API Routes
│   │   ├── ai/diagnose/
│   │   ├── payments/
│   │   ├── send-notification-email/
│   │   └── webhooks/
│   │
│   ├── auth/callback/        # OAuth callback
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx
│   ├── buscar-oficinas/
│   ├── oficina-detalhes/[id]/
│   └── solicitar-orcamento/
│
├── components/
│   ├── ui/                   # Componentes base
│   │   ├── motion.tsx        # Framer Motion wrappers
│   │   ├── glass-card.tsx    # Glassmorphism
│   │   ├── gradient-button.tsx
│   │   └── stat-card.tsx
│   ├── financeiro/           # Componentes financeiro
│   │   ├── TransactionModal.tsx
│   │   ├── BillModal.tsx
│   │   └── ReceivableModal.tsx
│   ├── os/                   # Componentes OS
│   │   ├── OSCard.tsx
│   │   ├── NewOSModal.tsx
│   │   └── ChecklistManager.tsx
│   └── dashboard/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
│
├── contexts/
│   └── AuthContext.tsx
│
├── supabase/                 # SQL Scripts
│   ├── setup-v10.sql
│   ├── financeiro-tables.sql
│   ├── service-orders-tables.sql
│   └── (outros fixes)
│
└── docs/                     # Documentação
    ├── ROADMAP.md
    ├── DESIGN-SYSTEM.md
    ├── CHECKUP-PROJETO.md
    └── BUGS-PENDENTES.md
```

---

## 🔐 Variáveis de Ambiente (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cajmcennpocqcrffzoms.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui

# OpenAI
OPENAI_API_KEY=sua_openai_key_aqui

# Resend
RESEND_API_KEY=sua_resend_key_aqui

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_google_client_id_aqui

# Analytics
NEXT_PUBLIC_GA_ID=seu_ga_id_aqui

# App
NEXT_PUBLIC_APP_URL=https://instauto.com.br
```

**IMPORTANTE**: As chaves reais estão no arquivo `.env.local` (não versionado).

---

## 🗄️ Schema do Banco de Dados (Principais Tabelas)

### Autenticação
- **profiles** - Perfis de usuários (type: workshop/motorist, role: user/admin)
- **workshops** - Dados das oficinas
- **motorists** - Dados dos motoristas

### Oficina
- **clients** - Clientes da oficina
- **vehicles** - Veículos dos clientes
- **quotes** - Orçamentos
- **service_orders** - Ordens de Serviço
- **service_order_items** - Itens da OS (serviços/peças)
- **service_order_checklist** - Checklist de verificação
- **service_order_history** - Histórico de status

### Financeiro
- **transactions** - Receitas e despesas
- **bills** - Contas a pagar
- **receivables** - Contas a receber

### Motorista
- **motorist_vehicles** - Veículos do motorista
- **reviews** - Avaliações de oficinas
- **notifications** - Notificações do sistema

---

## 🎨 Design System

### Cores Principais
- **Azul primário**: #3B82F6 (blue-600)
- **Amarelo destaque**: #F59E0B (yellow-500)
- **Verde sucesso**: #10B981 (green-600)
- **Vermelho erro**: #EF4444 (red-600)
- **Cinzas**: gray-50 a gray-900

### Componentes Reutilizáveis
- **FadeIn, SlideUp, StaggerContainer** - Animações
- **GlassCard** - Cards com glassmorphism
- **GradientButton** - Botões com gradiente
- **StatCard** - Cards de estatísticas

### Padrões
- Sidebar escura com gradiente azul
- Cards com `bg-white/80 backdrop-blur-sm`
- Botões com `min-h-[44px]` para mobile
- Textos responsivos: `text-sm sm:text-base lg:text-lg`

---

## 🔑 Funcionalidades Principais

### Dashboard Oficina
- ✅ Gestão de clientes e veículos
- ✅ Orçamentos (receber e responder)
- ✅ Ordens de Serviço (completo)
- ✅ Financeiro (receitas, despesas, contas)
- ✅ Diagnóstico com IA
- ✅ Avaliações de clientes
- ✅ Notificações
- ✅ Planos (FREE 7 dias / PRO)
- 🔄 Agenda (placeholder)
- 🔄 Estoque (placeholder)

### Dashboard Motorista
- ✅ Garagem (gerenciar veículos)
- ✅ Solicitar orçamentos
- ✅ Buscar oficinas
- ✅ Avaliar oficinas
- ✅ Socorro 24h (botão emergência)
- ✅ Solicitar Guincho
- ✅ Limite de 3 veículos (plano FREE)
- ✅ Notificações

### Painel Admin
- ✅ Listar oficinas
- ✅ Listar motoristas
- ✅ Listar orçamentos
- ✅ Listar avaliações
- ✅ Estatísticas gerais
- Admin: eubbbruno@gmail.com

### Páginas Públicas
- ✅ Landing page
- ✅ Login/Cadastro (email + Google)
- ✅ Buscar oficinas (filtros)
- ✅ Perfil público da oficina
- ✅ Solicitar orçamento
- ✅ Avaliar oficina
- ✅ Para oficinas (landing específica)
- ✅ Sobre, Contato

---

## 🐛 Bugs Conhecidos e Correções Aplicadas

### Corrigidos
- ✅ Coluna `km` adicionada em `vehicles`
- ✅ Coluna `motorist_id` em `reviews` (pode ser NULL)
- ✅ Plano FREE mudado de 14 para 7 dias
- ✅ RLS corrigido em várias tabelas
- ✅ Profile criado automaticamente no callback

### Possíveis Pendentes
- ⚠️ Coluna `notes` pode não existir em `vehicles` (verificar)
- ⚠️ Coluna `services` pode não existir em `service_orders` (verificar)
- ⚠️ Algumas colunas antigas podem estar no código mas não no banco

---

## 📝 Scripts SQL Pendentes de Execução

**IMPORTANTE**: Os seguintes SQLs foram criados mas podem não ter sido executados no Supabase:

1. **supabase/financeiro-tables.sql**
   - Cria: transactions, bills, receivables
   - RLS e policies
   - Triggers

2. **supabase/service-orders-tables.sql**
   - Cria: service_orders, service_order_items, service_order_checklist, service_order_history
   - RLS e policies
   - Triggers automáticos

3. **supabase/add-avatar-column.sql**
   - Adiciona avatar_url em profiles

4. **supabase/fix-vehicles-km.sql**
   - Adiciona coluna km em vehicles

**Como executar:**
1. Acessar Supabase Dashboard
2. SQL Editor
3. Copiar e executar cada SQL
4. Verificar se não há erros

---

## 🔄 Fluxos Principais

### Cadastro de Usuário
1. Usuário acessa `/login`
2. Seleciona tipo (Motorista/Oficina)
3. Cadastra por email ou Google
4. Cookie `instauto_user_type` é salvo
5. Callback cria profile + workshop/motorist
6. Redireciona para dashboard correto

### Orçamento
1. Motorista solicita orçamento
2. Oficina recebe notificação (sino + email)
3. Oficina responde com valor
4. Motorista recebe notificação
5. Motorista pode aceitar/recusar

### Avaliação
1. Motorista avalia oficina (anônimo ou logado)
2. Rating é calculado automaticamente
3. Estrelas aparecem no perfil público
4. Oficina pode responder avaliação

---

## 🎯 Módulos Implementados

### ✅ Módulo Financeiro (COMPLETO)
- Transações (receitas e despesas)
- Contas a pagar (com status e vencimento)
- Contas a receber (com status e vencimento)
- Gráfico de fluxo de caixa
- Filtros por tipo, período, categoria
- Stats cards animados

### ✅ Módulo Ordens de Serviço (COMPLETO)
- CRUD de OS
- 7 status possíveis
- Página de detalhes com 4 tabs
- Checklist de verificação
- Histórico automático de mudanças
- Busca e filtros
- Visualização grade/lista

### 🔄 Módulos Parciais
- Diagnóstico IA (funciona mas pode melhorar)
- Agenda (placeholder)
- Estoque (placeholder)
- WhatsApp (removido temporariamente)

---

## 🔐 Autenticação e Permissões

### Tipos de Usuário
- **motorist** - Motorista (cliente)
- **workshop** - Oficina
- **admin** - Administrador (eubbbruno@gmail.com)

### Proteção de Rotas (middleware.ts)
- `/oficina/*` - Apenas workshops
- `/motorista/*` - Apenas motorists
- `/admin/*` - Apenas admin
- Páginas públicas: `/`, `/login`, `/buscar-oficinas`, etc

### RLS (Row Level Security)
Todas as tabelas principais têm RLS habilitado:
- Oficinas veem apenas seus dados
- Motoristas veem apenas seus dados
- Admin vê tudo (via service_role_key)

---

## 🎨 Design System

### Animações (Framer Motion)
```tsx
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

<FadeIn delay={0.2}>
  <GlassCard>Conteúdo</GlassCard>
</FadeIn>

<StaggerContainer>
  <StaggerItem>Card 1</StaggerItem>
  <StaggerItem>Card 2</StaggerItem>
</StaggerContainer>
```

### Glassmorphism
```tsx
<GlassCard hover className="p-6">
  {/* bg-white/80 backdrop-blur-sm border border-white/20 */}
</GlassCard>
```

### Responsividade
- Mobile: `< 640px` (sm)
- Tablet: `640px - 1024px` (md/lg)
- Desktop: `> 1024px` (xl)

Padrões:
- `p-4 sm:p-6 lg:p-8`
- `text-sm sm:text-base lg:text-lg`
- `gap-2 sm:gap-3 lg:gap-4`

---

## 📧 Emails (Resend)

### Templates Implementados
- Novo orçamento para oficina
- Resposta de orçamento para motorista
- Confirmação de cadastro
- Notificações gerais

### Arquivo
`app/api/send-notification-email/route.ts`

---

## 💳 Pagamentos (MercadoPago)

### Planos
- **FREE**: 7 dias trial
- **PRO**: R$ 97/mês

### Webhook
`app/api/webhooks/mercadopago/route.ts`

---

## 🤖 IA Diagnóstico

### Funcionalidade
- Oficina envia descrição do problema
- OpenAI analisa e sugere diagnóstico
- Resposta formatada em markdown

### Arquivo
`app/api/ai/diagnose/route.ts`

---

## 📱 Mobile

### Sidebar
- Fecha ao clicar em link
- Overlay escuro quando aberta
- Botão hamburger no TopBar

### Otimizações
- Botões com `min-h-[44px]`
- Textos menores no mobile
- Cards empilhando (grid-cols-1)
- Tabs com scroll horizontal

---

## 🚨 Pontos de Atenção

### 1. Schema do Banco
Algumas colunas podem não existir ainda:
- `vehicles.notes` (usado no código)
- `service_orders.services` (usado no código antigo)
- Verificar se todos os SQLs foram executados

### 2. Tipos TypeScript
Alguns tipos podem estar desatualizados em `types/database.ts`

### 3. Console.logs
Muitos foram removidos, mas alguns podem ter ficado

### 4. Warnings do Build
- `baseline-browser-mapping` desatualizado (não afeta)
- Middleware deprecado (migrar para proxy no futuro)

---

## 📚 Documentação Existente

1. **docs/ROADMAP.md** - Funcionalidades planejadas
2. **docs/DESIGN-SYSTEM.md** - Padrões de design
3. **docs/CHECKUP-PROJETO.md** - Análise do projeto
4. **docs/BUGS-PENDENTES.md** - Bugs conhecidos

---

## 🚀 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

**Porta padrão**: http://localhost:3000

---

## 📊 Últimas Alterações (Fev 2026)

### Implementado
- ✅ Design System completo com Framer Motion
- ✅ Animações em todas as páginas
- ✅ Responsividade mobile em todo o site
- ✅ Módulo Financeiro completo (3 tabelas)
- ✅ Módulo Ordens de Serviço completo (4 tabelas)
- ✅ Socorro 24h e Guincho no dashboard motorista
- ✅ Limite de 3 veículos para plano FREE

### Commits Recentes
- `3e1510d` - Animações completas + Responsividade mobile
- `78d5f02` - Módulo Financeiro Parte 1
- `290a139` - Módulo Financeiro Parte 2
- `784f335` - Módulo Ordens de Serviço completo

---

## 🎯 Próximos Passos Sugeridos

1. **Executar SQLs pendentes** no Supabase
2. **Verificar schema** - comparar código vs banco
3. **Testar módulos novos** - Financeiro e OS
4. **Implementar tab Itens** na OS (adicionar serviços/peças)
5. **Implementar Kanban** para OS
6. **Melhorar relatórios** financeiros
7. **Sistema de estoque** (se necessário)

---

## 📞 Contato do Admin
- Email: eubbbruno@gmail.com
- Role: admin (único com acesso ao painel /admin)

---

## ⚠️ Notas Importantes

1. **Sempre verificar RLS** ao criar novas tabelas
2. **Usar toast (sonner)** para feedback ao usuário
3. **Seguir padrão de animações** (FadeIn, StaggerContainer)
4. **Mobile first** - testar em 375px (iPhone SE)
5. **Commits descritivos** - seguir padrão do projeto

---

**Última atualização**: 15/02/2026
**Versão**: 0.1.1
**Status**: Em desenvolvimento ativo
