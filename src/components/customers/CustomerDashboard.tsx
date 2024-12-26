import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerOrders } from "./CustomerOrders";
import { useToast } from "@/hooks/use-toast";
import { DashboardNav } from "../shared/DashboardNav";

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/restaurant');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setCustomerName(profile.full_name);
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!quotes_customer_id_fkey (
            full_name,
            email
          ),
          quote_items (
            id,
            quantity,
            food_items (
              name,
              dietary_preference,
              course_type
            )
          ),
          chef_item_quotes (
            id,
            chef_id,
            quote_item_id,
            price,
            quote_status,
            is_visible_to_customer,
            profiles:chef_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: error.message,
        });
        throw error;
      }
      return quotes || [];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/restaurant');
  };

  if (isLoading) return <div className="flex items-center justify-center p-8">Loading...</div>;

  if (error) return (
    <div className="container mx-auto py-8">
      <div className="text-red-500">Error loading orders. Please try again later.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={customerName} onSignOut={handleSignOut} />
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>
        <CustomerOrders orders={orders} refetch={refetch} />
      </div>
    </div>
  );
};