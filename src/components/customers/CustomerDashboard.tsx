import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const CustomerDashboard = () => {
  const { toast } = useToast();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const quotationsPromise = supabase
        .from('quotations')
        .select(`
          *,
          quotation_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .order('created_at', { ascending: false });

      const quotesPromise = supabase
        .from('quotes')
        .select(`
          *,
          quote_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
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

  const handleStatusUpdate = async (id: string, type: 'quotation' | 'quote', action: 'received' | 'confirm') => {
    try {
      const updateData = action === 'received' 
        ? { order_status: 'received' }
        : { is_confirmed: true, order_status: 'confirmed' };

      const { error } = await supabase
        .from(type === 'quotation' ? 'quotations' : 'quotes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: action === 'received' 
          ? "Order marked as received"
          : "Order confirmed successfully",
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
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      <div className="grid gap-6">
        {orders?.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).map((order) => (
          <Card key={order.id} className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Party Details</h3>
                <p>Date: {format(new Date(order.party_date), 'PPP')}</p>
                <p>Location: {order.party_location}</p>
                <p>Vegetarian Guests: {order.veg_guests}</p>
                <p>Non-vegetarian Guests: {order.non_veg_guests}</p>
                {order.total_price && (
                  <p className="mt-4 text-lg font-semibold">
                    Total Price: ${order.total_price}
                  </p>
                )}
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
                {order.order_status === 'delivered' && (
                  <Button
                    onClick={() => handleStatusUpdate(
                      order.id,
                      'quotation_items' in order ? 'quotation' : 'quote',
                      'received'
                    )}
                  >
                    Mark as Received
                  </Button>
                )}
                {order.total_price && !order.is_confirmed && order.quote_status === 'approved' && (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handleStatusUpdate(
                      order.id,
                      'quotation_items' in order ? 'quotation' : 'quote',
                      'confirm'
                    )}
                  >
                    Confirm Order (${order.total_price})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};