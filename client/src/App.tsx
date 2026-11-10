import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Server, Layout, CheckCircle2, ShieldCheck, BookOpen, Clock, Users } from 'lucide-react';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  uptime: number;
}

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check backend health status
    axios.get<HealthResponse>('/api/v1/health')
      .then((res) => {
        setHealth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to connect to backend:', err);
        setError('Backend is offline or starting up...');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Milestone 0 Complete
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Smart Campus Management System
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Full-stack university management platform built with React, TypeScript, Tailwind CSS, Express, Prisma, and Dockerized PostgreSQL.
          </p>
        </div>

        {/* System Architecture Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Frontend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layout className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-lg">Frontend UI</h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
            </div>
            <p className="text-sm text-slate-500 mb-3">React 18 + Vite + Tailwind</p>
            <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
              Operational (Port 5173)
            </div>
          </div>

          {/* Card 2: Backend API */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-lg">Backend API</h3>
              {loading ? (
                <span className="text-xs text-slate-400 ml-auto">Checking...</span>
              ) : health ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
              ) : (
                <span className="text-xs text-amber-500 ml-auto">Offline</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-3">Node.js + Express + TypeScript</p>
            <div className={`text-xs font-medium px-2.5 py-1 rounded-lg inline-block ${
              health ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
            }`}>
              {health ? 'Connected (Port 5000)' : error || 'Start server to connect'}
            </div>
          </div>

          {/* Card 3: Database */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Database className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-lg">PostgreSQL DB</h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
            </div>
            <p className="text-sm text-slate-500 mb-3">Docker Container + Prisma ORM</p>
            <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
              17 Tables Migrated (Port 55432)
            </div>
          </div>

        </div>

        {/* Ready for Next Milestone Box */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Next: Milestone 1 — Authentication & Role-Based Access Control</h2>
              <p className="text-sm text-slate-500">We will implement JWT login, password hashing, and user roles (Student, Lecturer, Admin).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Role 1</p>
                <p className="text-sm font-semibold text-slate-800">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Role 2</p>
                <p className="text-sm font-semibold text-slate-800">Lecturer Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Role 3</p>
                <p className="text-sm font-semibold text-slate-800">Admin Control Center</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
