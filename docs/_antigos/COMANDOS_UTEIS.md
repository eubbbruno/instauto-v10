# 🛠️ Comandos Úteis - Instauto V10

## 📦 Gerenciamento de Dependências

```bash
# Instalar todas as dependências
npm install

# Adicionar nova dependência
npm install nome-do-pacote

# Adicionar dependência de desenvolvimento
npm install -D nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Limpar cache do npm
npm cache clean --force
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em porta específica
npm run dev -- -p 3001

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Rodar linter
npm run lint

# Rodar linter e corrigir automaticamente
npm run lint -- --fix
```

## 🗄️ Supabase

### Comandos SQL Úteis

```sql
-- Ver todos os usuários
SELECT * FROM auth.users;

-- Ver todos os perfis
SELECT * FROM profiles;

-- Ver todas as oficinas
SELECT * FROM workshops;

-- Ver clientes de uma oficina específica
SELECT * FROM clients WHERE workshop_id = 'uuid-da-oficina';

-- Ver estatísticas de uma oficina
SELECT * FROM workshop_stats WHERE profile_id = 'uuid-do-usuario';

-- Limpar dados de teste
DELETE FROM service_orders;
DELETE FROM vehicles;
DELETE FROM clients;
DELETE FROM workshops;
DELETE FROM profiles;

-- Resetar auto-increment (se necessário)
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
```

### Supabase CLI (Opcional)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Inicializar projeto local
supabase init

# Iniciar Supabase local
supabase start

# Parar Supabase local
supabase stop

# Ver status
supabase status

# Aplicar migrations
supabase db push

# Gerar types do TypeScript
supabase gen types typescript --local > types/supabase.ts
```

## 🧪 Testes (Futuro)

```bash
# Rodar todos os testes
npm test

# Rodar testes em watch mode
npm test -- --watch

# Rodar testes com coverage
npm test -- --coverage

# Rodar testes E2E
npm run test:e2e
```

## 🎨 Tailwind CSS

```bash
# Gerar classes Tailwind
npx tailwindcss -i ./app/globals.css -o ./output.css

# Watch mode
npx tailwindcss -i ./app/globals.css -o ./output.css --watch

# Minificar CSS
npx tailwindcss -i ./app/globals.css -o ./output.css --minify
```

## 🔧 shadcn/ui

```bash
# Adicionar componente
npx shadcn-ui@latest add button

# Adicionar múltiplos componentes
npx shadcn-ui@latest add button card input

# Listar componentes disponíveis
npx shadcn-ui@latest add

# Atualizar componentes
npx shadcn-ui@latest update
```

## 📊 Análise de Código

```bash
# Verificar tamanho do bundle
npm run build
# Depois verificar em .next/analyze

# Analisar dependências
npm ls

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 🐛 Debug

```bash
# Modo debug do Node
NODE_OPTIONS='--inspect' npm run dev

# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ver logs detalhados
npm run dev -- --debug

# Verificar variáveis de ambiente
node -e "console.log(process.env)"
```

## 🚀 Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains

# Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Build Local

```bash
# Build otimizado
npm run build

# Analisar build
npm run build && npm run analyze

# Testar build localmente
npm run build && npm start
```

## 📝 Git

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: implementa setup inicial"

# Ver status
git status

# Ver histórico
git log --oneline

# Criar branch
git checkout -b feature/nova-funcionalidade

# Mudar de branch
git checkout main

# Merge
git merge feature/nova-funcionalidade

# Push
git push origin main

# Pull
git pull origin main

# Ver branches
git branch -a

# Deletar branch
git branch -d feature/nome
```

## 🔍 Busca e Navegação

```bash
# Buscar em arquivos
grep -r "texto" .

# Buscar arquivos por nome
find . -name "*.tsx"

# Contar linhas de código
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Ver estrutura de pastas
tree -L 3 -I node_modules
```

## 📦 Backup e Restore

### Banco de Dados

```bash
# Backup do schema
# No Supabase Dashboard: Settings > Database > Backup

# Backup via SQL
# Copiar o conteúdo de supabase/schema.sql
```

### Projeto

```bash
# Criar backup
tar -czf instauto-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .

# Restaurar backup
tar -xzf instauto-backup-20240129.tar.gz
npm install
```

## 🔐 Segurança

```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências vulneráveis
npm audit fix

# Verificar licenças
npx license-checker

# Verificar secrets no código
npx detect-secrets scan
```

## 📊 Performance

```bash
# Analisar bundle
npm run build
npx @next/bundle-analyzer

# Lighthouse CI
npx lighthouse http://localhost:3000 --view

# Verificar performance
npm run build && npm start
# Abrir DevTools > Lighthouse
```

## 🎯 Produtividade

```bash
# Abrir projeto no VS Code
code .

# Abrir arquivo específico
code app/page.tsx

# Formatar código com Prettier
npx prettier --write .

# Verificar formatação
npx prettier --check .
```

## 🆘 Troubleshooting

```bash
# Erro de porta em uso
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Erro de permissão npm
sudo chown -R $(whoami) ~/.npm

# Limpar tudo e recomeçar
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Verificar versões
node -v
npm -v
npx next -v
```

## 📚 Documentação Rápida

```bash
# Gerar documentação de tipos
npx typedoc --out docs src

# Gerar changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Gerar README automático
npx readme-md-generator
```

## 🎨 Customização

```bash
# Adicionar fonte do Google
# Adicionar em app/layout.tsx

# Gerar favicon
# Use https://realfavicongenerator.net/

# Otimizar imagens
npx @squoosh/cli --resize '{width: 800}' image.jpg
```

---

## 📝 Aliases Úteis (Opcional)

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
# Aliases do projeto
alias dev="npm run dev"
alias build="npm run build"
alias start="npm start"
alias lint="npm run lint"

# Git aliases
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline"

# Supabase aliases
alias sb="supabase"
alias sbs="supabase status"
alias sbstart="supabase start"
alias sbstop="supabase stop"
```

---

## 🔗 Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React](https://react.dev)
- [Vercel](https://vercel.com/docs)

---

**💡 Dica**: Salve este arquivo nos favoritos para referência rápida!

