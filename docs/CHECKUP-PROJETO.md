# 🔍 Checkup do Projeto Instauto

**Data:** 15/02/2026  
**Versão:** 0.1.1

---

## 1. Dependências Atuais

### UI Components (Radix UI - shadcn/ui base)
✅ **Instalados:**
- `@radix-ui/react-alert-dialog` - Diálogos de confirmação
- `@radix-ui/react-avatar` - Avatares de usuário
- `@radix-ui/react-dialog` - Modais
- `@radix-ui/react-label` - Labels de formulário
- `@radix-ui/react-progress` - Barras de progresso
- `@radix-ui/react-radio-group` - Radio buttons
- `@radix-ui/react-select` - Selects customizados
- `@radix-ui/react-slot` - Composição de componentes
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-tabs` - Abas
- `@radix-ui/react-toast` - Notificações toast

**Componentes UI customizados criados:**
- `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`
- `badge.tsx`, `avatar.tsx`, `progress.tsx`, `table.tsx`
- `alert-dialog.tsx`, `dialog.tsx`, `tabs.tsx`, `switch.tsx`
- `StarRating.tsx`, `EmptyState.tsx`, `OnboardingModal.tsx`, `PlateSearchInput.tsx`

### Animações
✅ **Instalado:**
- `framer-motion` (v12.23.26) - Biblioteca completa de animações
- `tailwindcss-animate` - Animações CSS via Tailwind

⚠️ **Status:** Framer Motion instalado mas **POUCO UTILIZADO** no projeto

### Ícones
✅ **Instalado:**
- `lucide-react` (v0.460.0) - Biblioteca moderna de ícones

### Formulários
❌ **Nenhuma biblioteca específica**
- Formulários gerenciados manualmente com React state

### Gráficos
✅ **Instalados:**
- `recharts` (v3.6.0) - **USADO** (dashboard oficina, financeiro)
- `chart.js` (v4.5.1) + `react-chartjs-2` (v5.3.1) - **NÃO USADO**

⚠️ **Duplicação:** Duas bibliotecas de gráficos, mas apenas Recharts é utilizada

### Calendário/Agenda
✅ **Instalados:**
- `react-big-calendar` (v1.19.4) - Calendário completo
- `react-calendar` (v6.0.0) - Calendário simples

⚠️ **Status:** Instalados mas agenda ainda é placeholder

### Notificações/Toast
✅ **Instalados:**
- `sonner` (v2.0.7) - Toast moderno (usado em 4 arquivos)
- `react-hot-toast` (v2.6.0) - Toast alternativo (usado em 3 arquivos)

⚠️ **Duplicação:** Duas bibliotecas de toast sendo usadas

### Utilitários
✅ **Instalados:**
- `class-variance-authority` - Variantes de componentes
- `clsx` + `tailwind-merge` - Merge de classes CSS
- `date-fns` (v4.1.0) - Manipulação de datas

### Backend/Integração
✅ **Instalados:**
- `@supabase/supabase-js` + `@supabase/ssr` - Banco de dados
- `openai` - Integração IA (diagnóstico)
- `mercadopago` - Pagamentos
- `resend` - Envio de emails
- `jspdf` + `jspdf-autotable` - Geração de PDFs

---

## 2. Arquivos para Remover/Limpar

### Dependências Não Utilizadas
❌ **Remover:**
- `chart.js` + `react-chartjs-2` - Não utilizados (usar apenas Recharts)

### Duplicação de Bibliotecas
⚠️ **Unificar:**
- **Toast:** Escolher entre `sonner` (recomendado) ou `react-hot-toast`
  - Atualmente: 4 arquivos usam sonner, 3 usam react-hot-toast
  - **Recomendação:** Migrar tudo para `sonner` (mais moderno)

### Scripts SQL Possivelmente Obsoletos
⚠️ **Revisar necessidade:**
- `supabase/recreate-reviews-table.sql` - Pode ser obsoleto se tabela já foi recriada
- `supabase/reset-database.sql` - Apenas para desenvolvimento
- Múltiplos `fix-*-rls.sql` - Verificar se ainda são necessários

### Console.logs de Debug
⚠️ **Limpar:**
- **70+ arquivos** contêm `console.log/error/warn`
- Muitos são logs de debug que podem ser removidos
- Manter apenas logs críticos de erro

**Arquivos com mais logs:**
- `app/api/webhooks/mercadopago/route.ts` (37 logs)
- `app/solicitar-orcamento/page.tsx` (39 logs)
- `app/login/page.tsx` (38 logs)
- `app/auth/callback/route.ts` (62 logs)

---

## 3. Inconsistências Encontradas

### Cores Hardcoded
⚠️ **Encontradas cores hex em:**
- `app/(dashboard)/oficina/page.tsx` (10 ocorrências)
- `app/login/page.tsx` (4 ocorrências)
- `app/api/og\route.tsx` (10 ocorrências)
- Layouts da sidebar (cores como `#1e3a8a`, `#1e40af`)

**Problema:** Cores hardcoded dificultam manutenção e tema consistente

**Solução:** Usar variáveis CSS do `globals.css` ou cores do Tailwind

### Padrões de Toast Inconsistentes
⚠️ **Dois sistemas de toast:**
```tsx
// Alguns arquivos usam:
import { toast } from "sonner"

// Outros usam:
import toast from "react-hot-toast"
```

**Solução:** Padronizar para `sonner` em todos os arquivos

