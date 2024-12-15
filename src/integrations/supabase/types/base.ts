import type { 
  TablesChefs,
  TablesCustomers,
  TablesFoodItems,
  TablesProfiles,
  TablesQuotations,
  TablesQuotationItems 
} from './tables';

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
      chefs: TablesChefs
      customers: TablesCustomers
      food_items: TablesFoodItems
      profiles: TablesProfiles
      quotations: TablesQuotations
      quotation_items: TablesQuotationItems
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface DatabaseEnums {
  course_type: "starter" | "mains" | "desserts"
  dietary_preference: "vegetarian" | "non-vegetarian"
  quotation_status: "pending" | "approved" | "rejected"
}