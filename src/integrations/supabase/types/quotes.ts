import { DietaryPreference, CourseType, QuoteStatus } from './enums';

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
  party_date: string | null;
  party_location: string | null;
  veg_guests: number | null;
  non_veg_guests: number | null;
  status: QuoteStatus | null;
  created_at: string;
  quote_items?: QuoteItem[];
}