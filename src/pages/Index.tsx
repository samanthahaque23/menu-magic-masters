import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FoodList } from '@/components/FoodList';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate('/')}
          >
            Restaurant Manager
          </h1>
          <div className="space-x-4">
            <Button 
              variant="secondary"
              onClick={() => navigate('/restaurant')}
            >
              Restaurant Menu
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/chef')}
            >
              Chef Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <FoodList />
      </main>
    </div>
  );
};

export default Index;