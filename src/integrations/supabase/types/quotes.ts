import { DietaryPreference, CourseType, QuoteStatus, OrderStatus } from './enums';

export interface ChefQuote {
  id: string;
  chef_id: string | null;
  price: number;
  quote_status: QuoteStatus | null;
  is_visible_to_customer: boolean | null;
}

export interface QuoteItem {
  id: string;
  quote_id: string | null;
  food_item_id: string | null;
  quantity: number | null;
  created_at: string;
  food_items?: {
    name: string;
    dietary_preference: DietaryPreference;
    course_type: CourseType;
  };
}

export interface Quote {
  id: string;
  customer_id: string | null;
  chef_id: string | null;
  party_date: string | null;
  party_location: string | null;
  veg_guests: number | null;
  non_veg_guests: number | null;
  quote_status: QuoteStatus | null;
  order_status: OrderStatus | null;
  total_price: number | null;
  is_confirmed: boolean | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
    phone?: string | null;
  };
  quote_items?: QuoteItem[];
  chef_quotes?: ChefQuote[];
}