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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  IndianRupee,
  Download,
  Search,
  FileText,
  TrendingUp,
  Users,
  Calculator
} from 'lucide-react';
import { formatINR, getInitials } from '@/lib/utils';

// Mock payroll data
const mockPayroll = [
  {
    id: '1',
    employeeId: 'EMP-2022-042',
    name: 'Amit Patel',
    department: 'Engineering',
    designation: 'Senior Developer',
    basic: 75000,
    hra: 30000,
    da: 7500,
    specialAllowance: 15000,
    grossSalary: 127500,
    pf: 9000,
    esi: 0,
    professionalTax: 200,
    tds: 12750,
    totalDeductions: 21950,
    netSalary: 105550,
    status: 'processed',
    month: 'December 2024',
  },
  {
    id: '2',
    employeeId: 'EMP-2021-015',
    name: 'Priya Sharma',
    department: 'Human Resources',
    designation: 'HR Manager',
    basic: 65000,
    hra: 26000,
    da: 6500,
    specialAllowance: 12000,
    grossSalary: 109500,
    pf: 7800,
    esi: 0,
    professionalTax: 200,
    tds: 10950,
    totalDeductions: 18950,
    netSalary: 90550,
    status: 'processed',
    month: 'December 2024',
  },
  {
    id: '3',
    employeeId: 'EMP-2023-078',
    name: 'Sneha Reddy',
    department: 'Marketing',
    designation: 'Marketing Executive',
    basic: 45000,
    hra: 18000,
    da: 4500,
    specialAllowance: 8000,
    grossSalary: 75500,
    pf: 5400,
    esi: 566,
    professionalTax: 200,
    tds: 5000,
    totalDeductions: 11166,
    netSalary: 64334,
    status: 'pending',
    month: 'December 2024',
  },
];

const months = [
  'January 2025', 'December 2024', 'November 2024', 'October 2024',
  'September 2024', 'August 2024', 'July 2024', 'June 2024'
];

export default function Payroll() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [selectedPayslip, setSelectedPayslip] = useState<typeof mockPayroll[0] | null>(null);

  const filteredPayroll = mockPayroll.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGross = mockPayroll.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalNet = mockPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = mockPayroll.reduce((sum, p) => sum + p.totalDeductions, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Payroll Management</h1>
            <p className="page-subtitle">Process and manage employee salaries</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calculator className="w-4 h-4" />
              Process Payroll
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <IndianRupee className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold rupee-format">{formatINR(totalGross)}</p>
                <p className="text-sm text-muted-foreground">Total Gross</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold rupee-format">{formatINR(totalNet)}</p>
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <Calculator className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-lg font-bold rupee-format">{formatINR(totalDeductions)}</p>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-lg font-bold">{mockPayroll.length}</p>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payroll - {selectedMonth}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="text-right">Basic</th>
                    <th className="text-right">Gross Salary</th>
                    <th className="text-right">Deductions</th>
                    <th className="text-right">Net Salary</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {getInitials(employee.name)}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="text-sm">{employee.department}</p>
                          <p className="text-xs text-muted-foreground">{employee.designation}</p>
                        </div>
                      </td>
                      <td className="text-right rupee-format font-medium">
                        {formatINR(employee.basic)}
                      </td>
                      <td className="text-right rupee-format font-medium">
                        {formatINR(employee.grossSalary)}
                      </td>
                      <td className="text-right rupee-format text-destructive">
                        {formatINR(employee.totalDeductions)}
                      </td>
                      <td className="text-right rupee-format font-bold text-success">
                        {formatINR(employee.netSalary)}
                      </td>
                      <td>
                        <Badge className={`status-badge ${
                          employee.status === 'processed' ? 'status-approved' : 'status-pending'
                        }`}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => setSelectedPayslip(employee)}
                            >
                              <FileText className="w-4 h-4" />
                              Payslip
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Salary Slip</DialogTitle>
                              <DialogDescription>
                                {employee.month}
                              </DialogDescription>
                            </DialogHeader>
                            <PayslipView employee={employee} />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPayroll.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No payroll records found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function PayslipView({ employee }: { employee: typeof mockPayroll[0] }) {
  return (
    <div className="space-y-6 mt-4">
      {/* Employee Info */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg">
          {getInitials(employee.name)}
        </div>
        <div>
          <p className="font-semibold">{employee.name}</p>
          <p className="text-sm text-muted-foreground">{employee.employeeId} • {employee.designation}</p>
          <p className="text-sm text-muted-foreground">{employee.department}</p>
        </div>
      </div>

      {/* Earnings */}
      <div>
        <h4 className="font-semibold mb-3 text-success">Earnings</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Basic Salary</span>
            <span className="rupee-format">{formatINR(employee.basic)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>House Rent Allowance (HRA)</span>
            <span className="rupee-format">{formatINR(employee.hra)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Dearness Allowance (DA)</span>
            <span className="rupee-format">{formatINR(employee.da)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Special Allowance</span>
            <span className="rupee-format">{formatINR(employee.specialAllowance)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Gross Salary</span>
            <span className="rupee-format text-success">{formatINR(employee.grossSalary)}</span>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div>
        <h4 className="font-semibold mb-3 text-destructive">Deductions</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Provident Fund (PF)</span>
            <span className="rupee-format">{formatINR(employee.pf)}</span>
          </div>
          {employee.esi > 0 && (
            <div className="flex justify-between text-sm">
              <span>Employee State Insurance (ESI)</span>
              <span className="rupee-format">{formatINR(employee.esi)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Professional Tax</span>
            <span className="rupee-format">{formatINR(employee.professionalTax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax Deducted at Source (TDS)</span>
            <span className="rupee-format">{formatINR(employee.tds)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total Deductions</span>
            <span className="rupee-format text-destructive">{formatINR(employee.totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="p-4 bg-primary/10 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Net Salary</span>
          <span className="text-2xl font-bold rupee-format text-primary">{formatINR(employee.netSalary)}</span>
        </div>
      </div>

      {/* Download Button */}
      <Button className="w-full gap-2">
        <Download className="w-4 h-4" />
        Download Payslip (PDF)
      </Button>
    </div>
  );
}
