# 🚀 Configuração do Supabase - Instauto V10

## Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Clique em "New Project"
5. Preencha:
   - **Name**: instauto-v10
   - **Database Password**: (escolha uma senha forte)
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"

## Passo 2: Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl+Enter)
6. Aguarde a execução (pode levar alguns segundos)
7. Verifique se não há erros

## Passo 3: Configurar Autenticação

### Email/Senha

1. Vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Auth**:
   - ✅ Enable email provider
   - ✅ Confirm email (opcional - desabilite para desenvolvimento)

### Google OAuth (Opcional)

1. Vá em **Authentication** > **Providers**
2. Clique em **Google**
3. Habilite o provider
4. Configure as credenciais OAuth:
   - Crie um projeto no [Google Cloud Console](https://console.cloud.google.com)
   - Ative a API "Google+ API"
   - Crie credenciais OAuth 2.0
   - Adicione as URLs de redirecionamento do Supabase
   - Copie Client ID e Client Secret
   - Cole no Supabase

## Passo 4: Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Passo 5: Configurar Variáveis de Ambiente

1. No projeto Next.js, crie o arquivo `.env.local` na raiz
2. Adicione as credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

## Passo 6: Testar a Conexão

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse [http://localhost:3000](http://localhost:3000)
3. Clique em "Começar Grátis"
4. Crie uma conta de teste
5. Verifique se:
   - A conta foi criada
   - Você foi redirecionado para o dashboard
   - As tabelas foram populadas no Supabase

## Passo 7: Verificar Dados no Supabase

1. Vá em **Table Editor** no Supabase
2. Verifique se as seguintes tabelas foram criadas:
   - ✅ profiles
   - ✅ workshops
   - ✅ clients
   - ✅ vehicles
   - ✅ service_orders

3. Clique em **profiles** e verifique se seu usuário foi criado
4. Clique em **workshops** e verifique se sua oficina foi criada automaticamente

## 🔒 Segurança - Row Level Security (RLS)

O schema já inclui políticas RLS que garantem:

- ✅ Usuários só veem seus próprios dados
- ✅ Oficinas só acessam seus clientes/veículos/OS
- ✅ Proteção contra acesso não autorizado
- ✅ Triggers automáticos para criar perfis e oficinas

## 📊 View de Estatísticas

O schema inclui uma view `workshop_stats` que calcula automaticamente:

- Total de clientes
- Total de veículos
- Total de ordens de serviço
- OS pendentes, em andamento e concluídas
- Faturamento total

Esta view é usada no dashboard principal.

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Execute novamente o schema SQL
- Verifique se todas as tabelas foram criadas

### Erro: "new row violates row-level security policy"
- Verifique se as policies foram criadas
- Confirme que o usuário está autenticado

### Erro: "Invalid API key"
- Verifique se copiou a chave correta (anon public)
- Confirme que o arquivo .env.local está na raiz do projeto
- Reinicie o servidor após alterar .env.local

### Erro ao fazer login
- Verifique se o Email Auth está habilitado
- Desabilite "Confirm email" para desenvolvimento
- Verifique os logs em Authentication > Logs

## 🎯 Próximos Passos

Após configurar o Supabase:

1. ✅ Teste o cadastro e login
2. ✅ Crie alguns clientes de teste
3. ✅ Cadastre veículos
4. ✅ Crie ordens de serviço
5. ✅ Verifique as estatísticas no dashboard

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

