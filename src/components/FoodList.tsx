import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash, Plus } from 'lucide-react';

export const FoodList = () => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchFoodItems = async () => {
    try {
      let query = supabase.from('food_items').select('*');
      
      if (dietaryFilter !== 'all') {
        query = query.eq('dietary_preference', dietaryFilter);
      }
      if (courseFilter !== 'all') {
        query = query.eq('course_type', courseFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFoodItems(data || []);
    } catch (error: any) {
      console.error('Error fetching food items:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load food items"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [dietaryFilter, courseFilter]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Select onValueChange={setDietaryFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Dietary Preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setCourseFilter} defaultValue="all">
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

        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Food Item
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              {item.image_url && (
                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              {item.description && (
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span className="capitalize">{item.dietary_preference}</span>
                <span className="capitalize">{item.course_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-primary font-bold">${item.price.toFixed(2)}</div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};