import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { OrderProgress } from "./OrderProgress";
import { QuotationStatus } from "@/integrations/supabase/types/enums";
import type { Quotation } from "@/integrations/supabase/types/quotations";
import type { Quote } from "@/integrations/supabase/types/quotes";

interface QuotationTableProps {
  quotations: (Quotation | Quote)[];
  onStatusUpdate: (id: string, status: QuotationStatus) => void;
}

export const QuotationTable = ({ quotations, onStatusUpdate }: QuotationTableProps) => {
  return (
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
                  <p>Date: {quotation.party_date ? format(new Date(quotation.party_date), 'PPP') : 'N/A'}</p>
                  <p>Location: {quotation.party_location}</p>
                  <p>Veg Guests: {quotation.veg_guests}</p>
                  <p>Non-veg Guests: {quotation.non_veg_guests}</p>
                </div>
              </TableCell>
              <TableCell>
                <Card className="p-2">
                  <ul className="text-sm space-y-1">
                    {'quotation_items' in quotation
                      ? quotation.quotation_items?.map((item, index) => (
                          <li key={index}>
                            {item.food_items?.name} x{item.quantity}
                            <span className="text-xs ml-2 text-muted-foreground">
                              ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                            </span>
                          </li>
                        ))
                      : quotation.quote_items?.map((item, index) => (
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
                <OrderProgress status={quotation.status || 'pending'} />
              </TableCell>
              <TableCell>
                {quotation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onStatusUpdate(quotation.id, 'processing')}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onStatusUpdate(quotation.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {quotation.status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(quotation.id, 'approved')}
                  >
                    Complete Order
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};