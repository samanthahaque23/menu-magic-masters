import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";

export const useQuotes = (session: any) => {
  const { toast } = useToast();

  const { data: quotes, isLoading, refetch } = useQuery({
    queryKey: ['quotes', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (full_name, email, phone),
          quote_items (
            id,
            quote_id,
            food_item_id,
            quantity,
            created_at,
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
            is_visible_to_customer
          )
        `)
        .or(`quote_status.eq.pending,and(chef_id.eq.${session.user.id},quote_status.neq.rejected)`)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      
      // Filter out quotes where the current chef has already submitted a quote
      const filteredQuotes = quotesData?.filter(quote => {
        const hasSubmittedQuote = quote.chef_quotes?.some(
          chefQuote => chefQuote.chef_id === session.user.id
        );
        return !hasSubmittedQuote || quote.chef_id === session.user.id;
      });
      
      return filteredQuotes || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleQuoteSubmission = async (quoteId: string, price: number) => {
    try {
      // Check if chef has already submitted a quote
      const { data: existingQuotes, error: checkError } = await supabase
        .from('chef_quotes')
        .select('*')
        .eq('quote_id', quoteId)
        .eq('chef_id', session.user.id);

      if (checkError) throw checkError;

      if (existingQuotes && existingQuotes.length > 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You have already submitted a quote for this order.",
        });
        return;
      }

      const { error } = await supabase
        .from('chef_quotes')
        .insert({
          quote_id: quoteId,
          chef_id: session.user.id,
          price: price,
          is_visible_to_customer: true,
          quote_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote submitted successfully",
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

  const handleStatusUpdate = async (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          quote_status: quoteStatus,
          ...(orderStatus && { order_status: orderStatus })
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Quote status updated successfully`,
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

  return { quotes, isLoading, handleQuoteSubmission, handleStatusUpdate };
};