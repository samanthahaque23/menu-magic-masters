import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuoteFormProps {
  items: Array<{ foodItem: any; quantity: number }>;
  onSuccess: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  vegGuests: number;
  nonVegGuests: number;
  partyLocation: string;
}

export const QuoteForm = ({ items, onSuccess }: QuoteFormProps) => {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to submit a quote",
        });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Party Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="partyLocation">Party Location</Label>
        <Input
          id="partyLocation"
          {...register("partyLocation", { required: "Party location is required" })}
        />
        {errors.partyLocation && (
          <p className="text-sm text-red-500">{errors.partyLocation.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vegGuests">Vegetarian Guests</Label>
          <Input
            id="vegGuests"
            type="number"
            min="0"
            {...register("vegGuests", {
              required: "Number of vegetarian guests is required",
              valueAsNumber: true,
            })}
          />
          {errors.vegGuests && (
            <p className="text-sm text-red-500">{errors.vegGuests.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nonVegGuests">Non-Vegetarian Guests</Label>
          <Input
            id="nonVegGuests"
            type="number"
            min="0"
            {...register("nonVegGuests", {
              required: "Number of non-vegetarian guests is required",
              valueAsNumber: true,
            })}
          />
          {errors.nonVegGuests && (
            <p className="text-sm text-red-500">{errors.nonVegGuests.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit Quote
      </Button>
    </form>
  );
};