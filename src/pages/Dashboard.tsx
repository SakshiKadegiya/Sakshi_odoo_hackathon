import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR, formatDateReadable } from '@/lib/utils';
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  IndianRupee,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { title: 'Total Employees', value: '256', change: '+12', changeType: 'positive', icon: Users, color: 'bg-primary/10 text-primary' },
  { title: 'Present Today', value: '218', change: '85%', changeType: 'positive', icon: UserCheck, color: 'bg-success/10 text-success' },
  { title: 'On Leave', value: '15', change: '-3', changeType: 'neutral', icon: CalendarDays, color: 'bg-warning/10 text-warning' },
  { title: 'Pending Requests', value: '8', change: '+2', changeType: 'negative', icon: Clock, color: 'bg-destructive/10 text-destructive' },
];

const attendanceData = [
  { day: 'Mon', present: 245, absent: 11 },
  { day: 'Tue', present: 238, absent: 18 },
  { day: 'Wed', present: 242, absent: 14 },
  { day: 'Thu', present: 218, absent: 38 },
  { day: 'Fri', present: 235, absent: 21 },
];

const departmentData = [
  { name: 'Engineering', value: 85, color: 'hsl(188, 80%, 38%)' },
  { name: 'Sales', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'Marketing', value: 32, color: 'hsl(38, 92%, 50%)' },
  { name: 'HR', value: 18, color: 'hsl(280, 65%, 60%)' },
  { name: 'Finance', value: 25, color: 'hsl(340, 75%, 55%)' },
  { name: 'Operations', value: 51, color: 'hsl(210, 70%, 50%)' },
];

const recentLeaveRequests = [
  { id: 1, name: 'Priya Sharma', type: 'Casual Leave', days: 2, status: 'pending', date: '2025-01-06' },
  { id: 2, name: 'Rahul Verma', type: 'Sick Leave', days: 1, status: 'approved', date: '2025-01-05' },
  { id: 3, name: 'Anita Desai', type: 'Earned Leave', days: 5, status: 'pending', date: '2025-01-04' },
  { id: 4, name: 'Vikram Singh', type: 'Casual Leave', days: 1, status: 'rejected', date: '2025-01-03' },
];

const upcomingHolidays = [
  { name: 'Republic Day', date: '2025-01-26', type: 'National' },
  { name: 'Maha Shivaratri', date: '2025-02-26', type: 'National' },
  { name: 'Holi', date: '2025-03-14', type: 'National' },
];

export default function Dashboard() {
  const { profile, userRole } = useAuth();
  const isAdminOrHR = userRole === 'admin' || userRole === 'hr';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-muted-foreground mt-1">
              {formatDateReadable(new Date())}
            </p>
          </div>
          {isAdminOrHR && (
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                View Calendar
              </Button>
              <Button className="gap-2">
                <Users className="w-4 h-4" />
                Add Employee
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.changeType === 'positive' && (
                          <ArrowUpRight className="w-4 h-4 text-success" />
                        )}
                        {stat.changeType === 'negative' && (
                          <ArrowDownRight className="w-4 h-4 text-destructive" />
                        )}
                        <span className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-success' : 
                          stat.changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        {isAdminOrHR && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="text-sm">{dept.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{dept.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leave Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{request.name}</p>
                        <p className="text-xs text-muted-foreground">{request.type} • {request.days} day(s)</p>
                      </div>
                    </div>
                    <span className={`status-badge ${
                      request.status === 'approved' ? 'status-approved' :
                      request.status === 'rejected' ? 'status-rejected' : 'status-pending'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Holidays</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingHolidays.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDateReadable(holiday.date)}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {holiday.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for Employee */}
        {userRole === 'employee' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  <span>Check In</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  <span>Apply Leave</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <IndianRupee className="w-6 h-6 text-primary" />
                  <span>View Payslip</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <span>My Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
