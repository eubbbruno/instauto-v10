-- ============================================
-- INSTAUTO V10 - MIGRATION: DIAGNOSTICS
-- ============================================
-- Adiciona tabela de diagnósticos com IA
-- Data: 21/12/2024
-- ============================================

-- Criar tabela de diagnósticos
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  symptoms TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  recommendations TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  estimated_cost TEXT,
  safe_to_drive BOOLEAN,
  ai_model TEXT DEFAULT 'gpt-4',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_diagnostics_workshop ON diagnostics(workshop_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_client ON diagnostics(client_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_vehicle ON diagnostics(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_created ON diagnostics(created_at DESC);

-- Comentários
COMMENT ON TABLE diagnostics IS 'Diagnósticos de veículos realizados com IA';
COMMENT ON COLUMN diagnostics.symptoms IS 'Sintomas descritos pelo usuário';
COMMENT ON COLUMN diagnostics.diagnosis IS 'Diagnóstico gerado pela IA';
COMMENT ON COLUMN diagnostics.recommendations IS 'Recomendações de reparo';
COMMENT ON COLUMN diagnostics.severity IS 'Gravidade: low, medium, high';
COMMENT ON COLUMN diagnostics.estimated_cost IS 'Estimativa de custo do reparo';
COMMENT ON COLUMN diagnostics.safe_to_drive IS 'Se é seguro continuar dirigindo';
COMMENT ON COLUMN diagnostics.ai_model IS 'Modelo de IA usado (gpt-4, claude-3, etc)';

-- Habilitar RLS
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- Policy: Workshop pode gerenciar seus diagnósticos
CREATE POLICY "Workshop manage diagnostics" ON diagnostics FOR ALL TO authenticated
USING (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()))
WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE profile_id = auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_diagnostics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_diagnostics_updated_at
BEFORE UPDATE ON diagnostics
FOR EACH ROW
EXECUTE FUNCTION update_diagnostics_updated_at();

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Tabela diagnostics criada com sucesso!';
  RAISE NOTICE '📊 RLS habilitado';
  RAISE NOTICE '🔒 Policies configuradas';
  RAISE NOTICE '⚡ Triggers configurados';
  RAISE NOTICE '🎯 Pronto para uso!';
END $$;

