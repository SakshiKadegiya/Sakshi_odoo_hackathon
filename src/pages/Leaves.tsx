import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  Plus,
  Check,
  X,
  Clock,
  Calendar,
  AlertCircle,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateReadable, calculateWorkingDays, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { LeaveRequest, LeaveBalance } from '@/lib/types';

// Mock data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP-2022-042',
    employeeName: 'Amit Patel',
    department: 'Engineering',
    leaveType: 'casual',
    startDate: '2025-01-06',
    endDate: '2025-01-07',
    isHalfDay: false,
    totalDays: 2,
    reason: 'Personal work at home',
    status: 'pending',
    appliedOn: '2025-01-03',
  },
  {
    id: '2',
    employeeId: 'EMP-2023-078',
    employeeName: 'Sneha Reddy',
    department: 'Marketing',
    leaveType: 'sick',
    startDate: '2025-01-08',
    endDate: '2025-01-08',
    isHalfDay: true,
    halfDayType: 'first-half',
    totalDays: 0.5,
    reason: 'Doctor appointment',
    status: 'approved',
    appliedOn: '2025-01-02',
    approvedBy: 'Priya Sharma',
    approvalDate: '2025-01-02',
  },
  {
    id: '3',
    employeeId: 'EMP-2024-102',
    employeeName: 'Vikram Singh',
    department: 'Sales',
    leaveType: 'earned',
    startDate: '2025-01-13',
    endDate: '2025-01-17',
    isHalfDay: false,
    totalDays: 5,
    reason: 'Family vacation',
    status: 'rejected',
    appliedOn: '2025-01-01',
    approvedBy: 'Priya Sharma',
    approvalDate: '2025-01-02',
    rejectionComment: 'Project deadline conflicts. Please reschedule after 20th January.',
  },
];

const mockLeaveBalance: LeaveBalance = {
  employeeId: 'EMP-2022-042',
  casual: { total: 12, used: 3, balance: 9 },
  sick: { total: 12, used: 2, balance: 10 },
  earned: { total: 15, used: 5, balance: 10 },
  maternity: { total: 180, used: 0, balance: 180 },
  paternity: { total: 15, used: 0, balance: 15 },
  compensatory: { total: 2, used: 0, balance: 2 },
  unpaid: { total: 0, used: 0, balance: 0 },
};

const holidays = [
  '2025-01-26', // Republic Day
  '2025-03-14', // Holi
  '2025-08-15', // Independence Day
];

