-- =====================================================
-- INSTAUTO V10 - TABELAS FINANCEIRAS E LEMBRETES
-- =====================================================
-- Autor: Bruno
-- Data: 05/01/2025
-- Descrição: Tabelas para controle financeiro e lembretes
-- =====================================================

-- =====================================================
-- 1. TABELA DE ABASTECIMENTO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.motorist_fueling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motorist_id UUID REFERENCES public.motorists(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.motorist_vehicles(id) ON DELETE CASCADE NOT NULL,
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'ethanol', 'diesel', 'gnv')),
    liters DECIMAL(8, 2) NOT NULL CHECK (liters > 0),
    price_per_liter DECIMAL(8, 2) NOT NULL CHECK (price_per_liter > 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
    odometer INTEGER NOT NULL CHECK (odometer >= 0),
    gas_station TEXT,
    city TEXT,
    state TEXT,
    notes TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fueling_motorist ON public.motorist_fueling(motorist_id);
CREATE INDEX IF NOT EXISTS idx_fueling_vehicle ON public.motorist_fueling(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fueling_date ON public.motorist_fueling(date DESC);

-- RLS para motorist_fueling
ALTER TABLE public.motorist_fueling ENABLE ROW LEVEL SECURITY;

-- Motoristas podem ver seus próprios abastecimentos
CREATE POLICY "Motorists can view their own fueling records"
ON public.motorist_fueling FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_fueling.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem inserir seus próprios abastecimentos
CREATE POLICY "Motorists can insert their own fueling records"
ON public.motorist_fueling FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_fueling.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem atualizar seus próprios abastecimentos
CREATE POLICY "Motorists can update their own fueling records"
ON public.motorist_fueling FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_fueling.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem deletar seus próprios abastecimentos
CREATE POLICY "Motorists can delete their own fueling records"
ON public.motorist_fueling FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_fueling.motorist_id
        AND profile_id = auth.uid()
    )
);

-- =====================================================
-- 2. TABELA DE DESPESAS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.motorist_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motorist_id UUID REFERENCES public.motorists(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.motorist_vehicles(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('fuel', 'maintenance', 'insurance', 'ipva', 'fine', 'parking', 'toll', 'wash', 'other')),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    date DATE NOT NULL,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_expenses_motorist ON public.motorist_expenses(motorist_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle ON public.motorist_expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.motorist_expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.motorist_expenses(category);

-- RLS para motorist_expenses
ALTER TABLE public.motorist_expenses ENABLE ROW LEVEL SECURITY;

-- Motoristas podem ver suas próprias despesas
CREATE POLICY "Motorists can view their own expenses"
ON public.motorist_expenses FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_expenses.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem inserir suas próprias despesas
CREATE POLICY "Motorists can insert their own expenses"
ON public.motorist_expenses FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_expenses.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem atualizar suas próprias despesas
CREATE POLICY "Motorists can update their own expenses"
ON public.motorist_expenses FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_expenses.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem deletar suas próprias despesas
CREATE POLICY "Motorists can delete their own expenses"
ON public.motorist_expenses FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_expenses.motorist_id
        AND profile_id = auth.uid()
    )
);

-- =====================================================
-- 3. TABELA DE LEMBRETES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.motorist_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motorist_id UUID REFERENCES public.motorists(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.motorist_vehicles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('ipva', 'insurance', 'revision', 'licensing', 'tire_rotation', 'oil_change', 'inspection', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reminder_days_before INTEGER[] DEFAULT ARRAY[30, 15, 7, 1],
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    amount DECIMAL(10, 2), -- Valor estimado/pago
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reminders_motorist ON public.motorist_reminders(motorist_id);
CREATE INDEX IF NOT EXISTS idx_reminders_vehicle ON public.motorist_reminders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON public.motorist_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON public.motorist_reminders(is_completed);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON public.motorist_reminders(type);

-- RLS para motorist_reminders
ALTER TABLE public.motorist_reminders ENABLE ROW LEVEL SECURITY;

-- Motoristas podem ver seus próprios lembretes
CREATE POLICY "Motorists can view their own reminders"
ON public.motorist_reminders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_reminders.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem inserir seus próprios lembretes
CREATE POLICY "Motorists can insert their own reminders"
ON public.motorist_reminders FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_reminders.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem atualizar seus próprios lembretes
CREATE POLICY "Motorists can update their own reminders"
ON public.motorist_reminders FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_reminders.motorist_id
        AND profile_id = auth.uid()
    )
);

-- Motoristas podem deletar seus próprios lembretes
CREATE POLICY "Motorists can delete their own reminders"
ON public.motorist_reminders FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.motorists
        WHERE id = motorist_reminders.motorist_id
        AND profile_id = auth.uid()
    )
);

