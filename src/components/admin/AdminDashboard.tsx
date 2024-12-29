import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodList } from "@/components/FoodList";
import { ChefList } from "@/components/chefs/ChefList";
import { CustomerList } from "@/components/customers/CustomerList";
import { DashboardNav } from "@/components/shared/DashboardNav";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav title="Admin Dashboard" />
      <main className="container mx-auto py-8">
        <Tabs defaultValue="food" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="food">Food Items</TabsTrigger>
            <TabsTrigger value="chefs">Chefs</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <TabsContent value="food">
            <FoodList />
          </TabsContent>
          <TabsContent value="chefs">
            <ChefList />
          </TabsContent>
          <TabsContent value="customers">
            <CustomerList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};