import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";

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

  const handleStatusUpdate = async (id: string, action: 'received' | 'confirm', selectedChefQuote?: any) => {
    try {
      const updateData = action === 'received' 
        ? { 
            order_status: 'received' as const 
          }
        : { 
            is_confirmed: true, 
            order_status: 'confirmed' as const,
            quote_status: 'approved' as const,
            chef_id: selectedChefQuote?.chef_id
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
                          {order.quote_status === 'pending' && !order.is_confirmed && (
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
              <h3 className="font-semibold mb-2">Order Status</h3>
              <OrderProgress 
                quoteStatus={order.quote_status} 
                orderStatus={order.order_status}
              />
              {order.order_status === 'delivered' && (
                <Button
                  onClick={() => handleStatusUpdate(order.id, 'received')}
                >
                  Mark as Received
                </Button>
              )}
              {order.total_price && !order.is_confirmed && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    const approvedChefQuote = order.chef_quotes?.find(
                      quote => quote.quote_status === 'approved'
                    );
                    if (!approvedChefQuote) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please select a chef quote first",
                      });
                      return;
                    }
                    handleStatusUpdate(order.id, 'confirm', approvedChefQuote);
                  }}
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