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
        .or(`quote_status.eq.pending,chef_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      return quotesData || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleQuoteSubmission = async (quoteId: string, price: number) => {
    try {
      const { error } = await supabase
        .from('chef_quotes')
        .insert({
          quote_id: quoteId,
          chef_id: session.user.id,
          price: price,
          is_visible_to_customer: true,
          quote_status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "You have already submitted a quote for this order.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success",
          description: "Quote submitted successfully",
        });
        refetch();
      }
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