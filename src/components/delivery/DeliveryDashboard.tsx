import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const DeliveryDashboard = () => {
  const { toast } = useToast();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['delivery-orders'],
    queryFn: async () => {
      const quotationsPromise = supabase
        .from('quotations')
        .select(`
          *,
          profiles (full_name, email),
          quotation_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .in('order_status', ['ready_to_deliver', 'on_the_way'])
        .order('created_at', { ascending: false });

      const quotesPromise = supabase
        .from('quotes')
        .select(`
          *,
          profiles (full_name, email),
          quote_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .in('order_status', ['ready_to_deliver', 'on_the_way'])
        .order('created_at', { ascending: false });

      const [quotationsResult, quotesResult] = await Promise.all([
        quotationsPromise,
        quotesPromise
      ]);

      if (quotationsResult.error) throw quotationsResult.error;
      if (quotesResult.error) throw quotesResult.error;

      return [...(quotationsResult.data || []), ...(quotesResult.data || [])];
    },
  });

  const updateOrderStatus = async (id: string, type: 'quotation' | 'quote', newStatus: 'on_the_way' | 'delivered') => {
    try {
      const { error } = await supabase
        .from(type === 'quotation' ? 'quotations' : 'quotes')
        .update({ order_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order marked as ${newStatus.replace(/_/g, ' ')}`,
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Delivery Dashboard</h2>
      <div className="grid gap-6">
        {orders?.map((order) => (
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
                    ? order.quotation_items?.map((item, index) => (
                        <li key={index}>
                          {item.food_items?.name} x{item.quantity}
                          <span className="text-xs ml-2 text-muted-foreground">
                            ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                          </span>
                        </li>
                      ))
                    : order.quote_items?.map((item, index) => (
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
                <div className="flex gap-2">
                  {order.order_status === 'ready_to_deliver' && (
                    <Button 
                      onClick={() => updateOrderStatus(
                        order.id, 
                        'quotation_items' in order ? 'quotation' : 'quote', 
                        'on_the_way'
                      )}
                    >
                      Start Delivery
                    </Button>
                  )}
                  {order.order_status === 'on_the_way' && (
                    <Button 
                      onClick={() => updateOrderStatus(
                        order.id, 
                        'quotation_items' in order ? 'quotation' : 'quote', 
                        'delivered'
                      )}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};