# 🐛 Bugs Pendentes

Lista de bugs conhecidos e pendentes de correção.

---

## 🔴 CRÍTICO

### Coluna km não existe em vehicles
**Status:** SQL criado, aguardando execução no Supabase  
**Arquivo:** `supabase/fix-vehicles-km.sql`  
**Descrição:** A coluna `km` não existe nas tabelas `vehicles` e `motorist_vehicles`, causando erro ao tentar inserir/atualizar veículos com quilometragem.  
**Solução:** Executar o SQL no Supabase para adicionar a coluna.  
**Impacto:** Impede cadastro completo de veículos com quilometragem.

---

## 🟡 MÉDIO

### Busca por placa não funciona completamente
**Status:** Funcionalidade parcial  
**Descrição:** A busca por placa está implementada mas precisa de integração com API externa (DENATRAN, PlacaFipe, etc) para preencher automaticamente os dados do veículo.  
**Solução:** 
1. Pesquisar APIs disponíveis
2. Implementar integração
3. Manter fallback manual  
**Impacto:** Usuário precisa preencher dados manualmente.

### WhatsApp Business não verificado
**Status:** Aguardando verificação Meta  
**Descrição:** Integração WhatsApp está implementada mas não pode ser usada sem verificação da Meta.  
**Solução:** Completar processo de verificação ou remover temporariamente.  
**Impacto:** Funcionalidade de resposta via WhatsApp não disponível.

---

## 🟢 BAIXO

### Console.logs de debug em produção
**Status:** Parcialmente resolvido  
**Descrição:** Alguns `console.log` de debug ainda presentes no código, especialmente em auth e layouts.  
**Solução:** Remover logs desnecessários, manter apenas `console.error`.  
**Impacto:** Poluição do console, sem impacto funcional.

### Warnings do baseline-browser-mapping
**Status:** Informativo  
**Descrição:** Warnings sobre dados desatualizados do `baseline-browser-mapping` (>2 meses).  
**Solução:** Atualizar dependência: `npm i baseline-browser-mapping@latest -D`  
**Impacto:** Nenhum impacto funcional, apenas warnings no build.

---

## ✅ RESOLVIDO RECENTEMENTE

### ✅ Cadastro por email não criava profile
**Resolvido em:** Commit anterior  
**Solução:** Callback corrigido com fallback via API route com service role key.

### ✅ Avaliações não apareciam no perfil
**Resolvido em:** Commit anterior  
**Solução:** Adicionado `is_visible: true` por padrão e corrigida query de reviews.

### ✅ Foreign key constraint em reviews
**Resolvido em:** Commit anterior  
**Solução:** Removido `motorist_id` do insert, avaliações agora são anônimas.

### ✅ Trial era de 14 dias
**Resolvido em:** Commit atual  
**Solução:** Mudado para 7 dias em todo o sistema.

---

## 📋 PROCESSO DE REPORTE

### Como reportar um bug:
1. Descrever o comportamento esperado
2. Descrever o comportamento atual
3. Passos para reproduzir
4. Prints/logs se possível
5. Navegador e sistema operacional

### Prioridades:
- 🔴 **CRÍTICO:** Impede uso de funcionalidade essencial
- 🟡 **MÉDIO:** Funcionalidade parcial ou workaround disponível
- 🟢 **BAIXO:** Cosmético ou impacto mínimo

---

## 🔧 MANUTENÇÃO

### Tarefas de manutenção regular:
- [ ] Atualizar dependências mensalmente
- [ ] Revisar e remover console.logs
- [ ] Verificar performance
- [ ] Revisar acessibilidade
- [ ] Atualizar documentação

---

**Última atualização:** 15/02/2026
