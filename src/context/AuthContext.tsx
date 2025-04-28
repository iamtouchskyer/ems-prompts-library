import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { adminSupabase } from '@/integrations/supabase/admin-client'; // 导入管理员权限的客户端
import { toast } from 'sonner';

// Define user type
interface User {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  authChecked: false,
  logout: async () => {},
});

// Create Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(false);

  // Get user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      if (!userId) {
        console.error('Cannot fetch profile: userId is undefined or empty');
        return;
      }
      
      // First check if the user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url, is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('User not found in database, attempting to create profile...');
        console.log('Error details:', error); // Log the exact error
        
        // If the user doesn't exist, create an entry based on GitHub data
        const { data: authUserData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting auth user data:', userError);
          return;
        }
        
        if (authUserData?.user) {
          const { user: authUser } = authUserData;
          
          // Log metadata for debugging
          console.log('Auth user metadata:', authUser.user_metadata);
          
          // Create user in users table using available metadata
          const username = authUser.user_metadata?.user_name || 
                          authUser.user_metadata?.preferred_username || 
                          authUser.user_metadata?.name ||
                          authUser.email?.split('@')[0] ||
                          'user_' + authUser.id.substring(0, 8);
          
          const avatar = authUser.user_metadata?.avatar_url;
          
          console.log("Creating new user profile with username:", username);
          
          // 使用具有管理员权限的客户端来绕过RLS策略
          // Insert into users table
          const { data: insertData, error: insertError } = await adminSupabase
            .from('users')
            .insert({
              id: authUser.id,
              username: username,
              avatar_url: avatar,
              is_admin: false
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
            toast.error("Unable to create user profile. Please try again.");
            
            // Log more details for debugging RLS issues
            console.log('Insert operation failed with:', {
              userId: authUser.id,
              errorCode: insertError.code,
              errorMessage: insertError.message,
              errorDetails: insertError.details,
              hint: 'This may be an RLS policy issue in Supabase'
            });
            
            return;
          }
          
          setUser(insertData);
          console.log("User profile created successfully:", insertData);
          toast.success("New user profile created successfully!");
          return;
        } else {
          console.error('No auth user data available to create profile');
          toast.error("Could not retrieve your user information");
          return;
        }
      }

      console.log("User profile data:", data);
      if (data) {
        setUser({
          id: userId,
          username: data.username,
          avatar_url: data.avatar_url,
          is_admin: data.is_admin
        });
      } else {
        console.warn("No user profile found for ID:", userId);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      toast.error("Error loading your profile");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Signed out successfully");
    } catch (err) {
      console.error('Failed to sign out:', err);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Handle OAuth redirect - completely rewritten to better handle GitHub auth
  useEffect(() => {
    const processOAuthRedirect = async () => {
      // 只有在OAuth回调URL上才继续处理
      const isCallback = 
        window.location.search.includes('code') || 
        window.location.hash.includes('access_token') ||
        window.location.search.includes('error');
      
      if (!isCallback) return;
      
      console.log("Processing OAuth redirect...");
      
      // 如果URL中包含错误信息，显示给用户
      if (window.location.search.includes('error')) {
        const params = new URLSearchParams(window.location.search);
        const errorDesc = params.get('error_description') || 'Unknown error';
        console.error("OAuth error:", errorDesc);
        toast.error(`Authentication error: ${errorDesc}`);
        
        // 清理URL
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return;
      }
      
      try {
        // 如果我们有授权码参数，直接尝试交换会话而不检查状态
        if (window.location.search.includes('code')) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          
          if (code) {
            console.log("Found authorization code, exchanging for session without state validation...");
            
            // 尝试创建新的会话，从授权码开始
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              
              if (error) {
                console.error("Failed to exchange code for session:", error);
                toast.error("Failed to complete authentication. Please try again.");
                return;
              }
              
              if (data?.session?.user) {
                console.log("Successfully created session for user:", data.session.user.id);
                console.log("User metadata:", data.session.user.user_metadata);
                
                // 现在我们有了确认的会话，创建用户资料
                await fetchUserProfile(data.session.user.id);
                
                // 清理URL
                if (window.history && window.history.replaceState) {
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
                
                return;
              }
            } catch (exchangeError) {
              console.error("Exchange code error:", exchangeError);
              // 如果交换授权码失败，我们尝试使用refreshSession方法
              try {
                console.log("Trying alternative session method...");
                const { data, error } = await supabase.auth.getSession();
                if (!error && data?.session) {
                  console.log("Got session through alternative method:", data.session.user.id);
                  await fetchUserProfile(data.session.user.id);
                }
              } catch (altError) {
                console.error("Alternative method failed:", altError);
              }
            }
          }
        }
        
        // 最后尝试检查现有会话
        console.log("Checking for existing session after OAuth...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          return;
        }
        
        if (sessionData?.session?.user) {
          console.log("Found existing session for user:", sessionData.session.user.id);
          await fetchUserProfile(sessionData.session.user.id);
        } else {
          console.log("No session found after OAuth redirect");
        }
      } catch (err) {
        console.error("Error handling OAuth redirect:", err);
      } finally {
        // 清理URL，无论结果如何
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    // 组件挂载时运行一次
    processOAuthRedirect();
  }, []);

  useEffect(() => {
    console.log('Setting up auth state in AuthContext');
    
    // 检查是否在 OAuth 回调 URL 上
    const isOnOAuthCallback = () => {
      return (window.location.hash && window.location.hash.includes('access_token')) ||
        (window.location.search && (
          window.location.search.includes('error') || 
          window.location.search.includes('code')
        ));
    };
    
    const isOAuthRedirect = isOnOAuthCallback();
    if (isOAuthRedirect) {
      console.log("On OAuth callback URL, will ignore SIGNED_OUT events");
    }
    
    // Set auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'User ID:', session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User is signed in with ID:', session.user.id);
        // Use setTimeout to avoid potential deadlocks with Supabase SDK
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
        
        toast.success(`Welcome ${session.user.user_metadata?.user_name || 'back'}!`);
      } else if (event === 'SIGNED_OUT') {
        // 仅在不处于 OAuth 回调时处理登出事件
        // 这是一个关键修复 - 忽略 OAuth 过程中的 SIGNED_OUT 事件
        if (!isOAuthRedirect && !sessionStorage.getItem('oauth_redirect_handled')) {
          console.log('User signed out');
          setUser(null);
          toast.info("You have been signed out.");
        } else {
          console.log('Ignoring SIGNED_OUT event during OAuth redirect');
        }
      } else if (event === 'USER_UPDATED') {
        console.log('User updated, refreshing profile');
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    });

    // Check existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast.error("Could not check your login status. Please refresh the page.");
        } else {
          console.log("Session check result:", session ? "Has session" : "No session");
          
          if (session?.user) {
            console.log("Found existing session for user:", session.user.id);
            fetchUserProfile(session.user.id);
          }
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

// Create custom hook
export const useAuth = () => useContext(AuthContext);
