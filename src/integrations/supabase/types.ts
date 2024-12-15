export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chefs: {
        Row: {
          created_at: string
          email: string
          experience_years: number | null
          id: string
          name: string
          phone: string | null
          speciality: string | null
        }
        Insert: {
          created_at?: string
          email: string
          experience_years?: number | null
          id?: string
          name: string
          phone?: string | null
          speciality?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          experience_years?: number | null
          id?: string
          name?: string
          phone?: string | null
          speciality?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      food_items: {
        Row: {
          course_type: Database["public"]["Enums"]["course_type"]
          created_at: string
          description: string | null
          dietary_preference: Database["public"]["Enums"]["dietary_preference"]
          id: string
          is_available: boolean | null
          name: string
          price: number
        }
        Insert: {
          course_type: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description?: string | null
          dietary_preference: Database["public"]["Enums"]["dietary_preference"]
          id?: string
          is_available?: boolean | null
          name: string
          price: number
        }
        Update: {
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description?: string | null
          dietary_preference?: Database["public"]["Enums"]["dietary_preference"]
          id?: string
          is_available?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          quantity: number
          quotation_id: string
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          quantity?: number
          quotation_id: string
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          quantity?: number
          quotation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_confirmed: boolean | null
          non_veg_guests: number
          party_date: string
          party_location: string
          status: Database["public"]["Enums"]["quotation_status"]
          total_price: number | null
          veg_guests: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number
          party_date: string
          party_location: string
          status?: Database["public"]["Enums"]["quotation_status"]
          total_price?: number | null
          veg_guests?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number
          party_date?: string
          party_location?: string
          status?: Database["public"]["Enums"]["quotation_status"]
          total_price?: number | null
          veg_guests?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string
          food_item_id: string | null
          id: string
          quantity: number | null
          quote_id: string | null
        }
        Insert: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          quantity?: number | null
          quote_id?: string | null
        }
        Update: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          quantity?: number | null
          quote_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          is_confirmed: boolean | null
          non_veg_guests: number | null
          party_date: string | null
          party_location: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          total_price: number | null
          veg_guests: number | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number | null
          party_date?: string | null
          party_location?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          total_price?: number | null
          veg_guests?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number | null
          party_date?: string | null
          party_location?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          total_price?: number | null
          veg_guests?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      course_type: "starter" | "mains" | "desserts"
      dietary_preference: "vegetarian" | "non-vegetarian"
      quotation_status:
        | "pending"
        | "approved"
        | "rejected"
        | "processing"
        | "ready_to_deliver"
        | "on_the_way"
        | "delivered"
        | "received"
      quote_status:
        | "pending"
        | "approved"
        | "rejected"
        | "processing"
        | "ready_to_deliver"
        | "on_the_way"
        | "delivered"
        | "received"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
