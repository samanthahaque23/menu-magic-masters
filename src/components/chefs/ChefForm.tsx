import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChefFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ChefForm = ({ initialData, onSuccess, onCancel }: ChefFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    speciality: initialData?.speciality || '',
    experience_years: initialData?.experience_years || '',
    phone: initialData?.phone || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
      };

      if (initialData) {
        const { error } = await supabase
          .from('chefs')
          .update(submissionData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Chef updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('chefs')
          .insert([submissionData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Chef created successfully",
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Input
          placeholder="Speciality"
          value={formData.speciality}
          onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
        />
      </div>

      <div>
        <Input
          type="number"
          placeholder="Years of Experience"
          value={formData.experience_years}
          onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
        />
      </div>

      <div>
        <Input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};