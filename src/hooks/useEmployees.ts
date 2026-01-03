import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Employee {
  id: string;
  employee_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  department: string | null;
  designation: string | null;
  date_of_joining: string | null;
  employment_type: string | null;
  work_location: string | null;
  reporting_manager: string | null;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchEmployees()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          employee_id,
          name,
          email,
          phone,
          is_active
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch employee details for each profile
      const employeesWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: details } = await supabase
            .from('employee_details')
            .select(`
              designation,
              employment_type,
              work_location,
              date_of_joining,
              department_id,
              reporting_manager_id
            `)
            .eq('profile_id', profile.id)
            .maybeSingle();

          let departmentName = null;
          let managerName = null;

          if (details?.department_id) {
            const { data: dept } = await supabase
              .from('departments')
              .select('name')
              .eq('id', details.department_id)
              .maybeSingle();
            departmentName = dept?.name || null;
          }

          if (details?.reporting_manager_id) {
            const { data: manager } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', details.reporting_manager_id)
              .maybeSingle();
            managerName = manager?.name || null;
          }

          return {
            id: profile.id,
            employee_id: profile.employee_id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            is_active: profile.is_active,
            department: departmentName,
            designation: details?.designation || null,
            date_of_joining: details?.date_of_joining || null,
            employment_type: details?.employment_type || null,
            work_location: details?.work_location || null,
            reporting_manager: managerName,
          };
        })
      );

      setEmployees(employeesWithDetails);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (data: {
    name: string;
    email: string;
    phone: string;
    department_id?: string;
    designation?: string;
    date_of_joining?: string;
    employment_type?: string;
    work_location?: string;
    reporting_manager_id?: string;
  }) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: 'TempPass@123', // Temporary password, user should reset
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name: data.name }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Wait a moment for the profile trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the created profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not created');

      // Generate employee ID
      const year = new Date().getFullYear();
      const count = employees.length + 1;
      const employeeId = `EMP-${year}-${String(count).padStart(3, '0')}`;

      // Update profile with employee_id and phone
      await supabase
        .from('profiles')
        .update({ employee_id: employeeId, phone: data.phone })
        .eq('id', profile.id);

      // Create employee details
      if (data.department_id || data.designation) {
        await supabase
          .from('employee_details')
          .insert({
            profile_id: profile.id,
            department_id: data.department_id || null,
            designation: data.designation || null,
            date_of_joining: data.date_of_joining || null,
            employment_type: data.employment_type || 'full-time',
            work_location: data.work_location || null,
            reporting_manager_id: data.reporting_manager_id || null,
          });
      }

      // Add employee role
      await supabase
        .from('user_roles')
        .insert({ user_id: authData.user.id, role: 'employee' });

      await fetchEmployees();
      toast.success('Employee added successfully! A temporary password has been set.');
      return { error: null };
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast.error(error.message || 'Failed to add employee');
      return { error: error.message };
    }
  };

  const updateEmployee = async (
    profileId: string,
    data: Partial<{
      name: string;
      phone: string;
      is_active: boolean;
      department_id: string;
      designation: string;
      employment_type: string;
      work_location: string;
      reporting_manager_id: string;
    }>
  ) => {
    try {
      // Update profile
      const profileUpdates: any = {};
      if (data.name) profileUpdates.name = data.name;
      if (data.phone) profileUpdates.phone = data.phone;
      if (typeof data.is_active === 'boolean') profileUpdates.is_active = data.is_active;

      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', profileId);
        if (error) throw error;
      }

      // Update employee details
      const detailUpdates: any = {};
      if (data.department_id) detailUpdates.department_id = data.department_id;
      if (data.designation) detailUpdates.designation = data.designation;
      if (data.employment_type) detailUpdates.employment_type = data.employment_type;
      if (data.work_location) detailUpdates.work_location = data.work_location;
      if (data.reporting_manager_id) detailUpdates.reporting_manager_id = data.reporting_manager_id;

      if (Object.keys(detailUpdates).length > 0) {
        const { data: existing } = await supabase
          .from('employee_details')
          .select('id')
          .eq('profile_id', profileId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('employee_details')
            .update(detailUpdates)
            .eq('profile_id', profileId);
        } else {
          await supabase
            .from('employee_details')
            .insert({ profile_id: profileId, ...detailUpdates });
        }
      }

      await fetchEmployees();
      toast.success('Employee updated successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast.error(error.message || 'Failed to update employee');
      return { error: error.message };
    }
  };

  const toggleEmployeeStatus = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;
      await fetchEmployees();
      toast.success(`Employee ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
      return { error: error.message };
    }
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    refetch: fetchEmployees,
  };
}
