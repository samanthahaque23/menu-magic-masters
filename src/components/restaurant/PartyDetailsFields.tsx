import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { QuoteFormData } from "./types";

interface PartyDetailsFieldsProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
}

export const PartyDetailsFields = ({ register, errors }: PartyDetailsFieldsProps) => {
  return (
    <>
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
    </>
  );
};