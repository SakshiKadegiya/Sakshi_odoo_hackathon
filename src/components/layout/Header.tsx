import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '@/lib/utils';

export function Header() {
  const { profile, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'Leave Request', message: 'New leave request from Amit Patel', time: '5 min ago' },
    { id: 2, title: 'Attendance Alert', message: 'Late check-in recorded for today', time: '1 hour ago' },
    { id: 3, title: 'Payroll', message: 'Salary processed for December 2024', time: '2 hours ago' },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md ml-12 lg:ml-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, departments..."
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b">
              <h4 className="font-semibold">Notifications</h4>
            </div>
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-4 cursor-pointer">
                <p className="font-medium text-sm">{notif.title}</p>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {getInitials(profile?.name || '')}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{profile?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
