import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  CreditCard,
  Settings,
  Building2,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  UserCircle,
  Clock,
  CalendarDays,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'hr', 'employee'] },
  { label: 'Employees', icon: Users, href: '/employees', roles: ['admin', 'hr'] },
  { label: 'Attendance', icon: Clock, href: '/attendance', roles: ['admin', 'hr', 'employee'] },
  { label: 'Leave Management', icon: CalendarDays, href: '/leaves', roles: ['admin', 'hr', 'employee'] },
  { label: 'Holidays', icon: Calendar, href: '/holidays', roles: ['admin', 'hr', 'employee'] },
  { label: 'Payroll', icon: CreditCard, href: '/payroll', roles: ['admin', 'hr'] },
  { label: 'Departments', icon: Building2, href: '/departments', roles: ['admin', 'hr'] },
  { label: 'Reports', icon: FileText, href: '/reports', roles: ['admin', 'hr'] },
  { label: 'My Profile', icon: UserCircle, href: '/profile', roles: ['admin', 'hr', 'employee'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['admin', 'hr', 'employee'] },
];

export function Sidebar() {
  const { profile, userRole, logout, switchRole } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">HRMS Pro</h1>
          <p className="text-xs text-sidebar-foreground/60">Human Resource System</p>
        </div>
      </div>

      {/* Role Switcher for Admin/HR */}
      {(userRole === 'admin' || userRole === 'hr') && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {userRole === 'admin' ? 'Admin View' : userRole === 'hr' ? 'HR View' : 'Employee View'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => switchRole('admin')}>
                Admin View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('hr')}>
                HR View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('employee')}>
                Employee View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-medium">
            {getInitials(profile?.name || '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.name || 'User'}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{userRole}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-sidebar-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-40 transition-transform duration-300 lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
