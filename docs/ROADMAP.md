# INSTAUTO V10 - ROADMAP OFICIAL

## 🎯 O QUE É O INSTAUTO

Plataforma SaaS que conecta oficinas mecânicas e motoristas:
1. **Sistema de Gestão para Oficinas** (ERP/CRM) - Plano PRO pago
2. **Marketplace** - Motoristas buscam oficinas e pedem orçamentos

---

## 💰 MODELO DE NEGÓCIO

### OFICINA FREE (R$ 0/mês)
- Dashboard básico (boas-vindas, status do plano)
- Configurações da oficina
- Perfil público (visível no marketplace)
- Receber e responder orçamentos de motoristas
- **NÃO TEM:** Sistema de gestão (clientes, veículos, OS, estoque, financeiro, agenda)

### OFICINA PRO (R$ 97/mês)
- **14 dias grátis** para testar tudo
- Tudo do FREE +
- Sistema de gestão COMPLETO:
  - Clientes (ilimitado)
  - Veículos (ilimitado)
  - Ordens de Serviço (ilimitado)
  - Estoque de peças
  - Financeiro (receitas/despesas)
  - Agenda/Calendário
  - Relatórios em PDF
  - Diagnóstico com IA
  - Integração WhatsApp

### MOTORISTA (Grátis sempre)
- Cadastro e login
- Garagem virtual (adicionar veículos)
- Histórico de manutenções
- Buscar oficinas por localização
- Pedir orçamentos
- Comparar orçamentos
- Avaliar oficinas
- Chat com oficinas

---

## 📊 STATUS ATUAL

### ✅ FASE 1 - COMPLETO
- [x] Autenticação (login, cadastro, OAuth Google)
- [x] Banco de dados Supabase (schema, RLS, triggers)
- [x] Dashboard oficina PRO
- [x] CRUD Clientes
- [x] CRUD Veículos
- [x] CRUD Ordens de Serviço
- [x] Estoque de peças
- [x] Financeiro (receitas/despesas)
- [x] Agenda/Calendário
- [x] Configurações da oficina
- [x] Página de planos
- [x] Integração MercadoPago (assinatura R$ 97/mês)
- [x] Webhooks de pagamento
- [x] PlanGuard (bloqueio de rotas PRO)
- [x] Dashboard FREE (boas-vindas + CTA upgrade)
- [x] Sidebar com itens PRO desabilitados para FREE

### 🔄 FASE 2A - EM ANDAMENTO
- [x] Estrutura das páginas PRO (Diagnóstico IA, Relatórios, WhatsApp)
- [ ] **Diagnóstico IA** - Integrar OpenAI/Claude API
- [ ] **Relatórios PDF** - Implementar geração real com jsPDF
- [ ] **WhatsApp** - Integrar WhatsApp Business API

### 📋 FASE 2B - LANDING PAGES
- [ ] Refazer landing page principal (/) - mais profissional, animações, depoimentos
- [ ] Criar página /oficinas - vender o sistema para oficinas
- [ ] Criar página /motoristas - vender para motoristas
- [ ] SEO otimizado
- [ ] Seção de FAQ completa
- [ ] Depoimentos/Cases

### 🚗 FASE 3 - MARKETPLACE (MOTORISTA)
- [ ] Cadastro/login de motorista
- [ ] Dashboard do motorista
- [ ] Garagem virtual (CRUD de veículos do motorista)
- [ ] Histórico de manutenções
- [ ] Buscar oficinas (por localização, avaliação, especialidade)
- [ ] Perfil público da oficina (página individual)
- [ ] Sistema de orçamentos:
  - Motorista descreve problema
  - Oficinas recebem e respondem
  - Motorista compara e aceita
- [ ] Sistema de avaliações (estrelas + comentários)
- [ ] Chat motorista ↔ oficina

### 🚀 FASE 4 - MELHORIAS FUTURAS
- [ ] App mobile (React Native)
- [ ] Notificações push
- [ ] Multi-usuários por oficina (funcionários)
- [ ] Assinatura digital em OS
- [ ] Fotos antes/depois do serviço
- [ ] Integração com sistemas de peças (Nakata, etc)
- [ ] API pública

---

## 🛠️ STACK TÉCNICA

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Pagamentos:** MercadoPago (assinatura recorrente)
- **Gráficos:** Recharts
- **Calendário:** react-big-calendar
- **PDF:** jsPDF + jspdf-autotable
- **Deploy:** Vercel
- **Domínio:** instauto.com.br

---

## 🎨 DESIGN SYSTEM

- **Cores principais:** Azul (#2563EB), Amarelo (#FBBF24), Branco
- **Fontes:** Syne (títulos), Plus Jakarta Sans (corpo)
- **Componentes:** shadcn/ui customizados
- **Responsivo:** Mobile-first

---

## 📁 ESTRUTURA DE ROTAS
```
/ - Landing page principal
/oficinas - Landing para oficinas
/motoristas - Landing para motoristas
/login - Login unificado
/cadastro - Cadastro (escolhe tipo: oficina ou motorista)

/oficina - Dashboard da oficina
/oficina/clientes - [PRO] Gestão de clientes
/oficina/veiculos - [PRO] Gestão de veículos
/oficina/ordens - [PRO] Ordens de serviço
/oficina/agenda - [PRO] Calendário/agendamentos
/oficina/estoque - [PRO] Controle de estoque
/oficina/financeiro - [PRO] Receitas e despesas
/oficina/relatorios - [PRO] Relatórios em PDF
/oficina/diagnostico - [PRO] Diagnóstico com IA
/oficina/whatsapp - [PRO] Integração WhatsApp
/oficina/configuracoes - Configurações da oficina
/oficina/planos - Ver planos e fazer upgrade
/oficina/orcamentos - Orçamentos do marketplace

/motorista - Dashboard do motorista
/motorista/garagem - Veículos do motorista
/motorista/orcamentos - Pedir e ver orçamentos
/motorista/historico - Histórico de serviços
/motorista/oficinas - Buscar oficinas
/motorista/configuracoes - Configurações

/oficina/[slug] - Perfil público da oficina (marketplace)
```

---

## 🗄️ TABELAS DO BANCO

### Existentes:
- profiles (usuários)
- workshops (oficinas)
- clients (clientes da oficina)
- vehicles (veículos dos clientes)
- service_orders (ordens de serviço)
- inventory (estoque de peças)
- transactions (financeiro)
- appointments (agendamentos)

### A criar (Fase 3):
- drivers (motoristas)
- driver_vehicles (veículos do motorista)
- quotes (orçamentos do marketplace)
- quote_responses (respostas das oficinas)
- reviews (avaliações)
- messages (chat)

---

## 📝 NOTAS DE DESENVOLVIMENTO

### Variáveis de Ambiente Necessárias:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_APP_URL=

# OpenAI (para Diagnóstico IA)
OPENAI_API_KEY=

# Anthropic Claude (alternativa)
ANTHROPIC_API_KEY=

# WhatsApp Business API (futuro)
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER_ID=
```

### Convenções de Commit:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

---

**Última atualização:** 21/12/2024

