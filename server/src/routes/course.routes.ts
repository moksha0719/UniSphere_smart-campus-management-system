import { Router } from 'express';
import { courseController } from '../controllers/course.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All course routes require a valid authenticated session
router.use(authenticateToken);

// 1. Browse all available course offerings (Students, Lecturers, Admins)
router.get('/offerings', courseController.listOfferings.bind(courseController));

// 2. Student: View my active enrolled courses
router.get('/my-enrollments', authorize([UserRole.STUDENT]), courseController.myEnrollments.bind(courseController));

// 3. Student: Enroll in a course offering
router.post('/offerings/:offeringId/enroll', authorize([UserRole.STUDENT]), courseController.enroll.bind(courseController));

// 4. Student: Drop a course offering
router.post('/offerings/:offeringId/drop', authorize([UserRole.STUDENT]), courseController.drop.bind(courseController));

// 5. Lecturer & Admin: View enrolled student roster for an offering
router.get('/offerings/:offeringId/students', authorize([UserRole.LECTURER, UserRole.ADMIN]), courseController.getRoster.bind(courseController));

export default router;
