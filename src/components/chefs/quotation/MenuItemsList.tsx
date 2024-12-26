import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Quote } from "@/integrations/supabase/types/quotes";

interface MenuItemsListProps {
  quotation: Quote;
  prices: Record<string, string>;
  onPriceChange: (quoteId: string, itemId: string, price: string) => void;
}

export const MenuItemsList = ({ quotation, prices, onPriceChange }: MenuItemsListProps) => {
  return (
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
                onChange={(e) => onPriceChange(quotation.id, item.id, e.target.value)}
              />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};