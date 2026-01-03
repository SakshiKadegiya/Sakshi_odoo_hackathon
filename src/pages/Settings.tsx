import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  KeyRound,
  Mail,
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Clock,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkPasswordStrength, formatDateReadable, formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginHistory } from '@/lib/types';

// Mock login history
const mockLoginHistory: LoginHistory[] = [
  {
    id: '1',
    userId: '1',
    device: 'Windows PC',
    browser: 'Chrome 120',
    ip: '103.24.56.78',
    location: 'Mumbai, Maharashtra, India',
    loginTime: '2025-01-03T09:15:00',
    isActive: true,
  },
  {
    id: '2',
    userId: '1',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    ip: '49.36.45.123',
    location: 'Mumbai, Maharashtra, India',
    loginTime: '2025-01-02T18:30:00',
    logoutTime: '2025-01-02T19:45:00',
    isActive: false,
  },
  {
    id: '3',
    userId: '1',
    device: 'MacBook Pro',
    browser: 'Firefox 121',
    ip: '157.43.89.201',
    location: 'Bangalore, Karnataka, India',
    loginTime: '2025-01-01T14:00:00',
    logoutTime: '2025-01-01T18:00:00',
    isActive: false,
  },
];

export default function Settings() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and security preferences</p>
          </div>
        </div>

        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
            <TabsTrigger value="password" className="gap-2">
              <KeyRound className="w-4 h-4" />
              <span className="hidden md:inline">Password</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden md:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Sessions</span>
            </TabsTrigger>
          </TabsList>

          {/* Change Password */}
          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>

          {/* Change Email */}
          <TabsContent value="email">
            <ChangeEmailForm currentEmail={user?.email || ''} />
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          {/* Active Sessions */}
          <TabsContent value="sessions">
            <SessionsView loginHistory={mockLoginHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = checkPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordStrength.score < 4) {
      toast.error('Please use a stronger password');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            {newPassword && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-destructive'
                            : passwordStrength.score <= 4
                            ? 'bg-warning'
                            : 'bg-success'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {passwordStrength.feedback.map((fb, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fb}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Passwords do not match
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Verification email sent! Please check your inbox.');
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>
          Update your email address. A verification link will be sent to your new email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Current Email</Label>
            <Input value={currentEmail} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailPassword">Current Password</Label>
            <Input
              id="emailPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Update Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    toast.success(enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure additional security options for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security using OTP
              </p>
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
        </div>

        {twoFactorEnabled && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              2FA is enabled. You'll receive an OTP on your registered mobile number during login.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Login Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when someone logs into your account
              </p>
            </div>
          </div>
          <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
        </div>
      </CardContent>
    </Card>
  );
}

function SessionsView({ loginHistory }: { loginHistory: LoginHistory[] }) {
  const handleLogoutAll = () => {
    toast.success('Logged out from all other devices');
  };

  const handleLogoutSession = (id: string) => {
    toast.success('Session terminated');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your logged-in devices and sessions
          </CardDescription>
        </div>
        <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogoutAll}>
          <LogOut className="w-4 h-4" />
          Logout All Devices
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loginHistory.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border ${
                session.isActive ? 'border-success bg-success/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isActive && (
                        <Badge className="bg-success text-success-foreground">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.browser}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateReadable(session.loginTime)} at {formatTime(session.loginTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      IP: {session.ip}
                    </p>
                  </div>
                </div>
                {!session.isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleLogoutSession(session.id)}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
