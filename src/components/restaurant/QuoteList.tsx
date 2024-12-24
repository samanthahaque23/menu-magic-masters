import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface QuoteListProps {
  items: Array<{ foodItem: any; quantity: number }>;
  setItems: React.Dispatch<React.SetStateAction<Array<{ foodItem: any; quantity: number }>>>;
}

export const QuoteList = ({ items, setItems }: QuoteListProps) => {
  const updateQuantity = (itemId: string, change: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.foodItem.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.foodItem.id !== itemId));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-primary/60">
        <p>Your quote is empty</p>
        <p className="text-sm">Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {items.map(({ foodItem, quantity }) => (
          <div key={foodItem.id}>
            <div className="flex justify-between items-start py-4">
              <div className="space-y-1">
                <h4 className="font-medium leading-none">{foodItem.name}</h4>
                <p className="text-sm text-primary/60">
                  {foodItem.dietary_preference} • {foodItem.course_type}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(foodItem.id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(foodItem.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(foodItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};