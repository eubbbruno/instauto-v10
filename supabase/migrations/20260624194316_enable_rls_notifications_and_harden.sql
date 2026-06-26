-- SEGURANÇA: notifications tinha políticas mas RLS desabilitado (tabela estava aberta)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Higiene: fixar search_path da função de reviews (advisor 0011)
ALTER FUNCTION public.update_reviews_updated_at() SET search_path = public;
