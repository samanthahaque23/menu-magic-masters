export type QuoteStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'ready_to_deliver'
  | 'on_the_way'
  | 'delivered'
  | 'received';
export type DietaryPreference = 'vegetarian' | 'non-vegetarian';
export type CourseType = 'starter' | 'mains' | 'desserts';