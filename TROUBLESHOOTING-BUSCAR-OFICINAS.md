# 🔧 TROUBLESHOOTING: /buscar-oficinas

## PROBLEMA: Página não mostra oficinas

---

## PASSO 1: VERIFICAR NO NAVEGADOR

1. Acesse: `http://localhost:3000/buscar-oficinas`
2. Abra o Console (F12)
3. Procure por logs:

```
🔍 [BuscarOficinas] Iniciando busca de oficinas públicas...
🔍 [BuscarOficinas] Resultado: { count: X, error: ..., sample: ... }
✅ [BuscarOficinas] Oficinas carregadas: X
```

### CENÁRIO A: Logs não aparecem
- **Causa**: Página não está executando o useEffect
- **Solução**: Verificar se há erro de JavaScript no console

### CENÁRIO B: count = 0 (sem erro)
- **Causa**: Banco não tem oficinas públicas
- **Solução**: Execute `supabase/debug-workshops.sql` no Supabase SQL Editor

### CENÁRIO C: error aparece
- **Causa**: RLS bloqueando ou query errada
- **Solução**: Execute `supabase/fix-workshops-public-rls.sql`

---

## PASSO 2: VERIFICAR BANCO DE DADOS

Execute no Supabase SQL Editor:

```sql
-- Verificar se existem oficinas públicas
SELECT COUNT(*) FROM workshops WHERE is_public = true;
```

### Se retornar 0:
Execute:
```sql
-- Tornar todas oficinas públicas
UPDATE workshops SET is_public = true;
```

---

## PASSO 3: VERIFICAR RLS

Execute no Supabase SQL Editor:

```sql
-- Ver policies da tabela workshops
SELECT * FROM pg_policies WHERE tablename = 'workshops';
```

### Deve ter a policy: `workshops_public_read`

Se NÃO tiver, execute:
```sql
-- Executar o script completo
-- supabase/fix-workshops-public-rls.sql
```

---

## PASSO 4: VERIFICAR VARIÁVEIS DE AMBIENTE

Arquivo: `.env.local`

Deve ter:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### Verificar se são do projeto CORRETO (novo Supabase)

---

## PASSO 5: TESTAR QUERY DIRETAMENTE

No console do navegador (F12), cole:

```javascript
const { createClient } = await import('@supabase/ssr');

const supabase = createClient(
  'SUA_URL_AQUI',
  'SUA_ANON_KEY_AQUI'
);

const { data, error } = await supabase
  .from('workshops')
  .select('*')
  .eq('is_public', true);

console.log('Resultado:', { count: data?.length, error, data });
```

---

## CHECKLIST DE DIAGNÓSTICO:

- [ ] Acessar /buscar-oficinas e abrir console (F12)
- [ ] Verificar logs no console
- [ ] Executar `supabase/debug-workshops.sql` no Supabase
- [ ] Verificar se `public_workshops > 0`
- [ ] Executar `supabase/fix-workshops-public-rls.sql` se necessário
- [ ] Tornar oficinas públicas: `UPDATE workshops SET is_public = true`
- [ ] Verificar `.env.local` tem credenciais corretas
- [ ] Recarregar página e verificar novamente

---

## SOLUÇÃO RÁPIDA (EMERGÊNCIA):

Se nada funcionar, execute no Supabase SQL Editor:

```sql
-- 1. Tornar todas oficinas públicas
UPDATE workshops SET is_public = true;

-- 2. Desabilitar RLS temporariamente (CUIDADO!)
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;

-- 3. Recarregar página
-- Deve funcionar agora

-- 4. Reabilitar RLS depois
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- 5. Executar supabase/fix-workshops-public-rls.sql
```

---

## INFORMAÇÕES ADICIONAIS:

### Painel de Debug na Página:
- Aparece automaticamente se `workshops.length === 0`
- Mostra em amarelo com possíveis causas
- Orienta verificar console

### Logs Implementados:
- `🔍 [BuscarOficinas]` = Início da busca
- `✅ [BuscarOficinas]` = Sucesso
- `❌ [BuscarOficinas]` = Erro

### Contador de Resultados:
- Mostra "X oficinas encontradas"
- Debug: "Total carregadas: X | Loading: Sim/Não"
- Ajuda identificar se problema é filtro ou query

---

## CONTATO:

Se o problema persistir após todos os passos:
1. Tire print do console (F12)
2. Tire print do resultado do `debug-workshops.sql`
3. Verifique se `.env.local` está correto
