import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ChefHat, Edit, Trash } from 'lucide-react';
import { ChefForm } from './ChefForm';

export const ChefList = () => {
  const [chefs, setChefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<any>(null);
  const { toast } = useToast();

  const fetchChefs = async () => {
    try {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .order('name');

      if (error) throw error;
      setChefs(data || []);
    } catch (error: any) {
      console.error('Error fetching chefs:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chefs"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleDelete = async () => {
    if (!selectedChef) return;

    try {
      const { error } = await supabase
        .from('chefs')
        .delete()
        .eq('id', selectedChef.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Chef deleted successfully"
      });
      
      fetchChefs();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedChef(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedChef(null);
    fetchChefs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Chefs</h3>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Chef
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chefs.map((chef) => (
            <Card key={chef.id} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{chef.name}</h3>
                  <p className="text-sm text-muted-foreground">{chef.email}</p>
                  {chef.speciality && (
                    <p className="text-sm text-muted-foreground">Speciality: {chef.speciality}</p>
                  )}
                  {chef.experience_years && (
                    <p className="text-sm text-muted-foreground">Experience: {chef.experience_years} years</p>
                  )}
                  {chef.phone && (
                    <p className="text-sm text-muted-foreground">{chef.phone}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedChef(chef);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedChef(chef);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedChef ? 'Edit Chef' : 'Add Chef'}</DialogTitle>
          </DialogHeader>
          <ChefForm
            initialData={selectedChef}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedChef(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chef.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedChef(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};