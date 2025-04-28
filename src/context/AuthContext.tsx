import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// 定义用户类型
interface User {
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
}

// 定义上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  logout: () => Promise<void>;
}

// 创建上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  authChecked: false,
  logout: async () => {},
});

// 创建Provider组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  // 获取用户资料
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url, is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  // 登出
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Failed to sign out:', err);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  useEffect(() => {
    // 设置认证状态变化监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    // 检查现有会话
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
        } else if (session?.user) {
          fetchUserProfile(session.user.id);
        }
        
        setAuthChecked(true);
      } catch (err) {
        console.error("Failed to check session:", err);
        setAuthChecked(true);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    authChecked,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 创建自定义hook
export const useAuth = () => useContext(AuthContext);