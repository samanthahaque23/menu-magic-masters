import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FoodFiltersProps {
  onDietaryFilterChange: (value: string) => void;
  onCourseFilterChange: (value: string) => void;
}

export const FoodFilters = ({ onDietaryFilterChange, onCourseFilterChange }: FoodFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="space-y-2">
        <label className="text-secondary font-medium">Dietary Preference</label>
        <Select onValueChange={onDietaryFilterChange} defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white border-secondary/20 hover:border-secondary/40 transition-colors">
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent className="bg-white border-secondary/20">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-secondary font-medium">Course Type</label>
        <Select onValueChange={onCourseFilterChange} defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white border-secondary/20 hover:border-secondary/40 transition-colors">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent className="bg-white border-secondary/20">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="starter">Starters</SelectItem>
            <SelectItem value="mains">Mains</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};