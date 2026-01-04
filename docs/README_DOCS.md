# 📚 DOCUMENTAÇÃO DO PROJETO INSTAUTO

## 🎯 DOCUMENTOS ESSENCIAIS (LEIA PRIMEIRO!)

### **1. PANORAMA_PROJETO.md** ⭐⭐⭐⭐⭐
Visão geral completa do projeto, arquitetura, funcionalidades e roadmap.

### **2. FLUXO_GOOGLE_OAUTH.md** ⭐⭐⭐⭐⭐
Entenda como funciona a autenticação com Google (cadastro e login).

### **3. SQL_RLS_DEFINITIVO.sql** ⭐⭐⭐⭐⭐
Script SQL para configurar as políticas RLS no Supabase.

### **4. CONFIGURAR_EMAIL_SUPABASE.md** ⭐⭐⭐⭐
Como configurar emails transacionais no Supabase.

### **5. MCPs_RECOMENDADOS.md** ⭐⭐⭐⭐
Lista de MCPs úteis para o projeto.

---

## 🗄️ SCRIPTS SQL ÚTEIS

### **Para Configuração Inicial:**
- `SQL_RLS_DEFINITIVO.sql` - Configurar RLS (Row Level Security)
- `database-schema.sql` - Schema completo do banco

### **Para Diagnóstico:**
- `SQL_DIAGNOSTICO_COMPLETO.sql` - Verificar estado do banco
- `SQL_VERIFICAR_USUARIO.sql` - Verificar dados de um usuário específico

### **Para Limpeza:**
- `SQL_LIMPAR_USUARIOS.sql` - Limpar usuários de teste
- `SQL_LIMPAR_HISTORICO.sql` - Organizar histórico de queries

---

## 🔧 CONFIGURAÇÃO

### **Variáveis de Ambiente:**
Ver: `CONFIGURAR_ENV.md`

Necessárias:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### **Google OAuth:**
Ver: `CONFIGURAR_GOOGLE_OAUTH.md`

### **Emails:**
Ver: `CONFIGURAR_EMAIL_SUPABASE.md`

---

## 📁 ESTRUTURA DE PASTAS

```
docs/
├── README_DOCS.md (este arquivo)
├── PANORAMA_PROJETO.md (visão geral)
├── FLUXO_GOOGLE_OAUTH.md (autenticação)
├── MCPs_RECOMENDADOS.md (ferramentas)
├── SQL_RLS_DEFINITIVO.sql (configuração RLS)
├── database-schema.sql (schema completo)
└── _antigos/ (documentos antigos/histórico)
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Autenticação funcionando
2. 🔜 Implementar pagamentos (Stripe)
3. 🔜 Configurar emails (Resend)
4. 🔜 Melhorar dashboards
5. 🔜 Implementar marketplace completo

---

## 📝 NOTAS

- Documentos na pasta `_antigos/` são para referência histórica
- Sempre use os scripts SQL da raiz de `docs/`
- Para dúvidas, consulte `PANORAMA_PROJETO.md` primeiro

---

**Última atualização:** Janeiro 2025

