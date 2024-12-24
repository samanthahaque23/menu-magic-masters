import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FoodList } from './FoodList';
import { CustomerList } from './customers/CustomerList';
import { ChefList } from './chefs/ChefList';
import { QuotationList } from './quotations/QuotationList';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-[#600000]">Admin Dashboard</h2>
      
      <Tabs defaultValue="food" className="w-full">
        <TabsList className="w-full justify-start border-b border-[#600000]/20 bg-[#600000]">
          <TabsTrigger 
            value="food"
            className="text-white data-[state=active]:bg-[#600000]/80 data-[state=active]:text-white"
          >
            Food Items
          </TabsTrigger>
          <TabsTrigger 
            value="customers"
            className="text-white data-[state=active]:bg-[#600000]/80 data-[state=active]:text-white"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="chefs"
            className="text-white data-[state=active]:bg-[#600000]/80 data-[state=active]:text-white"
          >
            Chefs
          </TabsTrigger>
          <TabsTrigger 
            value="quotations"
            className="text-white data-[state=active]:bg-[#600000]/80 data-[state=active]:text-white"
          >
            Quotations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="mt-6">
          <Card className="p-6">
            <FoodList />
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card className="p-6">
            <CustomerList />
          </Card>
        </TabsContent>

        <TabsContent value="chefs" className="mt-6">
          <Card className="p-6">
            <ChefList />
          </Card>
        </TabsContent>

        <TabsContent value="quotations" className="mt-6">
          <Card className="p-6">
            <QuotationList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};