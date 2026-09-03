import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/appointments').then(setAppointments).catch(console.error);
  }, []);

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  return (
    <div className="space-y-6 md:pl-64 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
          <p className="text-slate-500 text-sm">Manage your clinic and home visits.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/calendar/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2 font-medium transition-colors w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Book Slot
          </Link>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
        <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="text-center">
          <div className="font-bold text-lg text-slate-800">{format(selectedDate, 'EEEE')}</div>
          <div className="text-sm text-slate-500">{format(selectedDate, 'MMMM d, yyyy')}</div>
        </div>
        <button onClick={handleNextDay} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex-1">
        <div className="divide-y">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No appointments scheduled for this day.</div>
          ) : appointments.map((apt) => (
            <div key={apt.id} className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-24 shrink-0 flex items-center sm:items-start gap-2 sm:gap-1">
                <Clock className="w-4 h-4 text-slate-400 sm:hidden" />
                <div className="font-bold text-slate-800">{apt.startTime}</div>
              </div>
              
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{apt.patient?.fullName || 'Unknown'}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-600">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      apt.type === 'HOME_VISIT' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.type}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.duration}</span>
                    {apt.location && (
                      <span className="flex items-center gap-1 text-indigo-600"><MapPin className="w-3 h-3" /> {apt.location}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {apt.status === 'COMPLETED' ? (
                     <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-md">Completed</span>
                  ) : apt.status === 'IN_PROGRESS' ? (
                     <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-md">In Progress</span>
                  ) : (
                     <Link to={`/sessions/new?appointmentId=${apt.id}`} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm rounded-md transition-colors text-center flex-1 sm:flex-none">
                       Start Session
                     </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
