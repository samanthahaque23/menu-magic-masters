import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FoodItemFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FoodItemForm = ({ initialData, onSuccess, onCancel }: FoodItemFormProps) => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    dietary_preference: initialData?.dietary_preference || 'vegetarian',
    course_type: initialData?.course_type || 'starter',
    image_url: initialData?.image_url || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to perform this action",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be an admin to perform this action",
        });
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify admin status",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be an admin to perform this action",
      });
      return;
    }

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
        {(formData.image_url || imageFile) && (
          <div className="w-full max-w-[200px] mx-auto">
            <AspectRatio ratio={1}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                alt="Food preview"
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        )}
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
        <Button type="submit" disabled={loading || !isAdmin}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};