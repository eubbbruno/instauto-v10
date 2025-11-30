# 🧪 Guia de Teste - Instauto V10

## 📋 Checklist de Testes

### ✅ Pré-requisitos

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em http://localhost:3000

---

## 1️⃣ TESTE DE CADASTRO

### Passo a Passo

1. **Acessar página de cadastro**
   - Ir para http://localhost:3000/cadastro
   - Ou clicar em "Começar Grátis" na landing page

2. **Preencher formulário**
   ```
   Nome da Oficina: Oficina Teste
   Email: teste@oficina.com
   Senha: Teste@123
   Confirmar Senha: Teste@123
   ```

3. **Clicar em "Criar Conta Grátis"**

4. **Verificar:**
   - ✅ Mensagem de sucesso aparece
   - ✅ Redirecionamento para /login
   - ✅ Pode fazer login com as credenciais

### Verificar no Supabase

1. **Table Editor > profiles**
   - ✅ Novo registro criado
   - ✅ `email`: teste@oficina.com
   - ✅ `name`: Oficina Teste
   - ✅ `type`: oficina

2. **Table Editor > workshops**
   - ✅ Novo registro criado automaticamente
   - ✅ `profile_id`: mesmo ID do profile
   - ✅ `name`: Oficina Teste
   - ✅ `plan_type`: free
   - ✅ `trial_ends_at`: data futura (14 dias)

### Possíveis Erros

❌ **"Email already registered"**
- Solução: Use outro email ou delete o registro existente

❌ **"relation does not exist"**
- Solução: Execute o schema SQL novamente

❌ **"Invalid API key"**
- Solução: Verifique o .env.local

---

## 2️⃣ TESTE DE LOGIN

### Passo a Passo

1. **Acessar página de login**
   - Ir para http://localhost:3000/login

2. **Preencher credenciais**
   ```
   Email: teste@oficina.com
   Senha: Teste@123
   ```

3. **Clicar em "Entrar"**

4. **Verificar:**
   - ✅ Redirecionamento para /oficina
   - ✅ Dashboard carrega
   - ✅ Nome da oficina aparece na sidebar
   - ✅ Estatísticas aparecem (mesmo que zeradas)

### Verificar no Dashboard

- ✅ **Sidebar** mostra:
  - Nome da oficina
  - Email do usuário
  - Menu de navegação
  - Botão de logout

- ✅ **Dashboard** mostra:
  - Total de clientes: 0
  - Total de veículos: 0
  - Total de OS: 0
  - Faturamento: R$ 0.00
  - Status das OS (todas zeradas)

---

## 3️⃣ TESTE DE CRUD DE CLIENTES

### 3.1 Criar Cliente

1. **Ir para /oficina/clientes**
   - Clicar em "Clientes" na sidebar

2. **Clicar em "Novo Cliente"**

3. **Preencher formulário**
   ```
   Nome: João da Silva
   Email: joao@email.com
   Telefone: (11) 98765-4321
   CPF: 123.456.789-00
   Observações: Cliente preferencial
   ```

4. **Clicar em "Salvar"**

5. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Modal fecha
   - ✅ Cliente aparece na tabela
   - ✅ Contador atualiza (1/10 clientes)

### Verificar no Supabase

1. **Table Editor > clients**
   - ✅ Novo registro criado
   - ✅ `workshop_id`: ID da oficina
   - ✅ Todos os campos preenchidos corretamente

### 3.2 Buscar Cliente

1. **Na página de clientes**
   - Digitar "João" no campo de busca

2. **Verificar:**
   - ✅ Apenas clientes com "João" no nome aparecem
   - ✅ Busca funciona para email, telefone e CPF

### 3.3 Editar Cliente

1. **Clicar no ícone de editar (lápis)**

2. **Alterar dados**
   ```
   Nome: João da Silva Santos
   Telefone: (11) 91234-5678
   ```

3. **Clicar em "Salvar"**

4. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Dados atualizados na tabela
   - ✅ Alterações refletidas no Supabase

### 3.4 Deletar Cliente

1. **Clicar no ícone de deletar (lixeira)**

2. **Confirmar exclusão**

3. **Verificar:**
   - ✅ Modal de confirmação aparece
   - ✅ Toast de sucesso aparece
   - ✅ Cliente removido da tabela
   - ✅ Contador atualiza (0/10 clientes)
   - ✅ Registro deletado no Supabase

---

## 4️⃣ TESTE DE LIMITE DO PLANO FREE

### Criar 10 Clientes

1. **Criar clientes de teste**
   - Cliente 1: Maria Silva
   - Cliente 2: Pedro Santos
   - Cliente 3: Ana Costa
   - Cliente 4: Carlos Oliveira
   - Cliente 5: Juliana Lima
   - Cliente 6: Roberto Alves
   - Cliente 7: Fernanda Souza
   - Cliente 8: Marcos Pereira
   - Cliente 9: Patrícia Rocha
   - Cliente 10: Lucas Martins

