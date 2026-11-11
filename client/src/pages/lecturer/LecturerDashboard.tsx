import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CourseOffering, CourseRoster } from '../../types/course';
import { 
  BookOpen, LogOut, Users, ShieldCheck, 
  X, Award
} from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoster, setSelectedRoster] = useState<CourseRoster | null>(null);
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: CourseOffering[] }>('/courses/offerings');
        if (res.data.success) {
          setOfferings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleOpenRoster = async (offeringId: string) => {
    try {
      setRosterLoading(true);
      const res = await api.get<{ success: boolean; data: CourseRoster }>(`/courses/offerings/${offeringId}/students`);
      if (res.data.success) {
        setSelectedRoster(res.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load roster');
    } finally {
      setRosterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Lecturer Portal</h1>
            <p className="text-xs text-slate-500">Smart Campus Faculty Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500">{user?.lecturerProfile?.employeeIdNumber || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
              <span>Milestone 2 • Faculty Course Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.firstName} {user?.lastName}!
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Title: <span className="font-semibold text-white">{user?.lecturerProfile?.academicTitle || 'Associate Professor'}</span> • Staff ID: <span className="font-semibold text-white">{user?.lecturerProfile?.employeeIdNumber || 'LEC-2026-001'}</span>
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-indigo-100 uppercase tracking-wider font-medium">Assigned Courses</p>
            <p className="text-2xl font-bold text-white mt-0.5">{offerings.length}</p>
          </div>
        </div>

        {/* Assigned Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Assigned Teaching Offerings</h3>
              <p className="text-xs text-slate-500">View course sections and manage enrolled student rosters</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading assigned courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offerings.map((offering) => (
                <div
                  key={offering.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg tracking-wider">
                        {offering.code} - Section {offering.sectionNumber}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {offering.credits} Credits
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-snug">{offering.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{offering.department}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{offering.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>{offering.enrolledCount} Students Enrolled</span>
                    </div>

                    <button
                      onClick={() => handleOpenRoster(offering.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                    >
                      View Student Roster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Roster Modal */}
        {selectedRoster && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md">
                      {selectedRoster.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Section {selectedRoster.sectionNumber}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedRoster.courseTitle}</h3>
                  <p className="text-xs text-slate-500">
                    Total Enrolled: {selectedRoster.totalEnrolled} / {selectedRoster.maxCapacity} students
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoster(null)}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Table Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {selectedRoster.students.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No students have enrolled in this section yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Student ID</th>
                        <th className="pb-3 font-semibold">Name</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Enrolled On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedRoster.students.map((student) => (
                        <tr key={student.enrollmentId} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-mono font-bold text-indigo-600">{student.studentIdNumber}</td>
                          <td className="py-3 font-semibold text-slate-900">{student.name}</td>
                          <td className="py-3 text-slate-500">{student.email}</td>
                          <td className="py-3 text-slate-400">
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedRoster(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
