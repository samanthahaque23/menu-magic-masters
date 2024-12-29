import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useImageUpload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    imageFile,
    handleImageChange,
    uploadImage
  };
};