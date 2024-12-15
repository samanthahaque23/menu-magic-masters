import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

export const RestaurantMenu = () => {
  const { toast } = useToast();
  const { data: foodItems, isLoading } = useQuery({
    queryKey: ['food-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToQuote = (item: any) => {
    // TODO: Implement add to quote functionality
    toast({
      title: "Coming soon!",
      description: "Add to quote functionality will be implemented soon.",
    });
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Restaurant Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems?.map((item) => (
          <Card key={item.id} className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
            )}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span className="capitalize">{item.dietary_preference}</span>
              <span className="capitalize">{item.course_type}</span>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => handleAddToQuote(item)}
                variant="secondary"
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add to Quote
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};