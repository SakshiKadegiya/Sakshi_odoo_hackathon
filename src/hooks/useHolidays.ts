import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  is_optional: boolean;
  created_at: string;
}

export function useHolidays(year?: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, [year]);

  const fetchHolidays = async () => {
    try {
      let query = supabase
        .from('holidays')
        .select('*')
        .order('date');

      if (year) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHolidays(data || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = async (data: {
    name: string;
    date: string;
    type: string;
    is_optional: boolean;
  }) => {
    try {
      const { error } = await supabase.from('holidays').insert(data);

      if (error) throw error;
      await fetchHolidays();
      toast.success('Holiday added successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to add holiday');
      return { error: error.message };
    }
  };

  const updateHoliday = async (
    id: string,
    data: Partial<{ name: string; date: string; type: string; is_optional: boolean }>
  ) => {
    try {
      const { error } = await supabase.from('holidays').update(data).eq('id', id);

      if (error) throw error;
      await fetchHolidays();
      toast.success('Holiday updated successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update holiday');
      return { error: error.message };
    }
  };

  const deleteHoliday = async (id: string) => {
    try {
      const { error } = await supabase.from('holidays').delete().eq('id', id);

      if (error) throw error;
      await fetchHolidays();
      toast.success('Holiday deleted successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete holiday');
      return { error: error.message };
    }
  };

  return {
    holidays,
    loading,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    refetch: fetchHolidays,
  };
}
