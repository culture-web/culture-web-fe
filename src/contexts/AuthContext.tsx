import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User, AuthState, SignInCredentials, SignUpCredentials } from 'types/interface';
import { supabase, getCurrentUserToken } from 'configs/supabase.config';
import BACKEND_URI from 'configs/env.config';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type KbRole = 'admin' | 'editor' | 'viewer';

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  getUserToken: () => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateOwnPassword: (newPassword: string) => Promise<void>;
  kbRole: KbRole | null;
  isKbAdmin: boolean;
  refreshKbAccess: () => Promise<KbRole | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null,
  });
  const [kbRole, setKbRole] = useState<KbRole | null>(() => {
    try {
      const raw = localStorage.getItem('adminUser');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { role?: string };
      const role = String(parsed?.role || '').toLowerCase();
      if (role === 'admin' || role === 'editor' || role === 'viewer') return role;
      return null;
    } catch {
      return null;
    }
  });

  // Helper function to transform Supabase user to our User interface
  const transformSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    user_metadata: supabaseUser.user_metadata,
    createdAt: supabaseUser.created_at,
    created_at: supabaseUser.created_at,
  }), []);

  const syncKbAccess = useCallback(async (accessToken?: string): Promise<KbRole | null> => {
    const token = accessToken || await getCurrentUserToken();
    if (!token) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setKbRole(null);
      return null;
    }

    try {
      const response = await fetch(`${BACKEND_URI}/auth/supabase-kb-login`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setKbRole(null);
        return null;
      }

      const data = await response.json();
      const nextRole = String(data?.user?.role || '').toLowerCase();
      if (nextRole !== 'admin' && nextRole !== 'editor' && nextRole !== 'viewer') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setKbRole(null);
        return null;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setKbRole(nextRole);
      return nextRole;
    } catch (error) {
      console.error('Failed to sync KB access:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setKbRole(null);
      return null;
    }
  }, []);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
          return;
        }

        if (session?.user) {
          const transformedUser = transformSupabaseUser(session.user);
          await syncKbAccess(session.access_token);
          setAuthState({
            user: transformedUser,
            isAuthenticated: true,
            isLoading: false,
            session,
          });
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setKbRole(null);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
        }
      } catch (error) {
        console.error('Error during initial auth check:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const transformedUser = transformSupabaseUser(session.user);
          await syncKbAccess(session.access_token);
          setAuthState({
            user: transformedUser,
            isAuthenticated: true,
            isLoading: false,
            session,
          });
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setKbRole(null);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [syncKbAccess, transformSupabaseUser]);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        await syncKbAccess(data.session?.access_token);
        const transformedUser = transformSupabaseUser(data.user);
        setAuthState({
          user: transformedUser,
          isAuthenticated: true,
          isLoading: false,
          session: data.session,
        });
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [syncKbAccess, transformSupabaseUser]);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      console.log("Signing up with credentials:", credentials.email);

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            name: credentials.name,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // If user is immediately available (email confirmation disabled)
      if (data?.user) {
        const transformedUser = transformSupabaseUser(data.user);
        setAuthState({
          user: transformedUser,
          isAuthenticated: !!data.session, // Only authenticated if session exists
          isLoading: false,
          session: data.session,
        });
      } else {
        // Email confirmation required
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw new Error('Please check your email to confirm your account before signing in.');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [transformSupabaseUser]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during sign out:', error);
      }

      // State will be updated by the auth listener
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setKbRole(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Force clear state even if sign out fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setKbRole(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
    }
  }, []);

  const getUserToken = useCallback(async (): Promise<string | null> => getCurrentUserToken(), []);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const updateOwnPassword = useCallback(async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const value: AuthContextType = useMemo(() => ({
    ...authState,
    signIn,
    signUp,
    signOut,
    getUserToken,
    requestPasswordReset,
    updateOwnPassword,
    kbRole,
    isKbAdmin: kbRole === 'admin',
    refreshKbAccess: () => syncKbAccess(),
  }), [authState, signIn, signUp, signOut, getUserToken, requestPasswordReset, updateOwnPassword, kbRole, syncKbAccess]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};