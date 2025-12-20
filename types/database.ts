export type UserType = "oficina" | "motorista" | "admin";

export type PlanType = "free" | "pro";

export type ServiceOrderStatus = "pending" | "approved" | "in_progress" | "completed" | "cancelled";

export interface Profile {
  id: string;
  email: string;
  name: string;
  type: UserType;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Workshop {
  id: string;
  profile_id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  plan_type: PlanType;
  trial_ends_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  workshop_id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  notes?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  client_id: string;
  plate: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  km?: number;
  notes?: string;
  created_at: string;
}

export interface ServiceOrder {
  id: string;
  workshop_id: string;
  client_id: string;
  vehicle_id: string;
  order_number: string;
  status: ServiceOrderStatus;
  services: string;
  labor_cost: number;
  parts_cost: number;
  total: number;
  notes?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Inventory {
  id: string;
  workshop_id: string;
  name: string;
  code?: string;
  brand?: string;
  category?: string;
  quantity: number;
  min_quantity: number;
  cost_price: number;
  sell_price: number;
  location?: string;
  supplier?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  workshop_id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  payment_method?: string;
  reference_id?: string;
  reference_type?: string;
  date: string;
  notes?: string;
  created_at: string;
}

export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  workshop_id: string;
  client_id?: string;
  vehicle_id?: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time?: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceOrderItem {
  id: string;
  service_order_id: string;
  inventory_id?: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface DashboardStats {
  workshop_id: string;
  total_clients: number;
  total_vehicles: number;
  orders_this_month: number;
  completed_orders_this_month: number;
  revenue_this_month: number;
  appointments_today: number;
  low_stock_items: number;
}

