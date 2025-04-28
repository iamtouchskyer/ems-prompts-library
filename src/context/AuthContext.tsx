
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createUserWithServiceRole } from '@/integrations/supabase/admin-client'; 
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
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

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
        console.log('User not found in database, creating new profile...');
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
          // Use multiple fallbacks for username to ensure we always have something
          const username = authUser.user_metadata?.user_name || 
                          authUser.user_metadata?.preferred_username || 
                          authUser.user_metadata?.name ||
                          authUser.user_metadata?.login ||
                          authUser.email?.split('@')[0] ||
                          'user_' + authUser.id.substring(0, 8);
          
          const avatar = authUser.user_metadata?.avatar_url;
          
          console.log("Creating new user profile with username:", username);
          
          try {
            // Use service role function to create user
            const userData = {
              id: authUser.id,
              username: username,
              avatar_url: avatar,
              is_admin: false
            };
            
            const insertData = await createUserWithServiceRole(userData);
            
            if (insertData) {
              setUser({
                id: authUser.id,
                username: username,
                avatar_url: avatar,
                is_admin: false
              });
              console.log("User profile created successfully:", insertData);
              toast.success("Welcome! New user profile created successfully!");
            }
          } catch (insertError) {
            console.error('Error creating user profile:', insertError);
            toast.error("Unable to create user profile. Please try again.");
          }
        } else {
          console.error('No auth user data available to create profile');
          toast.error("Could not retrieve your user information");
        }
      } else if (data) {
        console.log("User profile data found:", data);
        setUser({
          id: userId,
          username: data.username,
          avatar_url: data.avatar_url,
          is_admin: data.is_admin
        });
        toast.success(`Welcome back, ${data.username}!`);
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

  // Handle OAuth redirect - this runs only once on mount
  useEffect(() => {
    const processOAuthRedirect = async () => {
      // Check for OAuth parameters in the URL
      const hasOAuthParams = window.location.hash.includes('access_token') || 
                             window.location.search.includes('code') ||
                             window.location.search.includes('error');
      
      if (!hasOAuthParams) return;
      
      setIsProcessingOAuth(true);
      console.log("Processing OAuth redirect...");
      
      try {
        // If there's an error in the URL, handle it
        if (window.location.search.includes('error')) {
          const params = new URLSearchParams(window.location.search);
          const error = params.get('error');
          const errorDescription = params.get('error_description');
          console.error("OAuth error:", error, errorDescription);
          toast.error(`Authentication failed: ${errorDescription || error}`);
          
          // Clean URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          setIsProcessingOAuth(false);
          return;
        }
        
        // Exchange code for session
        if (window.location.search.includes('code')) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          
          if (code) {
            console.log("Found authorization code, exchanging for session...");
            
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error("Failed to exchange code for session:", error);
              toast.error("Failed to complete authentication. Please try again.");
              setIsProcessingOAuth(false);
              return;
            }
            
            if (data?.session?.user) {
              console.log("Successfully created session for user:", data.session.user.id);
              await fetchUserProfile(data.session.user.id);
              
              // Clean URL
              if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error handling OAuth redirect:", err);
        toast.error("An error occurred during sign in. Please try again.");
      } finally {
        setIsProcessingOAuth(false);
        // Clean storage flag
        sessionStorage.removeItem('oauth_initiated');
        
        // Clean URL if not done already
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    processOAuthRedirect();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state in AuthContext');
    
    // Check if we're handling OAuth redirect
    const isOAuthRedirect = 
      window.location.hash.includes('access_token') || 
      window.location.search.includes('code') ||
      window.location.search.includes('error') ||
      sessionStorage.getItem('oauth_initiated') === 'true';
    
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
      } else if (event === 'SIGNED_OUT') {
        // Only handle sign out if not during OAuth process
        if (!isOAuthRedirect) {
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
    
    // Only check session if not processing OAuth
    if (!isProcessingOAuth) {
      checkSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [isProcessingOAuth]);

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
