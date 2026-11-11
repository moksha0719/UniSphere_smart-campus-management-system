export interface LecturerInfo {
  name: string;
  email: string;
  title: string;
  role?: string;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  code: string;
  title: string;
  credits: number;
  description: string | null;
  department: string;
  departmentCode: string;
  sectionNumber: string;
  maxCapacity: number;
  enrolledCount: number;
  availableSeats: number;
  term: string;
  lecturers: LecturerInfo[];
  isEnrolled: boolean;
}

export interface EnrolledCourse {
  enrollmentId: string;
  offeringId: string;
  code: string;
  title: string;
  credits: number;
  description: string | null;
  department: string;
  sectionNumber: string;
  term: string;
  enrolledAt: string;
  lecturers: LecturerInfo[];
}

export interface StudentInRoster {
  enrollmentId: string;
  studentProfileId: string;
  studentIdNumber: string;
  name: string;
  email: string;
  department: string;
  enrolledAt: string;
  finalGrade: number | null;
}

export interface CourseRoster {
  courseCode: string;
  courseTitle: string;
  sectionNumber: string;
  totalEnrolled: number;
  maxCapacity: number;
  students: StudentInRoster[];
}
