import { OrderStatus } from './enums';

export interface ItemOrder {
  id: string;
  quote_id: string;
  quote_item_id: string;
  chef_id: string;
  chef_item_quote_id: string;
  price: number;
  order_status: OrderStatus;
  created_at: string;
}

export interface Order {
  id: string;
  quote_id: string;
  chef_id: string;
  customer_id: string;
  total_price: number;
  party_date: string;
  party_location: string;
  veg_guests: number;
  non_veg_guests: number;
  order_status: OrderStatus;
  created_at: string;
}