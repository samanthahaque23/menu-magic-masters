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
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        throw error;
      }

      // Filter quotes to show:
      // 1. All pending quotes that don't have a chef assigned
      // 2. Quotes specifically assigned to this chef
      // 3. Quotes where this chef has submitted a quote
      return quotes?.filter(quote => {
        // Show all pending quotes that don't have a chef assigned
        if (quote.quote_status === 'pending' && !quote.chef_id) return true;
        
        // Show quotes assigned to this specific chef
        if (quote.chef_id === session.user.id) return true;
        
        // Show quotes where this chef has already submitted a quote
        if (quote.chef_quotes?.some(q => q.chef_id === session.user.id)) return true;
        
        return false;
      }).filter(quote => 
        // Ensure we only show quotes from customers
        quote.profiles?.role === 'customer'
      ) || [];
    }
  });

  const handleQuoteSubmission = async (quoteId: string, price: number) => {
    try {
      // First check if this chef has already submitted a quote
      const { data: existingQuotes, error: checkError } = await supabase
        .from('chef_quotes')
        .select('id')
        .eq('quote_id', quoteId)
        .eq('chef_id', session.user.id);

      if (checkError) throw checkError;

      if (existingQuotes && existingQuotes.length > 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You have already submitted a quote for this request",
        });
        return;
      }

      const { error } = await supabase
        .from('chef_quotes')
        .insert({
          quote_id: quoteId,
          chef_id: session.user.id,
          price: price,
          is_visible_to_customer: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote submitted successfully",
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