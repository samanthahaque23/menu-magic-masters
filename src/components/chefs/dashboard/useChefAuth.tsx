import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChefAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chefName, setChefName] = useState<string>("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/chef/login');
        return;
      }

      setSession(session);

      try {
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (chefError || !chefData) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not registered as a chef.",
          });
          await supabase.auth.signOut();
          navigate('/chef/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profileData) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: chefData.name,
              role: 'chef'
            });

          if (insertError) {
            console.error('Profile creation error:', insertError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create chef profile.",
            });
            return;
          }

          toast({
            title: "Profile Created",
            description: "Your chef profile has been created successfully.",
          });
        }

        setChefName(chefData.name);
      } catch (error: any) {
        console.error('Error in auth check:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while setting up your profile.",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      
      navigate('/chef/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return { session, chefName, handleSignOut };
};