2. **Verificar alerta**
   - ✅ Ao chegar em 8 clientes, alerta amarelo aparece
   - ✅ Mensagem: "Limite próximo"
   - ✅ Botão "Fazer Upgrade para PRO"

3. **Tentar criar 11º cliente**
   - ✅ Toast de erro aparece
   - ✅ Mensagem: "Limite atingido"
   - ✅ Modal não abre

### Testar Plano PRO

1. **Alterar plano no Supabase**
   ```sql
   UPDATE workshops
   SET plan_type = 'pro'
   WHERE profile_id = 'seu-uuid';
   ```

2. **Recarregar página**

3. **Verificar:**
   - ✅ Contador muda para "Clientes" (sem limite)
   - ✅ Alerta amarelo desaparece
   - ✅ Pode criar mais de 10 clientes

---

## 5️⃣ TESTE DE SEGURANÇA (RLS)

### Criar Segunda Oficina

1. **Fazer logout**

2. **Criar nova conta**
   ```
   Nome: Oficina 2
   Email: teste2@oficina.com
   Senha: Teste@123
   ```

3. **Fazer login com oficina 2**

4. **Criar cliente na oficina 2**
   ```
   Nome: Cliente Oficina 2
   ```

5. **Verificar:**
   - ✅ Oficina 2 só vê seus próprios clientes
   - ✅ Oficina 1 não vê clientes da oficina 2
   - ✅ RLS está funcionando corretamente

### Testar no Supabase

1. **Tentar query sem autenticação**
   ```sql
   SELECT * FROM clients;
   ```
   - ✅ Deve retornar erro de permissão

2. **Query com RLS**
   - ✅ Só retorna clientes da oficina autenticada

---

## 6️⃣ TESTE DE LOGOUT

1. **Clicar em "Sair" na sidebar**

2. **Verificar:**
   - ✅ Redirecionamento para /
   - ✅ Sessão encerrada
   - ✅ Não consegue acessar /oficina sem login
   - ✅ Redirecionado para /login ao tentar acessar rotas protegidas

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Causa**: Supabase não está respondendo

**Solução**:
1. Verificar se o projeto Supabase está ativo
2. Verificar variáveis de ambiente
3. Verificar conexão com internet

### Erro: "Invalid credentials"

**Causa**: Email/senha incorretos

**Solução**:
1. Verificar se o usuário foi criado no Supabase
2. Tentar resetar senha
3. Criar novo usuário

### Erro: "Workshop not found"

**Causa**: Trigger não criou workshop automaticamente

**Solução**:
1. Verificar se o trigger existe no Supabase
2. Criar workshop manualmente:
   ```sql
   INSERT INTO workshops (profile_id, name, plan_type)
   VALUES ('uuid-do-profile', 'Nome Oficina', 'free');
   ```

### Erro: "Cannot read properties of null"

**Causa**: Dados não carregaram

**Solução**:
1. Verificar console do navegador
2. Verificar se há erros de RLS
3. Verificar se o usuário está autenticado

### Toast não aparece

**Causa**: Toaster não foi adicionado ao layout

**Solução**:
1. Verificar se `<Toaster />` está no app/layout.tsx
2. Verificar se a dependência foi instalada
3. Reiniciar o servidor

---

## ✅ Checklist Final

Após todos os testes:

- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Profile criado automaticamente
- [ ] Workshop criado automaticamente
- [ ] Dashboard carrega
- [ ] Criar cliente funciona
- [ ] Editar cliente funciona
- [ ] Deletar cliente funciona
- [ ] Busca funciona
- [ ] Limite FREE funciona
- [ ] Alerta de limite aparece
- [ ] RLS protege dados
- [ ] Toast de feedback aparece
- [ ] Logout funciona
- [ ] Sem erros no console
- [ ] Sem erros de lint

---

## 📊 Métricas de Sucesso

### Performance
- ✅ Página carrega em < 2s
- ✅ CRUD responde em < 1s
- ✅ Sem travamentos

### UX
- ✅ Feedback visual em todas ações
- ✅ Loading states funcionam
- ✅ Mensagens de erro claras
- ✅ Confirmações antes de deletar

### Segurança
- ✅ RLS ativo e funcionando
- ✅ Rotas protegidas
- ✅ Dados isolados por oficina

---

## 🎯 Próximos Testes

Após validar o CRUD de clientes:

1. [ ] Implementar CRUD de veículos
2. [ ] Implementar CRUD de ordens de serviço
3. [ ] Testar relacionamentos (cliente → veículo → OS)
4. [ ] Testar limites de OS (30/mês no FREE)
5. [ ] Testar estatísticas do dashboard

---

**✅ Testes completos = Sistema validado e pronto para continuar!**

