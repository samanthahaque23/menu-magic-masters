import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FoodFiltersProps {
  onDietaryFilterChange: (value: string) => void;
  onCourseFilterChange: (value: string) => void;
}

export const FoodFilters = ({ onDietaryFilterChange, onCourseFilterChange }: FoodFiltersProps) => {
  return (
    <div className="flex gap-4">
      <Select onValueChange={onDietaryFilterChange} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Dietary Preference" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="vegetarian">Vegetarian</SelectItem>
          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onCourseFilterChange} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Course Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="starter">Starters</SelectItem>
          <SelectItem value="mains">Mains</SelectItem>
          <SelectItem value="desserts">Desserts</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};