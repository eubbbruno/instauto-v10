# 📁 Estrutura do Projeto - Instauto V10

## 🎯 Visão Geral

```
instauto-v10/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── layout.tsx           # Layout das páginas de auth
│   │   ├── login/               # Página de login
│   │   │   └── page.tsx
│   │   └── cadastro/            # Página de cadastro
│   │       └── page.tsx
│   │
│   ├── (dashboard)/             # Grupo de rotas protegidas
│   │   ├── layout.tsx           # Layout com sidebar e proteção
│   │   └── oficina/             # Dashboard da oficina
│   │       ├── page.tsx         # Dashboard principal
│   │       ├── clientes/        # CRUD de clientes
│   │       │   └── page.tsx
│   │       ├── veiculos/        # CRUD de veículos (TODO)
│   │       │   └── page.tsx
│   │       ├── ordens/          # CRUD de ordens de serviço (TODO)
│   │       │   └── page.tsx
│   │       └── configuracoes/   # Configurações da oficina (TODO)
│   │           └── page.tsx
│   │
│   ├── auth/                    # Callbacks de autenticação
│   │   └── callback/
│   │       └── route.ts         # Callback OAuth
│   │
│   ├── api/                     # API Routes (futuro)
│   ├── globals.css              # Estilos globais + Tailwind
│   ├── layout.tsx               # Layout raiz com AuthProvider
│   └── page.tsx                 # Landing page
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   │
│   ├── auth/                    # Componentes de autenticação (futuro)
│   └── dashboard/               # Componentes do dashboard (futuro)
│
├── contexts/                     # React Contexts
│   └── AuthContext.tsx          # Context de autenticação global
│
├── lib/                         # Utilitários e configurações
│   ├── supabase.ts              # Cliente Supabase
│   └── utils.ts                 # Funções utilitárias (cn)
│
├── types/                       # TypeScript types
│   └── database.ts              # Types do banco de dados
│
├── supabase/                    # Configurações Supabase
│   └── schema.sql               # Schema completo do banco
│
├── .env.local                   # Variáveis de ambiente (criar)
├── .env.example                 # Exemplo de variáveis
├── .gitignore                   # Arquivos ignorados pelo Git
├── next.config.ts               # Configuração Next.js
├── package.json                 # Dependências do projeto
├── postcss.config.mjs           # Configuração PostCSS
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
├── README.md                    # Documentação principal
├── SETUP_SUPABASE.md           # Guia de configuração Supabase
└── ESTRUTURA_PROJETO.md        # Este arquivo
```

## 📦 Dependências Principais

### Produção
- **next**: ^15.0.3 - Framework React
- **react**: ^18.3.1 - Biblioteca React
- **@supabase/supabase-js**: ^2.39.3 - Cliente Supabase
- **@supabase/ssr**: ^0.5.1 - SSR para Supabase
- **lucide-react**: ^0.460.0 - Ícones
- **tailwindcss**: ^3.4.1 - CSS utility-first
- **@radix-ui/react-***: Componentes acessíveis

### Desenvolvimento
- **typescript**: ^5 - Tipagem estática
- **eslint**: ^8 - Linter
- **autoprefixer**: ^10 - PostCSS plugin

## 🗂️ Organização por Funcionalidade

### 1. Autenticação (`app/(auth)`)
- ✅ Login com email/senha
- ✅ Cadastro de oficinas
- ✅ OAuth Google
- ✅ Proteção de rotas
- ✅ Context global de autenticação

### 2. Dashboard (`app/(dashboard)/oficina`)
- ✅ Dashboard com estatísticas reais
- ✅ CRUD de clientes completo
- 🔄 CRUD de veículos (próximo)
- 🔄 CRUD de ordens de serviço (próximo)
- 🔄 Configurações da oficina (próximo)

### 3. Componentes UI (`components/ui`)
Componentes shadcn/ui customizados:
- Button, Card, Input, Label
- Dialog (modais)
- Table (tabelas)
- Textarea

### 4. Banco de Dados (`supabase/schema.sql`)
Tabelas principais:
- **profiles**: Usuários do sistema
- **workshops**: Oficinas cadastradas
- **clients**: Clientes das oficinas
- **vehicles**: Veículos dos clientes
- **service_orders**: Ordens de serviço

## 🔐 Segurança

### Row Level Security (RLS)
Todas as tabelas possuem RLS habilitado com policies que garantem:
- Usuários só acessam seus próprios dados
- Oficinas só veem seus clientes/veículos/OS
- Proteção automática contra acesso não autorizado

### Autenticação
- JWT tokens gerenciados pelo Supabase
- Sessões persistentes
- Refresh automático de tokens
- Logout seguro

## 🎨 Design System

### Cores (Tailwind)
- **Primary**: Blue (oficinas)
- **Success**: Green (ações positivas)
- **Warning**: Yellow (alertas)
- **Danger**: Red (ações destrutivas)

### Componentes
- Design system baseado em shadcn/ui
- Componentes acessíveis (Radix UI)
- Responsivo por padrão
- Dark mode ready (configurado)

## 📊 Fluxo de Dados

```
1. Usuário faz login
   ↓
2. Supabase Auth valida credenciais
   ↓
3. AuthContext armazena user + profile
   ↓
4. Dashboard carrega dados da oficina
   ↓
5. Componentes fazem queries diretas ao Supabase
   ↓
6. RLS garante segurança dos dados
```

## 🚀 Próximas Implementações

### Fase 1 (Atual)
- ✅ Setup do projeto
- ✅ Autenticação completa
- ✅ Dashboard com stats
- ✅ CRUD de clientes
- 🔄 CRUD de veículos
- 🔄 CRUD de ordens de serviço
- 🔄 Configurações da oficina

### Fase 2 (Futuro)
- 🔄 Planos e pagamentos (Stripe)
- 🔄 Relatórios avançados
- 🔄 Marketplace motorista ↔ oficina
- 🔄 Sistema de avaliações
- 🔄 Agendamento online
- 🔄 Notificações (email/push)

## 📝 Convenções de Código

### TypeScript
- Tipos explícitos sempre que possível
- Interfaces para objetos complexos
- Enums para valores fixos

### Componentes
- Componentes funcionais com hooks
- Props tipadas com TypeScript
- Nomes descritivos e claros

### Arquivos
- `page.tsx`: Páginas Next.js
- `layout.tsx`: Layouts Next.js
- `route.ts`: API routes
- Componentes em PascalCase
- Utilitários em camelCase

### Estilo
- Tailwind CSS para estilização
- Classes utilitárias
- Componentes reutilizáveis
- Mobile-first

## 🧪 Testes (Futuro)

Planejado:
- Jest + React Testing Library
- Testes unitários de componentes
- Testes de integração
- E2E com Playwright

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

