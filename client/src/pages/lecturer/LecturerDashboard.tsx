import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, Users, CheckCircle, ShieldCheck, ClipboardList, Clock } from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
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
            <p className="text-xs text-slate-500">{user?.email}</p>
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-lg shadow-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
              <span>Role: LECTURER • Authenticated</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome, {user?.firstName} {user?.lastName}!
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Faculty Title: <span className="font-semibold text-white">{user?.lecturerProfile?.academicTitle || 'Associate Professor'}</span> • Staff ID: <span className="font-semibold text-white">{user?.lecturerProfile?.employeeIdNumber || 'LEC-2026-001'}</span>
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-indigo-100 uppercase tracking-wider font-medium">Department</p>
            <p className="text-lg font-bold text-white mt-0.5">Computer Science</p>
          </div>
        </div>

        {/* Milestone 1 Verification Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-emerald-900 text-base">Milestone 1 Verification: Lecturer Role Guard Passed!</h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              You are logged in with the faculty role <span className="font-semibold">LECTURER</span>. 
              The system grants you permissions to conduct attendance, create assignments, and grade submissions.
            </p>
          </div>
        </div>

        {/* Upcoming Features Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">My Assigned Courses</h4>
            <p className="text-xs text-slate-500">Manage enrolled student rosters and syllabus outlines in Milestone 2.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Attendance Session Launcher</h4>
            <p className="text-xs text-slate-500">Launch rapid-marking attendance sheets with 4-status tracking in Milestone 4.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Assignment Grader</h4>
            <p className="text-xs text-slate-500">Review student PDF/DOCX submissions and provide written feedback in Milestone 5.</p>
          </div>
        </div>

      </main>
    </div>
  );
};
