import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type OrderStatus = 'pending' | 'processing' | 'approved' | 'rejected';

interface OrderProgressProps {
  status: OrderStatus;
}

export const OrderProgress = ({ status }: OrderProgressProps) => {
  const getProgressValue = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'processing':
        return 50;
      case 'approved':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
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
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      <Progress value={getProgressValue(status)} className={getStatusColor(status)} />
    </div>
  );
};