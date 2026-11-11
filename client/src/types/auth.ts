export type UserRole = 'STUDENT' | 'LECTURER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
  studentProfileId?: string;
  lecturerProfileId?: string;
  studentProfile?: {
    id: string;
    studentIdNumber: string;
    enrollmentYear: number;
    currentSemester: number;
    department?: {
      name: string;
      code: string;
    };
  };
  lecturerProfile?: {
    id: string;
    employeeIdNumber: string;
    academicTitle: string;
    officeLocation?: string;
    department?: {
      name: string;
      code: string;
    };
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
