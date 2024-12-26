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
      chef_item_quotes: {
        Row: {
          chef_id: string | null
          created_at: string
          id: string
          is_selected: boolean | null
          is_visible_to_customer: boolean | null
          price: number
          quote_id: string | null
          quote_item_id: string | null
          quote_status: Database["public"]["Enums"]["quote_status"] | null
        }
        Insert: {
          chef_id?: string | null
          created_at?: string
          id?: string
          is_selected?: boolean | null
          is_visible_to_customer?: boolean | null
          price: number
          quote_id?: string | null
          quote_item_id?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
        }
        Update: {
          chef_id?: string | null
          created_at?: string
          id?: string
          is_selected?: boolean | null
          is_visible_to_customer?: boolean | null
          price?: number
          quote_id?: string | null
          quote_item_id?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "chef_item_quotes_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chef_item_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chef_item_quotes_quote_item_id_fkey"
            columns: ["quote_item_id"]
            isOneToOne: false
            referencedRelation: "quote_items"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_quotes: {
        Row: {
          chef_id: string | null
          created_at: string
          id: string
          is_visible_to_customer: boolean | null
          price: number
          quote_id: string | null
          quote_status: Database["public"]["Enums"]["quote_status"] | null
          status: string | null
        }
        Insert: {
          chef_id?: string | null
          created_at?: string
          id?: string
          is_visible_to_customer?: boolean | null
          price: number
          quote_id?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
          status?: string | null
        }
        Update: {
          chef_id?: string | null
          created_at?: string
          id?: string
          is_visible_to_customer?: boolean | null
          price?: number
          quote_id?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chef_quotes_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chef_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
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
          image_url: string | null
          is_available: boolean | null
          name: string
        }
        Insert: {
          course_type: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description?: string | null
          dietary_preference: Database["public"]["Enums"]["dietary_preference"]
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
        }
        Update: {
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          description?: string | null
          dietary_preference?: Database["public"]["Enums"]["dietary_preference"]
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
        }
        Relationships: []
      }
      item_orders: {
        Row: {
          chef_id: string | null
          chef_item_quote_id: string | null
          created_at: string
          id: string
          is_confirmed: boolean | null
          order_status: Database["public"]["Enums"]["order_status"] | null
          price: number
          quote_id: string | null
          quote_item_id: string | null
        }
        Insert: {
          chef_id?: string | null
          chef_item_quote_id?: string | null
          created_at?: string
          id?: string
          is_confirmed?: boolean | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          price: number
          quote_id?: string | null
          quote_item_id?: string | null
        }
        Update: {
          chef_id?: string | null
          chef_item_quote_id?: string | null
          created_at?: string
          id?: string
          is_confirmed?: boolean | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          price?: number
          quote_id?: string | null
          quote_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_orders_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_orders_chef_item_quote_id_fkey"
            columns: ["chef_item_quote_id"]
            isOneToOne: false
            referencedRelation: "chef_item_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_orders_quote_item_id_fkey"
            columns: ["quote_item_id"]
            isOneToOne: false
            referencedRelation: "quote_items"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          chef_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          non_veg_guests: number | null
          order_status: Database["public"]["Enums"]["order_status"] | null
          party_date: string | null
          party_location: string | null
          quote_id: string | null
          total_price: number
          veg_guests: number | null
        }
        Insert: {
          chef_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          non_veg_guests?: number | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          party_date?: string | null
          party_location?: string | null
          quote_id?: string | null
          total_price: number
          veg_guests?: number | null
        }
        Update: {
          chef_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          non_veg_guests?: number | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          party_date?: string | null
          party_location?: string | null
          quote_id?: string | null
          total_price?: number
          veg_guests?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
          chef_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          is_confirmed: boolean | null
          non_veg_guests: number | null
          order_status: Database["public"]["Enums"]["order_status"] | null
          party_date: string | null
          party_location: string | null
          quote_status: Database["public"]["Enums"]["quote_status"] | null
          total_price: number | null
          veg_guests: number | null
        }
        Insert: {
          chef_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          party_date?: string | null
          party_location?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
          total_price?: number | null
          veg_guests?: number | null
        }
        Update: {
          chef_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_confirmed?: boolean | null
          non_veg_guests?: number | null
          order_status?: Database["public"]["Enums"]["order_status"] | null
          party_date?: string | null
          party_location?: string | null
          quote_status?: Database["public"]["Enums"]["quote_status"] | null
          total_price?: number | null
          veg_guests?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      delete_quote_cascade: {
        Args: {
          quote_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      course_type: "starter" | "mains" | "desserts"
      dietary_preference: "vegetarian" | "non-vegetarian"
      order_status:
        | "pending_confirmation"
        | "confirmed"
        | "processing"
        | "ready_to_deliver"
        | "on_the_way"
        | "delivered"
        | "received"
      quote_status: "pending" | "approved" | "rejected" | "rejected_by_customer"
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
