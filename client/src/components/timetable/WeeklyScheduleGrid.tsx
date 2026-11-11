import React, { useState } from 'react';
import { TimetableSlot, DayOfWeek } from '../../types/timetable';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

interface WeeklyScheduleGridProps {
  slots: TimetableSlot[];
  loading?: boolean;
}

const DAYS_STANDARD: { key: DayOfWeek; label: string }[] = [
  { key: 'MON', label: 'Monday' },
  { key: 'TUE', label: 'Tuesday' },
  { key: 'WED', label: 'Wednesday' },
  { key: 'THU', label: 'Thursday' },
  { key: 'FRI', label: 'Friday' },
];

const DAYS_WEEKEND: { key: DayOfWeek; label: string }[] = [
  { key: 'SAT', label: 'Saturday' },
  { key: 'SUN', label: 'Sunday' },
];

const TIME_BLOCKS = [
  { label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { label: '12:00 - 14:00', start: '12:00', end: '14:00', isLunch: true },
  { label: '14:00 - 16:00', start: '14:00', end: '16:00' },
  { label: '16:00 - 18:00', start: '16:00', end: '18:00' },
];

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({ slots, loading }) => {
  const [showWeekend, setShowWeekend] = useState(false);

  const activeDays = showWeekend ? [...DAYS_STANDARD, ...DAYS_WEEKEND] : DAYS_STANDARD;

  const getSlotsForCell = (day: DayOfWeek, blockStart: string, blockEnd: string) => {
    return slots.filter((s) => {
      if (s.dayOfWeek !== day) return false;
      // Check if slot overlaps with this time block: start < blockEnd && end > blockStart
      return s.startTime < blockEnd && s.endTime > blockStart;
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading your weekly timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Weekly Class Grid</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium ml-2">
            {slots.length} Classes Scheduled
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWeekend(!showWeekend)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            {showWeekend ? 'Hide Weekend (Sat-Sun)' : 'Show Full 7 Days'}
          </button>
        </div>
      </div>

      {/* The Schedule Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          {/* Day Headers */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="w-32 p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-r border-slate-200">
                Time Block
              </th>
              {activeDays.map((d) => (
                <th key={d.key} className="p-4 text-xs font-bold text-slate-800 uppercase tracking-wider text-center border-r border-slate-100 last:border-r-0">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Time Row Slots */}
          <tbody className="divide-y divide-slate-100">
            {TIME_BLOCKS.map((block) => (
              <tr key={block.start} className="hover:bg-slate-50/30 transition">
                {/* Time Column Header */}
                <td className="p-3.5 text-center border-r border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{block.label}</span>
                  </div>
                  {block.isLunch && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium inline-block mt-1">
                      Lunch Break
                    </span>
                  )}
                </td>

                {/* Day Cells */}
                {activeDays.map((d) => {
                  const cellSlots = getSlotsForCell(d.key, block.start, block.end);

                  return (
                    <td
                      key={d.key}
                      className="p-2 border-r border-slate-100 last:border-r-0 align-top h-28"
                    >
                      {cellSlots.length === 0 ? (
                        <div className="h-full rounded-xl border border-dashed border-slate-100 flex items-center justify-center text-[11px] text-slate-300">
                          Free
                        </div>
                      ) : (
                        <div className="space-y-2 h-full">
                          {cellSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600 text-white tracking-wider">
                                    {slot.courseCode}
                                  </span>
                                  <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                                  {slot.courseTitle}
                                </h4>
                              </div>

                              <div className="pt-2 border-t border-blue-100/60 flex items-center justify-between text-[11px] text-slate-600">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                  {slot.roomNumber} ({slot.building})
                                </span>
                                <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                                  <User className="w-3 h-3 text-slate-400" />
                                  {slot.lecturers[0]?.name.split(' ')[0] || 'Faculty'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
