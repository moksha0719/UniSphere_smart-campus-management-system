import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Role-Based Access Control (RBAC) Guard Middleware.
 * Ensures the logged-in user has one of the allowed roles.
 * Example usage: authorize([UserRole.ADMIN, UserRole.LECTURER])
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Required role(s): [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