### Estilos de Cards Inconsistentes
⚠️ **Variações encontradas:**
- `bg-white/80 backdrop-blur-sm` (glassmorphism)
- `bg-white` (sólido)
- `bg-gradient-to-br from-yellow-50 to-yellow-100`

**Solução:** Criar componentes Card padronizados para cada tipo

---

## 4. Design System Atual

### Cores (globals.css)
✅ **Sistema de cores HSL bem estruturado:**
```css
--primary: 221.2 83.2% 53.3%     /* Azul primário #3B82F6 */
--secondary: 210 40% 96.1%        /* Cinza claro */
--destructive: 0 84.2% 60.2%      /* Vermelho */
--muted: 210 40% 96.1%            /* Cinza suave */
--accent: 210 40% 96.1%           /* Accent */
```

⚠️ **Problema:** Cores hardcoded no código ignoram essas variáveis

### Fontes (tailwind.config.ts)
✅ **Fontes customizadas:**
- `font-sans`: Plus Jakarta Sans (corpo)
- `font-heading`: Syne (títulos)

### Componentes Reutilizáveis
✅ **21 componentes UI criados** (base shadcn/ui)

⚠️ **Faltam componentes específicos:**
- Componente Card padronizado com variantes (solid, glass, gradient)
- Componente Toast wrapper unificado
- Componente de Loading/Skeleton consistente

### Animações
⚠️ **Framer Motion instalado mas subutilizado**
- Apenas `tailwindcss-animate` é usado extensivamente
- Potencial para micro-interações e transições suaves

---

## 5. Recomendações

### 🎨 Design & UI

#### Bibliotecas Sugeridas
✅ **Já instaladas - aumentar uso:**
- **Framer Motion** - Adicionar micro-animações em:
  - Hover de cards
  - Transições de página
  - Loading states
  - Modais e dropdowns

❌ **Considerar adicionar:**
- **react-hook-form** + **zod** - Validação de formulários robusta
  - Substituir validação manual por schema validation
  - Melhor UX com validação em tempo real

#### Melhorias de Componentes
🔧 **Criar:**
1. **Card Component com variantes:**
   ```tsx
   <Card variant="glass" hover="lift">
   <Card variant="gradient" color="blue">
   <Card variant="solid">
   ```

2. **Toast Wrapper unificado:**
   ```tsx
   // lib/toast.ts
   export const toast = {
     success: (msg) => sonner.success(msg),
     error: (msg) => sonner.error(msg),
     // ...
   }
   ```

3. **Loading Component consistente:**
   ```tsx
   <Loading variant="spinner" />
   <Loading variant="skeleton" />
   <Loading variant="pulse" />
   ```

### 🧹 Limpeza de Código

#### Prioridade Alta
1. **Remover dependências não usadas:**
   ```bash
   npm uninstall chart.js react-chartjs-2
   ```

2. **Unificar sistema de toast:**
   - Migrar todos para `sonner`
   - Remover `react-hot-toast`

3. **Limpar console.logs:**
   - Remover logs de debug
   - Manter apenas logs críticos com prefixo `[ERROR]`

#### Prioridade Média
4. **Substituir cores hardcoded:**
   - Usar `bg-primary`, `text-primary` do Tailwind
   - Criar variáveis CSS para cores específicas (amarelo da marca)

5. **Padronizar estilos de cards:**
   - Criar variantes no componente Card
   - Documentar quando usar cada variante

### 📦 Estrutura de Arquivos

#### Criar:
```
lib/
  ├── constants/
  │   ├── colors.ts        # Cores da marca
  │   └── animations.ts    # Configurações de animação
  ├── utils/
  │   ├── toast.ts         # Toast wrapper unificado
  │   └── validation.ts    # Schemas de validação
  └── types/
      └── components.ts    # Types de componentes
```

### 🎯 Próximos Passos Sugeridos

**Fase 1 - Limpeza (1-2 dias):**
1. Remover `chart.js` e `react-chartjs-2`
2. Migrar todos os toasts para `sonner`
3. Limpar console.logs desnecessários
4. Remover scripts SQL obsoletos

**Fase 2 - Padronização (2-3 dias):**
1. Criar componente Card com variantes
2. Substituir cores hardcoded por variáveis
3. Criar toast wrapper unificado
4. Documentar design system

**Fase 3 - Melhorias (3-5 dias):**
1. Adicionar `react-hook-form` + `zod`
2. Implementar micro-animações com Framer Motion
3. Criar componentes de Loading consistentes
4. Melhorar responsividade mobile

---

## 📊 Resumo Executivo

### ✅ Pontos Fortes
- Design system base bem estruturado (Radix UI + Tailwind)
- Componentes UI reutilizáveis criados
- Biblioteca de animações instalada (Framer Motion)
- Sistema de cores HSL consistente

### ⚠️ Pontos de Atenção
- Dependências duplicadas (toast, gráficos)
- Cores hardcoded em vários arquivos
- Console.logs de debug em 70+ arquivos
- Framer Motion subutilizado

### 🎯 Impacto das Melhorias
- **Performance:** Remover dependências não usadas (-200KB bundle)
- **Manutenibilidade:** Código mais limpo e padronizado
- **UX:** Animações e validações melhoradas
- **Consistência:** Design system unificado

---

**Última atualização:** 15/02/2026  
**Próxima revisão:** Após implementação das melhorias da Fase 1
