import { Router } from 'express';
import { timetableController } from '../controllers/timetable.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All timetable operations require valid login
router.use(authenticateToken);

// 1. Personalized weekly schedule for the current logged-in user (Student, Lecturer, Admin)
router.get('/my-schedule', timetableController.getMySchedule.bind(timetableController));

// 2. List all campus rooms
router.get('/rooms', timetableController.listRooms.bind(timetableController));

// 3. Propose a new slot with 3-tier conflict validation (Lecturer & Admin)
router.post('/slots', authorize([UserRole.LECTURER, UserRole.ADMIN]), timetableController.createSlot.bind(timetableController));

// 4. Remove a slot (Admin only)
router.delete('/slots/:slotId', authorize([UserRole.ADMIN]), timetableController.deleteSlot.bind(timetableController));

export default router;
