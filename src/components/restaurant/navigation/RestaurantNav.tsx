import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingCart, UserCircle2 } from "lucide-react";
import { SignInForm } from "../SignInForm";
import { SignUpForm } from "../SignUpForm";
import { QuoteList } from "../QuoteList";
import { QuoteForm } from "../QuoteForm";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantNavProps {
  user: any;
  quoteItems: Array<{ foodItem: any; quantity: number }>;
  isQuoteOpen: boolean;
  showQuoteForm: boolean;
  showAuthDialog: boolean;
  setIsQuoteOpen: (value: boolean) => void;
  setShowQuoteForm: (value: boolean) => void;
  setShowAuthDialog: (value: boolean) => void;
  setQuoteItems: (items: Array<{ foodItem: any; quantity: number }>) => void;
  handleQuoteSuccess: () => void;
  handleAuthSuccess: () => void;
}

export const RestaurantNav = ({
  user,
  quoteItems,
  isQuoteOpen,
  showQuoteForm,
  showAuthDialog,
  setIsQuoteOpen,
  setShowQuoteForm,
  setShowAuthDialog,
  setQuoteItems,
  handleQuoteSuccess,
  handleAuthSuccess
}: RestaurantNavProps) => {
  return (
    <nav className="bg-primary sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-serif font-bold text-white">Flavours From Home</h1>
        <div className="flex items-center gap-4">
          <Sheet open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white gap-2 hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                <span>Quote ({quoteItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-serif">Your Quote</SheetTitle>
              </SheetHeader>
              {showQuoteForm ? (
                <QuoteForm items={quoteItems} onSuccess={handleQuoteSuccess} />
              ) : (
                <div className="space-y-4">
                  <QuoteList items={quoteItems} setItems={setQuoteItems} />
                  {quoteItems.length > 0 && (
                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary/90" 
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
                <Button variant="ghost" className="text-white gap-2 hover:bg-white/10">
                  <UserCircle2 className="h-5 w-5" />
                  <span>Sign In</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif">Authentication</DialogTitle>
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
              className="text-white hover:bg-white/10"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};