import { useState } from 'react';
import { FoodFilters } from '@/components/food/FoodFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MenuSectionProps {
  foodItems: any[];
  onAddToQuote: (item: any) => void;
  onDietaryFilterChange: (value: string) => void;
  onCourseFilterChange: (value: string) => void;
}

export const MenuSection = ({ 
  foodItems, 
  onAddToQuote,
  onDietaryFilterChange,
  onCourseFilterChange
}: MenuSectionProps) => {
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  const filteredItems = foodItems?.filter(item => {
    const matchesDietary = dietaryFilter === 'all' || item.dietary_preference === dietaryFilter;
    const matchesCourse = courseFilter === 'all' || item.course_type === courseFilter;
    return matchesDietary && matchesCourse;
  });

  const handleDietaryChange = (value: string) => {
    setDietaryFilter(value);
    onDietaryFilterChange(value);
  };

  const handleCourseChange = (value: string) => {
    setCourseFilter(value);
    onCourseFilterChange(value);
  };

  return (
    <section id="menu-section" className="py-8 md:py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-['Proza_Libre']">Our Menu</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-primary text-base md:text-lg">Discover our carefully curated selection of dishes</p>
        </div>
        
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-full md:w-auto">
            <FoodFilters 
              onDietaryFilterChange={handleDietaryChange}
              onCourseFilterChange={handleCourseChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems?.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-secondary/20">
              <AspectRatio ratio={16/9}>
                <img
                  src={item.image_url || '/placeholder.svg'}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary">{item.name}</h3>
                {item.description && (
                  <p className="text-primary text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-primary/70 mb-3">
                  <span className="capitalize">{item.dietary_preference}</span>
                  <span className="capitalize">{item.course_type}</span>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => onAddToQuote(item)}
                    variant="secondary"
                    className="w-full sm:w-auto gap-2 bg-secondary text-primary hover:bg-secondary/90"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add to Quote
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};