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

      return quotes?.filter(quote => {
        if (quote.quote_status === 'pending') return true;
        if (quote.item_orders?.some(order => order.chef_id === session.user.id)) return true;
        if (quote.chef_quotes?.some(q => q.chef_id === session.user.id)) return true;
        return false;
      }) || [];
    }
  });

  const handleQuoteSubmission = async (quoteId: string, itemPrices: Record<string, number>) => {
    try {
      console.log('Starting quote submission process...', { quoteId, itemPrices });

      // First, create chef item quotes for each item
      const chefItemQuotes = Object.entries(itemPrices).map(([itemId, price]) => ({
        quote_id: quoteId,
        quote_item_id: itemId,
        chef_id: session.user.id,
        price: price,
        quote_status: 'pending' as QuoteStatus,
        is_visible_to_customer: true
      }));

      console.log('Creating chef item quotes:', chefItemQuotes);

      const { data: insertedChefQuotes, error: chefQuotesError } = await supabase
        .from('chef_item_quotes')
        .insert(chefItemQuotes)
        .select();

      if (chefQuotesError) {
        console.error('Error creating chef item quotes:', chefQuotesError);
        throw chefQuotesError;
      }

      console.log('Successfully created chef item quotes:', insertedChefQuotes);

      // Then create item orders with pending_confirmation status
      const itemOrders = Object.entries(itemPrices).map(([itemId, price]) => ({
        quote_id: quoteId,
        quote_item_id: itemId,
        chef_id: session.user.id,
        price: price,
        order_status: 'pending_confirmation' as OrderStatus,
        is_confirmed: false
      }));

      console.log('Creating item orders:', itemOrders);

      const { data: insertedOrders, error: ordersError } = await supabase
        .from('item_orders')
        .insert(itemOrders)
        .select();

      if (ordersError) {
        console.error('Error creating item orders:', ordersError);
        throw ordersError;
      }

      console.log('Successfully created item orders:', insertedOrders);

      // Update the quote status
      const { error: quoteUpdateError } = await supabase
        .from('quotes')
        .update({ 
          quote_status: 'approved' as QuoteStatus,
          order_status: 'pending_confirmation' as OrderStatus,
          is_confirmed: false 
        })
        .eq('id', quoteId);

      if (quoteUpdateError) {
        console.error('Error updating quote status:', quoteUpdateError);
        throw quoteUpdateError;
      }

      toast({
        title: "Success",
        description: "Quote submitted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['chef-quotes'] });
    } catch (error: any) {
      console.error('Error in quote submission process:', error);
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