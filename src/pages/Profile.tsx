import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  CreditCard,
  FileText,
  Edit,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDateReadable, formatINR, getInitials } from '@/lib/utils';

interface EmployeeDetails {
  designation: string | null;
  department_name: string | null;
  employment_type: string | null;
  work_location: string | null;
  date_of_joining: string | null;
  reporting_manager_name: string | null;
}

export default function Profile() {
  const { profile, userRole } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchEmployeeDetails();
    }
  }, [profile?.id]);

  const fetchEmployeeDetails = async () => {
    if (!profile?.id) return;

    try {
      const { data: details } = await supabase
        .from('employee_details')
        .select(`
          designation,
          employment_type,
          work_location,
          date_of_joining,
          department_id,
          reporting_manager_id
        `)
        .eq('profile_id', profile.id)
        .maybeSingle();

      let departmentName = null;
      let managerName = null;

      if (details?.department_id) {
        const { data: dept } = await supabase
          .from('departments')
          .select('name')
          .eq('id', details.department_id)
          .maybeSingle();
        departmentName = dept?.name || null;
      }

      if (details?.reporting_manager_id) {
        const { data: manager } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', details.reporting_manager_id)
          .maybeSingle();
        managerName = manager?.name || null;
      }

      setEmployeeDetails({
        designation: details?.designation || null,
        department_name: departmentName,
        employment_type: details?.employment_type || null,
        work_location: details?.work_location || null,
        date_of_joining: details?.date_of_joining || null,
        reporting_manager_name: managerName,
      });
    } catch (error) {
      console.error('Error fetching employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock extended employee data for personal/bank details
  const employeeData = {
    personalDetails: {
      dateOfBirth: '1995-05-15',
      gender: 'male',
      address: '123, ABC Apartments, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      emergencyContact: '9876543299',
      bloodGroup: 'O+',
      panNumber: 'ABCDE1234F',
      aadharNumber: '1234 5678 9012',
    },
    bankDetails: {
      accountNumber: 'XXXX XXXX 1234',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branchName: 'Andheri East Branch',
    },
    documents: [
      { name: 'Offer Letter', date: '2022-06-01', type: 'pdf' },
      { name: 'ID Proof', date: '2022-06-05', type: 'pdf' },
      { name: 'Address Proof', date: '2022-06-05', type: 'pdf' },
      { name: 'Educational Certificates', date: '2022-06-10', type: 'pdf' },
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                {getInitials(profile?.name || '')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
                  <Badge className={profile?.is_active ? "bg-success" : "bg-destructive"}>
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {employeeDetails?.designation || 'Employee'} • {employeeDetails?.department_name || 'Not Assigned'}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile?.email}
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      +91 {profile.phone}
                    </span>
                  )}
                  {employeeDetails?.work_location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {employeeDetails.work_location}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <p className="font-semibold">{profile?.employee_id || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Joined On</p>
              <p className="font-semibold">
                {employeeDetails?.date_of_joining ? formatDateReadable(employeeDetails.date_of_joining) : 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 text-center">
              <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{employeeDetails?.department_name || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-4 text-center">
              <User className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Reports To</p>
              <p className="font-semibold">{employeeDetails?.reporting_manager_name || 'N/A'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="professional" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Personal Details */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem label="Date of Birth" value={formatDateReadable(employeeData.personalDetails.dateOfBirth)} />
                  <InfoItem label="Gender" value={employeeData.personalDetails.gender} capitalize />
                  <InfoItem label="Blood Group" value={employeeData.personalDetails.bloodGroup} />
                  <InfoItem label="PAN Number" value={employeeData.personalDetails.panNumber} />
                  <InfoItem label="Aadhar Number" value={employeeData.personalDetails.aadharNumber} />
                  <InfoItem label="Emergency Contact" value={`+91 ${employeeData.personalDetails.emergencyContact}`} />
                  <div className="col-span-full">
                    <InfoItem 
                      label="Address" 
                      value={`${employeeData.personalDetails.address}, ${employeeData.personalDetails.city}, ${employeeData.personalDetails.state} - ${employeeData.personalDetails.pincode}`} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Details */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem label="Employee ID" value={profile?.employee_id || 'N/A'} />
                  <InfoItem label="Designation" value={employeeDetails?.designation || 'N/A'} />
                  <InfoItem label="Department" value={employeeDetails?.department_name || 'N/A'} />
                  <InfoItem label="Employment Type" value={employeeDetails?.employment_type?.replace('-', ' ') || 'N/A'} capitalize />
                  <InfoItem label="Date of Joining" value={employeeDetails?.date_of_joining ? formatDateReadable(employeeDetails.date_of_joining) : 'N/A'} />
                  <InfoItem label="Work Location" value={employeeDetails?.work_location || 'N/A'} />
                  <InfoItem label="Reporting Manager" value={employeeDetails?.reporting_manager_name || 'N/A'} />
                  <InfoItem label="Role" value={userRole} capitalize />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Details */}
          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Bank Name" value={employeeData.bankDetails.bankName} />
                  <InfoItem label="Branch Name" value={employeeData.bankDetails.branchName} />
                  <InfoItem label="Account Number" value={employeeData.bankDetails.accountNumber} />
                  <InfoItem label="IFSC Code" value={employeeData.bankDetails.ifscCode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employeeData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {formatDateReadable(doc.date)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`font-medium mt-1 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}
