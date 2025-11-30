# 📋 Teste do CRUD de Ordens de Serviço

## ✅ Pré-requisitos

- [ ] Schema SQL executado
- [ ] Servidor rodando
- [ ] Pelo menos 1 cliente cadastrado
- [ ] Pelo menos 1 veículo cadastrado
- [ ] Logado na oficina

---

## 1️⃣ ACESSAR PÁGINA DE ORDENS

1. **Clicar em "Ordens de Serviço" na sidebar**
   - Ou acessar: http://localhost:3000/oficina/ordens

2. **Verificar:**
   - ✅ Página carrega sem erros
   - ✅ Título "Ordens de Serviço" aparece
   - ✅ Botão "Nova OS" visível
   - ✅ Campo de busca presente
   - ✅ Contador de OS do mês (X/30 OS este mês)

---

## 2️⃣ CRIAR PRIMEIRA ORDEM DE SERVIÇO

### Sem Cliente/Veículo

1. **Clicar em "Nova OS"**

2. **Verificar:**
   - ✅ Toast de erro se não houver clientes
   - ✅ Mensagem: "Você precisa cadastrar pelo menos um cliente..."

3. **Preparar dados:**
   - Cadastrar cliente: "João da Silva"
   - Cadastrar veículo: ABC-1234 - Volkswagen Gol

### Criar OS

1. **Voltar para /oficina/ordens**

2. **Clicar em "Nova OS"**

3. **Preencher formulário:**
   ```
   Cliente: João da Silva
   Veículo: ABC-1234 - Volkswagen Gol
   Status: Pendente
   Serviços: Troca de óleo e filtros
   Mão de Obra: 150.00
   Peças: 250.00
   Observações: Cliente preferencial
   ```

4. **Verificar:**
   - ✅ Ao selecionar cliente, veículos são carregados
   - ✅ Dropdown de veículos mostra apenas veículos do cliente
   - ✅ Total calculado automaticamente (R$ 400,00)
   - ✅ Total atualiza ao digitar valores

5. **Clicar em "Salvar"**

6. **Verificar:**
   - ✅ Toast de sucesso com número da OS
   - ✅ Mensagem: "Ordem de serviço OS-2024-0001 criada..."
   - ✅ Modal fecha
   - ✅ OS aparece na tabela
   - ✅ Número sequencial correto (OS-2024-0001)
   - ✅ Status com cor amarela (Pendente)
   - ✅ Total formatado (R$ 400,00)

---

## 3️⃣ VERIFICAR NO SUPABASE

1. **Table Editor > service_orders**
   - ✅ Novo registro criado
   - ✅ `workshop_id`: ID da oficina
   - ✅ `client_id`: ID do João
   - ✅ `vehicle_id`: ID do veículo
   - ✅ `order_number`: OS-2024-0001
   - ✅ `status`: pending
   - ✅ `services`: Troca de óleo e filtros
   - ✅ `labor_cost`: 150.00
   - ✅ `parts_cost`: 250.00
   - ✅ `total`: 400.00

---

## 4️⃣ TESTAR NÚMERO SEQUENCIAL

1. **Criar segunda OS:**
   ```
   Cliente: João da Silva
   Veículo: ABC-1234
   Serviços: Alinhamento e balanceamento
   Mão de Obra: 80.00
   Peças: 0.00
   ```

2. **Verificar:**
   - ✅ Número gerado: OS-2024-0002
   - ✅ Sequencial incrementado

3. **Criar terceira OS:**
   ```
   Cliente: Maria Santos (criar se necessário)
   Veículo: XYZ-5678 (criar se necessário)
   Serviços: Revisão completa
   Mão de Obra: 300.00
   Peças: 500.00
   ```

4. **Verificar:**
   - ✅ Número gerado: OS-2024-0003
   - ✅ Total: R$ 800,00

---

## 5️⃣ TESTAR MUDANÇA DE STATUS

### Workflow Completo

1. **OS-2024-0001 (Pendente)**
   - ✅ Status amarelo
   - ✅ Label: "Pendente"

