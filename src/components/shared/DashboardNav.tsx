import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardNavProps {
  title: string;
}

export const DashboardNav = ({ title }: DashboardNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-primary/95 backdrop-blur-sm sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto flex justify-between items-center py-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-[24px] font-bold text-secondary font-['Proza_Libre']"
        >
          <Home className="h-6 w-6" />
          {title}
        </button>
      </div>
    </nav>
  );
};