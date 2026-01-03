import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LeaveRequest {
  id: string;
  profile_id: string;
  employee_name: string;
  employee_id: string | null;
  department: string | null;
  leave_type: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  is_half_day: boolean;
  half_day_type: string | null;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approver_name: string | null;
  approval_date: string | null;
  rejection_comment: string | null;
  created_at: string;
}

export interface LeaveBalance {
  leave_type: string;
  leave_type_id: string;
  total_days: number;
  used_days: number;
  balance_days: number;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  days_allowed: number;
}

export function useLeaves() {
  const { session, userRole } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdminOrHR = userRole === 'admin' || userRole === 'hr';

  useEffect(() => {
    if (session?.user?.id) {
      fetchLeaveTypes();
      fetchLeaveRequests();
      fetchLeaveBalances();

      // Set up realtime subscription
      const channel = supabase
        .channel('leave-requests-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leave_requests' },
          () => fetchLeaveRequests()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id, isAdminOrHR]);

  const fetchLeaveTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: requests, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          profiles!leave_requests_profile_id_fkey (
            name,
            employee_id
          ),
          leave_types (
            name,
            code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get department info for each request
      const requestsWithDetails = await Promise.all(
        (requests || []).map(async (req) => {
          let department = null;
          let approverName = null;

          // Get department
          const { data: empDetails } = await supabase
            .from('employee_details')
            .select('department_id')
            .eq('profile_id', req.profile_id)
            .maybeSingle();

          if (empDetails?.department_id) {
            const { data: dept } = await supabase
              .from('departments')
              .select('name')
              .eq('id', empDetails.department_id)
              .maybeSingle();
            department = dept?.name || null;
          }

          // Get approver name
          if (req.approved_by) {
            const { data: approver } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', req.approved_by)
              .maybeSingle();
            approverName = approver?.name || null;
          }

          return {
            id: req.id,
            profile_id: req.profile_id,
            employee_name: req.profiles?.name || 'Unknown',
            employee_id: req.profiles?.employee_id || null,
            department,
            leave_type: req.leave_types?.name || 'Unknown',
            leave_type_id: req.leave_type_id,
            start_date: req.start_date,
            end_date: req.end_date,
            is_half_day: req.is_half_day,
            half_day_type: req.half_day_type,
            total_days: req.total_days,
            reason: req.reason,
            status: req.status as 'pending' | 'approved' | 'rejected',
            approved_by: req.approved_by,
            approver_name: approverName,
            approval_date: req.approval_date,
            rejection_comment: req.rejection_comment,
            created_at: req.created_at,
          };
        })
      );

      setLeaveRequests(requestsWithDetails);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalances = async () => {
    if (!session?.user?.id) return;

    try {
      // Get current user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile) return;

      const currentYear = new Date().getFullYear();

      const { data: balances, error } = await supabase
        .from('leave_balances')
        .select(`
          *,
          leave_types (name, code, days_allowed)
        `)
        .eq('profile_id', profile.id)
        .eq('year', currentYear);

      if (error) throw error;

      // If no balances exist, create them from leave types
      if (!balances || balances.length === 0) {
        const { data: types } = await supabase
          .from('leave_types')
          .select('*')
          .eq('is_active', true);

        if (types && types.length > 0) {
          const newBalances = types.map((type) => ({
            profile_id: profile.id,
            leave_type_id: type.id,
            year: currentYear,
            total_days: type.days_allowed,
            used_days: 0,
            balance_days: type.days_allowed,
          }));

          await supabase.from('leave_balances').insert(newBalances);
          await fetchLeaveBalances();
          return;
        }
      }

      setLeaveBalances(
        (balances || []).map((b) => ({
          leave_type: b.leave_types?.name || 'Unknown',
          leave_type_id: b.leave_type_id,
          total_days: b.total_days,
          used_days: b.used_days,
          balance_days: b.balance_days,
        }))
      );
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    }
  };

  const applyLeave = async (data: {
    leave_type_id: string;
    start_date: string;
    end_date: string;
    is_half_day: boolean;
    half_day_type?: string;
    total_days: number;
    reason: string;
  }) => {
    if (!session?.user?.id) return { error: 'Not authenticated' };

    try {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase.from('leave_requests').insert({
        profile_id: profile.id,
        leave_type_id: data.leave_type_id,
        start_date: data.start_date,
        end_date: data.end_date,
        is_half_day: data.is_half_day,
        half_day_type: data.half_day_type || null,
        total_days: data.total_days,
        reason: data.reason,
        status: 'pending',
      });

      if (error) throw error;
      await fetchLeaveRequests();
      toast.success('Leave request submitted successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit leave request');
      return { error: error.message };
    }
  };

  const approveLeave = async (requestId: string) => {
    if (!session?.user?.id) return { error: 'Not authenticated' };

    try {
      // Get approver profile
      const { data: approver } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!approver) throw new Error('Approver profile not found');

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          approved_by: approver.id,
          approval_date: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update leave balance manually
      const request = leaveRequests.find((r) => r.id === requestId);
      if (request) {
        const currentYear = new Date().getFullYear();
        
        // Get current balance
        const { data: balance } = await supabase
          .from('leave_balances')
          .select('*')
          .eq('profile_id', request.profile_id)
          .eq('leave_type_id', request.leave_type_id)
          .eq('year', currentYear)
          .maybeSingle();

        if (balance) {
          await supabase
            .from('leave_balances')
            .update({
              used_days: balance.used_days + request.total_days,
              balance_days: balance.balance_days - request.total_days,
            })
            .eq('id', balance.id);
        }
      }

      await fetchLeaveRequests();
      toast.success('Leave request approved!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve leave');
      return { error: error.message };
    }
  };

  const rejectLeave = async (requestId: string, comment: string) => {
    if (!session?.user?.id) return { error: 'Not authenticated' };
    if (!comment.trim()) {
      toast.error('Rejection comment is mandatory');
      return { error: 'Rejection comment is mandatory' };
    }

    try {
      // Get approver profile
      const { data: approver } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!approver) throw new Error('Approver profile not found');

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          approved_by: approver.id,
          approval_date: new Date().toISOString(),
          rejection_comment: comment.trim(),
        })
        .eq('id', requestId);

      if (error) throw error;
      await fetchLeaveRequests();
      toast.success('Leave request rejected');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject leave');
      return { error: error.message };
    }
  };

  return {
    leaveRequests,
    leaveTypes,
    leaveBalances,
    loading,
    applyLeave,
    approveLeave,
    rejectLeave,
    refetch: fetchLeaveRequests,
  };
}
