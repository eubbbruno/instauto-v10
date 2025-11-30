# 🚗 Teste do CRUD de Veículos

## ✅ Pré-requisitos

- [ ] Schema SQL executado
- [ ] Servidor rodando
- [ ] Pelo menos 1 cliente cadastrado
- [ ] Logado na oficina

---

## 1️⃣ ACESSAR PÁGINA DE VEÍCULOS

1. **Clicar em "Veículos" na sidebar**
   - Ou acessar: http://localhost:3000/oficina/veiculos

2. **Verificar:**
   - ✅ Página carrega sem erros
   - ✅ Título "Veículos" aparece
   - ✅ Botão "Novo Veículo" visível
   - ✅ Campo de busca presente

---

## 2️⃣ CRIAR PRIMEIRO VEÍCULO

### Sem Clientes Cadastrados

1. **Clicar em "Novo Veículo"**

2. **Verificar:**
   - ✅ Toast de erro aparece
   - ✅ Mensagem: "Você precisa cadastrar pelo menos um cliente..."
   - ✅ Modal não abre

3. **Cadastrar um cliente primeiro**
   - Ir para /oficina/clientes
   - Criar cliente: "João da Silva"

### Com Cliente Cadastrado

1. **Voltar para /oficina/veiculos**

2. **Clicar em "Novo Veículo"**

3. **Verificar:**
   - ✅ Modal abre
   - ✅ Dropdown de clientes aparece
   - ✅ Cliente "João da Silva" está na lista

4. **Preencher formulário**
   ```
   Cliente: João da Silva
   Placa: ABC-1234
   Marca: Volkswagen
   Modelo: Gol
   Ano: 2020
   Cor: Prata
   KM: 50000
   Observações: Veículo em bom estado
   ```

5. **Clicar em "Salvar"**

6. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Modal fecha
   - ✅ Veículo aparece na tabela
   - ✅ Nome do cliente aparece na coluna "Cliente"
   - ✅ Placa em maiúsculas (ABC-1234)
   - ✅ KM formatado (50.000 km)

---

## 3️⃣ VERIFICAR NO SUPABASE

1. **Table Editor > vehicles**
   - ✅ Novo registro criado
   - ✅ `client_id`: ID do João
   - ✅ `workshop_id`: ID da oficina
   - ✅ `plate`: ABC-1234
   - ✅ `brand`: Volkswagen
   - ✅ `model`: Gol
   - ✅ `year`: 2020
   - ✅ `color`: Prata
   - ✅ `km`: 50000

---

## 4️⃣ TESTAR BUSCA

1. **Criar mais veículos**
   ```
   Veículo 2:
   - Cliente: João da Silva
   - Placa: XYZ-5678
   - Marca: Fiat
   - Modelo: Uno
   - Ano: 2018
   
   Veículo 3:
   - Cliente: Maria Santos (criar cliente se necessário)
   - Placa: DEF-9012
   - Marca: Chevrolet
   - Modelo: Onix
   - Ano: 2021
   ```

2. **Testar busca por placa**
   - Digitar "ABC"
   - ✅ Apenas ABC-1234 aparece

3. **Testar busca por marca**
   - Digitar "Fiat"
   - ✅ Apenas Uno aparece

4. **Testar busca por modelo**
   - Digitar "Gol"
   - ✅ Apenas Gol aparece

5. **Testar busca por cliente**
   - Digitar "João"
   - ✅ ABC-1234 e XYZ-5678 aparecem

6. **Limpar busca**
   - ✅ Todos os veículos voltam

---

## 5️⃣ EDITAR VEÍCULO

1. **Clicar no ícone de editar (lápis)**

2. **Verificar:**
   - ✅ Modal abre
   - ✅ Todos os campos preenchidos
   - ✅ Cliente correto selecionado

3. **Alterar dados**
   ```
   KM: 55000
   Cor: Cinza
   Observações: Troca de óleo realizada
   ```

4. **Clicar em "Salvar"**

5. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Dados atualizados na tabela
   - ✅ KM agora mostra "55.000 km"
   - ✅ Cor agora mostra "Cinza"

---

## 6️⃣ DELETAR VEÍCULO

1. **Clicar no ícone de deletar (lixeira)**

2. **Verificar:**
   - ✅ Modal de confirmação aparece
   - ✅ Mensagem clara sobre exclusão

3. **Confirmar exclusão**

4. **Verificar:**
   - ✅ Toast de sucesso aparece
   - ✅ Veículo removido da tabela
   - ✅ Registro deletado no Supabase

---

## 7️⃣ VALIDAÇÕES

### Campos Obrigatórios

1. **Tentar salvar sem preencher campos obrigatórios**
   - Cliente: vazio
   - ✅ Formulário não envia
   - ✅ Campo destacado

2. **Tentar salvar sem placa**
   - ✅ Formulário não envia
   - ✅ Campo destacado

3. **Tentar salvar sem marca**
   - ✅ Formulário não envia
   - ✅ Campo destacado

4. **Tentar salvar sem modelo**
   - ✅ Formulário não envia
   - ✅ Campo destacado

### Formatação

