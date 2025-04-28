import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting GitHub OAuth flow...");
      
      // 确保我们使用当前域名作为重定向 URL
      const redirectUrl = `${window.location.origin}`;
      console.log("Redirect URL:", redirectUrl);
      
      // 清除可能导致无效状态的会话存储
      localStorage.removeItem('oauth_redirect_handled');
      sessionStorage.removeItem('oauth_redirect_handled');
      sessionStorage.removeItem('supabase.auth.token');
      
      // 使用固定的状态字符串，而不是随机生成的
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          // 请求足够的作用域以获取用户数据
          scopes: 'user:email read:user',
          // 不再使用随机生成的状态字符串
          queryParams: {
            // 添加简单的时间戳，以确保每次请求都不同
            state: `auth_fixed_state_${Date.now()}`
          }
        }
      });
      
      if (error) {
        console.error("GitHub Auth error:", error);
        toast.error("Failed to sign in with GitHub. Please try again.");
        throw error;
      }
      
      console.log("OAuth response:", data);
      // 用户将在此时被重定向到 GitHub
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast.error("Could not sign in with GitHub. Please try again later.");
    } finally {
      setIsLoading(false);
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
