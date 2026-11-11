import prisma from '../utils/prisma';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { LoginInput } from '../validations/auth.validation';
import { AuthResponse } from '../types/auth.types';

export class AuthService {
  /**
   * Authenticates user credentials and returns user details with signed JWT.
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      include: {
        studentProfile: true,
        lecturerProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact campus administration.');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Build JWT payload
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      studentProfileId: user.studentProfile?.id,
      lecturerProfileId: user.lecturerProfile?.id,
    };

    const token = generateToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        studentProfileId: user.studentProfile?.id,
        lecturerProfileId: user.lecturerProfile?.id,
      },
      token,
    };
  }

  /**
   * Fetches full profile details for the currently authenticated user.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        studentProfile: {
          include: {
            department: true,
          },
        },
        lecturerProfile: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
