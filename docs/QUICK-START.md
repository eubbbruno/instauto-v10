# 🚀 Quick Start - Instauto

Guia rápido para continuar o desenvolvimento do projeto.

---

## ⚡ Início Rápido

```bash
# Clonar repositório
git clone https://github.com/eubbbruno/instauto-v10.git
cd instauto-v10

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copiar .env.local (já existe no projeto)

# Rodar em desenvolvimento
npm run dev

# Abrir: http://localhost:3000
```

---

## 📋 Checklist Inicial

### 1. Verificar Banco de Dados
- [ ] Acessar Supabase Dashboard (cajmcennpocqcrffzoms.supabase.co)
- [ ] Executar `supabase/financeiro-tables.sql`
- [ ] Executar `supabase/service-orders-tables.sql`
- [ ] Verificar se todas as tabelas existem (ver PENDING-SQL.md)

### 2. Testar Funcionalidades
- [ ] Login/Cadastro (email e Google)
- [ ] Dashboard oficina
- [ ] Dashboard motorista
- [ ] Módulo Financeiro (nova transação)
- [ ] Módulo OS (nova ordem)
- [ ] Buscar oficinas
- [ ] Solicitar orçamento

### 3. Verificar Integrações
- [ ] Emails (Resend) - testar envio
- [ ] Pagamentos (MercadoPago) - testar webhook
- [ ] IA Diagnóstico (OpenAI) - testar análise
- [ ] Google OAuth - testar login

---

## 🗂️ Documentação Importante

Ler antes de começar:

1. **CONTEXT-CLAUDE-CODE.md** - Contexto completo do projeto
2. **PENDING-SQL.md** - SQLs que precisam ser executados
3. **ROADMAP.md** - Funcionalidades planejadas
4. **BUGS-PENDENTES.md** - Bugs conhecidos
5. **DESIGN-SYSTEM.md** - Padrões de design

---

## 🎯 Funcionalidades Prontas

### ✅ Completo
- Autenticação (email + Google)
- Dashboard oficina e motorista
- Sistema de orçamentos
- Sistema de avaliações
- Buscar oficinas
- Perfil público
- Notificações
- **Módulo Financeiro** (receitas, despesas, contas)
- **Módulo Ordens de Serviço** (CRUD, checklist, histórico)
- Design System com animações
- Mobile responsivo

### 🔄 Parcial
- Diagnóstico IA (funciona mas pode melhorar)
- Agenda (placeholder)
- Estoque (placeholder)
- Tab Itens da OS (placeholder)

### ❌ Não Implementado
- WhatsApp (removido temporariamente)
- Relatórios avançados
- Exportação Excel
- Kanban de OS
- Sistema de comissões

---

## 🐛 Bugs Conhecidos

### Críticos
- Nenhum no momento

### Médios
- Busca por placa não funciona (precisa API DENATRAN)
- Verificação WhatsApp Meta pendente

### Baixos
- Warnings do baseline-browser-mapping (não afeta)
- Console.logs podem ter sobrado em alguns lugares

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar erros
npm run lint

# Git
git status
git add .
git commit -m "mensagem"
git push origin main

# Supabase (se tiver CLI)
supabase status
supabase db reset
```

---

## 📊 Estrutura de Commits

Seguir este padrão:

```
feat: Nova funcionalidade
fix: Correção de bug
refactor: Refatoração
style: Mudanças de estilo
docs: Documentação
chore: Manutenção
```

Exemplos:
- `feat: Adicionar filtro por cidade`
- `fix: Corrigir erro ao criar OS`
- `style: Melhorar responsividade mobile`

---

## 🎨 Padrões de Código

### Componentes
```tsx
"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";

export default function MeuComponente() {
  const [loading, setLoading] = useState(false);

  return (
    <FadeIn>
      <GlassCard className="p-6">
        {/* Conteúdo */}
      </GlassCard>
    </FadeIn>
  );
}
```

### API Routes
```tsx
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Lógica aqui
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar" },
      { status: 500 }
    );
  }
}
```

---

## 🔐 Acesso Admin

- **Email**: eubbbruno@gmail.com
- **Painel**: /admin
- **Role**: admin (único)

---

## 📱 Testar Mobile

```bash
# Abrir DevTools
# Emular dispositivo: iPhone SE (375px)
# Testar navegação e formulários
```

Páginas críticas para testar:
- Landing page
- Login
- Dashboard oficina
- Dashboard motorista
- Buscar oficinas
- Solicitar orçamento

---

## 🚨 Antes de Deploy

- [ ] Executar todos os SQLs pendentes
- [ ] Testar todas as funcionalidades principais
- [ ] Verificar emails sendo enviados
- [ ] Testar pagamentos (sandbox)
- [ ] Verificar mobile em dispositivo real
- [ ] Remover console.logs de debug
- [ ] Build passar sem erros
- [ ] Variáveis de ambiente configuradas

---

## 📞 Suporte

- **Desenvolvedor**: Bruno
- **Email**: eubbbruno@gmail.com
- **Repositório**: https://github.com/eubbbruno/instauto-v10

---

**Última atualização**: 15/02/2026  
**Versão**: 0.1.1
