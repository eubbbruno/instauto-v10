# 🚗 EXECUTAR SQL DO MARKETPLACE

## ⚠️ IMPORTANTE
Você precisa executar este SQL no Supabase para ativar o marketplace de motoristas!

---

## 📋 O QUE SERÁ CRIADO:

1. **Tabela `quotes`** - Orçamentos de motoristas para oficinas
2. **Tabela `reviews`** - Avaliações de motoristas
3. **Novos campos em `workshops`** - Para marketplace público
4. **Views úteis** - Para consultas otimizadas
5. **Triggers automáticos** - Para atualizar ratings

---

## 🔧 PASSO A PASSO:

### 1️⃣ Acesse o Supabase:
- Vá para: https://supabase.com/dashboard
- Entre no projeto: **Instauto V10**

### 2️⃣ Abra o SQL Editor:
- No menu lateral, clique em **SQL Editor**
- Clique em **New Query**

### 3️⃣ Cole o SQL:
- Abra o arquivo: `docs/database-migration-marketplace.sql`
- Copie TODO o conteúdo
- Cole no SQL Editor do Supabase

### 4️⃣ Execute:
- Clique no botão **Run** (ou pressione `Ctrl+Enter`)
- Aguarde a mensagem: **"Migration completed successfully!"**

### 5️⃣ Verifique:
Execute este SQL para confirmar:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quotes', 'reviews');
```

Deve retornar as 2 tabelas.

---

## ✅ APÓS EXECUTAR:

### Páginas que estarão funcionando:

#### Para Motoristas (Público):
- ✅ `/buscar-oficinas` - Buscar oficinas
- ✅ `/oficina/[id]` - Detalhes da oficina
- ✅ `/solicitar-orcamento` - Solicitar orçamento
- ✅ `/avaliar-oficina` - Deixar avaliação

#### Para Oficinas (Dashboard):
- ✅ `/oficina/orcamentos` - Gerenciar orçamentos recebidos

---

## 🔒 SEGURANÇA:

Todas as políticas RLS (Row Level Security) serão criadas automaticamente:
- ✅ Motoristas podem criar orçamentos e reviews (público)
- ✅ Oficinas veem apenas seus próprios orçamentos
- ✅ Oficinas podem responder e gerenciar reviews
- ✅ Apenas reviews visíveis aparecem publicamente

---

## 🤖 AUTOMAÇÕES:

Triggers que serão criados:
- ✅ Atualização automática de `average_rating` quando review é criada
- ✅ Atualização automática de `total_reviews`
- ✅ Atualização de `updated_at` em quotes e reviews

---

## 🐛 SE DER ERRO:

### Erro: "relation already exists"
As tabelas já existem. Você pode:
1. Ignorar (está tudo certo!)
2. Ou limpar e recriar:

```sql
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
```

E depois executar o SQL completo novamente.

### Erro: "column already exists"
Os campos já foram adicionados. Pode ignorar!

---

## 📞 PRÓXIMOS PASSOS:

Após executar o SQL:

1. **Testar busca de oficinas:**
   - Acesse: `https://www.instauto.com.br/buscar-oficinas`
   - Verifique se sua oficina aparece

2. **Configurar sua oficina para marketplace:**
   - Acesse: `/oficina/configuracoes`
   - Marque "Aparecer no marketplace"
   - Adicione descrição e serviços

3. **Testar orçamentos:**
   - Solicite um orçamento de teste
   - Veja se aparece em `/oficina/orcamentos`

---

## 📚 DOCUMENTAÇÃO COMPLETA:

Leia o arquivo `docs/MARKETPLACE_MOTORISTAS.md` para entender:
- Como funciona o fluxo completo
- Estrutura das tabelas
- Segurança e políticas RLS
- Melhorias futuras

---

**Criado em:** 23/01/2025  
**Arquivo SQL:** `docs/database-migration-marketplace.sql`

