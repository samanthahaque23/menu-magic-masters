import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { OrderProgress } from "./OrderProgress";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";
import type { Quote } from "@/integrations/supabase/types/quotes";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuotationTableProps {
  quotations: Quote[];
  onStatusUpdate: (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus, price?: number) => void;
}

export const QuotationTable = ({ quotations, onStatusUpdate }: QuotationTableProps) => {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleAccept = async (quotation: Quote) => {
    const price = parseFloat(prices[quotation.id] || "0");
    if (!price || price <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Price",
        description: "Please enter a valid price before accepting the quote",
      });
      return;
    }

    // Get current chef's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to accept quotes",
      });
      return;
    }

    // Create a new quote entry for this chef
    const { error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_id: quotation.customer_id,
        party_date: quotation.party_date,
        party_location: quotation.party_location,
        veg_guests: quotation.veg_guests,
        non_veg_guests: quotation.non_veg_guests,
        total_price: price,
        quote_status: 'pending',
        chef_id: session.user.id
      });

    if (quoteError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quote. Please try again.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your quote has been submitted successfully",
    });

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
                {quotation.quote_status === 'rejected_by_customer' && (
                  <p className="text-sm text-red-500 mt-2">Rejected by customer</p>
                )}
              </TableCell>
              <TableCell>
                {quotation.quote_status === 'pending' && (
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
                        onClick={() => handleAccept(quotation)}
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