-- =====================================================
-- 4. TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Trigger para motorist_fueling
CREATE TRIGGER update_motorist_fueling_updated_at
BEFORE UPDATE ON public.motorist_fueling
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para motorist_expenses
CREATE TRIGGER update_motorist_expenses_updated_at
BEFORE UPDATE ON public.motorist_expenses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para motorist_reminders
CREATE TRIGGER update_motorist_reminders_updated_at
BEFORE UPDATE ON public.motorist_reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FUNÇÃO PARA CRIAR NOTIFICAÇÕES DE LEMBRETES
-- =====================================================

CREATE OR REPLACE FUNCTION create_reminder_notifications()
RETURNS TRIGGER AS $$
DECLARE
    motorist_profile_id UUID;
    days_until_due INTEGER;
BEGIN
    -- Buscar profile_id do motorista
    SELECT profile_id INTO motorist_profile_id
    FROM public.motorists
    WHERE id = NEW.motorist_id;

    -- Calcular dias até vencimento
    days_until_due := NEW.due_date - CURRENT_DATE;

    -- Criar notificação se estiver nos dias de lembrete
    IF days_until_due = ANY(NEW.reminder_days_before) AND NOT NEW.is_completed THEN
        INSERT INTO public.notifications (
            user_id,
            profile_id,
            type,
            title,
            message,
            link
        ) VALUES (
            (SELECT auth.uid() FROM public.profiles WHERE id = motorist_profile_id),
            motorist_profile_id,
            'reminder',
            'Lembrete: ' || NEW.title,
            'Faltam ' || days_until_due || ' dias para ' || NEW.title,
            '/motorista/lembretes'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar notificações
CREATE TRIGGER trigger_reminder_notifications
AFTER INSERT OR UPDATE ON public.motorist_reminders
FOR EACH ROW EXECUTE FUNCTION create_reminder_notifications();

-- =====================================================
-- 6. VIEWS ÚTEIS
-- =====================================================

-- View para consumo médio por veículo
CREATE OR REPLACE VIEW motorist_vehicle_fuel_stats AS
SELECT
    vehicle_id,
    motorist_id,
    fuel_type,
    COUNT(*) as total_fuelings,
    SUM(liters) as total_liters,
    SUM(total_amount) as total_spent,
    AVG(price_per_liter) as avg_price_per_liter,
    MAX(odometer) - MIN(odometer) as total_km,
    CASE
        WHEN MAX(odometer) - MIN(odometer) > 0 THEN
            (SUM(liters) / (MAX(odometer) - MIN(odometer))) * 100
        ELSE 0
    END as avg_consumption_per_100km
FROM public.motorist_fueling
GROUP BY vehicle_id, motorist_id, fuel_type;

-- View para despesas mensais
CREATE OR REPLACE VIEW motorist_monthly_expenses AS
SELECT
    motorist_id,
    vehicle_id,
    category,
    DATE_TRUNC('month', date) as month,
    COUNT(*) as total_expenses,
    SUM(amount) as total_amount
FROM public.motorist_expenses
GROUP BY motorist_id, vehicle_id, category, DATE_TRUNC('month', date);

-- View para lembretes pendentes
CREATE OR REPLACE VIEW motorist_pending_reminders AS
SELECT
    r.*,
    v.make,
    v.model,
    v.plate,
    (r.due_date - CURRENT_DATE) as days_until_due
FROM public.motorist_reminders r
LEFT JOIN public.motorist_vehicles v ON r.vehicle_id = v.id
WHERE r.is_completed = FALSE
AND r.due_date >= CURRENT_DATE
ORDER BY r.due_date ASC;

-- =====================================================
-- 7. DADOS DE EXEMPLO (OPCIONAL - COMENTADO)
-- =====================================================

-- Descomente para inserir dados de exemplo
/*
-- Exemplo de abastecimento
INSERT INTO public.motorist_fueling (motorist_id, vehicle_id, fuel_type, liters, price_per_liter, total_amount, odometer, gas_station, city, state, date)
VALUES (
    'UUID_DO_MOTORISTA',
    'UUID_DO_VEICULO',
    'gasoline',
    45.50,
    5.89,
    268.00,
    15000,
    'Posto Shell',
    'Londrina',
    'PR',
    CURRENT_DATE
);

-- Exemplo de despesa
INSERT INTO public.motorist_expenses (motorist_id, vehicle_id, category, amount, description, date)
VALUES (
    'UUID_DO_MOTORISTA',
    'UUID_DO_VEICULO',
    'maintenance',
    350.00,
    'Troca de óleo e filtros',
    CURRENT_DATE
);

-- Exemplo de lembrete
INSERT INTO public.motorist_reminders (motorist_id, vehicle_id, type, title, description, due_date, priority)
VALUES (
    'UUID_DO_MOTORISTA',
    'UUID_DO_VEICULO',
    'ipva',
    'Pagamento IPVA 2025',
    'Vencimento da cota única do IPVA',
    '2025-03-15',
    'high'
);
*/

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para verificar se as tabelas foram criadas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'motorist_%';

-- Para verificar as políticas RLS:
-- SELECT * FROM pg_policies WHERE tablename LIKE 'motorist_%';

