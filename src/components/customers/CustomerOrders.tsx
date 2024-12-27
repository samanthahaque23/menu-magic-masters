import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderProgress } from "../chefs/OrderProgress";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const CustomerOrders = ({ orders, refetch }) => {
  const { toast } = useToast();

  const handleQuoteSelection = async (quoteId: string, chefItemQuoteId: string, quoteItemId: string) => {
    try {
      // Reset all chef item quotes for this quote item to not selected
      const { error: resetError } = await supabase
        .from('chef_item_quotes')
        .update({ is_selected: false })
        .eq('quote_item_id', quoteItemId);

      if (resetError) throw resetError;

      // Then select the chosen chef item quote
      const { error: selectError } = await supabase
        .from('chef_item_quotes')
        .update({ is_selected: true })
        .eq('id', chefItemQuoteId);

      if (selectError) throw selectError;

      toast({
        title: "Success",
        description: "Chef selection updated successfully",
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
      // First, check the status of all item_orders for this quote
      const { data: itemOrders, error: fetchError } = await supabase
        .from('item_orders')
        .select('order_status')
        .eq('quote_id', id);

      if (fetchError) throw fetchError;

      // Determine the overall order status based on item_orders
      let orderStatus = action === 'received' ? 'received' as const : 'confirmed' as const;
      
      if (itemOrders && itemOrders.every(item => item.order_status === 'ready_to_deliver')) {
        orderStatus = 'ready_to_deliver';
      } else if (itemOrders && itemOrders.some(item => item.order_status === 'on_the_way')) {
        orderStatus = 'on_the_way';
      }

      const updateData = action === 'received' 
        ? { 
            order_status: orderStatus
          }
        : { 
            is_confirmed: true, 
            order_status: orderStatus,
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
            </div>
            <div>
              <h3 className="font-semibold mb-2">Menu Items</h3>
              <div className="space-y-4">
                {order.quote_items?.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {item.food_items?.name} x{item.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                    </div>
                    
                    {order.chef_item_quotes && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Chef Quotes</h4>
                        <RadioGroup
                          defaultValue={order.chef_item_quotes.find(q => 
                            q.quote_item_id === item.id && q.is_selected
                          )?.id}
                          className="space-y-2"
                        >
                          {order.chef_item_quotes
                            .filter(quote => 
                              quote.quote_item_id === item.id && 
                              quote.is_visible_to_customer
                            )
                            .map((chefQuote) => (
                              <div key={chefQuote.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={chefQuote.id}
                                  id={chefQuote.id}
                                  disabled={order.is_confirmed}
                                  onClick={() => !order.is_confirmed && 
                                    handleQuoteSelection(order.id, chefQuote.id, item.id)}
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
              {!order.is_confirmed && order.chef_item_quotes?.some(quote => quote.is_selected) && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleStatusUpdate(order.id, 'confirm')}
                >
                  Confirm Order
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};