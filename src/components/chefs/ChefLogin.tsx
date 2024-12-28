import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const ChefLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Check auth state on mount and when it changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user?.email) {
      setLoading(true);
      try {
        // Check if the user has a chef record
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (chefError) {
          console.error('Error checking chef status:', chefError);
          throw chefError;
        }
        
        if (!chefData) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not registered as a chef. Please contact admin for registration.",
          });
          await supabase.auth.signOut();
          return;
        }

        // If we get here, the user is a valid chef
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate('/chef');
      } catch (error: any) {
        console.error('Error in auth flow:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred during login.",
        });
        await supabase.auth.signOut();
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Chef Login</h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Verifying credentials...</p>
            </div>
          ) : (
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--foreground))',
                      brandAccent: 'rgb(var(--foreground))',
                    },
                  },
                },
              }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin + '/chef'}
              onlyThirdPartyProviders={false}
              magicLink={false}
              showLinks={false}
              view="sign_in"
            />
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Only registered chefs can access this portal.</p>
          <p>Contact admin if you need assistance.</p>
        </div>
      </div>
    </div>
  );
};