2. **Mudar para "Em Andamento"**
   - Clicar no dropdown de status
   - Selecionar "Em Andamento"

3. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Status muda para azul
   - ✅ Label: "Em Andamento"
   - ✅ Atualizado no Supabase

4. **Mudar para "Concluída"**
   - Selecionar "Concluída"

5. **Verificar:**
   - ✅ Status muda para verde
   - ✅ Label: "Concluída"
   - ✅ `completed_at` preenchido no Supabase

6. **Testar "Cancelada"**
   - Criar nova OS
   - Mudar status para "Cancelada"

7. **Verificar:**
   - ✅ Status vermelho
   - ✅ Label: "Cancelada"

---

## 6️⃣ TESTAR BUSCA

1. **Buscar por número da OS**
   - Digitar "OS-2024-0001"
   - ✅ Apenas OS-2024-0001 aparece

2. **Buscar por cliente**
   - Digitar "João"
   - ✅ Apenas OS do João aparecem

3. **Buscar por placa**
   - Digitar "ABC"
   - ✅ Apenas OS com veículo ABC-1234 aparecem

4. **Limpar busca**
   - ✅ Todas as OS voltam

---

## 7️⃣ EDITAR ORDEM DE SERVIÇO

1. **Clicar no ícone de editar (lápis)**

2. **Verificar:**
   - ✅ Modal abre
   - ✅ Todos os campos preenchidos
   - ✅ Cliente e veículo corretos
   - ✅ Total calculado corretamente

3. **Alterar dados:**
   ```
   Serviços: Troca de óleo, filtros e velas
   Mão de Obra: 200.00
   Peças: 350.00
   ```

4. **Verificar:**
   - ✅ Total atualiza para R$ 550,00

5. **Clicar em "Salvar"**

6. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Dados atualizados na tabela
   - ✅ Total atualizado
   - ✅ Alterações no Supabase

---

## 8️⃣ DELETAR ORDEM DE SERVIÇO

1. **Clicar no ícone de deletar (lixeira)**

2. **Verificar:**
   - ✅ Modal de confirmação aparece
   - ✅ Mensagem clara

3. **Confirmar exclusão**

4. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ OS removida da tabela
   - ✅ Registro deletado no Supabase
   - ✅ Contador de OS do mês atualiza

---

## 9️⃣ TESTAR LIMITE DO PLANO FREE

### Criar 30 OS

1. **Criar OS até atingir 25**
   - ✅ Ao chegar em 25, alerta amarelo aparece
   - ✅ Mensagem: "Limite próximo"
   - ✅ Botão "Fazer Upgrade para PRO"

2. **Criar mais 5 OS (total 30)**
   - ✅ Todas são criadas normalmente
   - ✅ Contador mostra 30/30

3. **Tentar criar 31ª OS**
   - ✅ Toast de erro aparece
   - ✅ Mensagem: "Limite atingido"
   - ✅ Modal não abre

### Testar Plano PRO

1. **Alterar plano no Supabase:**
   ```sql
   UPDATE workshops
   SET plan_type = 'pro'
   WHERE profile_id = 'seu-uuid';
   ```

2. **Recarregar página**

3. **Verificar:**
   - ✅ Contador desaparece
   - ✅ Alerta amarelo desaparece
   - ✅ Pode criar mais de 30 OS

---

## 🔟 TESTAR RELACIONAMENTOS

### Cliente → Veículo → OS

1. **Criar cenário:**
   ```
   Cliente: Pedro Costa
   ├── Veículo 1: DEF-9012 - Chevrolet Onix
   │   └── OS-2024-0010: Troca de pneus
   └── Veículo 2: GHI-3456 - Honda Civic
       └── OS-2024-0011: Revisão
   ```

2. **Verificar:**
   - ✅ Ao criar OS, dropdown mostra apenas veículos do Pedro
   - ✅ Não mostra veículos de outros clientes

### Deletar Cliente com OS

