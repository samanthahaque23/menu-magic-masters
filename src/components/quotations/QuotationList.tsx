import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const QuotationList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch both quotations and quotes
  const { data: quotations, isLoading: isLoadingQuotations } = useQuery({
    queryKey: ['admin-quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles (full_name, email),
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

  const renderQuoteItems = (items: any[]) => (
    <Card className="p-2">
      <ul className="text-sm space-y-1">
        {items?.map((item, index) => (
          <li key={index}>
            {item.food_items?.name} x{item.quantity}
            <span className="text-xs ml-2 text-muted-foreground">
              ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );

  const renderDeleteButton = (id: string, type: 'quote' | 'quotation') => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the quote and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteQuoteMutation.mutate({ id, type })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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
              <TableRow key={quotation.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{quotation.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{quotation.profiles?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Date: {format(new Date(quotation.party_date), 'PPP')}</p>
                    <p>Location: {quotation.party_location}</p>
                    <p>Veg Guests: {quotation.veg_guests}</p>
                    <p>Non-veg Guests: {quotation.non_veg_guests}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {renderQuoteItems(quotation.quotation_items)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      quotation.quote_status === 'approved'
                        ? 'default'
                        : quotation.quote_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {quotation.quote_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {quotation.quote_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(quotation.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(quotation.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {renderDeleteButton(quotation.id, 'quotation')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {quotes?.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{quote.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{quote.profiles?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Date: {quote.party_date ? format(new Date(quote.party_date), 'PPP') : 'N/A'}</p>
                    <p>Location: {quote.party_location || 'N/A'}</p>
                    <p>Veg Guests: {quote.veg_guests}</p>
                    <p>Non-veg Guests: {quote.non_veg_guests}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {renderQuoteItems(quote.quote_items)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      quote.quote_status === 'approved'
                        ? 'default'
                        : quote.quote_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {quote.quote_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {renderDeleteButton(quote.id, 'quote')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};