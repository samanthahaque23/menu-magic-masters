import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotationTable } from "./QuotationTable";
import { QuotationStatus, QuoteStatus } from "@/integrations/supabase/types/enums";

export const ChefDashboard = () => {
  const { toast } = useToast();
  
  const { data: quotations, isLoading: quotationsLoading, refetch: refetchQuotations } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          profiles (full_name, email),
          quotation_items (
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

  const { data: quotes, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
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

  const handleStatusUpdate = async (id: string, newStatus: QuotationStatus | QuoteStatus, type: 'quotation' | 'quote') => {
    try {
      const { error } = await supabase
        .from(type === 'quotation' ? 'quotations' : 'quotes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'quotation' ? 'Quotation' : 'Quote'} ${newStatus} successfully`,
      });
      
      if (type === 'quotation') {
        refetchQuotations();
      } else {
        refetchQuotes();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (quotationsLoading || quotesLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Chef Dashboard</h2>
      
      <Tabs defaultValue="quotations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="quotations">
          <QuotationTable 
            quotations={quotations} 
            onStatusUpdate={(id, status) => handleStatusUpdate(id, status, 'quotation')} 
          />
        </TabsContent>

        <TabsContent value="quotes">
          <QuotationTable 
            quotations={quotes} 
            onStatusUpdate={(id, status) => handleStatusUpdate(id, status, 'quote')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};