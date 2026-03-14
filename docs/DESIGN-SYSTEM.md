# 🎨 Design System - Instauto

Sistema de design unificado para garantir consistência visual e melhor experiência do usuário.

---

## 🎨 Cores

### Paleta Principal

```css
/* Azul Primário - Cor da marca */
--primary: hsl(221.2, 83.2%, 53.3%)     /* #3B82F6 - blue-500 */
--primary-dark: hsl(221.2, 83.2%, 45%)  /* #1E40AF - blue-700 */

/* Amarelo Destaque - Cor secundária */
--accent: hsl(45, 93%, 47%)             /* #F59E0B - yellow-500 */

/* Cinzas */
--gray-50: hsl(210, 40%, 98%)
--gray-100: hsl(210, 40%, 96.1%)
--gray-200: hsl(214.3, 31.8%, 91.4%)
--gray-500: hsl(215.4, 16.3%, 46.9%)
--gray-900: hsl(222.2, 84%, 4.9%)

/* Estados */
--success: hsl(142, 71%, 45%)           /* #10B981 - green-500 */
--error: hsl(0, 84.2%, 60.2%)           /* #EF4444 - red-500 */
--warning: hsl(38, 92%, 50%)            /* #F59E0B - yellow-500 */
```

### Uso das Cores

