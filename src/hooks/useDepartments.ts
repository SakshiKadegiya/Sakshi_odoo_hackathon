import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Department {
  id: string;
  name: string;
  code: string;
  head_id: string | null;
  head_name: string | null;
  employee_count: number;
  created_at: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;

      // Get head names and employee counts
      const deptWithDetails = await Promise.all(
        (data || []).map(async (dept) => {
          let headName = null;
          if (dept.head_id) {
            const { data: head } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', dept.head_id)
              .maybeSingle();
            headName = head?.name || null;
          }

          // Count employees in this department
          const { count } = await supabase
            .from('employee_details')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', dept.id);

          return {
            id: dept.id,
            name: dept.name,
            code: dept.code,
            head_id: dept.head_id,
            head_name: headName,
            employee_count: count || 0,
            created_at: dept.created_at,
          };
        })
      );

      setDepartments(deptWithDetails);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (data: {
    name: string;
    code: string;
    head_id?: string;
  }) => {
    try {
      const { error } = await supabase.from('departments').insert({
        name: data.name,
        code: data.code.toUpperCase(),
        head_id: data.head_id || null,
      });

      if (error) throw error;
      await fetchDepartments();
      toast.success('Department added successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to add department');
      return { error: error.message };
    }
  };

  const updateDepartment = async (
    id: string,
    data: Partial<{ name: string; code: string; head_id: string }>
  ) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await fetchDepartments();
      toast.success('Department updated successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update department');
      return { error: error.message };
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase.from('departments').delete().eq('id', id);

      if (error) throw error;
      await fetchDepartments();
      toast.success('Department deleted successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete department');
      return { error: error.message };
    }
  };

  return {
    departments,
    loading,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchDepartments,
  };
}
