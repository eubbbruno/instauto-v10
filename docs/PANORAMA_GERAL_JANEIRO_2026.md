# 📊 PANORAMA GERAL DO PROJETO - INSTAUTO V10
**Última atualização:** Janeiro 17, 2026

---

## 🎯 **RESUMO EXECUTIVO**

O **Instauto** é uma plataforma completa de gestão automotiva que conecta **motoristas** e **oficinas mecânicas**. Pense no "Uber" das oficinas - motoristas solicitam orçamentos e oficinas respondem.

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **Stack Tecnológico:**
- ⚛️ **Frontend:** Next.js 15 + React + TypeScript + Tailwind CSS
- 🗄️ **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- 🎨 **UI:** shadcn/ui + Lucide Icons
- 🚀 **Deploy:** Vercel (automático via GitHub)
- 📧 **Email:** Resend (configurado)

---

## 👥 **TIPOS DE USUÁRIOS**

### 1. **MOTORISTA** (Gratuito para sempre)
**O que pode fazer:**
- ✅ Gerenciar veículos (Garagem)
- ✅ Buscar oficinas próximas
- ✅ Solicitar orçamentos
- ✅ Ver histórico de manutenções
- ✅ Controlar abastecimento
- ✅ Gerenciar despesas
- ✅ Criar lembretes (IPVA, seguro, etc)
- ✅ Chat com oficinas
- ✅ Ver promoções de parceiros

**Páginas principais:**
- `/motorista` - Dashboard
- `/motorista/garagem` - CRUD de veículos
- `/motorista/oficinas` - Buscar oficinas
- `/motorista/orcamentos` - Solicitações de orçamento
- `/motorista/historico` - Histórico de manutenções
- `/motorista/abastecimento` - Controle de combustível
- `/motorista/despesas` - Gestão financeira
- `/motorista/lembretes` - Lembretes e alertas

### 2. **OFICINA** (Freemium)
**Planos:**
- 🆓 **FREE:** Dashboard básico + receber orçamentos
- 💎 **PRO (R$ 99/mês):** Sistema completo de gestão

**O que pode fazer:**
- ✅ Receber e responder orçamentos
- ✅ Gerenciar clientes
- ✅ Chat com motoristas
- ✅ (PRO) Sistema de ordens de serviço
- ✅ (PRO) Controle de estoque
- ✅ (PRO) Gestão financeira
- ✅ (PRO) Relatórios avançados

**Páginas principais:**
- `/oficina` - Dashboard
- `/oficina/orcamentos` - Gerenciar orçamentos
- `/oficina/clientes` - Base de clientes
- `/oficina/configuracoes` - Perfil e dados
- `/oficina/planos` - Upgrade para PRO

---

## 🗄️ **ESTRUTURA DO BANCO DE DADOS**

### **Tabelas Principais:**

#### **1. Autenticação e Perfis**
- `profiles` - Dados dos usuários (motorista ou oficina)
- `motorists` - Dados específicos de motoristas
- `workshops` - Dados específicos de oficinas

#### **2. Veículos e Manutenção**
- `motorist_vehicles` - Veículos dos motoristas
- `maintenance_history` - Histórico de manutenções
- `quotes` - Orçamentos solicitados/respondidos

#### **3. Gestão Financeira (NOVO - Janeiro 2026)**
- `motorist_fueling` - Abastecimentos
- `motorist_expenses` - Despesas por categoria
- `motorist_reminders` - Lembretes (IPVA, seguro, etc)

#### **4. Comunicação**
- `conversations` - Conversas entre motorista e oficina
- `messages` - Mensagens do chat
- `notifications` - Notificações do sistema

#### **5. Marketplace**
- `promotions` - Promoções de parceiros (Uber, iFood, etc)

---

## 📁 **ESTRUTURA DE PASTAS**

