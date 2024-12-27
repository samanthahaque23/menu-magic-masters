import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeliveryList } from "./DeliveryList";
import { DashboardNav } from "../shared/DashboardNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DeliveryDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deliveryName, setDeliveryName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setDeliveryName(profile.full_name);
      }
    };
    fetchProfile();
  }, []);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['delivery-orders'],
    queryFn: async () => {
      // Get all quotes that have item_orders in ready_to_deliver or on_the_way status
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (
            full_name,
            email
          ),
          quote_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          ),
          item_orders (
            order_status
          )
        `)
        .not('item_orders', 'is', null);

      if (error) throw error;

      // Filter quotes where all items are ready_to_deliver or in later stages
      // AND at least one item is in ready_to_deliver OR on_the_way state
      const readyOrders = quotes?.filter(quote => {
        // Check if all items are ready_to_deliver or in a later stage
        const allItemsReady = quote.item_orders?.every(
          order => ['ready_to_deliver', 'on_the_way', 'delivered'].includes(order.order_status)
        );
        // At least one item should be in ready_to_deliver OR on_the_way state
        const hasReadyOrOnTheWayItems = quote.item_orders?.some(
          order => order.order_status === 'ready_to_deliver' || order.order_status === 'on_the_way'
        );
        return allItemsReady && hasReadyOrOnTheWayItems;
      });

      console.log('Filtered ready orders:', readyOrders);
      return readyOrders || [];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleStatusUpdate = async (id: string, type: 'quote', newStatus: 'on_the_way' | 'delivered'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ order_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Also update all item_orders for this quote
      const { error: itemOrderError } = await supabase
        .from('item_orders')
        .update({ order_status: newStatus })
        .eq('quote_id', id);

      if (itemOrderError) throw itemOrderError;

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
    <div className="min-h-screen bg-background">
      <DashboardNav userName={deliveryName} onSignOut={handleSignOut} />
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">Delivery Dashboard</h2>
        <DeliveryList 
          orders={orders || []}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};