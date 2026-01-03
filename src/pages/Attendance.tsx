import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  LogIn,
  LogOut,
  UserCheck,
  UserX,
  Calendar,
  Search,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateReadable, formatTime, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { Attendance } from '@/lib/types';

// Mock attendance data
const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: 'EMP-2022-042',
    date: '2025-01-03',
    checkIn: '2025-01-03T09:15:00',
    checkOut: '2025-01-03T18:30:00',
    status: 'present',
    workHours: 8.25,
    overtime: 0.25,
  },
  {
    id: '2',
    employeeId: 'EMP-2022-042',
    date: '2025-01-02',
    checkIn: '2025-01-02T09:00:00',
    checkOut: '2025-01-02T18:00:00',
    status: 'present',
    workHours: 8,
  },
  {
    id: '3',
    employeeId: 'EMP-2022-042',
    date: '2025-01-01',
    status: 'holiday',
    notes: 'New Year Holiday',
  },
];

const teamAttendance = [
  { id: '1', name: 'Amit Patel', department: 'Engineering', checkIn: '09:15', checkOut: null, status: 'present' },
  { id: '2', name: 'Priya Sharma', department: 'HR', checkIn: '09:00', checkOut: '18:00', status: 'present' },
  { id: '3', name: 'Sneha Reddy', department: 'Marketing', checkIn: null, checkOut: null, status: 'absent' },
  { id: '4', name: 'Vikram Singh', department: 'Sales', checkIn: '09:30', checkOut: null, status: 'present' },
  { id: '5', name: 'Rahul Verma', department: 'Engineering', checkIn: null, checkOut: null, status: 'on-leave' },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:15 AM');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(formatTime(now));
    setIsCheckedIn(true);
    toast.success(`Checked in at ${formatTime(now)}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    toast.success(`Checked out at ${formatTime(now)}`);
    setIsCheckedIn(false);
  };

  const filteredTeam = teamAttendance.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = teamAttendance.filter(m => m.status === 'present').length;
  const absentCount = teamAttendance.filter(m => m.status === 'absent').length;
  const onLeaveCount = teamAttendance.filter(m => m.status === 'on-leave').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Attendance</h1>
            <p className="page-subtitle">
              {isAdminOrHR ? 'Track and manage team attendance' : 'Track your daily attendance'}
            </p>
          </div>
          {isAdminOrHR && (
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          )}
        </div>

        {/* Check In/Out Card (for all users) */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Today's Attendance</h2>
                <p className="text-muted-foreground">{formatDateReadable(new Date())}</p>
              </div>
              <div className="flex items-center gap-4">
                {isCheckedIn ? (
                  <>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Checked in at</p>
                      <p className="text-lg font-semibold text-success">{checkInTime}</p>
                    </div>
                    <Button 
                      size="lg" 
                      variant="destructive" 
                      className="gap-2"
                      onClick={handleCheckOut}
                    >
                      <LogOut className="w-5 h-5" />
                      Check Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    className="gap-2"
                    onClick={handleCheckIn}
                  >
                    <LogIn className="w-5 h-5" />
                    Check In
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats (for Admin/HR) */}
        {isAdminOrHR && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamAttendance.length}</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <UserCheck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{presentCount}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{absentCount}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{onLeaveCount}</p>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters (for Admin/HR) */}
        {isAdminOrHR && (
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
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full md:w-44"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Attendance Table (for Admin/HR) */}
        {isAdminOrHR && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Attendance - {formatDateReadable(selectedDate)}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Work Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeam.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {getInitials(member.name)}
                            </div>
                            <p className="font-medium">{member.name}</p>
                          </div>
                        </td>
                        <td>{member.department}</td>
                        <td>
                          {member.checkIn ? (
                            <span className="text-success font-medium">{member.checkIn}</span>
                          ) : (
                            <span className="text-muted-foreground">--:--</span>
                          )}
                        </td>
                        <td>
                          {member.checkOut ? (
                            <span className="text-primary font-medium">{member.checkOut}</span>
                          ) : (
                            <span className="text-muted-foreground">--:--</span>
                          )}
                        </td>
                        <td>
                          {member.checkIn && member.checkOut ? (
                            <span className="font-medium">8h 00m</span>
                          ) : member.checkIn ? (
                            <span className="text-muted-foreground">In progress</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </td>
                        <td>
                          <Badge className={`status-badge ${
                            member.status === 'present' ? 'status-approved' :
                            member.status === 'absent' ? 'status-rejected' :
                            member.status === 'on-leave' ? 'status-pending' : 'status-inactive'
                          }`}>
                            {member.status.replace('-', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTeam.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No attendance records found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Attendance History (for all users) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isAdminOrHR ? 'My Attendance History' : 'Attendance History'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Overtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDateReadable(record.date)}</td>
                      <td>
                        {record.checkIn ? (
                          <span className="text-success font-medium">{formatTime(record.checkIn)}</span>
                        ) : (
                          <span className="text-muted-foreground">--:--</span>
                        )}
                      </td>
                      <td>
                        {record.checkOut ? (
                          <span className="text-primary font-medium">{formatTime(record.checkOut)}</span>
                        ) : (
                          <span className="text-muted-foreground">--:--</span>
                        )}
                      </td>
                      <td>
                        {record.workHours ? (
                          <span className="font-medium">{record.workHours}h</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td>
                        {record.overtime ? (
                          <span className="text-success font-medium">+{record.overtime}h</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td>
                        <Badge className={`status-badge ${
                          record.status === 'present' ? 'status-approved' :
                          record.status === 'absent' ? 'status-rejected' :
                          record.status === 'holiday' ? 'status-pending' : 'status-inactive'
                        }`}>
                          {record.status}
                        </Badge>
                        {record.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{record.notes}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
