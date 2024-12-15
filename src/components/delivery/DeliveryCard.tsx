import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { OrderProgress } from "../chefs/OrderProgress";
import { DeliveryActions } from "./DeliveryActions";

interface DeliveryCardProps {
  order: any;
  onStatusUpdate: (id: string, type: 'quotation' | 'quote', newStatus: 'on_the_way' | 'delivered') => Promise<void>;
}

export const DeliveryCard = ({ order, onStatusUpdate }: DeliveryCardProps) => {
  return (
    <Card key={order.id} className="p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p>Name: {order.profiles?.full_name}</p>
          <p>Email: {order.profiles?.email}</p>
          <p>Location: {order.party_location}</p>
          <p>Date: {format(new Date(order.party_date), 'PPP')}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Menu Items</h3>
          <ul className="space-y-1">
            {'quotation_items' in order
              ? order.quotation_items?.map((item: any, index: number) => (
                  <li key={index}>
                    {item.food_items?.name} x{item.quantity}
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                    </span>
                  </li>
                ))
              : order.quote_items?.map((item: any, index: number) => (
                  <li key={index}>
                    {item.food_items?.name} x{item.quantity}
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                    </span>
                  </li>
                ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2">Order Status</h3>
          <OrderProgress 
            quoteStatus={order.quote_status} 
            orderStatus={order.order_status}
          />
          <DeliveryActions
            order={order}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      </div>
    </Card>
  );
};