import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QuotationTable } from "./QuotationTable";
import { QuoteStatus, OrderStatus } from "@/integrations/supabase/types/enums";

export const ChefDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chefName, setChefName] = useState<string>("");
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/chef/login');
        return;
      }

      // Verify the user is a chef
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (chefError || !chefData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not registered as a chef.",
        });
        await supabase.auth.signOut();
        navigate('/chef/login');
      } else {
        setChefName(chefData.name);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      
      navigate('/chef/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: quotes, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      // First, get quotes that haven't been quoted by any chef (no entries in quotes table)
      const { data: quotationsData, error: quotationsError } = await supabase
        .from('quotations')
        .select(`
          *,
          profiles!quotations_customer_id_fkey (full_name, email, phone),
          quotation_items (
            id,
            quotation_id,
            food_item_id,
            quantity,
            created_at,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .eq('quote_status', 'pending')
        .not('id', 'in', `(
          select quotation_id 
          from quotes 
          where chef_id != '${session?.user.id}'
        )`);

      if (quotationsError) throw quotationsError;

      // Then, get quotes submitted by the current chef
      const { data: chefQuotes, error: chefQuotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (full_name, email, phone),
          quote_items (
            id,
            quote_id,
            food_item_id,
            quantity,
            created_at,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          )
        `)
        .eq('chef_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (chefQuotesError) throw chefQuotesError;

      return [...(quotationsData || []), ...(chefQuotes || [])];
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Chef Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Welcome, {chefName}</span>
          <Button
            variant="destructive"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
      
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