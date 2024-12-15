import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FoodList } from './FoodList';
import { StaffList } from './StaffList';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <Tabs defaultValue="food" className="w-full">
        <TabsList>
          <TabsTrigger value="food">Food Items</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Food Items</h3>
            </div>
            <FoodList />
          </Card>
        </TabsContent>

        <TabsContent value="chefs" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Chefs</h3>
            </div>
            <StaffList role="chef" />
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Delivery Staff</h3>
            </div>
            <StaffList role="delivery_staff" />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};