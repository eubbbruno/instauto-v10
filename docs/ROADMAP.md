# 🗺️ Roadmap Instauto

Planejamento de funcionalidades e melhorias do sistema.

---

## ✅ CONCLUÍDO

### Autenticação e Usuários
- ✅ Sistema de autenticação (email + Google OAuth)
- ✅ Perfis de usuário (motorista e oficina)
- ✅ Proteção de rotas
- ✅ Middleware de autenticação
- ✅ Callback de confirmação de email

### Dashboard Oficina
- ✅ Dashboard principal com estatísticas
- ✅ Gestão de clientes
- ✅ Gestão de veículos
- ✅ Orçamentos recebidos
- ✅ Sistema de avaliações
- ✅ Configurações de perfil
- ✅ Upload de avatar
- ✅ Planos (FREE e PRO)
- ✅ Trial de 7 dias

### Dashboard Motorista
- ✅ Dashboard principal com estatísticas
- ✅ Garagem de veículos
- ✅ Solicitação de orçamentos
- ✅ Histórico de orçamentos
- ✅ Avaliação de oficinas
- ✅ Configurações de perfil
- ✅ Upload de avatar
- ✅ Limite de veículos (3 no FREE)
- ✅ Card Socorro 24h
- ✅ Card Guincho

### Páginas Públicas
- ✅ Landing page
- ✅ Buscar oficinas
- ✅ Perfil público da oficina
- ✅ Solicitar orçamento
- ✅ Para oficinas
- ✅ Login/Cadastro
- ✅ Sobre, Contato, Termos, Privacidade

### Sistema
- ✅ Notificações (sino)
- ✅ Emails (Resend)
- ✅ Design System completo
- ✅ Animações (Framer Motion)
- ✅ Glassmorphism
- ✅ Responsividade mobile
- ✅ Toast notifications (Sonner)

---

## 🔧 EM ANDAMENTO

### Correções Urgentes
- 🔄 Executar SQL para adicionar coluna km (`supabase/fix-vehicles-km.sql`)
- 🔄 Aplicar animações nas páginas públicas restantes

---

## 📱 DASHBOARD MOTORISTA - PRÓXIMAS FEATURES

### Socorro 24h (Melhorias)
- [ ] Modal com todos os números de emergência:
  - 192 — SAMU
  - 190 — Polícia Militar
  - 193 — Corpo de Bombeiros
  - 191 — Polícia Rodoviária Federal
  - 0800-777-1234 — Socorro Instauto
- [ ] Localização automática para socorro mais próximo
- [ ] Histórico de chamadas de emergência

### Guincho (Melhorias)
- [ ] Busca de guinchos por localização
- [ ] Categoria específica "Guincho" na busca de oficinas
- [ ] Preços estimados de guincho
- [ ] Avaliações de guinchos

### Gestão de Veículos
- [ ] Histórico completo de manutenções por veículo
- [ ] Lembretes automáticos (troca de óleo, revisão, etc)
- [ ] Controle de abastecimento
- [ ] Controle de despesas por veículo
- [ ] Gráficos de gastos

### Planos para Motorista
- [ ] Plano FREE: até 3 veículos
- [ ] Plano FROTA: veículos ilimitados + recursos avançados
- [ ] Página de planos do motorista

---

## 🏭 DASHBOARD OFICINA - PRÓXIMAS FEATURES

### Financeiro (Completo)
- [ ] Controle de caixa (entrada/saída)
- [ ] Contas a pagar
- [ ] Contas a receber
- [ ] Fluxo de caixa mensal
- [ ] Relatórios de lucro
- [ ] DRE (Demonstrativo de Resultados)
- [ ] Controle de comissões de funcionários
- [ ] Exportar relatórios em PDF/Excel

### Ordens de Serviço
- [ ] Criação e gerenciamento de OS
- [ ] Status do veículo (aguardando peças, em andamento, finalizado)
- [ ] Checklist de serviços
- [ ] Histórico de serviços por cliente
- [ ] Assinatura digital do cliente
- [ ] Exportar OS em PDF
- [ ] Integração com estoque (baixa automática de peças)

### Clientes (Melhorias)
- [ ] Histórico completo de atendimentos
- [ ] Comunicação automática (lembretes de revisão, aniversário)
- [ ] Segmentação de clientes (VIP, regular, inativo)
- [ ] Programa de fidelidade/pontos

### Estoque
- [ ] Controle de peças e insumos
- [ ] Alerta de estoque mínimo
- [ ] Previsão de demanda
- [ ] Gestão de fornecedores
- [ ] Histórico de compras
- [ ] Código de barras
- [ ] Integração com OS (baixa automática)

### Veículos/Pátio
- [ ] Gestão de pátio (veículos na oficina)
- [ ] Acompanhamento de status em tempo real
- [ ] Fotos do veículo (antes/depois)
- [ ] Localização no pátio

### Fiscal e Vendas
- [ ] Nota fiscal eletrônica (NF-e)
- [ ] Integração com vendas e estoque
- [ ] Controle de faturamento
- [ ] Controle de impostos (ICMS, ISS, etc)
- [ ] Emissão de recibos

