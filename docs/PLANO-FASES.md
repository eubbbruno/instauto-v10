# 🗺️ Plano de Fases — Instauto

Documento vivo. Atualizado conforme avançamos. Última atualização: 2026-06-25.

> Objetivo: tirar o produto de "demo bonita que quebra" para **SaaS confiável que cobra** e ajuda oficinas + motoristas.

---

## ✅ Fase 0 — Estabilização (CONCLUÍDA)
Auditoria de todas as ~50 telas + correção do drift de schema (código esperava colunas/tabelas que não existiam no banco real). Todos validados com insert/delete real.

- [x] Schema base reconciliado (vehicles, transactions, service_orders + tabelas filhas) — sessão anterior
- [x] Estoque (`inventory` +unit_price/supplier/location/description)
- [x] Agenda (`appointments` +date/start_time/end_time; scheduled_at nullable)
- [x] Diagnóstico IA (tabela `diagnostics` criada)
- [x] Histórico motorista (tabela `maintenance_history` criada)
- [x] Despesas (`motorist_expenses` +notes)
- [x] Lembretes (`motorist_reminders` +amount/notes/reminder_days_before/is_completed/completed_at)
- [x] Abastecimento (`motorist_fueling` +total_amount/gas_station/city/state/notes; total_price nullable)
- [x] Todas as migrações versionadas em `supabase/migrations/`
- [x] RLS de `notifications` habilitado (estava aberto)

---

## 🔄 Fase 0.5 — Monetização / Trial reverso (EM ANDAMENTO)
Modelo aprovado: **Free permanente** (marketplace) + **14 dias de PRO automático sem cartão** → cai pra Free ao expirar → assina via MercadoPago.

- [x] Trial 7 → 14 dias no cadastro (`login`)
- [x] `lib/plan.ts` — fonte única de verdade (`isProActive`, `trialDaysLeft`, `TRIAL_DAYS`)
- [x] `PlanGuard` usa `isProActive` (já bloqueava pós-trial; agora centralizado)
- [x] Clientes: limite/avisos respeitam o trial (trial = ilimitado)
- [x] Configurações: badge mostra "PRO (teste) • X dias restantes" em vez de "FREE"
- [x] Dashboard (`oficina/page.tsx`) card de upgrade respeitar trial
- [x] Página `planos` reconhece trial ("Plano PRO (teste)")
- [ ] Conferir/garantir webhook MercadoPago promovendo pra PRO no pagamento (código existe — validar em sandbox)
- [ ] (opcional) Email/aviso "seu trial termina em 3 dias"

---

## 🧩 Lacunas de PRODUTO descobertas na auditoria (não são bugs)
- [ ] `maintenance_history` não tem tela que ESCREVE → sempre vazio. Sugestão: gerar histórico automático quando uma OS é concluída (status=completed/delivered).
- [ ] `promotions` não tem criador → motorista nunca vê promoção. Falta tela na oficina pra criar/gerenciar promoções.
- [ ] Chat motorista (`/motorista/chat`) é casca — sem backend.
- [ ] Estoque: evoluir preço único → `cost_price`/`sell_price` (margem) — colunas já existem no banco.

---

## 🎨 Fase 1 — UX/UI (depois de 0.5)
Usar skills de design. Só faz sentido com fluxos funcionando.
- [ ] Design system consistente (cards, loading/skeletons, toasts)
- [ ] Onboarding da oficina (primeiro cliente → primeiro veículo → primeira OS)
- [ ] Revisão mobile de todos os módulos
- [ ] Limpeza de `console.log` (~70 arquivos) e cores hardcoded
- [ ] Lockfile duplicado em `C:\Users\Bruno\` + `middleware`→`proxy` (Next 16)

## 🚀 Fase 2 — Crescimento
- [ ] WhatsApp via Evolution Go + IA de resposta (a tela `whatsapp` é casca hoje)
- [ ] Relatórios avançados / KPIs
- [ ] Histórico automático e automações (lembretes, follow-up)

## 🧰 Backlog técnico
- [ ] Typed Supabase client (`types/supabase.ts` pronto; precisa saída exata do gerador + `.returns<T>()` nos ~4 joins admin)
- [ ] Remover colunas órfãs legadas (mileage, labor_total/parts_total, cost_price/sell_price não usados, scheduled_at/duration_minutes, total_price/station_name) — quando houver certeza
- [ ] Itens de segurança do advisor: view `public_workshops` SECURITY DEFINER; ligar leaked-password protection
