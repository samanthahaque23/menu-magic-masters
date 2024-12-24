import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";

interface OrderProgressProps {
  quoteStatus: QuoteStatus;
  orderStatus?: OrderStatus;
}

export const OrderProgress = ({ quoteStatus, orderStatus }: OrderProgressProps) => {
  const getProgressValue = (quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => {
    if (quoteStatus === 'rejected') return 0;
    if (quoteStatus === 'pending') return 12.5;
    if (quoteStatus === 'approved') {
      if (!orderStatus) return 25;
      switch (orderStatus) {
        case 'pending_confirmation':
          return 25;
        case 'confirmed':
          return 37.5;
        case 'processing':
          return 50;
        case 'ready_to_deliver':
          return 62.5;
        case 'on_the_way':
          return 75;
        case 'delivered':
          return 87.5;
        case 'received':
          return 100;
        default:
          return 25;
      }
    }
    return 0;
  };

  const getStatusColor = (quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => {
    if (quoteStatus === 'rejected') return 'bg-red-500';
    if (quoteStatus === 'pending') return 'bg-yellow-500';
    if (quoteStatus === 'approved') {
      if (!orderStatus) return 'bg-green-500';
      switch (orderStatus) {
        case 'pending_confirmation':
          return 'bg-blue-500';
        case 'confirmed':
          return 'bg-green-500';
        case 'processing':
          return 'bg-purple-500';
        case 'ready_to_deliver':
          return 'bg-indigo-500';
        case 'on_the_way':
          return 'bg-orange-500';
        case 'delivered':
          return 'bg-teal-500';
        case 'received':
          return 'bg-emerald-500';
        default:
          return 'bg-gray-500';
      }
    }
    return 'bg-gray-500';
  };

  const getDisplayStatus = (quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => {
    if (quoteStatus === 'rejected') return 'Rejected';
    if (quoteStatus === 'pending') return 'Pending';
    if (quoteStatus === 'approved') {
      if (!orderStatus) return 'Approved';
      return orderStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return 'Unknown';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Badge variant={quoteStatus === 'rejected' ? 'destructive' : 'default'}>
          {getDisplayStatus(quoteStatus, orderStatus)}
        </Badge>
      </div>
      <Progress 
        value={getProgressValue(quoteStatus, orderStatus)} 
        className={getStatusColor(quoteStatus, orderStatus)} 
      />
    </div>
  );
};