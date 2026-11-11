import { PrismaClient, UserRole, CourseLecturerRole, EnrollmentStatus, RoomType, DayOfWeek } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Smart Campus Management System...');

  // 1. Clean up existing records in reverse dependency order
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.courseLecturer.deleteMany();
  await prisma.courseOffering.deleteMany();
  await prisma.course.deleteMany();
  await prisma.roomReservation.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.lecturerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.academicTerm.deleteMany();
  await prisma.room.deleteMany();

  // 2. Create Default Department
  const department = await prisma.department.create({
    data: {
      name: 'Department of Computer Science & Software Engineering',
      code: 'CSE',
      faculty: 'Faculty of Computing',
    },
  });
  console.log(`✅ Created Department: ${department.name} (${department.code})`);

  // 3. Create Default Academic Term
  const term = await prisma.academicTerm.create({
    data: {
      name: 'Semester 1 - 2026/2027',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-01-31'),
      isCurrent: true,
    },
  });
  console.log(`✅ Created Academic Term: ${term.name}`);

  // 4. Create Standard Campus Rooms
  const roomLH201 = await prisma.room.create({
    data: {
      roomNumber: 'LH-201',
      building: 'Computing Complex',
      floor: 2,
      type: RoomType.LECTURE_HALL,
      capacity: 120,
      hasProjector: true,
      isActive: true,
    },
  });

  const roomLAB03 = await prisma.room.create({
    data: {
      roomNumber: 'LAB-03',
      building: 'Turing Center',
      floor: 3,
      type: RoomType.COMPUTER_LAB,
      capacity: 45,
      hasProjector: true,
      isActive: true,
    },
  });

  const roomLH105 = await prisma.room.create({
    data: {
      roomNumber: 'LH-105',
      building: 'Computing Complex',
      floor: 1,
      type: RoomType.STUDY_ROOM,
      capacity: 60,
      hasProjector: true,
      isActive: true,
    },
  });
  console.log(`✅ Created Rooms: LH-201 (Lecture Hall), LAB-03 (Computer Lab), LH-105 (Study Room)`);

  // 5. Create Standard Hashed Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const lecturerPasswordHash = await bcrypt.hash('Lecturer@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);

  // 6. Seed Administrator User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // 7. Seed Lecturer User + Profile
  const lecturer = await prisma.user.create({
    data: {
      email: 'lecturer@campus.edu',
      passwordHash: lecturerPasswordHash,
      firstName: 'Dr. Robert',
      lastName: 'Langdon',
      role: UserRole.LECTURER,
      lecturerProfile: {
        create: {
          employeeIdNumber: 'LEC-2026-001',
          academicTitle: 'Associate Professor',
          officeLocation: 'Computing Block C, Room 304',
          departmentId: department.id,
        },
      },
    },
    include: {
      lecturerProfile: true,
    },
  });
  console.log(`✅ Created Lecturer: ${lecturer.email} (Staff ID: ${lecturer.lecturerProfile?.employeeIdNumber})`);

  // 8. Seed Student User + Profile
  const student = await prisma.user.create({
    data: {
      email: 'student@campus.edu',
      passwordHash: studentPasswordHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: UserRole.STUDENT,
      studentProfile: {
        create: {
          studentIdNumber: 'IT2026042',
          enrollmentYear: 2026,
          currentSemester: 1,
          departmentId: department.id,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });
  console.log(`✅ Created Student: ${student.email} (Student ID: ${student.studentProfile?.studentIdNumber})`);

  // 9. Seed Academic Courses with Timetable Slots
  const coursesData = [
    {
      code: 'CS1010',
      title: 'Introduction to Computer Science & Python',
      credits: 4,
      description: 'Foundational programming concepts, algorithmic thinking, data structures, and object-oriented principles using Python.',
      slot: { day: DayOfWeek.MON, start: '09:00', end: '11:00', roomId: roomLH201.id, roomCode: 'LH-201' },
    },
    {
      code: 'CS2020',
      title: 'Data Structures and Algorithm Analysis',
      credits: 4,
      description: 'Design and analysis of essential data structures: linked lists, trees, graphs, sorting algorithms, and asymptotic complexity.',
      slot: { day: DayOfWeek.TUE, start: '11:00', end: '13:00', roomId: roomLAB03.id, roomCode: 'LAB-03' },
    },
    {
      code: 'CS3030',
      title: 'Database Management Systems',
      credits: 3,
      description: 'Relational database modeling, normalization, SQL queries, transaction management (ACID), and database optimization.',
      slot: { day: DayOfWeek.WED, start: '14:00', end: '16:00', roomId: roomLH105.id, roomCode: 'LH-105' },
    },
    {
      code: 'CS4040',
      title: 'Full-Stack Web Development & Cloud Systems',
      credits: 3,
      description: 'Modern component-based client architectures (React, Tailwind), REST APIs with Node.js/Express, Docker, and cloud deployments.',
      slot: { day: DayOfWeek.THU, start: '10:00', end: '12:00', roomId: roomLAB03.id, roomCode: 'LAB-03' },
    },
  ];

  console.log('\n📚 Creating Academic Courses & Timetable Slots...');
  for (const c of coursesData) {
    const course = await prisma.course.create({
      data: {
        code: c.code,
        title: c.title,
        credits: c.credits,
        description: c.description,
        departmentId: department.id,
        offerings: {
          create: {
            academicTermId: term.id,
            sectionNumber: '01',
            maxCapacity: 60,
            lecturers: {
              create: {
                lecturerProfileId: lecturer.lecturerProfile!.id,
                roleInCourse: CourseLecturerRole.COORDINATOR,
              },
            },
            timetableSlots: {
              create: {
                roomId: c.slot.roomId,
                dayOfWeek: c.slot.day,
                startTime: c.slot.start,
                endTime: c.slot.end,
              },
            },
          },
        },
      },
      include: {
        offerings: true,
      },
    });

    console.log(`   - Course: ${course.code} | Slot: ${c.slot.day} ${c.slot.start}-${c.slot.end} (${c.slot.roomCode})`);

    // Enroll Alex Rivera in CS1010 by default
    if (c.code === 'CS1010') {
      await prisma.courseEnrollment.create({
        data: {
          courseOfferingId: course.offerings[0].id,
          studentProfileId: student.studentProfile!.id,
          status: EnrollmentStatus.ENROLLED,
        },
      });
      console.log(`     👉 Enrolled ${student.firstName} in ${course.code}`);
    }
  }

  console.log('\n✨ Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('📌 Default Login Credentials:');
  console.log('   Administrator: admin@campus.edu    / Admin@123');
  console.log('   Lecturer:      lecturer@campus.edu / Lecturer@123');
  console.log('   Student:       student@campus.edu  / Student@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
