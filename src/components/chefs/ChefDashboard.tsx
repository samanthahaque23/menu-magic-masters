import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotationTable } from "./QuotationTable";
import { ChefHeader } from "./dashboard/ChefHeader";
import { useChefAuth } from "./dashboard/useChefAuth";
import { useQuotes } from "./dashboard/useQuotes";

export const ChefDashboard = () => {
  const { session, chefName, handleSignOut } = useChefAuth();
  const { quotes, isLoading, handleQuoteSubmission, handleStatusUpdate } = useQuotes(session);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <ChefHeader chefName={chefName} onSignOut={handleSignOut} />
      
      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuotationTable 
            quotations={quotes || []} 
            onStatusUpdate={handleStatusUpdate}
            onQuoteSubmit={handleQuoteSubmission}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};