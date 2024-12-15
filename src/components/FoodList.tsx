import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodItem, DietaryPreference, CourseType } from '@/types';

// Temporary data for demonstration
const mockFoodItems: FoodItem[] = [
  { id: '1', name: 'Vegetable Spring Rolls', dietaryPreference: 'vegetarian', courseType: 'starter', price: 8.99 },
  { id: '2', name: 'Chicken Tikka', dietaryPreference: 'non-vegetarian', courseType: 'starter', price: 10.99 },
  { id: '3', name: 'Paneer Butter Masala', dietaryPreference: 'vegetarian', courseType: 'mains', price: 15.99 },
];

export const FoodList = () => {
  const [dietaryFilter, setDietaryFilter] = useState<DietaryPreference | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<CourseType | 'all'>('all');

  const filteredItems = mockFoodItems.filter(item => {
    const matchesDietary = dietaryFilter === 'all' || item.dietaryPreference === dietaryFilter;
    const matchesCourse = courseFilter === 'all' || item.courseType === courseFilter;
    return matchesDietary && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Select onValueChange={(value: any) => setDietaryFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Dietary Preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value: any) => setCourseFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="starter">Starters</SelectItem>
            <SelectItem value="mains">Mains</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span className="capitalize">{item.dietaryPreference}</span>
              <span className="capitalize">{item.courseType}</span>
            </div>
            <div className="text-primary font-bold">${item.price.toFixed(2)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};