import { DeliveryCard } from "./DeliveryCard";

interface DeliveryListProps {
  orders: any[];
  onStatusUpdate: (id: string, type: 'quote', newStatus: 'on_the_way' | 'delivered') => Promise<void>;
}

export const DeliveryList = ({ orders, onStatusUpdate }: DeliveryListProps) => {
  if (!orders?.length) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => (
        <DeliveryCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};