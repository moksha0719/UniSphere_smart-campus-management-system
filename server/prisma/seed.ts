import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Smart Campus Management System...');

  // 1. Clean up existing records in reverse dependency order (optional/safe for re-seeding)
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

  // 4. Create Standard Hashed Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const lecturerPasswordHash = await bcrypt.hash('Lecturer@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);

  // 5. Seed Administrator User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Created Admin: ${admin.email} (Role: ${admin.role})`);

  // 6. Seed Lecturer User + Profile
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

  // 7. Seed Student User + Profile
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
