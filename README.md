# 🚗 Instauto - Plataforma de Gestão Automotiva

> Sistema completo para conectar motoristas e oficinas mecânicas

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)

## 🎯 Sobre

O **Instauto** é uma plataforma que conecta motoristas a oficinas mecânicas, facilitando:
- Solicitação de orçamentos
- Gerenciamento de veículos
- Histórico de manutenções
- Chat em tempo real
- Promoções exclusivas

## ✨ Funcionalidades

### 👤 Para Motoristas:
- ✅ Dashboard completo com estatísticas
- ✅ Gerenciamento de veículos (Garagem)
- ✅ Sistema de Frotas (5+ veículos)
- ✅ Busca de oficinas por localização
- ✅ Solicitação de orçamentos
- ✅ Chat em tempo real com oficinas
- ✅ Histórico de manutenções
- ✅ Promoções exclusivas de parceiros
- ✅ Notificações em tempo real
- ✅ Conta 100% gratuita

### 🔧 Para Oficinas:
- ✅ Dashboard com métricas
- ✅ Gestão de orçamentos
- ✅ Chat com clientes
- ✅ Calendário de agendamentos
- ✅ Gestão de clientes
- ✅ Planos PRO com recursos avançados

## 🛠️ Tecnologias

### Frontend:
- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes
- **Framer Motion** - Animações (removido por performance)
- **Recharts** - Gráficos
- **React Hot Toast** - Notificações
- **React Calendar** - Calendário

### Backend:
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Storage

### Integrações:
- **Mercado Pago** - Pagamentos
- **Google OAuth** - Login social
- **Email/Password** - Autenticação tradicional

## 🚀 Instalação

### Pré-requisitos:
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/instauto-v10.git
cd instauto-v10
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 4. Configure o banco de dados:
Execute os scripts SQL na ordem:
1. `docs/SQL_CRIAR_TABELAS_MOTORISTA.sql`
2. `docs/SQL_CRIAR_TABELAS_COMPLETAS.sql`

### 5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
instauto-v10/
├── app/                          # App Router (Next.js 16)
│   ├── (auth)/                   # Rotas de autenticação
│   ├── (dashboard)/              # Dashboard oficina
│   ├── (motorista)/              # Dashboard motorista
│   │   ├── motorista/
│   │   │   ├── page.tsx         # Dashboard principal
│   │   │   ├── garagem/         # Gerenciamento de veículos
│   │   │   ├── frotas/          # Sistema de frotas
│   │   │   ├── oficinas/        # Busca de oficinas
│   │   │   ├── orcamentos/      # Orçamentos
│   │   │   ├── historico/       # Histórico
│   │   │   ├── promocoes/       # Promoções
│   │   │   └── chat/            # Chat com oficinas
│   │   └── layout.tsx           # Layout motorista
│   ├── api/                     # API Routes
│   └── auth/                    # Callbacks OAuth
├── components/                   # Componentes React
│   ├── layout/                  # Header, Footer, etc
│   ├── motorista/               # Componentes motorista
│   ├── oficina/                 # Componentes oficina
│   ├── notifications/           # Sistema de notificações
│   └── ui/                      # Componentes UI (Shadcn)
├── contexts/                     # React Contexts
│   └── AuthContext.tsx          # Contexto de autenticação
├── lib/                         # Utilitários
│   └── supabase.ts              # Cliente Supabase
├── types/                       # TypeScript types
│   └── database.ts              # Tipos do banco
├── docs/                        # Documentação
│   ├── SQL_CRIAR_TABELAS_MOTORISTA.sql
│   ├── SQL_CRIAR_TABELAS_COMPLETAS.sql
│   └── LIMPEZA_COMPLETA.md
└── public/                      # Arquivos estáticos
    └── images/                  # Imagens e logos
```

## 📚 Documentação

### Scripts SQL:
- **`SQL_CRIAR_TABELAS_MOTORISTA.sql`** - Tabelas base (motoristas, veículos, orçamentos)
- **`SQL_CRIAR_TABELAS_COMPLETAS.sql`** - Tabelas avançadas (promoções, chat, notificações)

### Guias:
- **`LIMPEZA_COMPLETA.md`** - Histórico de refatoração do projeto

## 🔐 Autenticação

### Tipos de Usuário:
1. **Motorista** - Conta gratuita
2. **Oficina** - Planos Free e PRO

### Fluxo de Autenticação:
```
1. Cadastro/Login → 2. Verificação → 3. Criação de Profile → 4. Redirecionamento
```

### Rotas Protegidas:
- `/motorista/*` - Apenas motoristas autenticados
- `/oficina/*` - Apenas oficinas autenticadas

## 📊 Banco de Dados

### Tabelas Principais:
- `profiles` - Dados dos usuários
- `motorists` - Dados específicos de motoristas
- `workshops` - Dados de oficinas
- `motorist_vehicles` - Veículos dos motoristas
- `quotes` - Orçamentos
- `maintenance_history` - Histórico de manutenções
- `promotions` - Promoções de parceiros
- `conversations` - Conversas do chat
- `messages` - Mensagens
- `notifications` - Notificações do sistema

### RLS (Row Level Security):
Todas as tabelas possuem políticas de segurança configuradas.

## 🎨 Design System

### Cores:
- **Primária**: Azul (`#3B82F6`)
- **Secundária**: Amarelo (`#FCD34D`)
- **Sucesso**: Verde (`#10B981`)
- **Erro**: Vermelho (`#EF4444`)

### Componentes UI:
Utilizamos **Shadcn UI** com customizações.

## 🚀 Deploy

### Vercel (Recomendado):
```bash
vercel --prod
```

### Variáveis de Ambiente (Vercel):
Configure as mesmas variáveis do `.env.local` no painel da Vercel.

## 📈 Performance

- ✅ Server-side rendering (SSR)
- ✅ Static generation onde possível
- ✅ Image optimization (Next.js)
- ✅ Code splitting automático
- ✅ Lazy loading de componentes

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Equipe

- **Desenvolvimento**: Bruno
- **Design**: Bruno
- **Backend**: Supabase

## 📞 Contato

- **Email**: contato@instauto.com.br
- **WhatsApp**: (43) 99185-2779
- **Site**: [www.instauto.com.br](https://www.instauto.com.br)

---

**Feito com ❤️ por Instauto**