### Automação
- [ ] Envio automático de mensagens (WhatsApp/SMS)
- [ ] Boletos automáticos
- [ ] Recibos automáticos
- [ ] Emails de follow-up
- [ ] Lembretes de revisão

### Relatórios
- [ ] Indicadores de desempenho (KPIs)
- [ ] Gráficos gerenciais avançados
- [ ] Dashboard de métricas em tempo real
- [ ] Comparativo mensal/anual
- [ ] Exportação em PDF/Excel

### PDV (Frente de Caixa)
- [ ] Venda rápida de produtos/serviços
- [ ] Integração com estoque
- [ ] Impressão de recibos
- [ ] Múltiplas formas de pagamento
- [ ] Fechamento de caixa

### Checklist de Serviços
- [ ] Templates de checklist por tipo de serviço
- [ ] Preenchimento digital
- [ ] Fotos anexadas ao checklist
- [ ] Assinatura do cliente

### Diagnóstico IA (Melhorias)
- [ ] Campo de instruções personalizadas por oficina
- [ ] Configurações do agente IA
- [ ] Histórico de diagnósticos
- [ ] Exportar diagnóstico em PDF
- [ ] Enviar diagnóstico para cliente via email/WhatsApp

### Agenda
- [ ] Calendário de agendamentos
- [ ] Bloqueio de horários
- [ ] Confirmação automática
- [ ] Lembretes para cliente
- [ ] Integração com Google Calendar

---

## 🔍 INTEGRAÇÕES EXTERNAS

### Busca por Placa
- [ ] Pesquisar API disponível (DENATRAN, PlacaFipe, etc)
- [ ] Implementar integração
- [ ] Fallback para preenchimento manual
- [ ] Cache de consultas

### Pagamentos
- [ ] Mercado Pago (já iniciado)
- [ ] Stripe (alternativa)
- [ ] PIX automático
- [ ] Boleto bancário

### WhatsApp Business
- [ ] Verificação Meta (pendente)
- [ ] Envio de mensagens automáticas
- [ ] Resposta de orçamentos via WhatsApp
- [ ] Notificações via WhatsApp

### Google Maps
- [ ] Mapa de oficinas
- [ ] Rotas até a oficina
- [ ] Visualização de localização

---

## 🎨 DESIGN/UX - MELHORIAS

### Mobile
- [ ] Revisar todas as páginas em mobile
- [ ] Menu hamburger melhorado
- [ ] Gestos touch (swipe, etc)
- [ ] Bottom navigation

### Acessibilidade
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] ARIA labels

### Performance
- [ ] Lazy loading de imagens
- [ ] Code splitting
- [ ] Otimização de bundle
- [ ] Cache strategies

### Animações
- [ ] Micro-interações
- [ ] Loading states consistentes
- [ ] Skeleton loaders
- [ ] Transições de página

---

## 🔐 ADMIN - FUTURO

### Painel Administrativo
- [ ] Dashboard com estatísticas gerais
- [ ] Gestão de oficinas
- [ ] Gestão de motoristas
- [ ] Gestão de orçamentos
- [ ] Gestão de avaliações
- [ ] Moderação de conteúdo
- [ ] Relatórios do sistema

---

## 🚀 MARKETING - FUTURO

### SEO
- [ ] Meta tags otimizadas
- [ ] Sitemap dinâmico
- [ ] Schema.org markup
- [ ] Blog integrado

### Landing Pages
- [ ] Landing page por cidade
- [ ] Landing page por serviço
- [ ] Páginas de conversão otimizadas

### Conteúdo
- [ ] Blog de dicas automotivas
- [ ] Guias de manutenção
- [ ] Vídeos tutoriais

---

## 📊 ANALYTICS - FUTURO

### Métricas
- [ ] Google Analytics 4
- [ ] Hotjar (heatmaps)
- [ ] Conversão de cadastros
- [ ] Taxa de resposta de orçamentos

---

## 🔮 IDEIAS FUTURAS

### IA Avançada
- [ ] Chatbot de atendimento
- [ ] Previsão de manutenção
- [ ] Recomendação de oficinas por IA
- [ ] Análise de preços (justo ou não)

### Gamificação
- [ ] Sistema de pontos
- [ ] Badges e conquistas
- [ ] Ranking de oficinas
- [ ] Programa de fidelidade

### Comunidade
- [ ] Fórum de discussão
- [ ] Grupos por cidade
- [ ] Eventos e encontros

### Marketplace
- [ ] Venda de peças
- [ ] Serviços especializados
- [ ] Parceiros premium

---

## 📅 PRIORIDADES

### Curto Prazo (1-2 meses)
1. Corrigir bugs críticos (coluna km)
2. Completar animações
3. Implementar Ordens de Serviço
4. Melhorar Financeiro
5. Implementar Estoque básico

### Médio Prazo (3-6 meses)
1. PDV/Frente de Caixa
2. Nota Fiscal Eletrônica
3. WhatsApp Business
4. Agenda completa
5. Relatórios avançados

### Longo Prazo (6-12 meses)
1. IA avançada
2. Marketplace
3. Gamificação
4. Admin completo
5. Expansão para outras cidades

---

## 📝 NOTAS

- Priorizar funcionalidades que geram valor imediato
- Ouvir feedback dos usuários beta
- Iterar rapidamente
- Manter código limpo e documentado