const leaveTypes = [
  { value: 'casual', label: 'Casual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'earned', label: 'Earned Leave' },
  { value: 'compensatory', label: 'Compensatory Off' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export default function Leaves() {
  const { profile, userRole } = useAuth();
  const isAdminOrHR = userRole === 'admin' || userRole === 'hr';
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = leaveRequests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: 'approved', approvedBy: profile?.name || 'Admin', approvalDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    toast.success('Leave request approved');
  };

  const handleReject = () => {
    if (!rejectionComment.trim()) {
      toast.error('Rejection comment is mandatory');
      return;
    }
    if (selectedRequest) {
      setLeaveRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest.id
            ? { 
                ...req, 
                status: 'rejected', 
                approvedBy: profile?.name || 'Admin', 
                approvalDate: new Date().toISOString().split('T')[0],
                rejectionComment: rejectionComment.trim()
              }
            : req
        )
      );
      toast.success('Leave request rejected');
      setRejectDialogOpen(false);
      setRejectionComment('');
      setSelectedRequest(null);
    }
  };

  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'rejected').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Leave Management</h1>
            <p className="page-subtitle">
              {isAdminOrHR ? 'Review and manage employee leave requests' : 'Apply and track your leaves'}
            </p>
          </div>
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request. Weekends and holidays are automatically excluded.
                </DialogDescription>
              </DialogHeader>
              <ApplyLeaveForm 
                onClose={() => setIsApplyDialogOpen(false)} 
                holidays={holidays}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards (for employees) */}
        {!isAdminOrHR && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(mockLeaveBalance).filter(([key]) => key !== 'employeeId').map(([type, data]) => {
              if (typeof data === 'string') return null;
              return (
                <Card key={type} className="stat-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-2xl font-bold mt-1 text-primary">{data.balance}</p>
                    <p className="text-xs text-muted-foreground">of {data.total} days</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats for Admin/HR */}
        {isAdminOrHR && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{leaveRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                  className="gap-1"
                >
                  <Clock className="w-3 h-3" /> Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('approved')}
                  className="gap-1"
                >
                  <Check className="w-3 h-3" /> Approved
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('rejected')}
                  className="gap-1"
                >
                  <X className="w-3 h-3" /> Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    {isAdminOrHR && <th className="text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {getInitials(request.employeeName)}
                          </div>
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{request.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="capitalize">{request.leaveType} Leave</td>
                      <td>
                        <div>
                          <p className="text-sm">{formatDateReadable(request.startDate)}</p>
                          {request.startDate !== request.endDate && (
                            <p className="text-xs text-muted-foreground">to {formatDateReadable(request.endDate)}</p>
                          )}
                          {request.isHalfDay && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {request.halfDayType === 'first-half' ? '1st Half' : '2nd Half'}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-medium">{request.totalDays}</span>
                        <span className="text-muted-foreground"> day(s)</span>
                      </td>
                      <td className="max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </td>
                      <td>
                        <div>
                          <Badge className={`status-badge ${
                            request.status === 'approved' ? 'status-approved' :
                            request.status === 'rejected' ? 'status-rejected' : 'status-pending'
                          }`}>
                            {request.status}
                          </Badge>
                          {request.rejectionComment && (
                            <p className="text-xs text-destructive mt-1 max-w-xs truncate" title={request.rejectionComment}>
                              {request.rejectionComment}
                            </p>
                          )}
                        </div>
                      </td>
                      {isAdminOrHR && (
                        <td className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success border-success hover:bg-success/10"
                                onClick={() => handleApprove(request.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRequests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No leave requests found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this leave request. This is mandatory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">{selectedRequest?.employeeName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest?.leaveType} Leave • {selectedRequest?.totalDays} day(s)
                </p>
                <p className="text-sm mt-2">{selectedRequest?.reason}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejectionComment">
                  Rejection Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="rejectionComment"
                  value={rejectionComment}
                  onChange={(e) => setRejectionComment(e.target.value)}
                  placeholder="Please provide a detailed reason for rejection..."
                  rows={3}
                />
                {rejectionComment.trim() === '' && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Rejection comment is mandatory
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function ApplyLeaveForm({ onClose, holidays }: { onClose: () => void; holidays: string[] }) {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDayType: 'first-half',
    reason: '',
  });
  const [calculatedDays, setCalculatedDays] = useState(0);

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (newFormData.startDate && newFormData.endDate) {
      const start = new Date(newFormData.startDate);
      const end = new Date(newFormData.endDate);
      if (start <= end) {
        const days = calculateWorkingDays(start, end, holidays, newFormData.isHalfDay);
        setCalculatedDays(days);
      }
    }
  };

  const handleHalfDayChange = (checked: boolean) => {
    setFormData({ ...formData, isHalfDay: checked });
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start <= end) {
        const days = calculateWorkingDays(start, end, holidays, checked);
        setCalculatedDays(days);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for leave');
      return;
    }

    if (calculatedDays <= 0) {
      toast.error('Selected dates fall on weekends/holidays. Please select different dates.');
      return;
    }

    toast.success('Leave request submitted successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type *</Label>
        <Select value={formData.leaveType} onValueChange={(v) => setFormData({ ...formData, leaveType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isHalfDay"
          checked={formData.isHalfDay}
          onCheckedChange={handleHalfDayChange}
        />
        <Label htmlFor="isHalfDay" className="text-sm font-normal cursor-pointer">
          This is a half-day leave
        </Label>
      </div>

      {formData.isHalfDay && (
        <div className="space-y-2 pl-6">
          <Label>Half Day Type</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="halfDayType"
                value="first-half"
                checked={formData.halfDayType === 'first-half'}
                onChange={(e) => setFormData({ ...formData, halfDayType: e.target.value })}
                className="text-primary"
              />
              <span className="text-sm">First Half (Morning)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="halfDayType"
                value="second-half"
                checked={formData.halfDayType === 'second-half'}
                onChange={(e) => setFormData({ ...formData, halfDayType: e.target.value })}
                className="text-primary"
              />
              <span className="text-sm">Second Half (Afternoon)</span>
            </label>
          </div>
        </div>
      )}

      {calculatedDays > 0 && (
        <div className="p-3 bg-primary/10 rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm">
            <strong>{calculatedDays}</strong> working day(s) (excluding weekends & holidays)
          </span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Leave *</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Please provide a detailed reason for your leave..."
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Request
        </Button>
      </div>
    </form>
  );
}
