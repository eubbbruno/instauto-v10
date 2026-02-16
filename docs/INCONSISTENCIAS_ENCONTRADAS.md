# 🔍 INCONSISTÊNCIAS ENCONTRADAS - AUDITORIA

## ❌ PROBLEMAS IDENTIFICADOS

### 1. **AppointmentStatus** - FALTA `'no_show'`

**Banco aceita:** `'scheduled'`, `'confirmed'`, `'in_progress'`, `'completed'`, `'cancelled'`, `'no_show'`  
**Código tem:** `'scheduled'`, `'confirmed'`, `'in_progress'`, `'completed'`, `'cancelled'`  

**❌ FALTANDO:** `'no_show'`

**Arquivo:** `types/database.ts` linha 119

---

### 2. **Appointments.type** - NÃO EXISTE NO CÓDIGO

**Banco aceita:** `'service'`, `'quote'`, `'delivery'`, `'other'`  
**Código:** ❌ Não tem tipo definido

**Arquivo:** `types/database.ts` - precisa criar `AppointmentType`

---

### 3. **Messages - message_type e sender_type** - NÃO EXISTEM NO CÓDIGO

**Banco aceita:**
- **message_type**: `'text'`, `'image'`, `'file'`
- **sender_type**: `'motorist'`, `'workshop'`

**Código:** ❌ Não tem tipos definidos

**Arquivo:** `types/database.ts` - precisa criar tipos

---

### 4. **Notifications.type** - NÃO EXISTE NO CÓDIGO

**Banco aceita:** `'quote_response'`, `'message'`, `'maintenance'`, `'alert'`, `'promotion'`  
**Código:** ❌ Não tem tipo definido

**Arquivo:** `types/database.ts` - precisa criar `NotificationType`

---

### 5. **Workshops.subscription_status** - NÃO EXISTE NO CÓDIGO

**Banco aceita:** `'none'`, `'pending'`, `'active'`, `'cancelled'`, `'paused'`  
**Código:** ❌ Não tem tipo definido

**Arquivo:** `types/database.ts` - precisa criar `SubscriptionStatus`

---

## ✅ TIPOS CORRETOS (JÁ ALINHADOS)

1. ✅ **UserType**: `'oficina'`, `'motorista'`, `'admin'`
2. ✅ **PlanType**: `'free'`, `'pro'`
3. ✅ **ServiceOrderStatus**: `'pending'`, `'approved'`, `'in_progress'`, `'completed'`, `'cancelled'`
4. ✅ **TransactionType**: `'income'`, `'expense'`
5. ✅ **DiagnosticSeverity**: `'low'`, `'medium'`, `'high'`
6. ✅ **QuoteStatus**: `'pending'`, `'quoted'`, `'accepted'`, `'rejected'`, `'expired'`
7. ✅ **QuoteUrgency**: `'low'`, `'medium'`, `'high'` (corrigido)
8. ✅ **FuelType**: `'gasoline'`, `'ethanol'`, `'diesel'`, `'gnv'`
9. ✅ **ExpenseCategory**: `'fuel'`, `'maintenance'`, `'insurance'`, `'ipva'`, `'fine'`, `'parking'`, `'toll'`, `'wash'`, `'other'`
10. ✅ **ReminderType**: `'ipva'`, `'insurance'`, `'revision'`, `'licensing'`, `'tire_rotation'`, `'oil_change'`, `'inspection'`, `'other'`
11. ✅ **ReminderPriority**: `'low'`, `'medium'`, `'high'`

---

## 📝 AÇÕES NECESSÁRIAS

### 1. Atualizar `types/database.ts`

```typescript
// Adicionar no arquivo types/database.ts:

// Linha 119 - Atualizar AppointmentStatus
export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";

// Adicionar novo tipo AppointmentType
export type AppointmentType = "service" | "quote" | "delivery" | "other";

// Adicionar tipos de mensagens
export type MessageType = "text" | "image" | "file";
export type SenderType = "motorist" | "workshop";

// Adicionar tipo de notificação
export type NotificationType = "quote_response" | "message" | "maintenance" | "alert" | "promotion";

// Adicionar tipo de status de assinatura
export type SubscriptionStatus = "none" | "pending" | "active" | "cancelled" | "paused";
```

### 2. Atualizar interfaces que usam esses tipos

- `Appointment` - adicionar campo `type: AppointmentType`
- Interface de mensagens - adicionar tipos
- Interface de notificações - adicionar tipo
- `Workshop` - usar `SubscriptionStatus` no campo `subscription_status`

---

## 🎯 PRIORIDADE

1. **ALTA** - Corrigir `AppointmentStatus` (falta `no_show`)
2. **MÉDIA** - Adicionar `AppointmentType`
3. **MÉDIA** - Adicionar tipos de mensagens
4. **MÉDIA** - Adicionar `NotificationType`
5. **BAIXA** - Adicionar `SubscriptionStatus` (já funciona como string)
