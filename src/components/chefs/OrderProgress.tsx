import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuotationStatus } from "@/integrations/supabase/types/enums";

interface OrderProgressProps {
  status: QuotationStatus;
}

export const OrderProgress = ({ status }: OrderProgressProps) => {
  const getProgressValue = (status: QuotationStatus) => {
    switch (status) {
      case 'pending':
        return 12.5;
      case 'processing':
        return 25;
      case 'approved':
        return 37.5;
      case 'ready_to_deliver':
        return 50;
      case 'on_the_way':
        return 75;
      case 'delivered':
        return 87.5;
      case 'received':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
      case 'ready_to_deliver':
        return 'bg-purple-500';
      case 'on_the_way':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-teal-500';
      case 'received':
        return 'bg-emerald-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Badge variant={status === 'rejected' ? 'destructive' : 'default'}>
          {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Badge>
      </div>
      <Progress value={getProgressValue(status)} className={getStatusColor(status)} />
    </div>
  );
};