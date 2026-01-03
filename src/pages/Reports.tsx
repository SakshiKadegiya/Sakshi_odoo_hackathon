import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Users,
  Clock,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const reportTypes = [
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Daily, weekly, and monthly attendance summary',
    icon: Clock,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'leave',
    title: 'Leave Report',
    description: 'Leave balance and usage report',
    icon: CalendarDays,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'payroll',
    title: 'Payroll Report',
    description: 'Salary statements and deductions',
    icon: IndianRupee,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'employee',
    title: 'Employee Report',
    description: 'Complete employee directory',
    icon: Users,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'department',
    title: 'Department Report',
    description: 'Department-wise employee distribution',
    icon: BarChart3,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Employee performance summary',
    icon: TrendingUp,
    formats: ['PDF', 'Excel'],
  },
];

export default function Reports() {
  const handleDownload = (reportId: string, format: string) => {
    toast.success(`Downloading ${reportId} report as ${format}...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Generate and download various HR reports</p>
          </div>
        </div>

        {/* Quick Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select defaultValue="december">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January 2025</SelectItem>
                  <SelectItem value="december">December 2024</SelectItem>
                  <SelectItem value="november">November 2024</SelectItem>
                  <SelectItem value="october">October 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        className="gap-2 flex-1"
                        onClick={() => handleDownload(report.id, format)}
                      >
                        <Download className="w-4 h-4" />
                        {format}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Attendance Report - December 2024', date: '03 Jan 2025', format: 'Excel' },
                { name: 'Payroll Report - December 2024', date: '02 Jan 2025', format: 'PDF' },
                { name: 'Leave Report - Q4 2024', date: '31 Dec 2024', format: 'Excel' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    {item.format}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