1. **Tentar deletar cliente que tem OS**

2. **Verificar:**
   - ✅ Cliente é deletado
   - ✅ OS do cliente ficam com client_id = NULL (SET NULL)
   - ✅ OS ainda aparecem na lista
   - ✅ Cliente aparece como "-"

### Deletar Veículo com OS

1. **Tentar deletar veículo que tem OS**

2. **Verificar:**
   - ✅ Veículo é deletado
   - ✅ OS do veículo ficam com vehicle_id = NULL
   - ✅ OS ainda aparecem na lista
   - ✅ Veículo aparece como "-"

---

## 1️⃣1️⃣ VALIDAÇÕES

### Campos Obrigatórios

1. **Tentar salvar sem cliente**
   - ✅ Formulário não envia
   - ✅ Campo destacado

2. **Tentar salvar sem veículo**
   - ✅ Formulário não envia
   - ✅ Campo destacado

3. **Tentar salvar sem serviços**
   - ✅ Formulário não envia
   - ✅ Campo destacado

### Cálculo de Total

1. **Mão de Obra: 100, Peças: 200**
   - ✅ Total: R$ 300,00

2. **Mão de Obra: 0, Peças: 500**
   - ✅ Total: R$ 500,00

3. **Mão de Obra: 250, Peças: 0**
   - ✅ Total: R$ 250,00

4. **Ambos vazios**
   - ✅ Total: R$ 0,00

### Valores Negativos

1. **Tentar digitar valor negativo**
   - ✅ Campo não aceita

---

## 1️⃣2️⃣ SEGURANÇA (RLS)

### Criar Segunda Oficina

1. **Fazer logout**

2. **Criar nova oficina:**
   ```
   Email: oficina2@teste.com
   Senha: Teste@123
   ```

3. **Criar cliente, veículo e OS na oficina 2**

4. **Verificar:**
   - ✅ Oficina 2 só vê suas próprias OS
   - ✅ Oficina 1 não vê OS da oficina 2
   - ✅ RLS funcionando

---

## 1️⃣3️⃣ INTERFACE E UX

### Cores de Status

- ✅ **Pendente**: Amarelo claro
- ✅ **Aprovada**: Roxo claro
- ✅ **Em Andamento**: Azul claro
- ✅ **Concluída**: Verde claro
- ✅ **Cancelada**: Vermelho claro

### Loading States

1. **Ao carregar página**
   - ✅ Spinner aparece
   - ✅ Desaparece quando dados carregam

2. **Ao selecionar cliente**
   - ✅ Dropdown de veículos mostra "Carregando..."
   - ✅ Veículos aparecem após carregar

3. **Ao salvar OS**
   - ✅ Botão mostra "Salvando..."
   - ✅ Spinner no botão
   - ✅ Campos desabilitados

### Estados Vazios

1. **Sem OS cadastradas**
   - ✅ Ícone de documento aparece
   - ✅ Mensagem clara
   - ✅ Botão "Criar Primeira OS"

2. **Sem clientes**
   - ✅ Mensagem: "Cadastre um cliente e veículo primeiro"

3. **Cliente sem veículos**
   - ✅ Dropdown mostra: "Cliente sem veículos"
   - ✅ Não permite salvar

### Feedback Visual

1. **Toast de sucesso**
   - ✅ Cor verde
   - ✅ Mensagem com número da OS
   - ✅ Desaparece automaticamente

2. **Toast de erro**
   - ✅ Cor vermelha
   - ✅ Mensagem descritiva

3. **Mudança de status**
   - ✅ Toast confirma mudança
   - ✅ Cor atualiza imediatamente

---

## 1️⃣4️⃣ DADOS DE TESTE COMPLETOS

### Criar Cenário Real

