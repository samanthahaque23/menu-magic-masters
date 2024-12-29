import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreview } from './food/form/ImagePreview';
import { useImageUpload } from './food/form/useImageUpload';

interface FoodItemFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FoodItemForm = ({ initialData, onSuccess, onCancel }: FoodItemFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    dietary_preference: initialData?.dietary_preference || 'vegetarian',
    course_type: initialData?.course_type || 'starter',
    image_url: initialData?.image_url || '',
  });
  
  const { toast } = useToast();
  const { imageFile, handleImageChange, uploadImage } = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
      };

      if (initialData) {
        const { error } = await supabase
          .from('food_items')
          .update(dataToSubmit)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Food item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('food_items')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Food item created successfully",
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
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
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Select
          value={formData.dietary_preference}
          onValueChange={(value) => setFormData({ ...formData, dietary_preference: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dietary Preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select
          value={formData.course_type}
          onValueChange={(value) => setFormData({ ...formData, course_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="mains">Mains</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <ImagePreview imageUrl={formData.image_url} imageFile={imageFile} />
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
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