import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CourseOffering, EnrolledCourse } from '../../types/course';
import { TimetableSlot } from '../../types/timetable';
import { WeeklyScheduleGrid } from '../../components/timetable/WeeklyScheduleGrid';
import { 
  GraduationCap, LogOut, BookOpen, Search, CheckCircle, 
  ShieldCheck, AlertCircle, PlusCircle, Trash2, Users, Award, BookMarked, Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'my-courses' | 'catalog' | 'timetable'>('my-courses');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollRes, offeringsRes, timetableRes] = await Promise.all([
        api.get<{ success: boolean; data: EnrolledCourse[] }>('/courses/my-enrollments'),
        api.get<{ success: boolean; data: CourseOffering[] }>('/courses/offerings'),
        api.get<{ success: boolean; data: TimetableSlot[] }>('/timetable/my-schedule'),
      ]);

      if (enrollRes.data.success) {
        setEnrolledCourses(enrollRes.data.data);
      }
      if (offeringsRes.data.success) {
        setOfferings(offeringsRes.data.data);
      }
      if (timetableRes.data.success) {
        setTimetableSlots(timetableRes.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (offeringId: string) => {
    try {
      setActionId(offeringId);
      setBannerMessage(null);
      const res = await api.post(`/courses/offerings/${offeringId}/enroll`);
      setBannerMessage({ type: 'success', text: res.data.message || 'Successfully enrolled!' });
      await fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      setBannerMessage({ type: 'error', text: msg });
    } finally {
      setActionId(null);
    }
  };

  const handleDrop = async (offeringId: string, courseCode: string) => {
    if (!window.confirm(`Are you sure you want to drop ${courseCode}?`)) return;

    try {
      setActionId(offeringId);
      setBannerMessage(null);
      const res = await api.post(`/courses/offerings/${offeringId}/drop`);
      setBannerMessage({ type: 'success', text: res.data.message || 'Course dropped successfully.' });
      await fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to drop course';
      setBannerMessage({ type: 'error', text: msg });
    } finally {
      setActionId(null);
    }
  };

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  const filteredOfferings = offerings.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Student Portal</h1>
            <p className="text-xs text-slate-500">Smart Campus Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500">{user?.studentProfile?.studentIdNumber || user?.email}</p>
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
        
        {/* Banner Alert for Actions */}
        {bannerMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-sm transition animate-fade-in ${
              bannerMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {bannerMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span className="font-medium">{bannerMessage.text}</span>
            </div>
            <button
              onClick={() => setBannerMessage(null)}
              className="text-xs font-semibold underline ml-4 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Student Profile Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
              <span>Milestone 3 • Interactive Timetable & Conflict Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Student ID: <span className="font-semibold text-white">{user?.studentProfile?.studentIdNumber || 'IT2026042'}</span> • Department of Computer Science & Software Engineering
            </p>
          </div>

          {/* Quick Academic Stats */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Enrolled Courses</p>
              <p className="text-2xl font-bold text-white mt-0.5">{enrolledCourses.length}</p>
            </div>
            <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Weekly Classes</p>
              <p className="text-2xl font-bold text-white mt-0.5">{timetableSlots.length}</p>
            </div>
            <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center">
              <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Total Credits</p>
              <p className="text-2xl font-bold text-white mt-0.5">{totalCredits}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'my-courses'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>My Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Weekly Timetable ({timetableSlots.length} Classes)</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Catalog</span>
          </button>
        </div>

        {/* Tab 1: My Enrolled Courses */}
        {activeTab === 'my-courses' && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center text-slate-400">Loading your enrolled courses...</div>
            ) : enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">You are not enrolled in any courses yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Browse the course catalog to choose and self-enroll in your subjects for this semester.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.enrollmentId}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg tracking-wider">
                          {course.code}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {course.credits} Credits
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{course.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">INSTRUCTOR</p>
                        <p className="font-semibold text-slate-800">{course.lecturers[0]?.name || 'Faculty Member'}</p>
                      </div>

                      <button
                        onClick={() => handleDrop(course.offeringId, course.code)}
                        disabled={actionId === course.offeringId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-medium text-xs transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Drop</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Weekly Timetable (Milestone 3 Feature!) */}
        {activeTab === 'timetable' && (
          <div className="space-y-4">
            <WeeklyScheduleGrid slots={timetableSlots} loading={timetableLoading} />
          </div>
        )}

        {/* Tab 3: Course Catalog & Enrollment */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by code, title, or department..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOfferings.map((offering) => {
                const percentFilled = Math.round((offering.enrolledCount / offering.maxCapacity) * 100);
                const isFull = offering.availableSeats <= 0;

                return (
                  <div
                    key={offering.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg tracking-wider">
                          {offering.code}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {offering.credits} Academic Credits
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{offering.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{offering.department}</p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{offering.description}</p>
                    </div>

                    {/* Capacity Indicator & Enroll Button */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            Capacity: {offering.enrolledCount} / {offering.maxCapacity} Seats
                          </span>
                          <span className={isFull ? 'text-red-600 font-bold' : 'text-emerald-600'}>
                            {offering.availableSeats} Available
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentFilled >= 90 ? 'bg-red-500' : percentFilled >= 70 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-slate-500">
                          <span className="font-medium text-slate-700">Lecturer: </span>
                          {offering.lecturers[0]?.name || 'Faculty Member'}
                        </div>

                        {offering.isEnrolled ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Enrolled</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEnroll(offering.id)}
                            disabled={isFull || actionId === offering.id}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                              isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20'
                            }`}
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>{actionId === offering.id ? 'Enrolling...' : isFull ? 'Class Full' : 'Enroll Now'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
