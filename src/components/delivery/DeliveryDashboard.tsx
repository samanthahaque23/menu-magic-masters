import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeliveryList } from "./DeliveryList";

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
        .in('order_status', ['ready_to_deliver', 'on_the_way', 'delivered', 'received'])
        .order('created_at', { ascending: false });

      const quotesPromise = supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (full_name, email),
          quote_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .in('order_status', ['ready_to_deliver', 'on_the_way', 'delivered', 'received'])
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
      <DeliveryList 
        orders={orders || []}
        onStatusUpdate={updateOrderStatus}
      />
    </div>
  );
};