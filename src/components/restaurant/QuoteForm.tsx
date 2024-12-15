import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CustomerInfoFields } from "./CustomerInfoFields";
import { PartyDetailsFields } from "./PartyDetailsFields";
import { PartyDatePicker } from "./PartyDatePicker";
import { QuoteFormData } from "./types";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpForm } from "./SignUpForm";

interface QuoteFormProps {
  items: Array<{ foodItem: any; quantity: number }>;
  onSuccess: () => void;
}

export const QuoteForm = ({ items, onSuccess }: QuoteFormProps) => {
  const [date, setDate] = useState<Date>();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormData>();

  const onSubmit = async (data: QuoteFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setShowAuthDialog(true);
        return;
      }

      if (!date) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a party date",
        });
        return;
      }

      // Create the quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          customer_id: user.id,
          party_date: date.toISOString(),
          party_location: data.partyLocation,
          veg_guests: data.vegGuests,
          non_veg_guests: data.nonVegGuests,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Update profile information
      await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
        })
        .eq('id', user.id);

      // Create quote items
      const quoteItems = items.map(item => ({
        quote_id: quote.id,
        food_item_id: item.foodItem.id,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Your quote has been submitted successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomerInfoFields register={register} errors={errors} />
        <PartyDatePicker date={date} onDateChange={setDate} />
        <PartyDetailsFields register={register} errors={errors} />
        <Button type="submit" className="w-full">
          Submit Quote
        </Button>
      </form>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to Our Catering Service</DialogTitle>
            <DialogDescription>
              Sign in or create an account to submit your quote
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <SignUpForm onSuccess={() => setShowAuthDialog(false)} />
            </TabsContent>
            <TabsContent value="signin">
              <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'rgb(var(--foreground))',
                        brandAccent: 'rgb(var(--primary))',
                      },
                    },
                  },
                }}
                theme="light"
                providers={[]}
                redirectTo={window.location.origin + "/restaurant"}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};