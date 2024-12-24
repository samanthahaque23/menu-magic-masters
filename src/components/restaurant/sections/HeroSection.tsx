import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9'
];

export const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative h-[600px] mb-16">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {HERO_IMAGES.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h1 className="text-5xl font-bold mb-6">Flavours From Home</h1>
                  <p className="text-xl mb-8 max-w-2xl text-center">
                    Experience the authentic taste of home-cooked meals prepared with love and tradition
                  </p>
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    View Menu
                  </Button>
                  <div className="mt-12 flex items-center gap-2 text-lg italic">
                    <Quote className="h-6 w-6" />
                    <p>Taste the love in every bite</p>
                    <Quote className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
};