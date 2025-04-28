
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not sign in with GitHub",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="flex items-center gap-2"
    >
      <Github className="h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
};