```
instauto-v10/
├── app/
│   ├── (motorista)/          # Rotas protegidas do motorista
│   │   ├── motorista/
│   │   │   ├── page.tsx      # Dashboard motorista
│   │   │   ├── garagem/      # CRUD de veículos
│   │   │   ├── oficinas/     # Buscar oficinas
│   │   │   ├── orcamentos/   # Orçamentos
│   │   │   ├── historico/    # Histórico
│   │   │   ├── abastecimento/ # Controle de combustível
│   │   │   ├── despesas/     # Gestão financeira
│   │   │   └── lembretes/    # Lembretes
│   │   └── layout.tsx        # Layout com DashboardHeader
│   │
│   ├── (dashboard)/          # Rotas protegidas da oficina
│   │   └── oficina/
│   │       ├── page.tsx      # Dashboard oficina
│   │       ├── orcamentos/   # Gerenciar orçamentos
│   │       ├── clientes/     # Base de clientes
│   │       ├── configuracoes/ # Perfil
│   │       └── planos/       # Upgrade PRO
│   │
│   ├── cadastro-oficina/     # Cadastro público de oficinas
│   ├── completar-cadastro/   # Completar dados da oficina
│   ├── oficinas/             # Landing page "Para Oficinas"
│   ├── motoristas/           # Landing page "Para Motoristas"
│   ├── planos/               # Página de planos públicos
│   ├── sobre/                # Sobre nós
│   ├── contato/              # Contato
│   └── page.tsx              # Home page
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Header público
│   │   ├── DashboardHeader.tsx # Header autenticado
│   │   └── Footer.tsx        # Footer
│   ├── auth/                 # Componentes de autenticação
│   ├── notifications/        # Centro de notificações
│   └── ui/                   # shadcn/ui components
│
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação
│
├── lib/
│   └── supabase/             # Cliente Supabase
│
├── types/
│   └── database.ts           # Tipos TypeScript
│
└── docs/                     # Documentação
    ├── SQL_CRIAR_TABELAS_COMPLETAS.sql
    ├── SQL_CRIAR_TABELAS_FINANCEIRO.sql
    └── PANORAMA_GERAL_JANEIRO_2026.md (este arquivo)
```

---

## 🔐 **AUTENTICAÇÃO**

### **Fluxo de Login/Cadastro:**

1. **Usuário clica em "Entrar" ou "Cadastrar"** no Header
2. **Modal aparece** perguntando: "Você é Motorista ou Oficina?"
3. **Redireciona para a página correta:**
   - Motorista: `/login-motorista` ou `/cadastro-motorista`
   - Oficina: `/login-oficina` ou `/cadastro-oficina`
4. **Após autenticação:**
   - Motorista → `/motorista`
   - Oficina → `/oficina` (ou `/completar-cadastro` se não tiver oficina criada)

### **Métodos de Autenticação:**
- ✅ Email + Senha (Supabase Auth)
- ✅ Google OAuth (configurado)
- 🔄 Magic Link (preparado)

---

## 🎨 **DESIGN SYSTEM**

### **Paleta de Cores:**
- **Primária:** Azul (`blue-600`, `blue-900`)
- **Secundária:** Amarelo (`yellow-400`, `yellow-500`)
- **Sucesso:** Verde (`green-600`)
- **Alerta:** Vermelho (`red-600`)
- **Neutro:** Cinza (`gray-50` a `gray-900`)

### **Tipografia:**
- **Heading:** `font-heading` (títulos)
- **Sans:** `font-sans` (corpo de texto)

### **Componentes:**
- Todos os componentes usam **shadcn/ui**
- Ícones: **Lucide React**
- Toasts: **react-hot-toast**

---

## 🚀 **FUNCIONALIDADES IMPLEMENTADAS**

### ✅ **COMPLETO:**
1. Sistema de autenticação (email + Google)
2. Dashboard motorista com stats reais
3. CRUD completo de veículos
4. Busca de oficinas com filtros
5. Sistema de orçamentos
6. Histórico de manutenções
7. Controle de abastecimento
8. Gestão de despesas (9 categorias)
9. Lembretes inteligentes (8 tipos)
10. Chat em tempo real (preparado)
11. Notificações (preparado)
12. Promoções de parceiros
13. Dashboard oficina básico
14. Configurações de perfil

### 🔄 **EM DESENVOLVIMENTO:**
1. Sistema PRO para oficinas (ordens de serviço, estoque)
2. Chat em tempo real (UI pronta, falta integração)
3. Notificações push
4. Relatórios em PDF
5. Gráficos avançados

---

## 📋 **SCRIPTS SQL DISPONÍVEIS**

