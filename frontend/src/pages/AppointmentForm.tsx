import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { fetchApi } from '../api';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: '60',
    type: 'CLINIC',
    notes: '',
  });

  useEffect(() => {
    fetchApi('/patients').then(setPatients).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calculate endTime based on duration (simple mock logic for now)
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const endMins = minutes + parseInt(formData.duration);
      const endHours = hours + Math.floor(endMins / 60);
      const endTime = `${endHours.toString().padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;

      await fetchApi('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: formData.patientId,
          date: new Date(formData.date).toISOString(),
          startTime: formData.startTime,
          endTime,
          type: formData.type,
          notes: formData.notes
        })
      });
      navigate('/calendar');
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:pl-64 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Book Appointment</h1>
          <p className="text-slate-500 text-sm">Schedule a new visit.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Patient *</label>
            <select required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
              <option value="" disabled>Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Date *</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input required type="date" className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Time *</label>
              <div className="relative">
                <Clock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input required type="time" className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Duration</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Visit Type</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="CLINIC">Clinic Visit</option>
                <option value="HOME_VISIT">Home Visit</option>
                <option value="ONLINE">Online Consultation</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
            <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Any specific requests or context..."
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
           <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">
             Cancel
           </button>
           <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> Book Slot
           </button>
        </div>
      </form>
    </div>
  );
}
