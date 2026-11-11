import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (role: 'STUDENT' | 'LECTURER' | 'ADMIN') => {
    setError(null);
    if (role === 'STUDENT') {
      setEmail('student@campus.edu');
      setPassword('Student@123');
    } else if (role === 'LECTURER') {
      setEmail('lecturer@campus.edu');
      setPassword('Lecturer@123');
    } else if (role === 'ADMIN') {
      setEmail('admin@campus.edu');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login({ email, password });
      // Redirect based on role
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'LECTURER') {
        navigate('/lecturer/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to login. Please check credentials.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 text-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart Campus</h1>
          <p className="text-sm text-slate-400">Integrated University Management Portal</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500">Access your academic records, timetable, and campus services</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Campus Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@campus.edu"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Accounts for Evaluators */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Demo Credentials:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('STUDENT')}
                className="py-2 px-2 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('LECTURER')}
                className="py-2 px-2 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4" />
                <span>Lecturer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ADMIN')}
                className="py-2 px-2 text-xs font-medium rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 transition flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-slate-500">
          Smart Campus Management System &copy; 2026. All rights reserved.
        </p>

      </div>
    </div>
  );
};