```
Cliente 1: João da Silva
├── ABC-1234 - Volkswagen Gol
│   ├── OS-2024-0001: Troca de óleo (R$ 400) - Concluída
│   └── OS-2024-0002: Alinhamento (R$ 80) - Em Andamento
└── XYZ-5678 - Fiat Uno
    └── OS-2024-0003: Freios (R$ 600) - Pendente

Cliente 2: Maria Santos
└── DEF-9012 - Chevrolet Onix
    ├── OS-2024-0004: Revisão (R$ 800) - Concluída
    └── OS-2024-0005: Ar condicionado (R$ 350) - Pendente

Cliente 3: Pedro Costa
└── GHI-3456 - Honda Civic
    └── OS-2024-0006: Suspensão (R$ 1200) - Em Andamento
```

**Verificar:**
- ✅ 3 clientes
- ✅ 4 veículos
- ✅ 6 OS
- ✅ Todos os status representados
- ✅ Busca funciona
- ✅ Relacionamentos corretos

---

## 1️⃣5️⃣ INTEGRAÇÃO COM DASHBOARD

1. **Ir para /oficina (Dashboard)**

2. **Verificar estatísticas:**
   - ✅ Total de OS atualizado
   - ✅ OS Pendentes: contagem correta
   - ✅ OS Em Andamento: contagem correta
   - ✅ OS Concluídas: contagem correta
   - ✅ Faturamento total: soma das OS concluídas

---

## 🐛 Possíveis Erros

### "Cannot read properties of null"

**Causa**: Cliente ou veículo deletado

**Solução**:
- Verificar relacionamentos
- OS mostra "-" quando dados não existem

### "Duplicate key value"

**Causa**: Número de OS duplicado

**Solução**:
- Verificar função de geração de número
- Executar novamente o schema

### Veículos não aparecem

**Causa**: Cliente não selecionado ou sem veículos

**Solução**:
- Selecionar cliente primeiro
- Cadastrar veículo para o cliente

### Total não calcula

**Causa**: Valores não numéricos

**Solução**:
- Verificar se campos aceitam apenas números
- Usar parseFloat nos cálculos

---

## ✅ Checklist Final

- [ ] Criar OS funciona
- [ ] Número sequencial gerado corretamente
- [ ] Editar OS funciona
- [ ] Deletar OS funciona
- [ ] Mudar status funciona
- [ ] Cores de status corretas
- [ ] Busca funciona (número, cliente, placa)
- [ ] Dropdown de veículos filtra por cliente
- [ ] Total calculado automaticamente
- [ ] Valores formatados em R$
- [ ] Limite FREE funciona (30 OS/mês)
- [ ] Alerta de limite aparece
- [ ] Toast de feedback aparece
- [ ] Loading states funcionam
- [ ] Estados vazios aparecem
- [ ] Validações funcionam
- [ ] RLS protege dados
- [ ] Relacionamentos funcionam
- [ ] Dashboard atualiza
- [ ] Sem erros no console
- [ ] Sem erros de lint

---

## 🎯 Fluxo Completo Testado

```
1. Cliente cadastrado
   ↓
2. Veículo cadastrado para cliente
   ↓
3. OS criada vinculando cliente + veículo
   ↓
4. Número sequencial gerado (OS-2024-0001)
   ↓
5. Status inicial: Pendente (amarelo)
   ↓
6. Mudar para Em Andamento (azul)
   ↓
7. Mudar para Concluída (verde)
   ↓
8. Dashboard atualiza estatísticas
   ↓
9. Faturamento soma OS concluídas
```

---

## 📊 Métricas de Sucesso

### Funcionalidade
- ✅ CRUD completo funcionando
- ✅ Relacionamentos corretos
- ✅ Cálculos automáticos
- ✅ Workflow de status

### Performance
- ✅ Listagem rápida
- ✅ Busca instantânea
- ✅ Mudança de status imediata

### UX
- ✅ Feedback em todas ações
- ✅ Estados vazios informativos
- ✅ Cores intuitivas
- ✅ Mensagens claras

### Segurança
- ✅ RLS protegendo dados
- ✅ Validações funcionando
- ✅ Limites de plano respeitados

---

**✅ CRUD de Ordens de Serviço validado = Sistema completo!**

