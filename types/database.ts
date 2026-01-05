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
  zip_code?: string;
  plan_type: PlanType;
  trial_ends_at?: string;
  mercadopago_subscription_id?: string;
  subscription_status?: string;
  is_public?: boolean;
  description?: string;
  services?: string[];
  specialties?: string[];
  working_hours?: Record<string, any>;
  accepts_quotes?: boolean;
  average_rating?: number;
  total_reviews?: number;
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
  description?: string;
  code?: string;
  category?: string;
  quantity: number;
  min_quantity: number;
  unit_price?: number;
  supplier?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  workshop_id: string;
  type: TransactionType;
  category?: string;
  description: string;
  amount: number;
  date: string;
  payment_method?: string;
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
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

export type DiagnosticSeverity = "low" | "medium" | "high";

export interface Diagnostic {
  id: string;
  workshop_id: string;
  client_id?: string;
  vehicle_id?: string;
  symptoms: string;
  diagnosis: string;
  recommendations?: string;
  severity?: DiagnosticSeverity;
  estimated_cost?: string;
  safe_to_drive?: boolean;
  ai_model: string;
  created_at: string;
  updated_at?: string;
}

export type QuoteStatus = "pending" | "quoted" | "accepted" | "rejected" | "expired";
export type QuoteServiceType = "maintenance" | "repair" | "diagnostic" | "other";
export type QuoteUrgency = "low" | "medium" | "high";

export interface Quote {
  id: string;
  workshop_id: string;
  motorist_name: string;
  motorist_email: string;
  motorist_phone: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate?: string;
  service_type: QuoteServiceType;
  description: string;
  urgency: QuoteUrgency;
  status: QuoteStatus;
  workshop_response?: string;
  estimated_price?: number;
  estimated_days?: number;
  responded_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  workshop_id: string;
  motorist_name: string;
  motorist_email: string;
  rating: number;
  comment?: string;
  service_type?: string;
  verified: boolean;
  response?: string;
  responded_at?: string;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Motorist {
  id: string;
  profile_id: string;
  cpf?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
  updated_at?: string;
}

export interface MotoristVehicle {
  id: string;
  motorist_id: string;
  nickname?: string;
  make: string;
  model: string;
  year: number;
  plate?: string;
  color?: string;
  mileage?: number;
  fuel_type?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MaintenanceHistory {
  id: string;
  motorist_id: string;
  vehicle_id: string;
  workshop_id?: string;
  service_type: string;
  description?: string;
  mileage?: number;
  cost?: number;
  service_date: string;
  next_service_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// =====================================================
// NOVAS INTERFACES - FUNCIONALIDADES FINANCEIRAS
// =====================================================

export type FuelType = "gasoline" | "ethanol" | "diesel" | "gnv";

export interface MotoristFueling {
  id: string;
  motorist_id: string;
  vehicle_id: string;
  fuel_type: FuelType;
  liters: number;
  price_per_liter: number;
  total_amount: number;
  odometer: number;
  gas_station?: string;
  city?: string;
  state?: string;
  notes?: string;
  date: string;
  created_at: string;
  updated_at?: string;
}

export type ExpenseCategory = "fuel" | "maintenance" | "insurance" | "ipva" | "fine" | "parking" | "toll" | "wash" | "other";

export interface MotoristExpense {
  id: string;
  motorist_id: string;
  vehicle_id: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type ReminderType = "ipva" | "insurance" | "revision" | "licensing" | "tire_rotation" | "oil_change" | "inspection" | "other";
export type ReminderPriority = "low" | "medium" | "high";

export interface MotoristReminder {
  id: string;
  motorist_id: string;
  vehicle_id?: string;
  type: ReminderType;
  title: string;
  description?: string;
  due_date: string;
  is_completed: boolean;
  completed_at?: string;
  reminder_days_before: number[];
  priority: ReminderPriority;
  amount?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Stats para dashboard
export interface VehicleFuelStats {
  vehicle_id: string;
  motorist_id: string;
  fuel_type: FuelType;
  total_fuelings: number;
  total_liters: number;
  total_spent: number;
  avg_price_per_liter: number;
  total_km: number;
  avg_consumption_per_100km: number;
}

export interface MonthlyExpenseSummary {
  motorist_id: string;
  vehicle_id: string;
  category: ExpenseCategory;
  month: string;
  total_expenses: number;
  total_amount: number;
}

