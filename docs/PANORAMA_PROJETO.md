# 📊 PANORAMA GERAL DO PROJETO INSTAUTO

## 🎯 VISÃO GERAL

**Instauto** é uma plataforma completa que une:
1. **Sistema de Gestão** para oficinas mecânicas (SaaS)
2. **Marketplace** para motoristas encontrarem oficinas

---

## 🏗️ ARQUITETURA

### **Stack Tecnológico**
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Deployment**: Vercel
- **Domínio**: www.instauto.com.br

### **Estrutura de Pastas**
```
instauto-v10/
├── app/
│   ├── (auth)/                    # Rotas de autenticação
│   │   └── cadastro/
│   ├── (dashboard)/               # Dashboard oficinas
│   │   └── oficina/
│   │       ├── page.tsx           # Home dashboard
│   │       ├── clientes/
│   │       ├── veiculos/
│   │       ├── ordens/
│   │       ├── orcamentos/
│   │       ├── estoque/
│   │       ├── financeiro/
│   │       ├── agenda/
│   │       ├── relatorios/
│   │       ├── planos/
│   │       ├── configuracoes/
│   │       ├── diagnostico/
│   │       └── whatsapp/
│   ├── (motorista)/               # Dashboard motoristas
│   │   └── motorista/
│   │       ├── page.tsx           # Home dashboard
│   │       ├── garagem/           # Lista de veículos
│   │       ├── orcamentos/        # Orçamentos solicitados
│   │       └── historico/         # Histórico manutenções
│   ├── buscar-oficinas/           # Marketplace
│   ├── solicitar-orcamento/
│   ├── oficina-detalhes/[id]/
│   ├── avaliar-oficina/
│   ├── cadastro/                  # Cadastro oficina
│   ├── cadastro-motorista/        # Cadastro motorista
│   ├── login/                     # Login oficina
│   ├── login-motorista/           # Login motorista
│   ├── completar-cadastro/        # Seleção tipo usuário
│   ├── oficinas/                  # Landing page oficinas
│   ├── motoristas/                # Landing page motoristas
│   ├── sobre/
│   ├── contato/
│   ├── planos/
│   ├── termos/
│   ├── privacidade/
│   └── page.tsx                   # HOME (foco motoristas)
├── components/
│   ├── auth/
│   │   ├── UserTypeModal.tsx      # Modal seleção usuário
│   │   └── PlanGuard.tsx          # Proteção features PRO
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── search/
│   │   └── AddressAutocomplete.tsx # Busca endereço
│   └── ui/                        # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx            # Contexto autenticação
├── lib/
│   ├── supabase.ts
│   └── email-templates.ts
├── types/
│   └── database.ts                # Tipos TypeScript
└── docs/
    ├── database-migration-marketplace.sql
    ├── database-migration-motoristas.sql
    ├── database-fix-oauth.sql
    └── CONFIGURAR_*.md
```

---

## 👥 TIPOS DE USUÁRIOS

### **1. MOTORISTA** (Grátis para sempre)
**Fluxo de Cadastro**:
```
/cadastro-motorista → Cria conta → Cria perfil motorista → /motorista
```

**Funcionalidades**:
- ✅ Buscar oficinas por localização
- ✅ Ver detalhes e avaliações de oficinas
- ✅ Solicitar orçamentos online (grátis)
- ✅ Gerenciar veículos (garagem)
- ✅ Histórico de manutenções
- ✅ Acompanhar orçamentos solicitados
- 🔄 Chat em tempo real com oficinas (futuro)

**Dashboard**: `/motorista`
- Home com estatísticas
- Garagem (veículos)
- Orçamentos
- Histórico

### **2. OFICINA** (Plano FREE ou PRO)
**Fluxo de Cadastro**:
```
/cadastro → Cria conta → Cria perfil oficina → /oficina
```

**Planos**:
- **FREE**: Funcionalidades básicas
- **PRO**: R$ 97/mês (14 dias grátis)
  - Ordens de serviço ilimitadas
  - Relatórios avançados
  - WhatsApp integrado
  - Diagnóstico IA

**Funcionalidades**:
- ✅ Gestão completa de OS
- ✅ Cadastro de clientes e veículos
- ✅ Controle de estoque
- ✅ Gestão financeira
- ✅ Agenda de serviços
- ✅ Relatórios e gráficos
- ✅ Aparecer no marketplace
- ✅ Receber e responder orçamentos
- 🔄 Diagnóstico com IA (PRO)
- 🔄 WhatsApp Business (PRO)

**Dashboard**: `/oficina`
- Home com métricas
- Clientes
- Veículos
- Ordens de Serviço
- Orçamentos
- Estoque
- Financeiro
- Agenda
- Relatórios
- Planos
- Configurações

