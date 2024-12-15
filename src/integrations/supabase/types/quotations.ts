import { DietaryPreference, CourseType, QuoteStatus, OrderStatus } from './enums';

export interface QuotationItem {
  id: string;
  quotation_id: string;
  food_item_id: string;
  quantity: number;
  created_at: string;
  food_items?: {
    name: string;
    dietary_preference: DietaryPreference;
    course_type: CourseType;
  };
}

export interface Quotation {
  id: string;
  customer_id: string;
  party_date: string;
  party_location: string;
  veg_guests: number;
  non_veg_guests: number;
  quote_status: QuoteStatus;
  order_status?: OrderStatus;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
  quotation_items?: QuotationItem[];
}