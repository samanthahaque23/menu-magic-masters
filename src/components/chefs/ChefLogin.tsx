import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const ChefLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Check auth state on mount and when it changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      // Check if the user has a chef record
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('*')
        .eq('email', session?.user?.email)
        .single();

      if (chefError || !chefData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not registered as a chef.",
        });
        await supabase.auth.signOut();
        return;
      }

      navigate('/chef');
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
        </div>
      </div>
    </div>
  );
};