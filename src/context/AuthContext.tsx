
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Get user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      // First check if the user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url, is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If the user doesn't exist, create an entry based on GitHub data
        const { data: authUserData } = await supabase.auth.getUser();
        if (authUserData?.user) {
          const { user: authUser } = authUserData;
          
          // Create user in users table using available metadata
          const username = authUser.user_metadata?.user_name || 
                          authUser.user_metadata?.preferred_username || 
                          authUser.user_metadata?.name ||
                          'user_' + authUser.id.substring(0, 8);
          
          const avatar = authUser.user_metadata?.avatar_url;
          
          console.log("Creating new user profile with username:", username);
          
          // Insert into users table
          const { data: insertData, error: insertError } = await supabase
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
            return;
          }
          
          setUser(insertData);
          console.log("User profile created successfully:", insertData);
          return;
        }
        
        return;
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

  useEffect(() => {
    console.log('Setting up auth state in AuthContext');
    
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
        console.log('User signed out');
        setUser(null);
        toast.info("You have been signed out.");
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
