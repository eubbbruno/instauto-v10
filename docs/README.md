# 📚 Documentação - Instauto V10

> Central de documentação do projeto

## 📋 Índice de Documentos

### 🚀 **Início Rápido**
- **[README Principal](../README.md)** - Visão geral do projeto
- **[STATUS_PROJETO_V10.md](./STATUS_PROJETO_V10.md)** - Status atual de desenvolvimento

### 🗄️ **Banco de Dados**
- **[SQL_CRIAR_TABELAS_MOTORISTA.sql](./SQL_CRIAR_TABELAS_MOTORISTA.sql)** - Tabelas base (motoristas, veículos, orçamentos)
- **[SQL_CRIAR_TABELAS_COMPLETAS.sql](./SQL_CRIAR_TABELAS_COMPLETAS.sql)** - Tabelas avançadas (promoções, chat, notificações)

### 📝 **Histórico**
- **[LIMPEZA_COMPLETA.md](./LIMPEZA_COMPLETA.md)** - Refatoração e limpeza do projeto

### 💡 **Planejamento**
- **[IDEIAS_MELHORIAS.md](./IDEIAS_MELHORIAS.md)** - Brainstorming de funcionalidades

---

## 🎯 **Como Usar Esta Documentação**

### 1️⃣ **Novo no Projeto?**
Comece pelo [README Principal](../README.md) para entender a estrutura.

### 2️⃣ **Configurar Banco de Dados?**
Execute os scripts SQL na ordem:
1. `SQL_CRIAR_TABELAS_MOTORISTA.sql`
2. `SQL_CRIAR_TABELAS_COMPLETAS.sql`

### 3️⃣ **Ver Funcionalidades?**
Consulte [STATUS_PROJETO_V10.md](./STATUS_PROJETO_V10.md)

### 4️⃣ **Ideias Futuras?**
Veja [IDEIAS_MELHORIAS.md](./IDEIAS_MELHORIAS.md)

---

## 📊 **Estrutura do Banco de Dados**

### Tabelas Principais:
```
profiles (usuários)
├── motorists (motoristas)
│   ├── motorist_vehicles (veículos)
│   ├── quotes (orçamentos)
│   ├── maintenance_history (histórico)
│   ├── conversations (conversas)
│   └── notifications (notificações)
└── workshops (oficinas)
    ├── quotes (orçamentos recebidos)
    ├── conversations (conversas)
    └── notifications (notificações)

promotions (promoções globais)
messages (mensagens do chat)
```

---

## 🔐 **Autenticação**

### Fluxo:
```
1. Cadastro/Login
   ↓
2. Supabase Auth
   ↓
3. Criação de Profile
   ↓
4. Criação de Motorist/Workshop
   ↓
5. Redirecionamento para Dashboard
```

### Tipos de Usuário:
- **Motorista**: Conta gratuita
- **Oficina**: Planos Free e PRO

---

## 🎨 **Design System**

### Cores:
- **Azul**: `#3B82F6` (primária)
- **Amarelo**: `#FCD34D` (secundária)
- **Verde**: `#10B981` (sucesso)
- **Vermelho**: `#EF4444` (erro)

### Componentes:
- Shadcn UI (Radix)
- Tailwind CSS
- Lucide Icons

---

## 📦 **Dependências Principais**

### Frontend:
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 3.4

### Backend:
- Supabase (PostgreSQL + Auth + Real-time)

### UI/UX:
- Shadcn UI
- React Hot Toast
- React Calendar
- Recharts

---

## 🚀 **Deploy**

### Produção:
- **Plataforma**: Vercel
- **Domínio**: www.instauto.com.br
- **SSL**: Configurado

### Variáveis de Ambiente:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📞 **Suporte**

### Contato:
- **Email**: contato@instauto.com.br
- **WhatsApp**: (43) 99185-2779

### Reportar Bugs:
Abra uma issue no GitHub ou entre em contato.

---

## 📈 **Estatísticas do Projeto**

### Código:
- **Arquivos**: ~50 TypeScript
- **Componentes**: ~30 React
- **Páginas**: ~15
- **Linhas**: ~8.000+

### Banco de Dados:
- **Tabelas**: 10
- **RLS Policies**: ~30
- **Triggers**: 5

---

**✨ Documentação em constante atualização!**

*Última atualização: 05/01/2025*
