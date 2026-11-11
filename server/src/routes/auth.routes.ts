import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validations/auth.validation';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route: Log in
router.post('/login', validate(loginSchema), authController.login.bind(authController));

// Protected route: Get current user profile
router.get('/me', authenticateToken, authController.me.bind(authController));

export default router;
