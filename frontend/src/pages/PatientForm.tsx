import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchApi } from '../api';

export default function PatientForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'MALE',
    dateOfBirth: '',
    chiefComplaint: '',
    diagnosis: '',
    medicalHistory: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
        })
      });
      navigate('/patients');
    } catch (err) {
      alert('Failed to save patient');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:pl-64">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">New Patient</h1>
          <p className="text-slate-500 text-sm">Enter patient details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                <input required type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                <input required type="tel" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1 flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                  <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Chief Complaint</label>
                <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g., Lower back pain radiating to left leg"
                  value={formData.chiefComplaint} onChange={e => setFormData({...formData, chiefComplaint: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Diagnosis (if any)</label>
                <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Medical History & Precautions</label>
                <textarea rows={3} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Past surgeries, allergies, contraindications..."
                  value={formData.medicalHistory} onChange={e => setFormData({...formData, medicalHistory: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Patient
          </button>
        </div>
      </form>
    </div>
  );
}
