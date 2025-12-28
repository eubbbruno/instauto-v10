# 🚨 EXECUTAR AGORA NO SUPABASE

## ⚠️ IMPORTANTE: Tabelas faltando!

Você precisa criar 3 tabelas no banco de dados:
1. ✅ **`diagnostics`** - Diagnóstico IA (já criada!)
2. ⚠️ **`inventory`** - Estoque de peças
3. ⚠️ **`transactions`** - Gestão financeira

---

## 📋 PASSO A PASSO:

### 1️⃣ Acesse o Supabase:
- Vá para: https://supabase.com/dashboard
- Entre no projeto: **Instauto V10**

### 2️⃣ Abra o SQL Editor:
- No menu lateral, clique em **SQL Editor**
- Clique em **New Query**

### 3️⃣ Cole os SQLs abaixo (um de cada vez):

---

## 📦 **SQL 1: INVENTORY (Estoque)**

```sql
-- ============================================
-- INSTAUTO V10 - MIGRATION: INVENTORY
-- ============================================

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100),
  category VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier VARCHAR(255),
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_workshop ON inventory(workshop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshop manage inventory" ON inventory FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_inventory_updated_at();
```

**Execute este SQL primeiro!** ✅

---

## 💰 **SQL 2: TRANSACTIONS (Financeiro)**

```sql
-- ============================================
-- INSTAUTO V10 - MIGRATION: TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50),
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_workshop ON transactions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshop manage transactions" ON transactions FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();
```

**Execute este SQL por último!** ✅

### 4️⃣ Execute:
- Clique no botão **Run** (ou pressione `Ctrl+Enter`)
- Aguarde a mensagem de sucesso

### 5️⃣ Verifique:
- No menu lateral, clique em **Table Editor**
- Procure pelas tabelas: `inventory` e `transactions`
- Devem aparecer com todas as colunas

---

## ✅ PRONTO!

Após executar os 2 SQLs, as páginas de **Estoque** e **Financeiro** estarão 100% funcionais! 🎉

**Tabelas criadas:**
- ✅ `diagnostics` - Diagnóstico IA
- ✅ `inventory` - Estoque de peças
- ✅ `transactions` - Gestão financeira

---

## 🔄 Se der erro:

Se aparecer erro dizendo que a tabela já existe, execute estes comandos para limpar:

```sql
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
```

E depois execute os SQLs completos novamente.

---

## 📞 Dúvidas?

Me avise se tiver qualquer problema na execução!

