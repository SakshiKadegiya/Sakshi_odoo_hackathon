import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateReadable } from '@/lib/utils';
import { toast } from 'sonner';
import { Holiday } from '@/lib/types';

// Mock holidays for 2025
const mockHolidays: Holiday[] = [
  { id: '1', name: 'New Year', date: '2025-01-01', type: 'national', isOptional: false },
  { id: '2', name: 'Republic Day', date: '2025-01-26', type: 'national', isOptional: false },
  { id: '3', name: 'Maha Shivaratri', date: '2025-02-26', type: 'national', isOptional: false },
  { id: '4', name: 'Holi', date: '2025-03-14', type: 'national', isOptional: false },
  { id: '5', name: 'Good Friday', date: '2025-04-18', type: 'national', isOptional: false },
  { id: '6', name: 'Eid ul-Fitr', date: '2025-03-31', type: 'national', isOptional: false },
  { id: '7', name: 'Buddha Purnima', date: '2025-05-12', type: 'regional', isOptional: true },
  { id: '8', name: 'Independence Day', date: '2025-08-15', type: 'national', isOptional: false },
  { id: '9', name: 'Janmashtami', date: '2025-08-16', type: 'national', isOptional: false },
  { id: '10', name: 'Gandhi Jayanti', date: '2025-10-02', type: 'national', isOptional: false },
  { id: '11', name: 'Dussehra', date: '2025-10-02', type: 'national', isOptional: false },
  { id: '12', name: 'Diwali', date: '2025-10-21', type: 'national', isOptional: false },
  { id: '13', name: 'Guru Nanak Jayanti', date: '2025-11-05', type: 'national', isOptional: false },
  { id: '14', name: 'Christmas', date: '2025-12-25', type: 'national', isOptional: false },
];

export default function Holidays() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
  const [holidays, setHolidays] = useState(mockHolidays);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');

  const upcomingHolidays = holidays
    .filter(h => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastHolidays = holidays
    .filter(h => new Date(h.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    toast.success('Holiday deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Company Holidays</h1>
            <p className="page-subtitle">View and manage company holiday calendar</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            {isAdminOrHR && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Holiday</DialogTitle>
                    <DialogDescription>
                      Add a new holiday to the company calendar
                    </DialogDescription>
                  </DialogHeader>
                  <AddHolidayForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{holidays.length}</p>
                <p className="text-sm text-muted-foreground">Total Holidays</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingHolidays.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{holidays.filter(h => h.isOptional).length}</p>
                <p className="text-sm text-muted-foreground">Optional Holidays</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {upcomingHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-primary font-medium">
                        {new Date(holiday.date).toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(holiday.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {holiday.type}
                        </Badge>
                        {holiday.isOptional && (
                          <Badge variant="secondary" className="text-xs">
                            Optional
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isAdminOrHR && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(holiday.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {upcomingHolidays.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming holidays
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Holidays */}
        {pastHolidays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Past Holidays</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pastHolidays.slice(0, 5).map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-4 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(holiday.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-muted-foreground">
                          {new Date(holiday.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{holiday.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDateReadable(holiday.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function AddHolidayForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'national',
    isOptional: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Holiday added successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Holiday Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter holiday name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Holiday Type *</Label>
        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">National</SelectItem>
            <SelectItem value="regional">Regional</SelectItem>
            <SelectItem value="company">Company</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isOptional"
          checked={formData.isOptional}
          onChange={(e) => setFormData({ ...formData, isOptional: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isOptional" className="font-normal cursor-pointer">
          This is an optional holiday
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Holiday
        </Button>
      </div>
    </form>
  );
}
