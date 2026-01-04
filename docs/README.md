# Instauto v10

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Supabase (Auth + Database)
- Vercel (Deploy)

## Usuários
- **Motorista**: Grátis sempre. Dashboard: `/motorista`
- **Oficina**: R$97/mês (14 dias grátis). Dashboard: `/oficina`

## Fluxo de Autenticação
1. Cadastro (email/senha ou Google OAuth)
2. Confirmação de email (se cadastro por email)
3. Redirecionamento automático para dashboard

## Rotas Principais
- `/` - Home
- `/cadastro-motorista`, `/login-motorista` - Auth motorista
- `/cadastro-oficina`, `/login-oficina` - Auth oficina
- `/motorista` - Dashboard motorista
- `/oficina` - Dashboard oficina
- `/completar-cadastro` - Dados adicionais da oficina
- `/auth/callback` - OAuth callback

## Estrutura do Banco (Supabase)
- `profiles` - Dados básicos do usuário (id, email, name, type)
- `motorists` - Dados específicos do motorista
- `workshops` - Dados da oficina (CNPJ, endereço, plano, etc)

## Variáveis de Ambiente (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deploy
- Push para `main` → Deploy automático no Vercel
- Configurar variáveis de ambiente no Vercel

## Desenvolvimento Local
```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`
