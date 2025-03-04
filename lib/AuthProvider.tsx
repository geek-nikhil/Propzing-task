'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase'; // Adjust the import path
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Define the type for the context
type AuthContextType = {
  session: Session | null;
  signOut: () => Promise<void>; // Add signOut function to the context type
};

// Create the context
const AuthContext = createContext<AuthContextType>({
  session: null,
  signOut: async () => {}, // Default empty function
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  // Fetch the current session on component mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('auth state changed', session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle sign out
  const signOut = async () => {
    await supabase.auth.signOut(); // Sign out from Supabase
    setSession(null); // Clear the session
    router.push('/components/login'); // Redirect to the login page
  };

  // Context value
  const value = {
    session,
    signOut, // Include signOut in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);