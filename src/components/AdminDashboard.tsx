import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FoodList } from './FoodList';
import { CustomerList } from './customers/CustomerList';
import { ChefList } from './chefs/ChefList';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <Tabs defaultValue="food" className="w-full">
        <TabsList>
          <TabsTrigger value="food">Food Items</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
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
      </Tabs>
    </div>
  );
};