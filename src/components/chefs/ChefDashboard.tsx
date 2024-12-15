import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotationTable } from "./QuotationTable";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";

export const ChefDashboard = () => {
  const { toast } = useToast();
  
  const { data: quotes, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles (full_name, email),
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

  const handleStatusUpdate = async (id: string, quoteStatus: QuoteStatus, orderStatus?: OrderStatus, price?: number) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          quote_status: quoteStatus,
          ...(orderStatus && { order_status: orderStatus }),
          ...(price && { total_price: price })
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Quote status updated successfully`,
      });
      
      refetchQuotes();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (quotesLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Chef Dashboard</h2>
      
      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuotationTable 
            quotations={quotes || []} 
            onStatusUpdate={handleStatusUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};