---

## 🗄️ BANCO DE DADOS (Supabase)

### **Tabelas Principais**

#### **Autenticação**
```sql
profiles
├── id (UUID, PK)
├── email
├── name
├── type (oficina | motorista | admin)
└── created_at
```

#### **Oficinas**
```sql
workshops
├── id (UUID, PK)
├── profile_id (FK → profiles)
├── name
├── cnpj
├── phone
├── email
├── address, city, state, zip_code
├── description
├── services (TEXT[])
├── is_public (BOOLEAN)
├── average_rating (DECIMAL)
├── total_reviews (INT)
├── plan (free | pro)
├── trial_ends_at
└── subscription_status
```

#### **Motoristas**
```sql
motorists
├── id (UUID, PK)
├── profile_id (FK → profiles)
├── name
├── phone
└── created_at

motorist_vehicles
├── id (UUID, PK)
├── motorist_id (FK → motorists)
├── brand, model, year
├── plate, color
├── mileage, fuel_type
└── is_active

maintenance_history
├── id (UUID, PK)
├── motorist_id (FK → motorists)
├── vehicle_id (FK → motorist_vehicles)
├── workshop_id (FK → workshops)
├── service_type, description
├── cost, mileage
└── service_date
```

#### **Marketplace**
```sql
quotes (Orçamentos)
├── id (UUID, PK)
├── workshop_id (FK → workshops)
├── motorist_id (FK → motorists)
├── vehicle_brand, vehicle_model, vehicle_year
├── service_type, description
├── status (pending | responded | rejected)
├── response_message
├── estimated_price
└── created_at

reviews (Avaliações)
├── id (UUID, PK)
├── workshop_id (FK → workshops)
├── motorist_id (FK → motorists)
├── rating (1-5)
├── comment
└── created_at
```

#### **Gestão Oficina**
```sql
clients
vehicles
service_orders
stock_items
financial_transactions
appointments
```

### **RLS (Row Level Security)**
- ✅ Motoristas só veem seus próprios dados
- ✅ Oficinas só veem seus próprios clientes/OS
- ✅ Marketplace: oficinas públicas visíveis para todos
- ✅ Orçamentos: visíveis para oficina e motorista envolvidos

---

## 🎨 DESIGN SYSTEM

### **Cores**
- **Oficinas**: Amarelo/Laranja (`from-yellow-500 to-orange-600`)
- **Motoristas**: Azul (`from-blue-600 to-blue-800`)
- **Primária**: Azul (`blue-600`)
- **Secundária**: Amarelo (`yellow-400`)

### **Componentes UI**
- **shadcn/ui**: Button, Input, Card, Label, etc.
- **Radix UI**: RadioGroup, Dialog, etc.
- **Lucide Icons**: Ícones modernos

### **Efeitos Visuais**
- ✅ Glassmorphism em imagens com fundo sólido
- ✅ Bordas arredondadas (`rounded-3xl`)
- ✅ Gradientes (`bg-gradient-to-br`)
- ✅ Sombras profundas (`drop-shadow-2xl`)
- ✅ Animações suaves (`transition-all`)

---

## 🔐 AUTENTICAÇÃO

### **Fluxos**

#### **Cadastro**
```
Header "Cadastrar" 
  → Modal (Motorista ou Oficina?)
    → /cadastro-motorista → Cria motorista → /motorista
    → /cadastro → Cria oficina → /oficina
```

#### **Login**
```
Header "Entrar"
  → Modal (Motorista ou Oficina?)
    → /login-motorista → Verifica perfil → /motorista
    → /login → Verifica perfil → /oficina
```

#### **OAuth (Google)**
```
Google Login 
  → /auth/callback 
  → /completar-cadastro (escolhe tipo)
  → Cria perfil
  → Dashboard correspondente
```

### **Proteção de Rotas**
- `AuthContext`: Gerencia sessão do usuário
- `PlanGuard`: Protege features PRO
- Middleware: Redireciona não autenticados

---

## 🚀 FEATURES IMPLEMENTADAS

### ✅ **HOME (Motoristas)**
- Hero com busca de endereço (autocomplete Nominatim)
- Imagens de veículos (carro, moto, caminhão)
- Como funciona (3 passos com imagens)
- CTA para oficinas no final
- SEO otimizado

### ✅ **MARKETPLACE**
- Busca de oficinas por localização
- Filtros (cidade, estado, serviço)
- Timer 5s → Modal de login
- Cards de oficinas com avaliações
- Detalhes da oficina
- Solicitar orçamento
- Avaliar oficina

