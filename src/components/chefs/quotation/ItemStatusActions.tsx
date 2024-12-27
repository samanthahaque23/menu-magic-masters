import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/integrations/supabase/types/enums";
import { OrderProgress } from "../OrderProgress";
import type { Quote } from "@/integrations/supabase/types/quotes";

interface ItemStatusActionsProps {
  quotation: Quote;
  itemId: string;
  itemName: string;
  orderStatus: OrderStatus;
  onStatusUpdate: (quoteId: string, itemId: string, status: OrderStatus) => Promise<void>;
}

export const ItemStatusActions = ({ 
  quotation,
  itemId,
  itemName,
  orderStatus,
  onStatusUpdate
}: ItemStatusActionsProps) => {
  return (
    <div key={itemId} className="mb-2">
      <p className="text-sm font-medium mb-1">{itemName}</p>
      <div className="space-y-2">
        {orderStatus === 'confirmed' && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(quotation.id, itemId, 'processing')}
            className="bg-[#600000] hover:bg-[#600000]/90 text-white w-full"
          >
            Start Processing
          </Button>
        )}
        {orderStatus === 'processing' && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(quotation.id, itemId, 'ready_to_deliver')}
            className="bg-[#600000] hover:bg-[#600000]/90 text-white w-full"
          >
            Mark Ready to Deliver
          </Button>
        )}
        <OrderProgress 
          quoteStatus={quotation.quote_status} 
          orderStatus={orderStatus}
        />
      </div>
    </div>
  );
};