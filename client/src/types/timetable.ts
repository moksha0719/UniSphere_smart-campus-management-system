export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  courseCode: string;
  courseTitle: string;
  sectionNumber: string;
  roomNumber: string;
  building: string;
  floor: number;
  roomType: string;
  lecturers: Array<{
    name: string;
    title: string;
  }>;
}

export interface Room {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  type: string;
  capacity: number;
  hasProjector: boolean;
  isActive: boolean;
}
