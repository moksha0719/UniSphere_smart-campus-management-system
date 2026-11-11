import { UserRole } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  studentProfileId?: string;
  lecturerProfileId?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string | null;
    studentProfileId?: string;
    lecturerProfileId?: string;
  };
  token: string;
}
