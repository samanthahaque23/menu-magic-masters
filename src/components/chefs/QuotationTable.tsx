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
  onQuoteSubmit: (quoteId: string, itemPrices: Record<string, number>) => void;
}

export const QuotationTable = ({ 
  quotations, 
  onStatusUpdate,
  onQuoteSubmit
}: QuotationTableProps) => {
  const [itemPrices, setItemPrices] = useState<Record<string, Record<string, string>>>({});

  const handlePriceChange = (quotationId: string, itemId: string, value: string) => {
    setItemPrices(prev => ({
      ...prev,
      [quotationId]: {
        ...(prev[quotationId] || {}),
        [itemId]: value
      }
    }));
  };

  const handleSubmitQuote = (quotation: Quote) => {
    const prices = itemPrices[quotation.id] || {};
    const validPrices: Record<string, number> = {};
    let isValid = true;

    // Validate all prices
    quotation.quote_items?.forEach(item => {
      const price = parseFloat(prices[item.id] || "0");
      if (!price || price <= 0) {
        isValid = false;
        return;
      }
      validPrices[item.id] = price;
    });

    if (!isValid) return;
    
    onQuoteSubmit(quotation.id, validPrices);
    
    // Clear prices after submission
    setItemPrices(prev => ({
      ...prev,
      [quotation.id]: {}
    }));
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
                <Card className="p-4 border border-[#600000]/10">
                  <ul className="space-y-4">
                    {quotation.quote_items?.map((item) => (
                      <li key={item.id} className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.food_items?.name}</span>
                          <span className="text-sm">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="text-xs opacity-75">
                          {item.food_items?.dietary_preference}, {item.food_items?.course_type}
                        </div>
                        {quotation.quote_status === 'pending' && (
                          <Input
                            type="number"
                            placeholder="Enter price per item"
                            value={itemPrices[quotation.id]?.[item.id] || ''}
                            onChange={(e) => handlePriceChange(quotation.id, item.id, e.target.value)}
                            className="w-full mt-1"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              </TableCell>
              <TableCell className="text-[#600000]">
                <OrderProgress 
                  quoteStatus={quotation.quote_status} 
                  orderStatus={quotation.order_status}
                />
              </TableCell>
              <TableCell>
                {quotation.quote_status === 'pending' && !quotation.chef_quotes?.some(q => q.chef_id === quotation.chef_id) && (
                  <Button
                    onClick={() => handleSubmitQuote(quotation)}
                    className="bg-[#600000] hover:bg-[#600000]/90 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Submit Quote
                  </Button>
                )}
                {quotation.quote_status === 'approved' && quotation.order_status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(quotation.id, 'approved', 'processing')}
                    className="bg-[#600000] hover:bg-[#600000]/90 text-white"
                  >
                    Start Processing
                  </Button>
                )}
                {quotation.quote_status === 'approved' && quotation.order_status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(quotation.id, 'approved', 'ready_to_deliver')}
                    className="bg-[#600000] hover:bg-[#600000]/90 text-white"
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