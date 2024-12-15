export type DietaryPreference = 'vegetarian' | 'non-vegetarian';
export type CourseType = 'starter' | 'mains' | 'desserts';

export interface FoodItem {
  id: string;
  name: string;
  dietaryPreference: DietaryPreference;
  courseType: CourseType;
  price: number;
}

export interface Staff {
  id: string;
  email: string;
  name: string;
  role: 'chef' | 'delivery';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}