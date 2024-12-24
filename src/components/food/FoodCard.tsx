import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface FoodCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export const FoodCard = ({ item, onEdit, onDelete }: FoodCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
      {item.description && (
        <p className="text-primary/60 text-sm mb-4">{item.description}</p>
      )}
      <div className="flex justify-between items-center text-sm text-primary/80 mb-4">
        <span className="capitalize">{item.dietary_preference}</span>
        <span className="capitalize">{item.course_type}</span>
      </div>
      <div className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(item)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};