- **Azul (#3B82F6):** Ações primárias, links, elementos interativos
- **Amarelo (#F59E0B):** Destaques, CTAs importantes, badges PRO
- **Verde (#10B981):** Sucesso, confirmações, WhatsApp
- **Vermelho (#EF4444):** Erros, alertas, ações destrutivas
- **Cinza:** Textos, bordas, backgrounds neutros

---

## 📝 Tipografia

### Fontes

```css
/* Corpo de texto */
font-family: 'Plus Jakarta Sans', system-ui, sans-serif;

/* Títulos e headings */
font-family: 'Syne', system-ui, sans-serif;
```

### Escala Tipográfica

```css
/* Títulos */
.text-4xl  /* 2.25rem - 36px - Hero titles */
.text-3xl  /* 1.875rem - 30px - Page titles */
.text-2xl  /* 1.5rem - 24px - Section titles */
.text-xl   /* 1.25rem - 20px - Card titles */
.text-lg   /* 1.125rem - 18px - Subtitles */

/* Corpo */
.text-base /* 1rem - 16px - Body text */
.text-sm   /* 0.875rem - 14px - Small text */
.text-xs   /* 0.75rem - 12px - Captions, labels */
```

### Pesos de Fonte

```css
.font-normal    /* 400 - Texto normal */
.font-medium    /* 500 - Destaque leve */
.font-semibold  /* 600 - Subtítulos */
.font-bold      /* 700 - Títulos */
```

---

## 📐 Espaçamentos

### Sistema de Espaçamento (4px base)

```css
.p-1  /* 4px */
.p-2  /* 8px */
.p-3  /* 12px */
.p-4  /* 16px - Padrão para cards pequenos */
.p-5  /* 20px */
.p-6  /* 24px - Padrão para cards médios */
.p-8  /* 32px - Padrão para seções */
```

### Gaps e Margens

```css
/* Entre elementos pequenos */
.gap-2, .space-y-2  /* 8px */

/* Entre cards */
.gap-4, .space-y-4  /* 16px */

/* Entre seções */
.gap-6, .space-y-6  /* 24px */
.gap-8, .space-y-8  /* 32px */
```

---

## 🎭 Componentes

### GlassCard

Card com efeito glassmorphism.

```tsx
import { GlassCard } from "@/components/ui/glass-card";

// Variantes
<GlassCard variant="default">Conteúdo</GlassCard>
<GlassCard variant="elevated">Conteúdo com mais destaque</GlassCard>
<GlassCard variant="highlighted">Conteúdo destacado em azul</GlassCard>

// Com hover
<GlassCard hover>Card clicável</GlassCard>
```

**Quando usar:**
- `default`: Cards comuns, conteúdo informativo
- `elevated`: Cards importantes, destaque moderado
- `highlighted`: Cards especiais, CTAs, promoções

---

### GradientButton

Botão com gradiente e animações.

```tsx
import { GradientButton } from "@/components/ui/gradient-button";

// Variantes
<GradientButton variant="primary">Ação Principal</GradientButton>
<GradientButton variant="secondary">Ação Secundária</GradientButton>
<GradientButton variant="accent">Destaque Especial</GradientButton>

// Tamanhos
<GradientButton size="sm">Pequeno</GradientButton>
<GradientButton size="md">Médio</GradientButton>
<GradientButton size="lg">Grande</GradientButton>

// Estados
<GradientButton loading>Carregando...</GradientButton>
<GradientButton disabled>Desabilitado</GradientButton>
```

**Quando usar:**
- `primary`: Ações principais (salvar, enviar, confirmar)
- `secondary`: Ações secundárias (cancelar, voltar)
- `accent`: CTAs importantes (upgrade, começar teste)

---

### StatCard

Card de estatística com animações.

```tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { FileText } from "lucide-react";

<StatCard
  title="Orçamentos"
  value={24}
  description="pendentes"
  icon={FileText}
  color="blue"
  trend={{ value: 12, positive: true }}
/>
```

**Cores disponíveis:**
- `blue`: Padrão, informações gerais
- `green`: Crescimento, sucesso
- `yellow`: Atenção, avisos
- `red`: Alertas, problemas
- `purple`: Especial, premium
- `sky`: Alternativa ao azul

---

## ✨ Animações

### Componentes de Animação

```tsx
import { 
  FadeIn, 
  SlideUp, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem,
  FloatingCard,
  HoverLift,
  Pulse
} from "@/components/ui/motion";
```

### FadeIn - Entrada com fade

```tsx
<FadeIn delay={0.2}>
  <div>Conteúdo aparece suavemente</div>
</FadeIn>
```

**Quando usar:** Conteúdo que deve aparecer gradualmente

---

### SlideUp - Entrada de baixo para cima

```tsx
<SlideUp delay={0.1} duration={0.5}>
  <div>Conteúdo desliza para cima</div>
</SlideUp>
```

**Quando usar:** Modais, cards, seções que aparecem

---

### ScaleIn - Entrada com scale

```tsx
<ScaleIn delay={0.3}>
  <div>Conteúdo cresce ao aparecer</div>
</ScaleIn>
```

**Quando usar:** Elementos de destaque, badges, notificações

---

### StaggerContainer - Animar filhos em sequência

```tsx
<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>
    <StatCard title="Card 1" value={10} />
  </StaggerItem>
  <StaggerItem>
    <StatCard title="Card 2" value={20} />
  </StaggerItem>
  <StaggerItem>
    <StatCard title="Card 3" value={30} />
  </StaggerItem>
</StaggerContainer>
```

**Quando usar:** Listas de cards, grids de estatísticas

---

### FloatingCard - Card com hover flutuante

```tsx
<FloatingCard className="bg-white p-6 rounded-2xl">
  <h3>Card que flutua no hover</h3>
</FloatingCard>
```

**Quando usar:** Cards clicáveis, links, CTAs

---

### HoverLift - Elevação no hover

```tsx
<HoverLift liftAmount={-8}>
  <div>Elemento se eleva no hover</div>
</HoverLift>
```

**Quando usar:** Botões, cards interativos

---

### Pulse - Animação de pulso

```tsx
<Pulse>
  <div>Elemento pulsa continuamente</div>
</Pulse>
```

**Quando usar:** Indicadores de loading, notificações não lidas

---

## 🎯 Padrões de Uso

### Dashboard

```tsx
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/dashboard/StatCard";

// Stats em sequência
<StaggerContainer staggerDelay={0.1}>
  <div className="grid grid-cols-4 gap-4">
    <StaggerItem><StatCard {...} /></StaggerItem>
    <StaggerItem><StatCard {...} /></StaggerItem>
    <StaggerItem><StatCard {...} /></StaggerItem>
    <StaggerItem><StatCard {...} /></StaggerItem>
  </div>
</StaggerContainer>

// Cards com hover
<GlassCard variant="elevated" hover>
  <h3>Card Interativo</h3>
</GlassCard>
```

---

### Landing Page

```tsx
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { GradientButton } from "@/components/ui/gradient-button";

// Hero section
<FadeIn>
  <h1>Título Principal</h1>
</FadeIn>

<SlideUp delay={0.2}>
  <p>Subtítulo</p>
</SlideUp>

<SlideUp delay={0.4}>
  <GradientButton variant="accent" size="lg">
    Começar Agora
  </GradientButton>
</SlideUp>
```

---

### Modais e Dialogs

```tsx
import { ScaleIn } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";

<ScaleIn>
  <GlassCard variant="elevated" className="max-w-md mx-auto">
    <h2>Título do Modal</h2>
    <p>Conteúdo</p>
  </GlassCard>
</ScaleIn>
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile first */
sm: 640px   /* Tablets */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

### Padrões Mobile

```tsx
// Textos menores no mobile
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// Padding reduzido no mobile
<div className="p-4 sm:p-6 lg:p-8">

// Grid responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## 🎨 Glassmorphism

### Padrão Base

```css
/* Light glassmorphism */
bg-white/80 backdrop-blur-sm border border-white/20

/* Medium glassmorphism */
bg-white/90 backdrop-blur-md border border-gray-200

/* Strong glassmorphism */
bg-white/95 backdrop-blur-lg border border-gray-300
```

### Quando Usar

- **Light:** Cards sobre fundos claros
- **Medium:** Cards importantes, modais
- **Strong:** Overlays, dropdowns

---

## 🔄 Transições

### Durações Padrão

```css
/* Rápida - Hover, clicks */
duration-200  /* 200ms */

/* Média - Animações gerais */
duration-300  /* 300ms */

/* Lenta - Transições complexas */
duration-500  /* 500ms */
```

### Easing

```css
ease-in     /* Começa devagar */
ease-out    /* Termina devagar - PADRÃO */
ease-in-out /* Suave início e fim */
```

---

## ✅ Checklist de Implementação

Ao criar um novo componente ou página:

- [ ] Usar cores da paleta (não hardcoded)
- [ ] Aplicar tipografia consistente
- [ ] Usar espaçamentos do sistema (múltiplos de 4px)
- [ ] Adicionar animações apropriadas
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Usar componentes do design system quando possível
- [ ] Manter acessibilidade (contraste, labels, keyboard)

---

## 📚 Referências

- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)

---

**Última atualização:** 15/02/2026  
**Versão:** 1.0
