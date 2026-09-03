import { useState, useEffect } from 'react';
import { Users, Calendar as CalendarIcon, Clock, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ appointmentsToday: 0, activePatients: 0, pendingRevenue: 0 });

  useEffect(() => {
    fetchApi('/dashboard').then(setStats).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 md:pl-64">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good Morning, Dr Kavitha!</h1>
          <p className="text-slate-500 text-sm">Here is your schedule for today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-slate-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            DK
          </div>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Overview of today's activities.</p>
      </div>

      {/* Quick Actions (Large Buttons for Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/patients/new" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors">
          <Plus className="w-6 h-6" />
          <span className="font-medium text-sm">New Patient</span>
        </Link>
        <Link to="/calendar/new" className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-100 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors">
          <CalendarIcon className="w-6 h-6" />
          <span className="font-medium text-sm">Book Session</span>
        </Link>
        <Link to="/payments/new" className="bg-white hover:bg-slate-50 text-emerald-600 border border-emerald-100 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors">
          <span className="text-2xl font-bold leading-none">₹</span>
          <span className="font-medium text-sm">Record Payment</span>
        </Link>
        <Link to="/calendar?filter=home" className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-100 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors">
          <Clock className="w-6 h-6" />
          <span className="font-medium text-sm">Home Visit</span>
        </Link>
      </div>

      {/* Today's Overview */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Appointments" value={stats.appointmentsToday.toString()} icon={<CalendarIcon className="w-5 h-5 text-blue-500" />} />
          <StatCard label="Active Patients" value={stats.activePatients.toString()} icon={<Users className="w-5 h-5 text-indigo-500" />} />
          <StatCard label="Completed" value="0" icon={<Clock className="w-5 h-5 text-emerald-500" />} />
          <StatCard label="Pending Revenue" value={`₹${stats.pendingRevenue}`} icon={<AlertCircle className="w-5 h-5 text-amber-500" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Upcoming Sessions</h2>
            <Link to="/calendar" className="text-sm text-blue-600 font-medium">View All</Link>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex gap-4 items-center">
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold text-slate-800">10:30</div>
                    <div className="text-xs text-slate-500 uppercase">AM</div>
                  </div>
                  <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Rahul Sharma</h3>
                    <p className="text-sm text-slate-500">Knee Rehab • Clinic Visit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Pending Tasks</h2>
            <button className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> New</button>
          </div>
          <div className="divide-y">
            <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
               <input type="checkbox" className="mt-1 w-4 h-4 accent-blue-600" />
               <div>
                  <h3 className="font-medium text-slate-800">Follow up on exercises</h3>
                  <p className="text-sm text-slate-500">Call Priya Patel to check if pain persists during Heel Slides.</p>
                  <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-700 rounded text-red">High Priority</span>
               </div>
            </div>
            <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
               <input type="checkbox" className="mt-1 w-4 h-4 accent-blue-600" />
               <div>
                  <h3 className="font-medium text-slate-800">Send Invoice</h3>
                  <p className="text-sm text-slate-500">Generate and WhatsApp invoice for Amit Kumar's 10 session package.</p>
                  <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded">Medium Priority</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
