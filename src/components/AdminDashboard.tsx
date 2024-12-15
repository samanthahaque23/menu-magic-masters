import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <Tabs defaultValue="food" className="w-full">
        <TabsList>
          <TabsTrigger value="food">Food Items</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Staff</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Food Items</h3>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Food Item
              </Button>
            </div>
            <div className="text-muted-foreground">
              Food items management coming soon...
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Customers</h3>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
            <div className="text-muted-foreground">
              Customer management coming soon...
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Delivery Staff</h3>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Delivery Staff
              </Button>
            </div>
            <div className="text-muted-foreground">
              Delivery staff management coming soon...
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chefs" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Chefs</h3>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Chef
              </Button>
            </div>
            <div className="text-muted-foreground">
              Chef management coming soon...
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};