import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const QuotationList = () => {
  const { data: quotations, isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          profiles:customer_id (full_name, email),
          quotation_items (
            *,
            food_items (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Quotations</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Party Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
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
                <TableCell>{format(new Date(quotation.party_date), 'PPP')}</TableCell>
                <TableCell>{quotation.party_location}</TableCell>
                <TableCell>
                  <p>Veg: {quotation.veg_guests}</p>
                  <p>Non-veg: {quotation.non_veg_guests}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      quotation.status === 'approved'
                        ? 'success'
                        : quotation.status === 'rejected'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {quotation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Card className="p-2">
                    <ul className="text-sm">
                      {quotation.quotation_items?.map((item) => (
                        <li key={item.id}>
                          {item.food_items?.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};