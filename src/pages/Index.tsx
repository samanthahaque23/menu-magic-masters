import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FoodList } from '@/components/FoodList';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Restaurant Manager</h1>
          <Button 
            variant="secondary"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? 'View Menu' : 'Admin Dashboard'}
          </Button>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        {isAdmin ? <AdminDashboard /> : <FoodList />}
      </main>
    </div>
  );
};

export default Index;