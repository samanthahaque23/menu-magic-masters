import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const CustomerOrders = ({ orders, refetch }) => {
  const { toast } = useToast();

  const handleQuoteSelection = async (quoteId: string, chefQuoteId: string, price: number) => {
    try {
      const { error: chefQuoteError } = await supabase
        .from('chef_quotes')
        .update({ quote_status: 'approved' })
        .eq('id', chefQuoteId);

      if (chefQuoteError) throw chefQuoteError;

      const { error: quoteError } = await supabase
        .from('quotes')
        .update({ 
          total_price: price,
          quote_status: 'pending',
          is_confirmed: false
        })
        .eq('id', quoteId);

      if (quoteError) throw quoteError;

      toast({
        title: "Success",
        description: "Quote selected successfully",
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

  const handleStatusUpdate = async (id: string, action: 'received' | 'confirm') => {
    try {
      const updateData = action === 'received' 
        ? { 
            order_status: 'received' as const 
          }
        : { 
            is_confirmed: true, 
            order_status: 'confirmed' as const,
            quote_status: 'approved' as const 
          };

      const { error } = await supabase
        .from('quotes')
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      ready_to_deliver: "bg-indigo-100 text-indigo-800",
      on_the_way: "bg-cyan-100 text-cyan-800",
      delivered: "bg-green-100 text-green-800",
      received: "bg-emerald-100 text-emerald-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
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
              <div className="mt-4">
                <span className="text-sm font-medium mb-2 block">Current Status:</span>
                <Badge 
                  variant="secondary"
                  className={`${getStatusColor(order.order_status)} text-sm`}
                >
                  {order.order_status?.replace(/_/g, ' ').toUpperCase() || 'PENDING'}
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Menu Items</h3>
              <ul className="space-y-1">
                {order.quote_items?.map((item, index) => (
                  <li key={index}>
                    {item.food_items?.name} x{item.quantity}
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                    </span>
                  </li>
                ))}
              </ul>

              {order.chef_quotes && order.chef_quotes.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Chef Quotes</h3>
                  <ul className="space-y-2">
                    {order.chef_quotes
                      .filter(quote => quote.is_visible_to_customer)
                      .map((chefQuote) => (
                        <li key={chefQuote.id} className="flex items-center justify-between">
                          <div>
                            <span>{chefQuote.profiles?.full_name}</span>
                            <span className="ml-2 font-semibold">${chefQuote.price}</span>
                            {chefQuote.quote_status === 'approved' && (
                              <span className="ml-2 text-green-500">(Selected)</span>
                            )}
                          </div>
                          {!order.is_confirmed && order.quote_status !== 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleQuoteSelection(order.id, chefQuote.id, chefQuote.price)}
                              variant={chefQuote.quote_status === 'approved' ? 'secondary' : 'default'}
                            >
                              {chefQuote.quote_status === 'approved' ? 'Selected' : 'Select Quote'}
                            </Button>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold mb-2">Order Progress</h3>
              <OrderProgress 
                quoteStatus={order.quote_status} 
                orderStatus={order.order_status}
              />
              {order.order_status === 'delivered' && (
                <Button
                  onClick={() => handleStatusUpdate(order.id, 'received')}
                  className="w-full"
                >
                  Mark as Received
                </Button>
              )}
              {order.total_price && !order.is_confirmed && order.quote_status === 'pending' && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleStatusUpdate(order.id, 'confirm')}
                >
                  Confirm Order (${order.total_price})
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};