import { QuoteStatus } from './enums';

export interface ChefItemQuote {
  id: string;
  quote_id: string;
  quote_item_id: string;
  chef_id: string;
  price: number;
  quote_status: QuoteStatus;
  is_visible_to_customer: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface ChefQuote {
  id: string;
  chef_id: string;
  quote_id: string;
  price: number;
  quote_status: QuoteStatus;
  is_visible_to_customer: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}