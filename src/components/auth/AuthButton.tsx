
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const AuthButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting GitHub OAuth flow...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            // Optional: Add custom parameters for GitHub auth flow
          }
        }
      });
      
      if (error) {
        console.error("GitHub Auth error:", error);
        throw error;
      }
      
      console.log("OAuth response:", data);
      // Note: At this point, the user will be redirected to GitHub
      // so we don't need to handle success case here
    } catch (error) {
      console.error("GitHub sign in error:", error);
      setIsLoading(false);
      
      // Show more detailed error message
      toast({
        title: "GitHub Sign-in Error",
        description: "Could not sign in with GitHub. Please check the console for more details and ensure the GitHub provider is enabled in Supabase.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      <Github className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Sign in with GitHub"}
    </Button>
  );
};
