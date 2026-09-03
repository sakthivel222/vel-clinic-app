import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, IndianRupee } from 'lucide-react';
import { fetchApi } from '../api';

export default function PaymentForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    type: 'SINGLE_SESSION',
    amount: '',
    method: 'UPI',
    status: 'PAID',
    notes: '',
    packageSessions: 10,
  });

  useEffect(() => {
    fetchApi('/patients').then(setPatients).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/payments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: formData.patientId,
          amount: parseFloat(formData.amount),
          type: formData.type,
          method: formData.method,
          status: formData.status,
          notes: formData.notes
        })
      });
      navigate('/payments');
    } catch (err) {
      alert('Failed to save payment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:pl-64 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Record Payment</h1>
          <p className="text-slate-500 text-sm">Create a new invoice or record a payment.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Patient *</label>
            <select required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
              <option value="" disabled>Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Payment Type</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="SINGLE_SESSION">Single Session</option>
                <option value="PACKAGE">Package</option>
                <option value="HOME_VISIT">Home Visit</option>
                <option value="CONSULTATION">Consultation</option>
              </select>
            </div>
            
            {formData.type === 'PACKAGE' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Number of Sessions</label>
                <input type="number" min="1" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.packageSessions} onChange={e => setFormData({...formData, packageSessions: parseInt(e.target.value)})} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Amount *</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input required type="number" min="0" className="w-full pl-10 pr-4 p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg" 
                placeholder="0.00"
                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Payment Method</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="UPI">UPI / GPay</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending (Due)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
            <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="Any additional details..."
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
           <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">
             Cancel
           </button>
           <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {formData.status === 'PAID' ? 'Save & Generate Invoice' : 'Save Record'}
           </button>
        </div>
      </form>
    </div>
  );
}
