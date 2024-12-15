import { DatabaseEnums } from './base';

interface BaseTable<T> {
  Row: T
  Insert: Partial<T>
  Update: Partial<T>
}

export interface TablesChefs extends BaseTable<{
  created_at: string
  email: string
  experience_years: number | null
  id: string
  name: string
  phone: string | null
  speciality: string | null
}> {
  Relationships: []
}

export interface TablesCustomers extends BaseTable<{
  address: string | null
  created_at: string
  email: string
  id: string
  name: string
  phone: string | null
}> {
  Relationships: []
}

export interface TablesFoodItems extends BaseTable<{
  course_type: DatabaseEnums["course_type"]
  created_at: string
  description: string | null
  dietary_preference: DatabaseEnums["dietary_preference"]
  id: string
  is_available: boolean | null
  name: string
  price: number
}> {
  Relationships: []
}

export interface TablesProfiles extends BaseTable<{
  address: string | null
  created_at: string
  email: string
  full_name: string | null
  id: string
  phone: string | null
  role: string | null
}> {
  Relationships: []
}

export interface TablesQuotations extends BaseTable<{
  id: string
  customer_id: string
  party_date: string
  party_location: string
  veg_guests: number
  non_veg_guests: number
  status: DatabaseEnums["quotation_status"]
  created_at: string
}> {
  Relationships: [
    {
      foreignKeyName: "quotations_customer_id_fkey"
      columns: ["customer_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface TablesQuotationItems extends BaseTable<{
  id: string
  quotation_id: string
  food_item_id: string
  quantity: number
  created_at: string
}> {
  Relationships: [
    {
      foreignKeyName: "quotation_items_quotation_id_fkey"
      columns: ["quotation_id"]
      referencedRelation: "quotations"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "quotation_items_food_item_id_fkey"
      columns: ["food_item_id"]
      referencedRelation: "food_items"
      referencedColumns: ["id"]
    }
  ]
}