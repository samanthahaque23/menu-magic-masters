import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { OrderProgress } from "./OrderProgress";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";
import type { Quote } from "@/integrations/supabase/types/quotes";

interface QuotationTableProps {
  quotations: Quote[];
  onStatusUpdate: (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => void;
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
                    {quotation.quote_items?.map((item, index) => (
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
                <OrderProgress 
                  quoteStatus={quotation.quote_status || 'pending'} 
                  orderStatus={quotation.order_status} 
                />
              </TableCell>
              <TableCell>
                {quotation.quote_status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onStatusUpdate(quotation.id, 'approved', 'pending_confirmation')}
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
                {quotation.quote_status === 'approved' && quotation.order_status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(quotation.id, 'approved', 'processing')}
                  >
                    Start Processing
                  </Button>
                )}
                {quotation.quote_status === 'approved' && quotation.order_status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(quotation.id, 'approved', 'ready_to_deliver')}
                  >
                    Mark Ready
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