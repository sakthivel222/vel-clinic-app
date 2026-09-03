import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';

const COMMON_TREATMENTS = [
  'Manual therapy', 'Exercise therapy', 'Electrotherapy', 'Ultrasound',
  'TENS', 'IFT', 'Dry needling', 'Heat/cold therapy',
  'Stretching', 'Strengthening', 'Mobility training'
];

export default function SessionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    painBefore: 5,
    painAfter: 2,
    treatments: [] as string[],
  });

  const toggleTreatment = (t: string) => {
    setFormData(prev => ({
      ...prev,
      treatments: prev.treatments.includes(t)
        ? prev.treatments.filter(x => x !== t)
        : [...prev.treatments, t]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/calendar');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:pl-64 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Treatment Session</h1>
          <p className="text-slate-500 text-sm">Rahul Sharma • Clinic Visit • Today</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pain Scale */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Pain Tracking (0-10)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>Pain Before Session</span>
                <span className="font-bold text-rose-500">{formData.painBefore}</span>
              </label>
              <input type="range" min="0" max="10" className="w-full accent-rose-500" 
                value={formData.painBefore} onChange={e => setFormData({...formData, painBefore: parseInt(e.target.value)})} />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0 (No Pain)</span><span>10 (Severe)</span></div>
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>Pain After Session</span>
                <span className="font-bold text-emerald-500">{formData.painAfter}</span>
              </label>
              <input type="range" min="0" max="10" className="w-full accent-emerald-500" 
                value={formData.painAfter} onChange={e => setFormData({...formData, painAfter: parseInt(e.target.value)})} />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0 (No Pain)</span><span>10 (Severe)</span></div>
            </div>
          </div>
        </div>

        {/* Quick Treatments */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Treatments Provided</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_TREATMENTS.map(t => {
              const isSelected = formData.treatments.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTreatment(t)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-1 transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* SOAP Notes */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">SOAP Notes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subjective (S)</label>
                <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" 
                  placeholder="Patient complaints, pain level, changes since last visit..."
                  value={formData.subjective} onChange={e => setFormData({...formData, subjective: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Objective (O)</label>
                <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" 
                  placeholder="ROM, strength, swelling, observations..."
                  value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assessment (A)</label>
                <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" 
                  placeholder="Clinical assessment, progress..."
                  value={formData.assessment} onChange={e => setFormData({...formData, assessment: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan (P)</label>
                <textarea rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" 
                  placeholder="Exercises prescribed, home program, next session plan..."
                  value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
             <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
               <Save className="w-4 h-4" /> Complete Session
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
