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
  quantity: number;
  min_quantity: number;
  cost_price: number;
  sell_price: number;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

