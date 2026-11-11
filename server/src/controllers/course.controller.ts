import { Request, Response, NextFunction } from 'express';
import { courseService } from '../services/course.service';

export class CourseController {
  /**
   * GET /api/v1/courses/offerings
   * Lists all available course offerings.
   */
  async listOfferings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.user?.studentProfileId;
      const offerings = await courseService.getAllOfferings(studentProfileId);
      res.status(200).json({
        success: true,
        data: offerings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch course offerings',
      });
    }
  }

  /**
   * POST /api/v1/courses/offerings/:offeringId/enroll
   * Student self-enrollment into a course offering.
   */
  async enroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.user?.studentProfileId;
      if (!studentProfileId) {
        res.status(400).json({
          success: false,
          message: 'Only registered students with a student profile can enroll in courses.',
        });
        return;
      }

      const { offeringId } = req.params;
      const enrollment = await courseService.enrollStudent(studentProfileId, offeringId);

      res.status(201).json({
        success: true,
        message: `Successfully enrolled in ${enrollment.courseOffering.course.code}`,
        data: enrollment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Enrollment failed',
      });
    }
  }

  /**
   * POST /api/v1/courses/offerings/:offeringId/drop
   * Student drops a course section.
   */
  async drop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.user?.studentProfileId;
      if (!studentProfileId) {
        res.status(400).json({
          success: false,
          message: 'Student profile required',
        });
        return;
      }

      const { offeringId } = req.params;
      await courseService.dropCourse(studentProfileId, offeringId);

      res.status(200).json({
        success: true,
        message: 'Course dropped successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to drop course',
      });
    }
  }

  /**
   * GET /api/v1/courses/my-enrollments
   * Fetches courses the logged-in student is enrolled in.
   */
  async myEnrollments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.user?.studentProfileId;
      if (!studentProfileId) {
        res.status(400).json({
          success: false,
          message: 'Student profile required',
        });
        return;
      }

      const enrollments = await courseService.getMyEnrolledCourses(studentProfileId);
      res.status(200).json({
        success: true,
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch enrolled courses',
      });
    }
  }

  /**
   * GET /api/v1/courses/offerings/:offeringId/students
   * Roster view for Lecturers and Admins.
   */
  async getRoster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { offeringId } = req.params;
      const userRole = req.user!.role;
      const lecturerProfileId = req.user?.lecturerProfileId;

      const roster = await courseService.getEnrolledStudents(offeringId, userRole, lecturerProfileId);
      res.status(200).json({
        success: true,
        data: roster,
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        message: error.message || 'Failed to load course roster',
      });
    }
  }
}

export const courseController = new CourseController();
