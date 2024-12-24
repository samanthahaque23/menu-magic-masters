import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { QuoteForm } from "./QuoteForm";
import { QuoteList } from "./QuoteList";
import { HeroSection } from "./sections/HeroSection";
import { MenuSection } from "./sections/MenuSection";
import { FooterSection } from "./sections/FooterSection";
import { ShoppingCart, UserCircle2 } from "lucide-react";

export const RestaurantMenu = () => {
  const { toast } = useToast();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteItems, setQuoteItems] = useState<Array<{ foodItem: any; quantity: number }>>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        setUser(session?.user ?? null);
        setIsInitialized(true);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN') {
            setUser(session?.user ?? null);
            setShowAuthDialog(false);
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            // Clear any user-specific state
            setQuoteItems([]);
            setShowQuoteForm(false);
            setIsQuoteOpen(false);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try signing in again.",
        });
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [toast]);

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

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    toast({
      title: "Success",
      description: "You have successfully signed in.",
    });
  };

  if (!isInitialized || isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary/95 backdrop-blur-sm sticky top-0 z-50 border-b border-primary/20">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white">Flavours From Home</h1>
          <div className="flex items-center gap-4">
            <Sheet open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Quote ({quoteItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
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

            {!user ? (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-white gap-2">
                    <UserCircle2 className="h-5 w-5" />
                    <span>Sign In</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Authentication</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                      <SignInForm onSuccess={handleAuthSuccess} />
                    </TabsContent>
                    <TabsContent value="signup">
                      <SignUpForm onSuccess={handleAuthSuccess} />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                variant="ghost" 
                className="text-white"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <MenuSection 
          foodItems={foodItems}
          onAddToQuote={handleAddToQuote}
          onDietaryFilterChange={(value) => console.log('Dietary:', value)}
          onCourseFilterChange={(value) => console.log('Course:', value)}
        />
      </main>

      <FooterSection />
    </div>
  );
};