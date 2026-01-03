import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Key,
  Download,
  Filter,
  Building2
} from 'lucide-react';
import { formatDateReadable, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP-2020-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    phone: '9876543210',
    department: 'Human Resources',
    designation: 'HR Director',
    dateOfJoining: '2020-01-15',
    reportingManager: 'Board',
    employmentType: 'full-time',
    workLocation: 'Mumbai Head Office',
    isActive: true,
  },
  {
    id: '2',
    employeeId: 'EMP-2021-015',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    phone: '9876543211',
    department: 'Human Resources',
    designation: 'HR Manager',
    dateOfJoining: '2021-03-01',
    reportingManager: 'Rajesh Kumar',
    employmentType: 'full-time',
    workLocation: 'Mumbai Head Office',
    isActive: true,
  },
  {
    id: '3',
    employeeId: 'EMP-2022-042',
    name: 'Amit Patel',
    email: 'amit.patel@company.com',
    phone: '9876543212',
    department: 'Engineering',
    designation: 'Senior Developer',
    dateOfJoining: '2022-06-15',
    reportingManager: 'Suresh Menon',
    employmentType: 'full-time',
    workLocation: 'Bangalore Tech Park',
    isActive: true,
  },
  {
    id: '4',
    employeeId: 'EMP-2023-078',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@company.com',
    phone: '9876543213',
    department: 'Marketing',
    designation: 'Marketing Executive',
    dateOfJoining: '2023-02-20',
    reportingManager: 'Kavita Nair',
    employmentType: 'full-time',
    workLocation: 'Mumbai Head Office',
    isActive: true,
  },
  {
    id: '5',
    employeeId: 'EMP-2024-102',
    name: 'Vikram Singh',
    email: 'vikram.singh@company.com',
    phone: '9876543214',
    department: 'Sales',
    designation: 'Sales Manager',
    dateOfJoining: '2024-01-10',
    reportingManager: 'Arun Gupta',
    employmentType: 'full-time',
    workLocation: 'Delhi Office',
    isActive: false,
  },
];

const departments = ['All Departments', 'Human Resources', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations'];
const employmentTypes = ['All Types', 'full-time', 'part-time', 'contract', 'intern'];

export default function Employees() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'All Departments' || emp.department === departmentFilter;
    const matchesType = typeFilter === 'All Types' || emp.employmentType === typeFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? emp.isActive : !emp.isActive);

    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
      )
    );
    toast.success('Employee status updated');
  };

  const handleResetPassword = (name: string) => {
    toast.success(`Password reset link sent to ${name}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-subtitle">Manage your organization's employees</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the employee details to add them to the system
                  </DialogDescription>
                </DialogHeader>
                <AddEmployeeForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
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
                <p className="text-2xl font-bold">{employees.filter(e => e.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <UserX className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.filter(e => !e.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10">
                <Building2 className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(employees.map(e => e.department)).size}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
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
                  placeholder="Search by name, email, or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type.replace('-', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
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
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>{formatDateReadable(employee.dateOfJoining)}</td>
                      <td>{employee.workLocation}</td>
                      <td>
                        <Badge variant={employee.isActive ? 'default' : 'secondary'} className={employee.isActive ? 'bg-success' : ''}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="w-4 h-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer"
                              onClick={() => handleResetPassword(employee.name)}
                            >
                              <Key className="w-4 h-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer"
                              onClick={() => handleToggleStatus(employee.id)}
                            >
                              {employee.isActive ? (
                                <>
                                  <UserX className="w-4 h-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4" /> Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No employees found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    employmentType: 'full-time',
    workLocation: '',
    reportingManager: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, make API call
    toast.success('Employee added successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="9876543210"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="Enter designation"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfJoining">Date of Joining *</Label>
          <Input
            id="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type *</Label>
          <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="workLocation">Work Location *</Label>
          <Input
            id="workLocation"
            value={formData.workLocation}
            onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
            placeholder="Enter work location"
            required
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="reportingManager">Reporting Manager</Label>
          <Input
            id="reportingManager"
            value={formData.reportingManager}
            onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
            placeholder="Enter reporting manager name"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Employee
        </Button>
      </div>
    </form>
  );
}
