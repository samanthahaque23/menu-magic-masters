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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) {
        setChefName("");
        navigate('/chef/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const setupChefProfile = async () => {
      if (!session?.user?.email) return;

      try {
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (chefError) throw chefError;

        if (!chefData) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not registered as a chef.",
          });
          await handleSignOut();
          return;
        }

        const { data: profileData } = await supabase
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

    if (session?.user) {
      setupChefProfile();
    }
  }, [session, toast]);

  const handleSignOut = async () => {
    try {
      // Clear local state first
      setSession(null);
      setChefName("");

      // Attempt to sign out from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Warning",
        description: "There was an issue during sign out, but you have been logged out.",
      });
    } finally {
      // Always navigate to login page, regardless of API success
      navigate('/chef/login');
    }
  };

  return { session, chefName, handleSignOut };
};