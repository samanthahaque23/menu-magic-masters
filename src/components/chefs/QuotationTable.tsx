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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuotationTableProps {
  quotations: Quote[];
  onStatusUpdate: (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus) => void;
  onQuoteSubmit: (quoteId: string, itemPrices: Record<string, number>) => void;
}

export const QuotationTable = ({ 
  quotations, 
  onStatusUpdate,
  onQuoteSubmit
}: QuotationTableProps) => {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmitQuote = async (quotation: Quote) => {
    // Validate that all items have prices
    const itemPrices: Record<string, number> = {};
    let isValid = true;

    quotation.quote_items?.forEach(item => {
      const price = parseFloat(prices[`${quotation.id}-${item.id}`] || "0");
      if (!price || price <= 0) {
        isValid = false;
        return;
      }
      itemPrices[item.id] = price;
    });

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter valid prices for all items"
      });
      return;
    }
    
    onQuoteSubmit(quotation.id, itemPrices);
    
    // Clear prices for this quote
    const newPrices = { ...prices };
    quotation.quote_items?.forEach(item => {
      delete newPrices[`${quotation.id}-${item.id}`];
    });
    setPrices(newPrices);
  };

  const handleItemStatusUpdate = async (quoteId: string, itemId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('item_orders')
        .update({ order_status: newStatus })
        .eq('quote_id', quoteId)
        .eq('quote_item_id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item status updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="rounded-md border border-[#600000]/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#600000]/5">
            <TableHead className="text-[#600000] font-semibold">Customer</TableHead>
            <TableHead className="text-[#600000] font-semibold">Party Details</TableHead>
            <TableHead className="text-[#600000] font-semibold">Menu Items</TableHead>
            <TableHead className="text-[#600000] font-semibold">Status</TableHead>
            <TableHead className="text-[#600000] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations?.map((quotation) => (
            <TableRow 
              key={quotation.id}
              className="border-b border-[#600000]/10"
            >
              <TableCell className="text-[#600000]">
                <div>
                  <p className="font-medium">
                    {quotation.profiles?.full_name || 'Unknown Customer'}
                  </p>
                  <p className="text-sm opacity-75">
                    {quotation.profiles?.email}
                  </p>
                  {quotation.profiles?.phone && (
                    <p className="text-sm opacity-75">
                      Phone: {quotation.profiles.phone}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-[#600000]">
                <div>
                  <p>Date: {quotation.party_date ? format(new Date(quotation.party_date), 'PPP') : 'N/A'}</p>
                  <p>Location: {quotation.party_location}</p>
                  <p>Veg Guests: {quotation.veg_guests}</p>
                  <p>Non-veg Guests: {quotation.non_veg_guests}</p>
                </div>
              </TableCell>

              <TableCell className="text-[#600000]">
                <Card className="p-2 border border-[#600000]/10">
                  <ul className="text-sm space-y-1">
                    {quotation.quote_items?.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>
                          {item.food_items?.name} x{item.quantity}
                          <span className="text-xs ml-2 opacity-75">
                            ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
                          </span>
                        </span>
                        {quotation.quote_status === 'pending' && (
                          <Input
                            type="number"
                            placeholder="Price"
                            className="w-24 ml-2"
                            value={prices[`${quotation.id}-${item.id}`] || ''}
                            onChange={(e) => setPrices(prev => ({
                              ...prev,
                              [`${quotation.id}-${item.id}`]: e.target.value
                            }))}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              </TableCell>

              <TableCell className="text-[#600000]">
                <div className="space-y-2">
                  {quotation.quote_items?.map((item) => {
                    const itemOrder = quotation.item_orders?.find(
                      order => order.quote_item_id === item.id && order.chef_id === quotation.chef_id
                    );
                    return itemOrder ? (
                      <div key={item.id} className="mb-2">
                        <p className="text-sm font-medium mb-1">{item.food_items?.name}</p>
                        <OrderProgress 
                          quoteStatus={quotation.quote_status} 
                          orderStatus={itemOrder.order_status}
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </TableCell>

              <TableCell>
                {quotation.quote_status === 'pending' && !quotation.chef_quotes?.some(q => q.chef_id === quotation.chef_id) && (
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmitQuote(quotation)}
                      className="bg-[#600000] hover:bg-[#600000]/90 text-white"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Submit Quote
                    </Button>
                  </div>
                )}
                {quotation.quote_status === 'approved' && quotation.quote_items?.map((item) => {
                  const itemOrder = quotation.item_orders?.find(
                    order => order.quote_item_id === item.id && order.chef_id === quotation.chef_id
                  );
                  if (!itemOrder) return null;

                  return (
                    <div key={item.id} className="mb-2">
                      <p className="text-sm font-medium mb-1">{item.food_items?.name}</p>
                      {itemOrder.order_status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleItemStatusUpdate(quotation.id, item.id, 'processing')}
                          className="bg-[#600000] hover:bg-[#600000]/90 text-white w-full"
                        >
                          Start Processing
                        </Button>
                      )}
                      {itemOrder.order_status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => handleItemStatusUpdate(quotation.id, item.id, 'ready_to_deliver')}
                          className="bg-[#600000] hover:bg-[#600000]/90 text-white w-full"
                        >
                          Mark Ready
                        </Button>
                      )}
                    </div>
                  );
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};