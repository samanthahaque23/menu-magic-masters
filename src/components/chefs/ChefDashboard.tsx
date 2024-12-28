import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotationTable } from "./QuotationTable";
import { useChefAuth } from "./dashboard/useChefAuth";
import { useQuotes } from "./dashboard/useQuotes";
import { DashboardNav } from "../shared/DashboardNav";
import { OrderProgress } from "./OrderProgress";

export const ChefDashboard = () => {
  const { session, chefName, handleSignOut } = useChefAuth();
  const { quotes, isLoading, handleQuoteSubmission, handleStatusUpdate } = useQuotes(session);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={chefName} onSignOut={handleSignOut} />
      
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="quotes" className="space-y-4">
          <TabsList className="w-full justify-start border-b border-[#600000]/20">
            <TabsTrigger 
              value="quotes" 
              className="text-[#600000] data-[state=active]:border-[#600000]"
            >
              Quotes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <QuotationTable 
                quotations={quotes?.map(quote => ({
                  ...quote,
                  statusDisplay: (
                    <OrderProgress 
                      quoteStatus={quote.quote_status} 
                      orderStatus={quote.order_status}
                    />
                  )
                })) || []} 
                onStatusUpdate={handleStatusUpdate}
                onQuoteSubmit={handleQuoteSubmission}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};