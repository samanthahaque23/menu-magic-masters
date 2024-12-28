import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AdminDashboard } from "./components/AdminDashboard";
import { ChefDashboard } from "./components/chefs/ChefDashboard";
import { ChefLogin } from "./components/chefs/ChefLogin";
import { RestaurantMenu } from "./components/restaurant/RestaurantMenu";
import { CustomerDashboard } from "./components/customers/CustomerDashboard";
import { DeliveryDashboard } from "./components/delivery/DeliveryDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chef" element={<ChefDashboard />} />
          <Route path="/chef/login" element={<ChefLogin />} />
          <Route path="/restaurant" element={<RestaurantMenu />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;