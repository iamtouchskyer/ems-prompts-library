
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

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
          
          // Create user in users table
          const username = authUser.user_metadata?.user_name || 
                          authUser.user_metadata?.preferred_username || 
                          'user_' + authUser.id;
          
          const avatar = authUser.user_metadata?.avatar_url;
          
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
    } catch (err) {
      console.error('Failed to sign out:', err);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  useEffect(() => {
    console.log('Setting up auth state in AuthContext');
    
    // Set auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        console.log('User is signed in with ID:', session.user.id);
        // Use setTimeout to avoid potential deadlocks with Supabase SDK
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        console.log('No user session found in auth state change');
        setUser(null);
      }
      
      // Log auth events for debugging
      if (event === 'SIGNED_IN') {
        toast({
          title: "Signed in successfully",
          description: `Welcome ${session?.user?.user_metadata?.user_name || 'back'}!`,
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out."
        });
      }
    });

    // Check existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast({
            title: "Authentication Error",
            description: "Could not check your login status. Please refresh the page.",
            variant: "destructive"
          });
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
  }, [toast]);

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
