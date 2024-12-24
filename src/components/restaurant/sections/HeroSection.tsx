import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative h-[600px] mb-16">
      <div 
        className="w-full h-full bg-cover bg-center relative"
        style={{ 
          backgroundImage: 'url(/lovable-uploads/3ddeb265-0d54-4bdc-8e64-71bfc8aecb54.png)',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-5xl font-bold mb-6 text-center">Flavours From Home</h1>
          <p className="text-xl mb-8 max-w-2xl text-center">
            Experience the authentic taste of Indian cuisine, where every dish tells a story of tradition and passion
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            View Menu
          </Button>
          <div className="mt-12 flex items-center gap-2 text-lg italic">
            <Quote className="h-6 w-6" />
            <p>Where every meal feels like home</p>
            <Quote className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
};