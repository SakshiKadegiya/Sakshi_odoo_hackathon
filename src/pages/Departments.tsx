import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Building2,
  Plus,
  Users,
  Edit,
  Trash2,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { Department } from '@/lib/types';

// Mock departments
const mockDepartments: Department[] = [
  { id: '1', name: 'Human Resources', code: 'HR', headName: 'Rajesh Kumar', employeeCount: 18 },
  { id: '2', name: 'Engineering', code: 'ENG', headName: 'Suresh Menon', employeeCount: 85 },
  { id: '3', name: 'Marketing', code: 'MKT', headName: 'Kavita Nair', employeeCount: 32 },
  { id: '4', name: 'Sales', code: 'SAL', headName: 'Arun Gupta', employeeCount: 45 },
  { id: '5', name: 'Finance', code: 'FIN', headName: 'Meera Iyer', employeeCount: 25 },
  { id: '6', name: 'Operations', code: 'OPS', headName: 'Vijay Reddy', employeeCount: 51 },
];

export default function Departments() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    toast.success('Department deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Departments</h1>
            <p className="page-subtitle">Manage organization departments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Create a new department in the organization
                </DialogDescription>
              </DialogHeader>
              <AddDepartmentForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Total Departments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10">
                <User className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalEmployees / departments.length)}</p>
                <p className="text-sm text-muted-foreground">Avg per Dept</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="stat-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{dept.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Code: {dept.code}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Department Head</span>
                    <span className="font-medium">{dept.headName || 'Not assigned'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="font-medium">{dept.employeeCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AddDepartmentForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Department added successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Department Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter department name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Department Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="e.g., ENG, HR, MKT"
          maxLength={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headName">Department Head</Label>
        <Input
          id="headName"
          value={formData.headName}
          onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
          placeholder="Enter department head name"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Department
        </Button>
      </div>
    </form>
  );
}
