import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogOut, Users, Building, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Admin Control Center</h1>
            <p className="text-xs text-slate-500">Smart Campus Management System</p>
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
        <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-lg shadow-purple-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
              <span>Role: ADMINISTRATOR • Superuser Permissions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Campus Administration Hub
            </h2>
            <p className="text-purple-200 text-sm max-w-xl">
              Logged in as <span className="font-semibold text-white">{user?.firstName} {user?.lastName}</span> ({user?.email})
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-purple-200 uppercase tracking-wider font-medium">System Security</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">Full Access</p>
          </div>
        </div>

        {/* Milestone 1 Verification Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-emerald-900 text-base">Milestone 1 Verification: Administrator Access Granted!</h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              You are authenticated with full administrative privileges. 
              Only users with <span className="font-semibold">ADMIN</span> role can view this console. Students and Lecturers attempting to load this URL will receive a 403 Forbidden screen.
            </p>
          </div>
        </div>

        {/* Upcoming Features Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">User Management</h4>
            <p className="text-xs text-slate-500">Create, activate, deactivate, and assign roles to campus members in Milestone 2.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Department & Course Catalog</h4>
            <p className="text-xs text-slate-500">Define academic faculties, semesters, and course offerings in Milestone 2.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Room Booking Approvals</h4>
            <p className="text-xs text-slate-500">Review lab and hall reservation requests with clash detection in Milestone 6.</p>
          </div>
        </div>

      </main>
    </div>
  );
};
