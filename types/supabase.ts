// =====================================================
// GERADO automaticamente a partir do schema real do Supabase
// (projeto cajmcennpocqcrffzoms). NÃO editar à mão.
// Regenerar: `npx supabase gen types typescript --project-id cajmcennpocqcrffzoms`
// ou via MCP generate_typescript_types.
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          scheduled_at: string
          status: string | null
          title: string
          type: string | null
          vehicle_id: string | null
          workshop_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          scheduled_at: string
          status?: string | null
          title: string
          type?: string | null
          vehicle_id?: string | null
          workshop_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          scheduled_at?: string
          status?: string | null
          title?: string
          type?: string | null
          vehicle_id?: string | null
          workshop_id?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string
          due_date: string
          id: string
          paid_date: string | null
          recurrence: string | null
          status: string | null
          supplier: string | null
          updated_at: string | null
          workshop_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          paid_date?: string | null
          recurrence?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
          workshop_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          paid_date?: string | null
          recurrence?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
          workshop_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          workshop_id: string
        }
        Insert: {
          address?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          workshop_id: string
        }
        Update: {
          address?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          workshop_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string | null
          code: string | null
          cost_price: number | null
          created_at: string | null
          id: string
          min_quantity: number | null
          name: string
          quantity: number | null
          sell_price: number | null
          workshop_id: string
        }
        Insert: {
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string | null
          id?: string
          min_quantity?: number | null
          name: string
          quantity?: number | null
          sell_price?: number | null
          workshop_id: string
        }
        Update: {
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string | null
          id?: string
          min_quantity?: number | null
          name?: string
          quantity?: number | null
          sell_price?: number | null
          workshop_id?: string
        }
        Relationships: []
      }
      motorist_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string
          id: string
          motorist_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          motorist_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          motorist_id?: string
          vehicle_id?: string | null
        }
        Relationships: []
      }
      motorist_fueling: {
        Row: {
          created_at: string | null
          date: string | null
          fuel_type: string
          id: string
          liters: number
          motorist_id: string
          odometer: number | null
          price_per_liter: number
          station_name: string | null
          total_price: number
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          fuel_type: string
          id?: string
          liters: number
          motorist_id: string
          odometer?: number | null
          price_per_liter: number
          station_name?: string | null
          total_price: number
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          fuel_type?: string
          id?: string
          liters?: number
          motorist_id?: string
          odometer?: number | null
          price_per_liter?: number
          station_name?: string | null
          total_price?: number
          vehicle_id?: string
        }
        Relationships: []
      }
      motorist_reminders: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          motorist_id: string
          priority: string | null
          status: string | null
          title: string
          type: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          motorist_id: string
          priority?: string | null
          status?: string | null
          title: string
          type: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          motorist_id?: string
          priority?: string | null
          status?: string | null
          title?: string
          type?: string
          vehicle_id?: string | null
        }
        Relationships: []
      }
      motorist_vehicles: {
        Row: {
          color: string | null
          created_at: string | null
          fuel_type: string | null
          id: string
          is_active: boolean | null
          make: string
          mileage: number | null
          model: string
          motorist_id: string
          nickname: string | null
          notes: string | null
          plate: string
          year: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          is_active?: boolean | null
          make: string
          mileage?: number | null
          model: string
          motorist_id: string
          nickname?: string | null
          notes?: string | null
          plate: string
          year: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          is_active?: boolean | null
          make?: string
          mileage?: number | null
          model?: string
          motorist_id?: string
          nickname?: string | null
          notes?: string | null
          plate?: string
          year?: number
        }
        Relationships: []
      }
      motorists: {
        Row: {
          cpf: string | null
          created_at: string | null
          id: string
          notification_preferences: Json | null
          profile_id: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          profile_id: string
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "motorists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percent: number | null
          id: string
          is_active: boolean | null
          title: string
          valid_until: string | null
          workshop_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          title: string
          valid_until?: string | null
          workshop_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          title?: string
          valid_until?: string | null
          workshop_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string | null
          description: string
          estimated_days: number | null
          estimated_price: number | null
          id: string
          images: string[] | null
          motorist_email: string
          motorist_name: string
          motorist_phone: string | null
          responded_at: string | null
          service_type: string
          status: string | null
          urgency: string | null
          vehicle_brand: string | null
          vehicle_id: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_year: number | null
          workshop_id: string
          workshop_response: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          estimated_days?: number | null
          estimated_price?: number | null
          id?: string
          images?: string[] | null
          motorist_email: string
          motorist_name: string
          motorist_phone?: string | null
          responded_at?: string | null
          service_type: string
          status?: string | null
          urgency?: string | null
          vehicle_brand?: string | null
          vehicle_id?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
          workshop_id: string
          workshop_response?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          estimated_days?: number | null
          estimated_price?: number | null
          id?: string
          images?: string[] | null
          motorist_email?: string
          motorist_name?: string
          motorist_phone?: string | null
          responded_at?: string | null
          service_type?: string
          status?: string | null
          urgency?: string | null
          vehicle_brand?: string | null
          vehicle_id?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
          workshop_id?: string
          workshop_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      receivables: {
        Row: {
          amount: number
          client_id: string | null
          client_name: string | null
          created_at: string | null
          description: string
          due_date: string
          id: string
          order_id: string | null
          received_date: string | null
          status: string | null
          updated_at: string | null
          workshop_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          order_id?: string | null
          received_date?: string | null
          status?: string | null
          updated_at?: string | null
          workshop_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          order_id?: string | null
          received_date?: string | null
          status?: string | null
          updated_at?: string | null
          workshop_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          motorist_email: string | null
          motorist_id: string | null
          motorist_name: string | null
          quote_id: string | null
          rating: number
          responded_at: string | null
          service_type: string | null
          updated_at: string | null
          workshop_id: string
          workshop_response: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          motorist_email?: string | null
          motorist_id?: string | null
          motorist_name?: string | null
          quote_id?: string | null
          rating: number
          responded_at?: string | null
          service_type?: string | null
          updated_at?: string | null
          workshop_id: string
          workshop_response?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          motorist_email?: string | null
          motorist_id?: string | null
          motorist_name?: string | null
          quote_id?: string | null
          rating?: number
          responded_at?: string | null
          service_type?: string | null
          updated_at?: string | null
          workshop_id?: string
          workshop_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_checklist: {
        Row: {
          checked: boolean | null
          checked_at: string | null
          created_at: string | null
          id: string
          item: string
          notes: string | null
          order_id: string | null
        }
        Insert: {
          checked?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          id?: string
          item: string
          notes?: string | null
          order_id?: string | null
        }
        Update: {
          checked?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          id?: string
          item?: string
          notes?: string | null
          order_id?: string | null
        }
        Relationships: []
      }
      service_order_history: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          order_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string
        }
        Relationships: []
      }
      service_order_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_id: string | null
          quantity: number | null
          total: number
          type: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          total: number
          type: string
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          total?: number
          type?: string
          unit_price?: number
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          client_id: string | null
          client_notes: string | null
          completed_at: string | null
          created_at: string | null
          delivered_at: string | null
          description: string | null
          diagnosis: string | null
          discount: number | null
          estimated_completion: string | null
          id: string
          internal_notes: string | null
          km_entry: number | null
          km_exit: number | null
          labor_cost: number | null
          labor_total: number | null
          observations: string | null
          order_number: number
          parts: Json | null
          parts_cost: number | null
          parts_total: number | null
          services: Json | null
          started_at: string | null
          status: string | null
          total: number | null
          updated_at: string | null
          vehicle_id: string | null
          warranty: string | null
          workshop_id: string
        }
        Insert: {
          client_id?: string | null
          client_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          description?: string | null
          diagnosis?: string | null
          discount?: number | null
          estimated_completion?: string | null
          id?: string
          internal_notes?: string | null
          km_entry?: number | null
          km_exit?: number | null
          labor_cost?: number | null
          labor_total?: number | null
          observations?: string | null
          order_number?: number
          parts?: Json | null
          parts_cost?: number | null
          parts_total?: number | null
          services?: Json | null
          started_at?: string | null
          status?: string | null
          total?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          warranty?: string | null
          workshop_id: string
        }
        Update: {
          client_id?: string | null
          client_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          description?: string | null
          diagnosis?: string | null
          discount?: number | null
          estimated_completion?: string | null
          id?: string
          internal_notes?: string | null
          km_entry?: number | null
          km_exit?: number | null
          labor_cost?: number | null
          labor_total?: number | null
          observations?: string | null
          order_number?: number
          parts?: Json | null
          parts_cost?: number | null
          parts_total?: number | null
          services?: Json | null
          started_at?: string | null
          status?: string | null
          total?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          warranty?: string | null
          workshop_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string
          id: string
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          type: string
          updated_at: string | null
          workshop_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          workshop_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          workshop_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          client_id: string | null
          color: string | null
          created_at: string | null
          id: string
          km: number | null
          mileage: number | null
          model: string
          notes: string | null
          plate: string | null
          workshop_id: string
          year: number | null
        }
        Insert: {
          brand: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          km?: number | null
          mileage?: number | null
          model: string
          notes?: string | null
          plate?: string | null
          workshop_id: string
          year?: number | null
        }
        Update: {
          brand?: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          km?: number | null
          mileage?: number | null
          model?: string
          notes?: string | null
          plate?: string | null
          workshop_id?: string
          year?: number | null
        }
        Relationships: []
      }
      workshops: {
        Row: {
          accepts_quotes: boolean | null
          address: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_public: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          plan_type: string | null
          profile_id: string
          rating: number | null
          reviews_count: number | null
          specialties: string[] | null
          state: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          accepts_quotes?: boolean | null
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          plan_type?: string | null
          profile_id: string
          rating?: number | null
          reviews_count?: number | null
          specialties?: string[] | null
          state?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          accepts_quotes?: boolean | null
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          plan_type?: string | null
          profile_id?: string
          rating?: number | null
          reviews_count?: number | null
          specialties?: string[] | null
          state?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshops_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_workshops: {
        Row: {
          accepts_quotes: boolean | null
          city: string | null
          description: string | null
          id: string | null
          is_public: boolean | null
          name: string | null
          plan_type: string | null
          rating: number | null
          reviews_count: number | null
          specialties: string[] | null
          state: string | null
        }
        Insert: {
          accepts_quotes?: boolean | null
          city?: string | null
          description?: string | null
          id?: string | null
          is_public?: boolean | null
          name?: string | null
          plan_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialties?: string[] | null
          state?: string | null
        }
        Update: {
          accepts_quotes?: boolean | null
          city?: string | null
          description?: string | null
          id?: string | null
          is_public?: boolean | null
          name?: string | null
          plan_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialties?: string[] | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
