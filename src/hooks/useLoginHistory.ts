import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LoginSession {
  id: string;
  device: string | null;
  browser: string | null;
  ip_address: string | null;
  location: string | null;
  login_time: string;
  logout_time: string | null;
  is_active: boolean;
}

export function useLoginHistory() {
  const { session } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchLoginHistory();
    }
  }, [session?.user?.id]);

  const fetchLoginHistory = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('login_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLoginHistory(data || []);
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordLogin = async (deviceInfo: {
    device: string;
    browser: string;
    ip_address?: string;
    location?: string;
  }) => {
    if (!session?.user?.id) return;

    try {
      await supabase.from('login_history').insert({
        user_id: session.user.id,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        ip_address: deviceInfo.ip_address || 'Unknown',
        location: deviceInfo.location || 'Unknown',
        is_active: true,
      });

      await fetchLoginHistory();
    } catch (error) {
      console.error('Error recording login:', error);
    }
  };

  const logoutSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('login_history')
        .update({
          logout_time: new Date().toISOString(),
          is_active: false,
        })
        .eq('id', sessionId);

      if (error) throw error;
      await fetchLoginHistory();
      toast.success('Session terminated');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to terminate session');
      return { error: error.message };
    }
  };

  const logoutAllSessions = async () => {
    if (!session?.user?.id) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('login_history')
        .update({
          logout_time: new Date().toISOString(),
          is_active: false,
        })
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (error) throw error;
      await fetchLoginHistory();
      toast.success('Logged out from all devices');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout from all devices');
      return { error: error.message };
    }
  };

  return {
    loginHistory,
    loading,
    recordLogin,
    logoutSession,
    logoutAllSessions,
    refetch: fetchLoginHistory,
  };
}
