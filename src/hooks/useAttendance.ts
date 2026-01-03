import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface AttendanceRecord {
  id: string;
  profile_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday' | 'weekend';
  work_hours: number | null;
  overtime: number | null;
  notes: string | null;
}

export function useAttendance() {
  const { session } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAttendance();

      // Set up realtime subscription
      const channel = supabase
        .channel('attendance-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'attendance' },
          () => fetchAttendance()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id]);

  const fetchAttendance = async () => {
    if (!session?.user?.id) return;

    try {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile) return;

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('profile_id', profile.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      const records = (data || []).map((a) => ({
        id: a.id,
        profile_id: a.profile_id,
        date: a.date,
        check_in: a.check_in,
        check_out: a.check_out,
        status: a.status as AttendanceRecord['status'],
        work_hours: a.work_hours,
        overtime: a.overtime,
        notes: a.notes,
      }));

      setAttendance(records);

      // Check today's attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecord = records.find((r) => r.date === today);
      setTodayAttendance(todayRecord || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    if (!session?.user?.id) return { error: 'Not authenticated' };

    try {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile) throw new Error('Profile not found');

      const today = format(new Date(), 'yyyy-MM-dd');
      const now = new Date().toISOString();

      // Check if already checked in
      const { data: existing } = await supabase
        .from('attendance')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        toast.error('Already checked in for today');
        return { error: 'Already checked in' };
      }

      const { error } = await supabase.from('attendance').insert({
        profile_id: profile.id,
        date: today,
        check_in: now,
        status: 'present',
      });

      if (error) throw error;
      await fetchAttendance();
      toast.success('Checked in successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to check in');
      return { error: error.message };
    }
  };

  const checkOut = async () => {
    if (!session?.user?.id) return { error: 'Not authenticated' };

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile) throw new Error('Profile not found');

      const today = format(new Date(), 'yyyy-MM-dd');
      const now = new Date().toISOString();

      // Get today's attendance
      const { data: todayRecord } = await supabase
        .from('attendance')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('date', today)
        .maybeSingle();

      if (!todayRecord) {
        toast.error('Please check in first');
        return { error: 'Not checked in' };
      }

      if (todayRecord.check_out) {
        toast.error('Already checked out for today');
        return { error: 'Already checked out' };
      }

      // Calculate work hours
      const checkInTime = new Date(todayRecord.check_in);
      const checkOutTime = new Date(now);
      const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      const overtime = Math.max(0, workHours - 8);

      const { error } = await supabase
        .from('attendance')
        .update({
          check_out: now,
          work_hours: parseFloat(workHours.toFixed(2)),
          overtime: parseFloat(overtime.toFixed(2)),
        })
        .eq('id', todayRecord.id);

      if (error) throw error;
      await fetchAttendance();
      toast.success('Checked out successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to check out');
      return { error: error.message };
    }
  };

  return {
    attendance,
    todayAttendance,
    loading,
    checkIn,
    checkOut,
    refetch: fetchAttendance,
  };
}
