import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { QuoteList } from "./QuoteList";
import { QuoteForm } from "./QuoteForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export const RestaurantMenu = () => {
  const { toast } = useToast();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteItems, setQuoteItems] = useState<Array<{ foodItem: any; quantity: number }>>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuthDialog(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: foodItems, isLoading } = useQuery({
    queryKey: ['food-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToQuote = (item: any) => {
    if (!user) {
      setShowAuthDialog(true);
      toast({
        title: "Please sign in",
        description: "You need to sign in to create a quote",
      });
      return;
    }

    const existingItem = quoteItems.find(qi => qi.foodItem.id === item.id);
    if (existingItem) {
      setQuoteItems(quoteItems.map(qi => 
        qi.foodItem.id === item.id 
          ? { ...qi, quantity: qi.quantity + 1 }
          : qi
      ));
    } else {
      setQuoteItems([...quoteItems, { foodItem: item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to quote",
      description: `${item.name} has been added to your quote.`,
    });
  };

  const handleQuoteSuccess = () => {
    setShowQuoteForm(false);
    setIsQuoteOpen(false);
    setQuoteItems([]);
    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted successfully.",
    });
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Restaurant Menu</h1>
        <div className="flex gap-4">
          {!user && (
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Sign In / Sign Up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Authentication</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="light"
                    providers={[]}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Sheet open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Quote List ({quoteItems.reduce((acc, item) => acc + item.quantity, 0)})
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Your Quote</SheetTitle>
              </SheetHeader>
              {showQuoteForm ? (
                <QuoteForm items={quoteItems} onSuccess={handleQuoteSuccess} />
              ) : (
                <div className="space-y-4">
                  <QuoteList items={quoteItems} setItems={setQuoteItems} />
                  {quoteItems.length > 0 && (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowQuoteForm(true)}
                    >
                      Proceed to Quote Details
                    </Button>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems?.map((item) => (
          <Card key={item.id} className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
            )}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span className="capitalize">{item.dietary_preference}</span>
              <span className="capitalize">{item.course_type}</span>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => handleAddToQuote(item)}
                variant="secondary"
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add to Quote
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};