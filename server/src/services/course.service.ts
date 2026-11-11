import prisma from '../utils/prisma';
import { EnrollmentStatus, UserRole } from '@prisma/client';

export class CourseService {
  /**
   * Retrieves all course offerings with department, term, lecturers, and enrollment counts.
   * If studentProfileId is provided, adds a flag indicating if the student is currently enrolled.
   */
  async getAllOfferings(studentProfileId?: string) {
    const offerings = await prisma.courseOffering.findMany({
      include: {
        course: {
          include: {
            department: true,
          },
        },
        academicTerm: true,
        lecturers: {
          include: {
            lecturerProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          where: {
            status: EnrollmentStatus.ENROLLED,
          },
          select: {
            id: true,
            studentProfileId: true,
          },
        },
      },
      orderBy: {
        course: {
          code: 'asc',
        },
      },
    });

    return offerings.map((offering) => {
      const activeEnrollmentsCount = offering.enrollments.length;
      const isEnrolled = studentProfileId
        ? offering.enrollments.some((e) => e.studentProfileId === studentProfileId)
        : false;

      return {
        id: offering.id,
        courseId: offering.course.id,
        code: offering.course.code,
        title: offering.course.title,
        credits: offering.course.credits,
        description: offering.course.description,
        department: offering.course.department.name,
        departmentCode: offering.course.department.code,
        sectionNumber: offering.sectionNumber,
        maxCapacity: offering.maxCapacity,
        enrolledCount: activeEnrollmentsCount,
        availableSeats: Math.max(0, offering.maxCapacity - activeEnrollmentsCount),
        term: offering.academicTerm.name,
        lecturers: offering.lecturers.map((l) => ({
          name: `${l.lecturerProfile.user.firstName} ${l.lecturerProfile.user.lastName}`,
          email: l.lecturerProfile.user.email,
          title: l.lecturerProfile.academicTitle,
          role: l.roleInCourse,
        })),
        isEnrolled,
      };
    });
  }

  /**
   * Enrolls a student in a specific course offering.
   * Protects against duplicate enrollment and exceeding maximum capacity.
   */
  async enrollStudent(studentProfileId: string, courseOfferingId: string) {
    const offering = await prisma.courseOffering.findUnique({
      where: { id: courseOfferingId },
      include: {
        enrollments: {
          where: { status: EnrollmentStatus.ENROLLED },
        },
        course: true,
      },
    });

    if (!offering) {
      throw new Error('Course offering not found');
    }

    // 1. Capacity Check
    if (offering.enrollments.length >= offering.maxCapacity) {
      throw new Error(`Enrollment failed: This course section has reached its maximum capacity (${offering.maxCapacity} students).`);
    }

    // 2. Existing Enrollment Check
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        courseOfferingId_studentProfileId: {
          courseOfferingId,
          studentProfileId,
        },
      },
    });

    if (existing) {
      if (existing.status === EnrollmentStatus.ENROLLED) {
        throw new Error(`You are already enrolled in ${offering.course.code}.`);
      }

      // Re-enroll if previously dropped or withdrawn
      return prisma.courseEnrollment.update({
        where: { id: existing.id },
        data: {
          status: EnrollmentStatus.ENROLLED,
          enrolledAt: new Date(),
        },
        include: {
          courseOffering: {
            include: { course: true },
          },
        },
      });
    }

    // 3. Create fresh enrollment
    return prisma.courseEnrollment.create({
      data: {
        courseOfferingId,
        studentProfileId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        courseOffering: {
          include: { course: true },
        },
      },
    });
  }

  /**
   * Drops an enrolled course (sets status to DROPPED, maintaining academic history).
   */
  async dropCourse(studentProfileId: string, courseOfferingId: string) {
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        courseOfferingId_studentProfileId: {
          courseOfferingId,
          studentProfileId,
        },
      },
      include: {
        courseOffering: {
          include: { course: true },
        },
      },
    });

    if (!existing || existing.status !== EnrollmentStatus.ENROLLED) {
      throw new Error('You are not currently enrolled in this course section.');
    }

    return prisma.courseEnrollment.update({
      where: { id: existing.id },
      data: {
        status: EnrollmentStatus.DROPPED,
      },
    });
  }

  /**
   * Returns all active enrolled courses for a given student.
   */
  async getMyEnrolledCourses(studentProfileId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        studentProfileId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        courseOffering: {
          include: {
            course: {
              include: { department: true },
            },
            academicTerm: true,
            lecturers: {
              include: {
                lecturerProfile: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      offeringId: e.courseOffering.id,
      code: e.courseOffering.course.code,
      title: e.courseOffering.course.title,
      credits: e.courseOffering.course.credits,
      description: e.courseOffering.course.description,
      department: e.courseOffering.course.department.name,
      sectionNumber: e.courseOffering.sectionNumber,
      term: e.courseOffering.academicTerm.name,
      enrolledAt: e.enrolledAt,
      lecturers: e.courseOffering.lecturers.map((l) => ({
        name: `${l.lecturerProfile.user.firstName} ${l.lecturerProfile.user.lastName}`,
        email: l.lecturerProfile.user.email,
        title: l.lecturerProfile.academicTitle,
      })),
    }));
  }

  /**
   * Returns the list of students enrolled in an offering (for Lecturers and Admins).
   */
  async getEnrolledStudents(courseOfferingId: string, userRole: UserRole, lecturerProfileId?: string) {
    // If lecturer, verify assignment
    if (userRole === UserRole.LECTURER) {
      const isAssigned = await prisma.courseLecturer.findFirst({
        where: {
          courseOfferingId,
          lecturerProfileId,
        },
      });

      if (!isAssigned) {
        throw new Error('Access denied: You are not assigned as an instructor for this course offering.');
      }
    }

    const offering = await prisma.courseOffering.findUnique({
      where: { id: courseOfferingId },
      include: {
        course: true,
        enrollments: {
          where: { status: EnrollmentStatus.ENROLLED },
          include: {
            studentProfile: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
                department: true,
              },
            },
          },
          orderBy: {
            studentProfile: {
              studentIdNumber: 'asc',
            },
          },
        },
      },
    });

    if (!offering) {
      throw new Error('Course offering not found');
    }

    return {
      courseCode: offering.course.code,
      courseTitle: offering.course.title,
      sectionNumber: offering.sectionNumber,
      totalEnrolled: offering.enrollments.length,
      maxCapacity: offering.maxCapacity,
      students: offering.enrollments.map((e) => ({
        enrollmentId: e.id,
        studentProfileId: e.studentProfile.id,
        studentIdNumber: e.studentProfile.studentIdNumber,
        name: `${e.studentProfile.user.firstName} ${e.studentProfile.user.lastName}`,
        email: e.studentProfile.user.email,
        department: e.studentProfile.department.name,
        enrolledAt: e.enrolledAt,
        finalGrade: e.finalGrade,
      })),
    };
  }
}

export const courseService = new CourseService();
