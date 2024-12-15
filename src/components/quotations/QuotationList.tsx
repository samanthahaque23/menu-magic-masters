import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QuotationTableRow } from "./QuotationTableRow";

export const QuotationList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch quotations with explicit relationship specification
  const { data: quotations, isLoading: isLoadingQuotations } = useQuery({
    queryKey: ['admin-quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          profiles!quotations_customer_id_fkey (full_name, email),
          quotation_items (
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch quotes with explicit relationship specification
  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
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
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'quote' | 'quotation' }) => {
      const table = type === 'quote' ? 'quotes' : 'quotations';
      const itemsTable = type === 'quote' ? 'quote_items' : 'quotation_items';
      
      // First delete the related items
      const { error: itemsError } = await supabase
        .from(itemsTable)
        .delete()
        .eq(`${type}_id`, id);
      
      if (itemsError) throw itemsError;

      // Then delete the main record
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}s`] });
      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleStatusUpdate = async (quotationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ quote_status: newStatus })
        .eq('id', quotationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Quotation ${newStatus} successfully`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-quotations'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoadingQuotations || isLoadingQuotes) return <div>Loading...</div>;

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
            {quotations?.map((quotation) => (
              <QuotationTableRow
                key={quotation.id}
                item={quotation}
                type="quotation"
                onDelete={(id, type) => deleteQuoteMutation.mutate({ id, type })}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
            {quotes?.map((quote) => (
              <QuotationTableRow
                key={quote.id}
                item={quote}
                type="quote"
                onDelete={(id, type) => deleteQuoteMutation.mutate({ id, type })}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};