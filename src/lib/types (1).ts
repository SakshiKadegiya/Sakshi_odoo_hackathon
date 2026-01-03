export type UserRole = 'admin' | 'hr' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId: string;
  department: string;
  designation: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  dateOfJoining: string;
  reportingManager?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: string;
}

export interface Employee extends User {
  personalDetails: {
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergencyContact: string;
    bloodGroup: string;
    panNumber: string;
    aadharNumber: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  };
  salary: {
    basic: number;
    hra: number;
    da: number;
    specialAllowance: number;
    pf: number;
    esi: number;
    professionalTax: number;
    grossSalary: number;
    netSalary: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'compensatory' | 'unpaid';
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayType?: 'first-half' | 'second-half';
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionComment?: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: { total: number; used: number; balance: number };
  sick: { total: number; used: number; balance: number };
  earned: { total: number; used: number; balance: number };
  maternity: { total: number; used: number; balance: number };
  paternity: { total: number; used: number; balance: number };
  compensatory: { total: number; used: number; balance: number };
  unpaid: { total: number; used: number; balance: number };
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday' | 'weekend';
  workHours?: number;
  overtime?: number;
  notes?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'regional' | 'company';
  isOptional: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headId?: string;
  headName?: string;
  employeeCount: number;
}

export interface LoginHistory {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  loginTime: string;
  logoutTime?: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'leave' | 'attendance' | 'payroll' | 'announcement' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