### ✅ **DASHBOARD MOTORISTA**
- Home com estatísticas
- Garagem (lista de veículos)
- Orçamentos (status: aguardando/respondido/recusado)
- Histórico de manutenções

### ✅ **DASHBOARD OFICINA**
- Home com métricas
- Gestão de clientes
- Gestão de veículos
- Ordens de serviço
- Orçamentos recebidos
- Controle de estoque
- Gestão financeira
- Agenda
- Relatórios
- Planos (upgrade para PRO)
- Configurações

### ✅ **AUTENTICAÇÃO**
- Cadastro/Login oficina e motorista (separados)
- Google OAuth
- Modal de seleção de tipo de usuário
- Redirecionamento inteligente

### ✅ **DESIGN**
- Layout 2 colunas (cadastro/login)
- Glassmorphism
- Responsivo mobile
- Header/Footer consistentes
- Portal React para modais

---

## 🔄 FEATURES PENDENTES

### 🚧 **Chat em Tempo Real**
- Motorista ↔ Oficina
- Supabase Realtime

### 🚧 **Pagamentos**
- Integração Mercado Pago
- Assinatura PRO
- Webhooks

### 🚧 **Diagnóstico IA**
- Análise de sintomas
- Sugestão de serviços

### 🚧 **WhatsApp Business**
- Notificações
- Confirmações de agendamento

### 🚧 **Mapa**
- Google Maps
- Oficinas próximas

### 🚧 **Notificações**
- Email transacional
- Push notifications

---

## 📝 DOCUMENTAÇÃO IMPORTANTE

### **SQL Migrations**
1. `docs/database-migration-marketplace.sql` - Criar tabelas marketplace
2. `docs/database-migration-motoristas.sql` - Criar tabelas motoristas
3. `docs/database-fix-oauth.sql` - Corrigir OAuth Google

### **Configurações**
- `docs/CONFIGURAR_GOOGLE_OAUTH.md` - Setup OAuth
- `docs/CONFIGURAR_EMAILS.md` - Emails transacionais
- `docs/RESUMO_PROBLEMAS_RESOLVIDOS.md` - Histórico de bugs

---

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### ✅ **Resolvidos**
1. ~~Modal preso no header~~ → Portal React
2. ~~Autocomplete não funcionava~~ → Nominatim API
3. ~~Glassmorphism em imagens transparentes~~ → Removido
4. ~~Fluxo cadastro motorista errado~~ → Cria perfil automaticamente
5. ~~Páginas cortadas pelo header~~ → `pt-28`
6. ~~z-index do modal~~ → `z-[100]`

### ⚠️ **Atenção**
- **Google OAuth**: Precisa executar `database-fix-oauth.sql` no Supabase
- **Emails**: Configurar templates no Supabase Auth
- **Domínio**: Já configurado (instauto.com.br)

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

1. **Testar fluxos completos**
   - Cadastro motorista → Login → Buscar oficinas → Solicitar orçamento
   - Cadastro oficina → Login → Responder orçamentos

2. **Implementar chat em tempo real**
   - Supabase Realtime
   - UI de chat

3. **Adicionar Google Maps**
   - Mapa de oficinas
   - Rotas

4. **Configurar pagamentos**
   - Mercado Pago
   - Plano PRO

5. **Melhorar SEO**
   - Sitemap
   - Meta tags dinâmicas
   - Schema.org

---

## 📊 MÉTRICAS DO PROJETO

- **Páginas**: ~30
- **Componentes**: ~50
- **Rotas**: ~25
- **Tabelas DB**: ~15
- **Linhas de código**: ~15.000
- **Tempo de desenvolvimento**: ~3 sessões intensivas

---

## 🤝 COLABORAÇÃO COM CLAUDE OPUS 4.5

**O que já está pronto**:
- ✅ Estrutura completa do projeto
- ✅ Autenticação e autorização
- ✅ Dashboards (oficina e motorista)
- ✅ Marketplace funcional
- ✅ Design system consistente
- ✅ Database schema completo

**O que pode ser melhorado**:
- 🔄 Chat em tempo real
- 🔄 Integração de pagamentos
- 🔄 Testes automatizados
- 🔄 Performance optimization
- 🔄 Acessibilidade (a11y)

**Recomendação**: 
Sim, o Claude Opus 4.5 pode ajudar muito! O projeto está bem estruturado e documentado. Ele pode focar em:
1. Implementar features complexas (chat, pagamentos)
2. Otimização de performance
3. Testes e qualidade de código
4. Refinamentos de UX

---

**Última atualização**: 27/12/2024
**Versão**: 10.0
**Status**: ✅ Produção (deploy ativo)

