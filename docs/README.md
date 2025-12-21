# 📚 DOCUMENTAÇÃO DO INSTAUTO V10

## 📋 Índice de Documentos

### 🎯 **Planejamento e Visão**
- **[ROADMAP.md](./ROADMAP.md)** - Documento oficial do projeto, modelo de negócio, fases e status

### 🚀 **Setup e Configuração**
- **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** - Guia completo de configuração do Supabase
- **[COMO_USAR_SCHEMA.md](./COMO_USAR_SCHEMA.md)** - Como executar o schema SQL no Supabase

### 🧪 **Desenvolvimento**
- **[GUIA_TESTE.md](./GUIA_TESTE.md)** - Guia para testar funcionalidades
- **[COMANDOS_UTEIS.md](./COMANDOS_UTEIS.md)** - Comandos úteis para desenvolvimento

### 🗄️ **Banco de Dados**
- **[database-schema.sql](./database-schema.sql)** - Schema SQL completo (executar primeiro)
- **[database-migration-payments.sql](./database-migration-payments.sql)** - Migration para pagamentos MercadoPago
- **[database-migration-inventory.sql](./database-migration-inventory.sql)** - Migration para estoque
- **[database-migration-fase2a.sql](./database-migration-fase2a.sql)** - Migration para fase 2A (appointments, transactions)
- **[database-migration-diagnostics.sql](./database-migration-diagnostics.sql)** - Migration para diagnósticos com IA

---

## 🚀 Quick Start

### 1. Clone e Instale
```bash
git clone https://github.com/eubbbruno/instauto-v10.git
cd instauto-v10
npm install
```

### 2. Configure Variáveis de Ambiente
Crie `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenAI (para Diagnóstico IA)
OPENAI_API_KEY=sk-...
```

### 3. Configure o Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os SQLs na ordem:
   - `database-schema.sql` (primeiro)
   - `database-migration-payments.sql`
   - `database-migration-inventory.sql`
   - `database-migration-fase2a.sql`
   - `database-migration-diagnostics.sql`
3. Configure OAuth Google (opcional)

### 4. Rode o Projeto
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📊 Status Atual

### ✅ FASE 1 - COMPLETO
- Sistema de gestão completo
- Autenticação e OAuth
- Dashboard, clientes, veículos, OS
- Estoque, financeiro, agenda
- Planos FREE vs PRO
- Pagamentos MercadoPago

### 🔄 FASE 2A - EM ANDAMENTO (33%)
- ✅ Diagnóstico com IA (OpenAI GPT-4)
- ⏳ Relatórios em PDF (próximo)
- ⏳ Integração WhatsApp

### 📋 FASE 2B - PLANEJADO
- Landing pages profissionais
- SEO e marketing

### 🚗 FASE 3 - PLANEJADO
- Marketplace motorista ↔ oficina
- Sistema de orçamentos
- Avaliações e chat

---

## 🛠️ Stack Técnica

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Pagamentos:** MercadoPago
- **IA:** OpenAI GPT-4
- **PDF:** jsPDF
- **Gráficos:** Recharts
- **Deploy:** Vercel

---

## 📞 Suporte

- **Documentação:** Leia os arquivos nesta pasta
- **Issues:** Abra uma issue no GitHub
- **Email:** suporte@instauto.com.br

---

**Última atualização:** 21/12/2024

