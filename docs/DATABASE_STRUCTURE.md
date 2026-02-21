# Estrutura do Banco de Dados - Instauto

## Tabelas Principais

### profiles
Tabela central de usuários (motoristas e oficinas)

- `id` (uuid, PK) - Mesmo ID do auth.users do Supabase
- `email` (text, unique) - Email do usuário
- `name` (text) - Nome completo
- `type` (text) - 'motorist' ou 'workshop'
- `phone` (text, nullable)
- `avatar_url` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Usuários podem ler e atualizar apenas seu próprio profile

---

### motorists
Dados específicos de motoristas

- `id` (uuid, PK)
- `profile_id` (uuid, FK -> profiles.id, unique)
- `cpf` (text, nullable)
- `notification_preferences` (jsonb, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Motoristas podem ler e atualizar apenas seus próprios dados

---

### workshops
Dados específicos de oficinas

- `id` (uuid, PK)
- `profile_id` (uuid, FK -> profiles.id, unique)
- `name` (text) - Nome da oficina
- `cnpj` (text, nullable)
- `phone` (text, nullable)
- `email` (text, nullable)
- `address` (text, nullable)
- `city` (text, nullable)
- `state` (text, nullable)
- `zip_code` (text, nullable)
- `plan_type` (text) - 'free' ou 'pro'
- `subscription_status` (text) - 'trial', 'active', 'cancelled', 'expired'
- `trial_ends_at` (timestamp, nullable)
- `subscription_id` (text, nullable) - ID do MercadoPago
- `is_public` (boolean) - Se aparece na busca pública
- `accepts_quotes` (boolean) - Se aceita orçamentos
- `specialties` (text[], nullable) - Especialidades da oficina
- `rating` (numeric, nullable) - Avaliação média (0-5)
- `reviews_count` (integer) - Quantidade de avaliações
- `logo_url` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem ler e atualizar apenas seus próprios dados. Dados públicos visíveis para todos.

---

### motorist_vehicles
Veículos dos motoristas

- `id` (uuid, PK)
- `motorist_id` (uuid, FK -> motorists.id)
- `make` (text) - Marca (ex: Volkswagen, Fiat)
- `model` (text) - Modelo (ex: Gol, Uno)
- `year` (integer) - Ano de fabricação
- `plate` (text, nullable) - Placa
- `color` (text, nullable) - Cor
- `mileage` (integer, nullable) - Quilometragem
- `fuel_type` (text, nullable) - Tipo de combustível
- `nickname` (text, nullable) - Apelido do veículo
- `notes` (text, nullable) - Observações
- `is_active` (boolean) - Se está ativo
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Motoristas podem gerenciar apenas seus próprios veículos

---

### quotes
Solicitações de orçamento (motorista -> oficina)

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `motorist_id` (uuid, FK -> motorists.id, nullable)
- `motorist_name` (text) - Nome do motorista
- `motorist_email` (text) - Email do motorista
- `motorist_phone` (text) - Telefone do motorista
- `vehicle_id` (uuid, FK -> motorist_vehicles.id, nullable)
- `vehicle_brand` (text) - Marca do veículo
- `vehicle_model` (text) - Modelo do veículo
- `vehicle_year` (integer) - Ano do veículo
- `vehicle_plate` (text, nullable) - Placa
- `service_type` (text) - Tipo de serviço
- `description` (text) - Descrição do problema
- `urgency` (text) - 'low', 'normal', 'high'
- `status` (text) - 'pending', 'responded', 'rejected', 'accepted'
- `workshop_response` (text, nullable) - Resposta da oficina
- `estimated_price` (numeric, nullable) - Preço estimado
- `estimated_days` (integer, nullable) - Dias estimados
- `responded_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Motoristas veem apenas seus orçamentos. Oficinas veem orçamentos enviados para elas.

---

### clients
Clientes das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `name` (text) - Nome do cliente
- `email` (text, nullable)
- `phone` (text, nullable)
- `cpf` (text, nullable)
- `address` (text, nullable)
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas seus próprios clientes

---

### vehicles
Veículos dos clientes das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `client_id` (uuid, FK -> clients.id)
- `brand` (text) - Marca
- `model` (text) - Modelo
- `year` (text) - Ano (string para flexibilidade)
- `plate` (text) - Placa
- `color` (text, nullable)
- `km` (text, nullable) - Quilometragem
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas veículos de seus clientes

---

### service_orders
Ordens de serviço das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `client_id` (uuid, FK -> clients.id)
- `vehicle_id` (uuid, FK -> vehicles.id)
- `order_number` (text, unique) - Número da OS
- `status` (text) - 'pending', 'approved', 'in_progress', 'completed', 'cancelled'
- `services` (text) - Descrição dos serviços (JSON string)
- `labor_cost` (numeric) - Custo de mão de obra
- `parts_cost` (numeric) - Custo de peças
- `total` (numeric) - Total da OS
- `notes` (text, nullable) - Observações
- `started_at` (timestamp, nullable)
- `completed_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas suas próprias OS

---

### inventory
Estoque de peças das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `name` (text) - Nome da peça
- `description` (text, nullable)
- `code` (text, nullable) - Código da peça
- `category` (text, nullable) - Categoria
- `quantity` (integer) - Quantidade em estoque
- `min_quantity` (integer) - Quantidade mínima
- `unit_price` (numeric, nullable) - Preço unitário
- `supplier` (text, nullable) - Fornecedor
- `location` (text, nullable) - Localização no estoque
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas seu próprio estoque

---

### transactions
Transações financeiras das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `type` (text) - 'income' ou 'expense'
- `category` (text) - Categoria da transação
- `description` (text) - Descrição
- `amount` (numeric) - Valor
- `payment_method` (text, nullable) - Método de pagamento
- `date` (date) - Data da transação
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas suas próprias transações

---

### appointments
Agendamentos das oficinas

- `id` (uuid, PK)
- `workshop_id` (uuid, FK -> workshops.id)
- `client_id` (uuid, FK -> clients.id)
- `vehicle_id` (uuid, FK -> vehicles.id, nullable)
- `date` (date) - Data do agendamento
- `start_time` (time) - Horário de início
- `end_time` (time, nullable) - Horário de término
- `service_type` (text) - Tipo de serviço
- `status` (text) - 'scheduled', 'confirmed', 'completed', 'cancelled'
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS**: Oficinas podem gerenciar apenas seus próprios agendamentos

---

### notifications
Notificações dos usuários

- `id` (uuid, PK)
- `user_id` (uuid, FK -> profiles.id)
- `type` (text) - Tipo da notificação
- `title` (text) - Título
- `message` (text) - Mensagem
- `is_read` (boolean) - Se foi lida
- `data` (jsonb, nullable) - Dados adicionais
- `created_at` (timestamp)

**RLS**: Usuários veem apenas suas próprias notificações

---

## Views (UNRESTRICTED - Sem RLS)

### public_workshops
Oficinas públicas visíveis para todos

- Todos os campos de `workshops` onde `is_public = true`
- Usado na busca de oficinas por motoristas

### motorist_stats
Estatísticas do motorista

- `motorist_id`
- `total_vehicles` - Total de veículos
- `total_quotes` - Total de orçamentos
- `total_maintenances` - Total de manutenções

### workshop_stats
Estatísticas da oficina

- `workshop_id`
- `total_clients` - Total de clientes
- `total_vehicles` - Total de veículos
- `orders_this_month` - OS deste mês
- `completed_orders_this_month` - OS concluídas este mês
- `revenue_this_month` - Receita deste mês
- `appointments_today` - Agendamentos hoje
- `low_stock_items` - Itens com estoque baixo

---

## Fluxo de Cadastro via Google OAuth

### Motorista:
1. Usuário clica em "Entrar com Google" em `/login-motorista`
2. localStorage salva `google_login_type: 'motorista'`
3. Redirect para Google OAuth
4. Google retorna para `/auth/callback?type=motorista&code=...`
5. Callback cria:
   - Profile (type: 'motorist')
   - Motorist (profile_id)
6. Redirect para `/motorista?welcome=true`
7. AuthContext carrega profile com retries (aguarda callback terminar)
8. Dashboard carrega normalmente

### Oficina:
1. Usuário clica em "Entrar com Google" em `/login-oficina`
2. localStorage salva `google_login_type: 'oficina'`
3. Redirect para Google OAuth
4. Google retorna para `/auth/callback?type=oficina&code=...`
5. Callback cria:
   - Profile (type: 'workshop')
   - Workshop (profile_id, plan_type: 'free', trial de 14 dias)
6. Redirect para `/oficina?welcome=true`
7. AuthContext carrega profile com retries
8. Dashboard carrega normalmente

---

## Constraints Importantes

### quotes.urgency
- CHECK: `urgency IN ('low', 'normal', 'high')`

### workshops.plan_type
- CHECK: `plan_type IN ('free', 'pro')`

### workshops.subscription_status
- CHECK: `subscription_status IN ('trial', 'active', 'cancelled', 'expired')`

### service_orders.status
- CHECK: `status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')`

---

## Limites do Plano FREE (Oficinas)

- Clientes: 10
- Veículos: 20
- Ordens de Serviço: 30/mês
- Estoque: 50 itens
- Agendamentos: 50/mês

## Plano PRO (Oficinas)

- Tudo ilimitado
- Diagnóstico com IA
- Relatórios avançados
- Integração WhatsApp
- Suporte prioritário
