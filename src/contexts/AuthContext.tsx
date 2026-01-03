import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'hr' | 'employee';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: {
    id: string;
    name: string;
    email: string;
    employee_id: string | null;
    phone: string | null;
    is_active: boolean;
  } | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [displayRole, setDisplayRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer fetching profile and role to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            fetchProfileAndRole(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole('employee');
          setDisplayRole('employee');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfileAndRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileAndRole = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, name, email, employee_id, phone, is_active')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const role = (roleData?.role as UserRole) || 'employee';
      setUserRole(role);
      setDisplayRole(role);
    } catch (error) {
      console.error('Error fetching profile/role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is active
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profileData && !profileData.is_active) {
          await supabase.auth.signOut();
          return { success: false, error: 'Your account has been deactivated. Please contact HR.' };
        }

        // Record login history
        try {
          const deviceInfo = getDeviceInfo();
          await supabase.from('login_history').insert({
            user_id: data.user.id,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            ip_address: 'Unknown',
            location: 'Unknown',
            is_active: true,
          });
        } catch (e) {
          console.error('Failed to record login:', e);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Wait for profile trigger to execute
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update profile with name
        await supabase
          .from('profiles')
          .update({ name })
          .eq('user_id', data.user.id);

        // Add default employee role
        await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: 'employee' });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Mark current session as logged out
    if (user) {
      try {
        await supabase
          .from('login_history')
          .update({ logout_time: new Date().toISOString(), is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);
      } catch (e) {
        console.error('Failed to update login history:', e);
      }
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole('employee');
    setDisplayRole('employee');
  };

  const switchRole = (role: UserRole) => {
    // Only admin and hr can switch roles (for demo purposes)
    if (userRole === 'admin' || userRole === 'hr') {
      setDisplayRole(role);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        session,
        profile,
        userRole: displayRole,
        isAuthenticated: !!session,
        isLoading,
        login, 
        signUp,
        logout,
        switchRole,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get device info
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = 'Unknown Device';
  let browser = 'Unknown Browser';

  // Detect device
  if (/iPad/i.test(ua)) device = 'iPad';
  else if (/iPhone/i.test(ua)) device = 'iPhone';
  else if (/Android/i.test(ua)) device = 'Android Device';
  else if (/Windows/i.test(ua)) device = 'Windows PC';
  else if (/Mac/i.test(ua)) device = 'Mac';
  else if (/Linux/i.test(ua)) device = 'Linux';

  // Detect browser
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Edge/i.test(ua)) browser = 'Edge';

  return { device, browser };
}
