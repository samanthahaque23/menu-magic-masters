import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type Quotation = {
  id: string;
  party_date: string;
  party_location: string;
  veg_guests: number;
  non_veg_guests: number;
  status: Database["public"]["Enums"]["quotation_status"];
  customer: {
    full_name: string | null;
    email: string;
  } | null;
  quotation_items: {
    id: string;
    quantity: number;
    food_item: {
      name: string;
      dietary_preference: Database["public"]["Enums"]["dietary_preference"];
      course_type: Database["public"]["Enums"]["course_type"];
    } | null;
  }[] | null;
};

export const QuotationList = () => {
  const navigate = useNavigate();
  const { data: quotations, isLoading } = useQuery<Quotation[]>({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          id,
          party_date,
          party_location,
          veg_guests,
          non_veg_guests,
          status,
          customer:customer_id (
            full_name,
            email
          ),
          quotation_items (
            id,
            quantity,
            food_item:food_item_id (
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Quotations</h3>
        <Button onClick={() => navigate('/')}>
          Browse Restaurant Menu
        </Button>
      </div>
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
                    <p className="font-medium">{quotation.customer?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{quotation.customer?.email}</p>
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
                  <Card className="p-2">
                    <ul className="text-sm">
                      {quotation.quotation_items?.map((item) => (
                        <li key={item.id}>
                          {item.food_item?.name} x{item.quantity}
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