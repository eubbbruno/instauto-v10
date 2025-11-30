# 🚗 Instauto V10

> Sistema completo de gestão para oficinas mecânicas

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)](https://supabase.com/)

---

## 📋 Índice

- [Sobre](#-sobre)
- [Stack](#-stack)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Uso](#-uso)
- [Estrutura](#-estrutura)
- [Documentação](#-documentação)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre

O **Instauto V10** é um SaaS completo para gestão de oficinas mecânicas, desenvolvido com as tecnologias mais modernas do mercado. Oferece controle total sobre clientes, veículos e ordens de serviço, com planos gratuitos e pagos.

### Por que usar o Instauto?

✅ **Gratuito para começar** - Até 10 clientes e 30 OS/mês  
✅ **Fácil de usar** - Interface intuitiva e moderna  
✅ **Seguro** - Autenticação robusta e dados protegidos  
✅ **Completo** - Tudo que sua oficina precisa em um só lugar  
✅ **Escalável** - Cresce junto com seu negócio  

---

## 🚀 Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 3](https://tailwindcss.com/)** - Estilização utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis
- **[Lucide Icons](https://lucide.dev/)** - Ícones modernos

### Backend
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL (Database)
  - Auth (Autenticação)
  - Row Level Security (Segurança)
  - Real-time (Futuro)

### Deploy
- **[Vercel](https://vercel.com/)** - Hospedagem e CI/CD

---

## ✨ Funcionalidades

### ✅ Implementado (Fase 1)

#### 🔐 Autenticação
- Login com email/senha
- Cadastro de oficinas
- OAuth Google
- Recuperação de senha
- Proteção de rotas

#### 📊 Dashboard
- Estatísticas em tempo real
- Total de clientes
- Total de veículos
- Ordens de serviço (pendentes/andamento/concluídas)
- Faturamento total
- Ações rápidas

#### 👥 Gestão de Clientes
- Listar todos os clientes
- Buscar por nome, email, telefone ou CPF
- Criar novo cliente
- Editar dados do cliente
- Excluir cliente
- Visualizar histórico

#### 🚗 Gestão de Veículos (Em desenvolvimento)
- Cadastro de veículos
- Vincular com cliente
- Histórico de manutenções

#### 📝 Ordens de Serviço (Em desenvolvimento)
- Criar nova OS
- Editar OS
- Finalizar OS
- Cancelar OS
- Calcular valores
- Imprimir OS

### 🔄 Próximas Funcionalidades (Fase 2)

- 💳 Planos e pagamentos (Stripe)
- 📈 Relatórios avançados
- 🏪 Marketplace motorista ↔ oficina
- ⭐ Sistema de avaliações
- 📅 Agendamento online
- 🔔 Notificações (email/push)
- 📱 App mobile (React Native)

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (gratuita)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/instauto-v10.git
cd instauto-v10

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuração

### 1. Supabase

Siga o guia completo em **[docs/SETUP_SUPABASE.md](./docs/SETUP_SUPABASE.md)**

Resumo:
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `docs/database-schema.sql`
3. Configure OAuth (opcional)
4. Copie as credenciais

### 2. Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Deploy na Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça deploy
vercel

# Configure as variáveis de ambiente no dashboard da Vercel
```

---

## 🎮 Uso

### Desenvolvimento

```bash
# Iniciar servidor
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linter
npm run lint
```

### Comandos Úteis

Veja todos os comandos em **[docs/COMANDOS_UTEIS.md](./docs/COMANDOS_UTEIS.md)**

---

## 📁 Estrutura

```
instauto-v10/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rotas de autenticação
│   │   ├── login/           # Página de login
│   │   └── cadastro/        # Página de cadastro
│   ├── (dashboard)/         # Rotas protegidas
│   │   └── oficina/         # Dashboard da oficina
│   │       ├── clientes/    # CRUD de clientes
│   │       ├── veiculos/    # CRUD de veículos
│   │       └── ordens/      # CRUD de OS
│   └── page.tsx             # Landing page
├── components/              # Componentes React
│   └── ui/                  # Componentes shadcn/ui
├── contexts/                # React Contexts
│   └── AuthContext.tsx      # Context de autenticação
├── lib/                     # Utilitários
│   ├── supabase.ts         # Cliente Supabase
│   └── utils.ts            # Funções auxiliares
├── types/                   # TypeScript types
│   └── database.ts         # Types do banco
└── supabase/               # Configurações Supabase
    └── schema.sql          # Schema do banco
```

Veja detalhes em **[docs/ESTRUTURA_PROJETO.md](./docs/ESTRUTURA_PROJETO.md)**

---

## 📚 Documentação

- **[README.md](./README.md)** - Este arquivo
- **[docs/SETUP_SUPABASE.md](./docs/SETUP_SUPABASE.md)** - Guia de configuração do Supabase
- **[docs/database-schema.sql](./docs/database-schema.sql)** - Schema SQL completo
- **[docs/ESTRUTURA_PROJETO.md](./docs/ESTRUTURA_PROJETO.md)** - Estrutura detalhada do projeto
- **[docs/STATUS_PROJETO.md](./docs/STATUS_PROJETO.md)** - Status atual do desenvolvimento
- **[docs/COMANDOS_UTEIS.md](./docs/COMANDOS_UTEIS.md)** - Comandos úteis para desenvolvimento

---

## 🗺️ Roadmap

### ✅ Fase 1 - MVP (Atual)
- [x] Setup do projeto
- [x] Autenticação completa
- [x] Dashboard com estatísticas
- [x] CRUD de clientes
- [ ] CRUD de veículos
- [ ] CRUD de ordens de serviço
- [ ] Configurações da oficina

### 🔄 Fase 2 - Monetização
- [ ] Integração Stripe
- [ ] Planos FREE e PRO
- [ ] Limites de uso
- [ ] Billing dashboard

### 🚀 Fase 3 - Marketplace
- [ ] Perfil de motorista
- [ ] Busca de oficinas
- [ ] Sistema de avaliações
- [ ] Agendamento online

### 📱 Fase 4 - Mobile
- [ ] App React Native
- [ ] Notificações push
- [ ] Offline-first

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 👨‍💻 Autor

**Bruno**

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)

---

## 📞 Suporte

- 📧 Email: suporte@instauto.com
- 💬 Discord: [Link do Discord]
- 📖 Docs: [Link da Documentação]

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

Feito com ❤️ para revolucionar a gestão de oficinas mecânicas

</div>

