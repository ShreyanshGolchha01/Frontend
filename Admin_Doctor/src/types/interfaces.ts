export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'employee';
  avatar?: string;
  employeeId?: string;
  department?: string;
  joiningDate?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  avatar?: string;
  experience: number;
  qualification: string;
  assignedCamps: string[];
}

export interface Camp {
  id: string;
  location: string;
  date: string;
  time: string;
  doctors: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  beneficiaries: number;
  expectedBeneficiaries: number;
  address: string;
  coordinator: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  sugarLevel: number;
  weight: number;
  height: number;
  bmi: number;
  notes?: string;
  campId?: string;
}

export interface Scheme {
  id: string;
  applicantName: string;
  employeeId: string;
  schemeName: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  amount: number;
  reviewedBy?: string;
  reviewDate?: string;
  remarks?: string;
}

export interface KPIData {
  totalCamps: number;
  totalUsers: number;
  totalSchemes: number;
  totalDoctors: number;
  monthlyBeneficiaries: number;
  approvedSchemes: number;
}

export interface ChartData {
  महीना: string;
  शिविर: number;
  लाभार्थी: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'camp' | 'user' | 'doctor' | 'general';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
