import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

export const useQuotes = (session: Session | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['chef-quotes', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
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
        .or(`chef_id.eq.${session.user.id},and(quote_status.eq.pending,chef_id.is.null)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleQuoteSubmission = async (quoteId: string, price: number) => {
    try {
      const { error } = await supabase
        .from('chef_quotes')
        .insert({
          quote_id: quoteId,
          chef_id: session?.user?.id,
          price: price,
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

  const handleStatusUpdate = async (quoteId: string, newStatus: 'ready_to_deliver' | 'delivered') => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ order_status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order marked as ${newStatus.replace(/_/g, ' ')}`,
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
    handleStatusUpdate,
  };
};