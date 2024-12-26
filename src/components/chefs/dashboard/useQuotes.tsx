import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";

export const useQuotes = (session: any) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['chef-quotes', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching quotes for chef:', session?.user?.id);
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (
            full_name,
            email,
            phone,
            role
          ),
          quote_items (
            id,
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          ),
          chef_quotes (
            id,
            chef_id,
            price,
            quote_status,
            profiles!chef_quotes_chef_id_fkey (
              full_name
            )
          ),
          item_orders (
            id,
            chef_id,
            quote_item_id,
            order_status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        throw error;
      }

      console.log('Fetched quotes:', quotes);

      return quotes?.filter(quote => {
        // Show quotes that are pending for all chefs
        if (quote.quote_status === 'pending') return true;
        
        // Show quotes where this chef has been selected (has item orders)
        if (quote.item_orders?.some(order => order.chef_id === session.user.id)) return true;
        
        // Show quotes where this chef has submitted quotes
        if (quote.chef_quotes?.some(q => q.chef_id === session.user.id)) return true;
        
        return false;
      }) || [];
    }
  });

  const handleQuoteSubmission = async (quoteId: string, itemPrices: Record<string, number>) => {
    try {
      // Create chef_item_quotes for each item
      const chefItemQuotes = Object.entries(itemPrices).map(([itemId, price]) => ({
        quote_id: quoteId,
        quote_item_id: itemId,
        chef_id: session.user.id,
        price: price,
        is_visible_to_customer: true
      }));

      // Insert chef item quotes
      const { data: insertedQuotes, error: quotesError } = await supabase
        .from('chef_item_quotes')
        .insert(chefItemQuotes)
        .select();

      if (quotesError) throw quotesError;

      // Create item orders for each quote item
      const itemOrders = insertedQuotes.map(quote => ({
        quote_id: quote.quote_id,
        quote_item_id: quote.quote_item_id,
        chef_id: session.user.id,
        chef_item_quote_id: quote.id,
        price: quote.price,
        order_status: 'confirmed' as OrderStatus,
        is_confirmed: true
      }));

      // Insert item orders
      const { error: ordersError } = await supabase
        .from('item_orders')
        .insert(itemOrders);

      if (ordersError) throw ordersError;

      toast({
        title: "Success",
        description: "Quote submitted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['chef-quotes'] });
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleStatusUpdate = async (
    quoteId: string,
    quoteStatus: QuoteStatus,
    orderStatus?: OrderStatus
  ) => {
    try {
      const updateData: any = { quote_status: quoteStatus };
      if (orderStatus) {
        updateData.order_status = orderStatus;
      }

      const { error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Status updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['chef-quotes'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return {
    quotes,
    isLoading,
    handleQuoteSubmission,
    handleStatusUpdate
  };
};