import { OrderProgress } from "../OrderProgress";
import type { Quote } from "@/integrations/supabase/types/quotes";

interface OrderStatusListProps {
  quotation: Quote;
  chefId: string;
}

export const OrderStatusList = ({ quotation, chefId }: OrderStatusListProps) => {
  return (
    <div className="space-y-2">
      {quotation.quote_items?.map((item) => {
        const itemOrder = quotation.item_orders?.find(
          order => order.quote_item_id === item.id && order.chef_id === chefId
        );
        return itemOrder ? (
          <div key={item.id} className="mb-2">
            <p className="text-sm font-medium mb-1">{item.food_items?.name}</p>
            <OrderProgress 
              quoteStatus={quotation.quote_status} 
              orderStatus={itemOrder.order_status}
            />
          </div>
        ) : null;
      })}
    </div>
  );
};