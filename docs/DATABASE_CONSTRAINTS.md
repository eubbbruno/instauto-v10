# 📋 DATABASE CONSTRAINTS - AUDITORIA COMPLETA

## ✅ CONSTRAINTS CHECK ENCONTRADAS

### 1. **appointments**
- **status**: `'scheduled'`, `'confirmed'`, `'in_progress'`, `'completed'`, `'cancelled'`, `'no_show'`
- **type**: `'service'`, `'quote'`, `'delivery'`, `'other'`

### 2. **diagnostics**
- **severity**: `'low'`, `'medium'`, `'high'`

### 3. **messages**
- **message_type**: `'text'`, `'image'`, `'file'`
- **sender_type**: `'motorist'`, `'workshop'`

### 4. **motorist_expenses**
- **category**: `'fuel'`, `'maintenance'`, `'insurance'`, `'ipva'`, `'fine'`, `'parking'`, `'toll'`, `'wash'`, `'other'`
- **amount**: > 0

### 5. **motorist_fueling**
- **fuel_type**: `'gasoline'`, `'ethanol'`, `'diesel'`, `'gnv'`
- **liters**: > 0
- **price_per_liter**: > 0
- **total_amount**: > 0
- **odometer**: >= 0

### 6. **motorist_reminders**
- **type**: `'ipva'`, `'insurance'`, `'revision'`, `'licensing'`, `'tire_rotation'`, `'oil_change'`, `'inspection'`, `'other'`
- **priority**: `'low'`, `'medium'`, `'high'`

### 7. **notifications**
- **type**: `'quote_response'`, `'message'`, `'maintenance'`, `'alert'`, `'promotion'`

### 8. **profiles**
- **type**: `'oficina'`, `'motorista'`, `'admin'`

### 9. **quotes** ✅
- **status**: `'pending'`, `'quoted'`, `'accepted'`, `'rejected'`, `'expired'`
- **urgency**: `'low'`, `'medium'`, `'high'` ✅ CORRIGIDO

### 10. **reviews**
- **rating**: >= 1 AND <= 5

### 11. **service_orders**
- **status**: `'pending'`, `'approved'`, `'in_progress'`, `'completed'`, `'cancelled'`

### 12. **transactions**
- **type**: `'income'`, `'expense'`

### 13. **workshops**
- **plan_type**: `'free'`, `'pro'`
- **subscription_status**: `'none'`, `'pending'`, `'active'`, `'cancelled'`, `'paused'`

---

## 📊 VALORES ATUAIS NO BANCO

Baseado nos dados existentes:
- ✅ quotes.status: `'pending'`
- ✅ quotes.urgency: `'medium'`

---

## 🔍 PRÓXIMA ETAPA

Verificar se o código TypeScript está usando os valores corretos para cada constraint.
