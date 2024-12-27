import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DeliveryActionsProps {
  order: any;
  onStatusUpdate: (id: string, type: 'quote', newStatus: 'on_the_way' | 'delivered') => Promise<void>;
}

export const DeliveryActions = ({ order, onStatusUpdate }: DeliveryActionsProps) => {
  if (order.order_status === 'delivered') {
    return <Badge variant="secondary">Delivered</Badge>;
  }

  return (
    <div className="flex gap-2">
      {order.order_status === 'ready_to_deliver' && (
        <Button 
          onClick={() => onStatusUpdate(order.id, 'quote', 'on_the_way')}
        >
          Start Delivery
        </Button>
      )}
      {order.order_status === 'on_the_way' && (
        <Button 
          onClick={() => onStatusUpdate(order.id, 'quote', 'delivered')}
        >
          Mark as Delivered
        </Button>
      )}
    </div>
  );
};