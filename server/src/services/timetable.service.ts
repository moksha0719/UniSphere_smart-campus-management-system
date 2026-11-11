import prisma from '../utils/prisma';
import { DayOfWeek, UserRole } from '@prisma/client';

export interface CreateSlotInput {
  courseOfferingId: string;
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export class TimetableService {
  /**
   * 3-Tier Conflict Detection Engine:
   * Validates Room availability, Lecturer availability, and Course Section schedule.
   */
  async validateNoConflicts(input: CreateSlotInput, excludeSlotId?: string): Promise<void> {
    const { courseOfferingId, roomId, dayOfWeek, startTime, endTime } = input;

    // Time validation: Start must be before End
    if (startTime >= endTime) {
      throw new Error('Invalid Time Window: Start time must be earlier than end time.');
    }

    // -------------------------------------------------------------
    // Tier 1: Check Room Conflict
    // -------------------------------------------------------------
    const roomClash = await prisma.timetableSlot.findFirst({
      where: {
        roomId,
        dayOfWeek,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        ...(excludeSlotId ? { id: { not: excludeSlotId } } : {}),
      },
      include: {
        courseOffering: { include: { course: true } },
        room: true,
      },
    });

    if (roomClash) {
      throw new Error(
        `Room Clash: Room ${roomClash.room.roomNumber} is already booked for ${roomClash.courseOffering.course.code} (${roomClash.startTime} - ${roomClash.endTime}) on ${dayOfWeek}.`
      );
    }

    // -------------------------------------------------------------
    // Tier 2: Check Lecturer Conflict
    // -------------------------------------------------------------
    const assignedLecturers = await prisma.courseLecturer.findMany({
      where: { courseOfferingId },
      select: { lecturerProfileId: true },
    });
    const lecturerProfileIds = assignedLecturers.map((l) => l.lecturerProfileId);

    if (lecturerProfileIds.length > 0) {
      const lecturerClash = await prisma.timetableSlot.findFirst({
        where: {
          dayOfWeek,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
          courseOffering: {
            lecturers: {
              some: {
                lecturerProfileId: { in: lecturerProfileIds },
              },
            },
          },
          ...(excludeSlotId ? { id: { not: excludeSlotId } } : {}),
        },
        include: {
          courseOffering: { include: { course: true } },
          room: true,
        },
      });

      if (lecturerClash) {
        throw new Error(
          `Lecturer Clash: The instructor is already teaching ${lecturerClash.courseOffering.course.code} in ${lecturerClash.room.roomNumber} (${lecturerClash.startTime} - ${lecturerClash.endTime}) on ${dayOfWeek}.`
        );
      }
    }

    // -------------------------------------------------------------
    // Tier 3: Check Section Conflict
    // -------------------------------------------------------------
    const sectionClash = await prisma.timetableSlot.findFirst({
      where: {
        courseOfferingId,
        dayOfWeek,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        ...(excludeSlotId ? { id: { not: excludeSlotId } } : {}),
      },
    });

    if (sectionClash) {
      throw new Error(
        `Section Clash: This course offering section already has a lecture scheduled on ${dayOfWeek} (${sectionClash.startTime} - ${sectionClash.endTime}).`
      );
    }
  }

  /**
   * Creates a new timetable slot after passing 3-tier clash checks.
   */
  async createSlot(input: CreateSlotInput) {
    await this.validateNoConflicts(input);

    return prisma.timetableSlot.create({
      data: {
        courseOfferingId: input.courseOfferingId,
        roomId: input.roomId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
      },
      include: {
        courseOffering: {
          include: {
            course: true,
            lecturers: {
              include: {
                lecturerProfile: {
                  include: { user: true },
                },
              },
            },
          },
        },
        room: true,
      },
    });
  }

  /**
   * Returns personalized weekly schedule based on the authenticated user's role.
   */
  async getMySchedule(user: { role: UserRole; studentProfileId?: string; lecturerProfileId?: string }) {
    let whereClause: any = {};

    if (user.role === UserRole.STUDENT) {
      if (!user.studentProfileId) return [];

      // Find all course offerings where student is actively ENROLLED
      const studentEnrollments = await prisma.courseEnrollment.findMany({
        where: {
          studentProfileId: user.studentProfileId,
          status: 'ENROLLED',
        },
        select: { courseOfferingId: true },
      });

      const offeringIds = studentEnrollments.map((e) => e.courseOfferingId);
      whereClause = { courseOfferingId: { in: offeringIds } };
    } else if (user.role === UserRole.LECTURER) {
      if (!user.lecturerProfileId) return [];

      // Find all offerings taught by this lecturer
      const teaching = await prisma.courseLecturer.findMany({
        where: { lecturerProfileId: user.lecturerProfileId },
        select: { courseOfferingId: true },
      });

      const offeringIds = teaching.map((t) => t.courseOfferingId);
      whereClause = { courseOfferingId: { in: offeringIds } };
    } else {
      // Admin: View all slots
      whereClause = {};
    }

    const slots = await prisma.timetableSlot.findMany({
      where: whereClause,
      include: {
        courseOffering: {
          include: {
            course: true,
            lecturers: {
              include: {
                lecturerProfile: {
                  include: { user: true },
                },
              },
            },
          },
        },
        room: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return slots.map((s) => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      courseCode: s.courseOffering.course.code,
      courseTitle: s.courseOffering.course.title,
      sectionNumber: s.courseOffering.sectionNumber,
      roomNumber: s.room.roomNumber,
      building: s.room.building,
      floor: s.room.floor,
      roomType: s.room.type,
      lecturers: s.courseOffering.lecturers.map((l) => ({
        name: `${l.lecturerProfile.user.firstName} ${l.lecturerProfile.user.lastName}`,
        title: l.lecturerProfile.academicTitle,
      })),
    }));
  }

  /**
   * Returns all active campus rooms with capacity details.
   */
  async getAllRooms() {
    return prisma.room.findMany({
      where: { isActive: true },
      orderBy: { roomNumber: 'asc' },
    });
  }

  /**
   * Deletes a timetable slot.
   */
  async deleteSlot(slotId: string) {
    return prisma.timetableSlot.delete({
      where: { id: slotId },
    });
  }
}

export const timetableService = new TimetableService();
