import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QuotationTableRow } from "./QuotationTableRow";

export const QuotationList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
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
          ),
          chef_quotes (
            id,
            chef_id,
            price,
            quote_status,
            profiles!chef_quotes_chef_id_fkey (full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      console.log('Attempting to delete quote:', id);

      // First delete chef quotes
      const { data: chefQuotesData, error: chefQuotesError } = await supabase
        .from('chef_quotes')
        .delete()
        .eq('quote_id', id)
        .select();
      
      if (chefQuotesError) {
        console.error('Error deleting chef quotes:', chefQuotesError);
        throw chefQuotesError;
      }
      console.log('Deleted chef quotes:', chefQuotesData);

      // Then delete quote items
      const { data: quoteItemsData, error: itemsError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', id)
        .select();
      
      if (itemsError) {
        console.error('Error deleting quote items:', itemsError);
        throw itemsError;
      }
      console.log('Deleted quote items:', quoteItemsData);

      // Finally delete the main quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)
        .select();
      
      if (quoteError) {
        console.error('Error deleting quote:', quoteError);
        throw quoteError;
      }
      console.log('Deleted quote:', quoteData);

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleStatusUpdate = async (quoteId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ quote_status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Quote ${newStatus} successfully`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
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
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Party Details</TableHead>
              <TableHead>Menu Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes?.map((quote) => (
              <QuotationTableRow
                key={quote.id}
                item={quote}
                type="quote"
                onDelete={(id) => deleteQuoteMutation.mutate({ id })}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};