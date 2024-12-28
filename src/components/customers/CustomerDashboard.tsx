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

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          party_date,
          party_location,
          veg_guests,
          non_veg_guests,
          quote_status,
          order_status,
          created_at,
          is_confirmed,
          profiles!quotes_customer_id_fkey (
            full_name,
            email
          ),
          quote_items (
            id,
            quantity,
            food_items (
              id,
              name,
              dietary_preference,
              course_type
            )
          ),
          chef_item_quotes (
            id,
            chef_id,
            price,
            quote_item_id,
            is_selected,
            is_visible_to_customer,
            profiles:chef_id (
              full_name
            )
          )
        `)
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav userName={customerName} onSignOut={async () => {
          await supabase.auth.signOut();
          navigate('/restaurant');
        }} />
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center p-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading orders:', error);
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav userName={customerName} onSignOut={async () => {
          await supabase.auth.signOut();
          navigate('/restaurant');
        }} />
        <div className="container mx-auto py-8">
          <div className="text-red-500">Error loading orders. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav userName={customerName} onSignOut={async () => {
        await supabase.auth.signOut();
        navigate('/restaurant');
      }} />
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>
        <CustomerOrders orders={orders} refetch={() => {
          // Trigger a refetch of the orders query
          queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
        }} />
      </div>
    </div>
  );
};