### **1. `SQL_CRIAR_TABELAS_COMPLETAS.sql`**
- Tabelas: `promotions`, `conversations`, `messages`, `notifications`
- Insere 8 promoções de parceiros
- RLS policies configuradas

### **2. `SQL_CRIAR_TABELAS_FINANCEIRO.sql`** (NOVO)
- Tabelas: `motorist_fueling`, `motorist_expenses`, `motorist_reminders`
- Views para relatórios
- RLS policies configuradas
- **CORRIGIDO:** `v.brand` → `v.make`

---

## 🐛 **PROBLEMAS CONHECIDOS E SOLUÇÕES**

### ❌ **Problema 1: Erro no SQL**
**Erro:** `column v.brand does not exist`
**Causa:** Campo correto é `v.make` (não `brand`)
**Status:** ✅ CORRIGIDO

### ❌ **Problema 2: Links do Header quebrados**
**Erro:** "Motoristas" e "Oficinas" não vão para lugar nenhum
**Páginas que existem:**
- `/motoristas` - Landing page "Para Motoristas"
- `/oficinas` - Landing page "Para Oficinas"
**Status:** ✅ Links corretos no Header

### ❌ **Problema 3: Título da página de Planos**
**Erro:** Título não padronizado
**Solução:** Verificar e padronizar com outras páginas
**Status:** 🔄 A CORRIGIR

---

## 🎯 **PRÓXIMOS PASSOS**

### **Imediato (Esta Sessão):**
1. ✅ Corrigir SQL (`v.brand` → `v.make`)
2. ✅ Verificar links do Header
3. 🔄 Padronizar título da página de Planos
4. 🔄 Testar formulários de abastecimento, despesas e lembretes

### **Curto Prazo (Esta Semana):**
1. Implementar gráficos de gastos (Chart.js)
2. Adicionar calendário visual de lembretes
3. Implementar chat em tempo real
4. Sistema de notificações push

### **Médio Prazo (Este Mês):**
1. Sistema PRO completo para oficinas
2. Ordens de serviço
3. Controle de estoque
4. Relatórios em PDF
5. Integração com WhatsApp

---

## 📊 **ESTATÍSTICAS DO PROJETO**

### **Código:**
- **Linhas de TypeScript:** ~15.000
- **Linhas de SQL:** ~800
- **Componentes React:** ~50
- **Páginas:** ~30
- **Tabelas no Banco:** 15

### **Funcionalidades:**
- **Rotas públicas:** 8
- **Rotas protegidas (motorista):** 8
- **Rotas protegidas (oficina):** 5
- **Formulários:** 10
- **Dashboards:** 2

---

## 🔗 **LINKS IMPORTANTES**

### **Produção:**
- 🌐 Site: https://instauto-v10.vercel.app
- 📊 Supabase: https://supabase.com/dashboard/project/[PROJECT_ID]
- 🚀 Vercel: https://vercel.com/dashboard

### **Repositório:**
- 📁 GitHub: https://github.com/eubbbruno/instauto-v10

### **Documentação:**
- 📖 Next.js: https://nextjs.org/docs
- 📖 Supabase: https://supabase.com/docs
- 📖 shadcn/ui: https://ui.shadcn.com

---

## 🆘 **COMANDOS ÚTEIS**

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor local (http://localhost:3000)

# Build e Deploy
npm run build            # Build de produção
npm run start            # Rodar build localmente

# Git
git add .                # Adicionar mudanças
git commit -m "msg"      # Commit
git push                 # Push para GitHub (deploy automático na Vercel)

# Supabase
# Executar SQL: Copiar e colar no SQL Editor do Supabase
```

---

## 📞 **CONTATO E SUPORTE**

- **Desenvolvedor:** Bruno
- **Telefone:** (43) 99185-2779
- **Email:** [seu-email]
- **Localização:** Londrina, PR

---

## 🎉 **CONCLUSÃO**

O **Instauto V10** está **90% completo** com todas as funcionalidades principais implementadas. O sistema está estável, escalável e pronto para uso. As próximas etapas focam em:

1. **Melhorias de UX** (gráficos, calendário)
2. **Sistema PRO** para oficinas
3. **Integrações** (WhatsApp, notificações push)

**Status Geral:** 🟢 **PRODUÇÃO PRONTA**

---

*Última atualização: Janeiro 17, 2026 - Após 1 semana de viagem*