1. **Digitar placa em minúsculas**
   - Digitar: "abc-1234"
   - ✅ Automaticamente converte para "ABC-1234"

2. **Ano inválido**
   - Tentar digitar ano < 1900
   - ✅ Campo não aceita

3. **KM negativo**
   - Tentar digitar KM negativo
   - ✅ Campo não aceita

---

## 8️⃣ RELACIONAMENTO COM CLIENTE

### Deletar Cliente com Veículos

1. **Ir para /oficina/clientes**

2. **Tentar deletar cliente que tem veículos**

3. **Verificar:**
   - ✅ Cliente é deletado
   - ✅ Veículos do cliente são deletados (CASCADE)
   - ✅ Não há veículos órfãos

### Criar Veículo para Cliente Diferente

1. **Criar novo cliente: "Pedro Costa"**

2. **Criar veículo para Pedro**
   ```
   Cliente: Pedro Costa
   Placa: GHI-3456
   Marca: Honda
   Modelo: Civic
   ```

3. **Verificar:**
   - ✅ Veículo aparece com nome "Pedro Costa"
   - ✅ Oficina vê veículos de todos seus clientes

---

## 9️⃣ SEGURANÇA (RLS)

### Criar Segunda Oficina

1. **Fazer logout**

2. **Criar nova oficina**
   ```
   Email: oficina2@teste.com
   Senha: Teste@123
   ```

3. **Criar cliente e veículo na oficina 2**

4. **Verificar:**
   - ✅ Oficina 2 só vê seus próprios veículos
   - ✅ Oficina 1 não vê veículos da oficina 2
   - ✅ RLS funcionando corretamente

---

## 🔟 INTERFACE E UX

### Loading States

1. **Ao carregar página**
   - ✅ Spinner aparece
   - ✅ Spinner desaparece quando dados carregam

2. **Ao salvar veículo**
   - ✅ Botão mostra "Salvando..."
   - ✅ Spinner no botão
   - ✅ Campos desabilitados

### Estados Vazios

1. **Sem veículos cadastrados**
   - ✅ Ícone de carro aparece
   - ✅ Mensagem clara
   - ✅ Botão "Adicionar Primeiro Veículo"

2. **Sem clientes cadastrados**
   - ✅ Mensagem: "Cadastre um cliente primeiro..."
   - ✅ Não permite criar veículo

3. **Busca sem resultados**
   - ✅ Mensagem: "Nenhum veículo encontrado"

### Feedback Visual

1. **Toast de sucesso**
   - ✅ Cor verde
   - ✅ Mensagem clara
   - ✅ Desaparece automaticamente

2. **Toast de erro**
   - ✅ Cor vermelha
   - ✅ Mensagem descritiva
   - ✅ Desaparece automaticamente

---

## 📊 DADOS DE TESTE COMPLETOS

### Criar Cenário Completo

```
Cliente 1: João da Silva
├── ABC-1234 - Volkswagen Gol 2020
└── XYZ-5678 - Fiat Uno 2018

Cliente 2: Maria Santos
├── DEF-9012 - Chevrolet Onix 2021
└── GHI-3456 - Honda Civic 2019

Cliente 3: Pedro Costa
└── JKL-7890 - Toyota Corolla 2022
```

**Verificar:**
- ✅ 3 clientes
- ✅ 5 veículos
- ✅ Todos aparecem corretamente
- ✅ Busca funciona
- ✅ Relacionamentos corretos

---

## 🐛 Possíveis Erros

### "Cannot read properties of undefined"

**Causa**: Cliente não tem nome

**Solução**:
- Verificar se a query está trazendo dados do cliente
- Verificar relacionamento no Supabase

### "Foreign key violation"

**Causa**: client_id inválido

**Solução**:
- Verificar se o cliente existe
- Verificar se o cliente pertence à oficina

### "Duplicate key value"

**Causa**: Placa duplicada

**Solução**:
- Verificar se a placa já existe
- Usar placa diferente

### Veículos não aparecem

**Causa**: RLS bloqueando

**Solução**:
- Verificar se está logado
- Verificar policies no Supabase
- Verificar workshop_id

---

## ✅ Checklist Final

- [ ] Criar veículo funciona
- [ ] Editar veículo funciona
- [ ] Deletar veículo funciona
- [ ] Busca funciona (placa, marca, modelo, cliente)
- [ ] Dropdown de clientes funciona
- [ ] Placa converte para maiúsculas
- [ ] KM formata com separador de milhares
- [ ] Relacionamento com cliente funciona
- [ ] Toast de feedback aparece
- [ ] Loading states funcionam
- [ ] Estados vazios aparecem
- [ ] Validações funcionam
- [ ] RLS protege dados
- [ ] Sem erros no console
- [ ] Sem erros de lint

---

## 🎯 Próximos Passos

Após validar veículos:

1. [ ] Implementar CRUD de Ordens de Serviço
2. [ ] Relacionar OS com cliente e veículo
3. [ ] Testar fluxo completo: Cliente → Veículo → OS

---

**✅ CRUD de Veículos validado = Pronto para Ordens de Serviço!**

