import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChefItemQuote } from "@/integrations/supabase/types/chef-quotes";

export const CustomerOrders = ({ orders, refetch }) => {
  const { toast } = useToast();

  const handleQuoteSelection = async (
    quoteId: string, 
    quoteItemId: string, 
    chefItemQuoteId: string, 
    price: number
  ) => {
    try {
      // Reset all chef item quotes to pending first
      const { error: resetError } = await supabase
        .from('chef_item_quotes')
        .update({ quote_status: 'pending' })
        .eq('quote_item_id', quoteItemId);

      if (resetError) throw resetError;

      // Then approve the selected quote
      const { error: chefQuoteError } = await supabase
        .from('chef_item_quotes')
        .update({ quote_status: 'approved' })
        .eq('id', chefItemQuoteId);

      if (chefQuoteError) throw chefQuoteError;

      // Update the quote total price
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

      // If confirming order, create item_orders for each approved chef item quote
      if (action === 'confirm') {
        const { data: approvedQuotes, error: quotesError } = await supabase
          .from('chef_item_quotes')
          .select('*')
          .eq('quote_id', id)
          .eq('quote_status', 'approved');

        if (quotesError) throw quotesError;

        const itemOrders = approvedQuotes.map(quote => ({
          quote_id: id,
          quote_item_id: quote.quote_item_id,
          chef_id: quote.chef_id,
          chef_item_quote_id: quote.id,
          price: quote.price
        }));

        if (itemOrders.length > 0) {
          const { error: ordersError } = await supabase
            .from('item_orders')
            .insert(itemOrders);

          if (ordersError) throw ordersError;
        }
      }

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
              <div className="space-y-4">
                {order.quote_items?.map((item) => (
                  <div key={item.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{item.food_items?.name} x{item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.food_items?.dietary_preference}, {item.food_items?.course_type}
                        </p>
                      </div>
                    </div>
                    {!order.is_confirmed && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Chef Quotes</h4>
                        <RadioGroup
                          defaultValue={
                            order.chef_item_quotes?.find(
                              q => q.quote_item_id === item.id && q.quote_status === 'approved'
                            )?.id
                          }
                          className="space-y-2"
                        >
                          {order.chef_item_quotes
                            ?.filter(quote => 
                              quote.quote_item_id === item.id && 
                              quote.is_visible_to_customer
                            )
                            .map((chefQuote: ChefItemQuote) => (
                              <div key={chefQuote.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={chefQuote.id}
                                  id={chefQuote.id}
                                  disabled={order.is_confirmed}
                                  onClick={() => 
                                    !order.is_confirmed && 
                                    handleQuoteSelection(
                                      order.id,
                                      item.id,
                                      chefQuote.id,
                                      chefQuote.price
                                    )
                                  }
                                />
                                <Label htmlFor={chefQuote.id} className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span>{chefQuote.profiles?.full_name}</span>
                                    <span className="font-semibold">${chefQuote.price}</span>
                                  </div>
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
              {!order.is_confirmed && order.quote_items?.every(item => 
                order.chef_item_quotes?.some(quote => 
                  quote.quote_item_id === item.id && 
                  quote.quote_status === 'approved'
                )
              ) && (
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