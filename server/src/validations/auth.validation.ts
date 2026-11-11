import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Role must be STUDENT, LECTURER, or ADMIN' }) }),
  // Role-specific optional fields:
  departmentId: z.string().uuid('Valid department ID is required').optional(),
  studentIdNumber: z.string().optional(),
  employeeIdNumber: z.string().optional(),
  academicTitle: z.string().optional(),
  enrollmentYear: z.number().int().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
