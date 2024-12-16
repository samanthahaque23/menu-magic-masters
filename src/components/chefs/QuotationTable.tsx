import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { OrderProgress } from "./OrderProgress";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";
import type { Quote } from "@/integrations/supabase/types/quotes";
import { useState } from "react";

interface QuotationTableProps {
  quotations: Quote[];
  onStatusUpdate: (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => void;
  onQuoteSubmit: (quoteId: string, price: number) => void;
}

export const QuotationTable = ({ 
  quotations, 
  onStatusUpdate,
  onQuoteSubmit
}: QuotationTableProps) => {
  const [prices, setPrices] = useState<Record<string, string>>({});

  const handleSubmitQuote = (quotation: Quote) => {
    const price = parseFloat(prices[quotation.id] || "0");
    if (!price || price <= 0) return;
    
    onQuoteSubmit(quotation.id, price);
    
    // Clear the price input
    setPrices(prev => ({
      ...prev,
      [quotation.id]: ''
    }));
  };

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
                  <p className="font-medium">{quotation.profiles?.full_name || 'Unknown Customer'}</p>
                  <p className="text-sm text-muted-foreground">{quotation.profiles?.email}</p>
                  {quotation.profiles?.phone && (
                    <p className="text-sm text-muted-foreground">Phone: {quotation.profiles.phone}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>Date: {quotation.party_date ? format(new Date(quotation.party_date), 'PPP') : 'N/A'}</p>
                  <p>Location: {quotation.party_location}</p>
                  <p>Veg Guests: {quotation.veg_guests}</p>
                  <p>Non-veg Guests: {quotation.non_veg_guests}</p>
                  {quotation.chef_quotes && quotation.chef_quotes.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold">Submitted Quotes:</p>
                      <ul className="text-sm space-y-1">
                        {quotation.chef_quotes.map((chefQuote) => (
                          <li key={chefQuote.id}>
                            Price: ${chefQuote.price}
                            {chefQuote.quote_status === 'approved' && (
                              <span className="ml-2 text-green-500">(Selected)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  quoteStatus={quotation.quote_status} 
                  orderStatus={quotation.order_status}
                />
              </TableCell>
              <TableCell>
                {quotation.quote_status === 'pending' && !quotation.chef_quotes?.some(q => q.chef_id === quotation.chef_id) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter price"
                        value={prices[quotation.id] || ''}
                        onChange={(e) => setPrices(prev => ({
                          ...prev,
                          [quotation.id]: e.target.value
                        }))}
                        className="w-32"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitQuote(quotation)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Submit Quote
                      </Button>
                    </div>
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