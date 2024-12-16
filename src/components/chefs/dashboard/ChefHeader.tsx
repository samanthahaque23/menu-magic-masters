import { Button } from "@/components/ui/button";

interface ChefHeaderProps {
  chefName: string;
  onSignOut: () => void;
}

export const ChefHeader = ({ chefName, onSignOut }: ChefHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">Chef Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">Welcome, {chefName}</span>
        <Button variant="destructive" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};