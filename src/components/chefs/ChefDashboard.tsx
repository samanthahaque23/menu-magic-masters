import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ChefDashboard = () => {
  const { toast } = useToast();
  
  const { data: quotations, isLoading: quotationsLoading, refetch: refetchQuotations } = useQuery({
    queryKey: ['quotations'],
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

  const { data: quotes, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
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

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected', type: 'quotation' | 'quote') => {
    try {
      const { error } = await supabase
        .from(type === 'quotation' ? 'quotations' : 'quotes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'quotation' ? 'Quotation' : 'Quote'} ${newStatus} successfully`,
      });
      
      if (type === 'quotation') {
        refetchQuotations();
      } else {
        refetchQuotes();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (quotationsLoading || quotesLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Chef Dashboard</h2>
      
      <Tabs defaultValue="quotations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="quotations">
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
                      <Card className="p-2">
                        <ul className="text-sm space-y-1">
                          {quotation.quotation_items?.map((item, index) => (
                            <li key={index}>
                              {item.food_items?.name} x{item.quantity}
                              <span className="text-xs ml-2 text-muted-foreground">
                                ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quotation.status === 'approved'
                            ? 'default'
                            : quotation.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {quotation.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(quotation.id, 'approved', 'quotation')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(quotation.id, 'rejected', 'quotation')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="quotes">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party Details</TableHead>
                  <TableHead>Menu Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes?.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div>
                        <p>Date: {quote.party_date ? format(new Date(quote.party_date), 'PPP') : 'Not specified'}</p>
                        <p>Location: {quote.party_location || 'Not specified'}</p>
                        <p>Veg Guests: {quote.veg_guests || 0}</p>
                        <p>Non-veg Guests: {quote.non_veg_guests || 0}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Card className="p-2">
                        <ul className="text-sm space-y-1">
                          {quote.quote_items?.map((item, index) => (
                            <li key={index}>
                              {item.food_items?.name} x{item.quantity}
                              <span className="text-xs ml-2 text-muted-foreground">
                                ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.status === 'approved'
                            ? 'default'
                            : quote.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {quote.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(quote.id, 'approved', 'quote')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(quote.id, 'rejected', 'quote')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};