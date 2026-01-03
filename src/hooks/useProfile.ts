import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  employee_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  emergency_contact: string | null;
  blood_group: string | null;
  pan_number: string | null;
  aadhar_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDetails {
  id: string;
  profile_id: string;
  department_id: string | null;
  designation: string | null;
  employment_type: string;
  work_location: string | null;
  date_of_joining: string | null;
  reporting_manager_id: string | null;
}

export interface FullEmployee {
  profile: Profile;
  employeeDetails: EmployeeDetails | null;
  department: { id: string; name: string; code: string } | null;
  reportingManager: { id: string; name: string } | null;
  role: 'admin' | 'hr' | 'employee' | null;
}

export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile?.id) return { error: 'No profile found' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
}

export function useUserRole() {
  const { session } = useAuth();
  const [role, setRole] = useState<'admin' | 'hr' | 'employee' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRole();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchRole = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      setRole(data?.role || 'employee');
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole('employee');
    } finally {
      setLoading(false);
    }
  };

  return { role, loading, refetch: fetchRole };
}
