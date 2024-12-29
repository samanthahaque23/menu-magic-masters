import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImagePreviewProps {
  imageUrl: string | null;
  imageFile: File | null;
}

export const ImagePreview = ({ imageUrl, imageFile }: ImagePreviewProps) => {
  if (!imageUrl && !imageFile) return null;

  return (
    <div className="w-full max-w-[200px] mx-auto">
      <AspectRatio ratio={1}>
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : imageUrl!}
          alt="Food preview"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};