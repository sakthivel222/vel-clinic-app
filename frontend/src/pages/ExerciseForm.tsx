import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchApi } from '../api';

export default function ExerciseForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    targetBodyPart: 'Knee',
    description: '',
    defaultSets: 3,
    defaultReps: 10,
    imageUrl: '',
    videoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/exercises', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      navigate('/exercises');
    } catch (err) {
      alert('Failed to save exercise');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:pl-64 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Exercise</h1>
          <p className="text-slate-500 text-sm">Add a new exercise to the library.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Exercise Name *</label>
            <input required type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Target Body Part</label>
            <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.targetBodyPart} onChange={e => setFormData({...formData, targetBodyPart: e.target.value})}>
              <option value="Knee">Knee</option>
              <option value="Shoulder">Shoulder</option>
              <option value="Back">Back</option>
              <option value="Neck">Neck</option>
              <option value="Hip">Hip</option>
              <option value="Ankle">Ankle</option>
              <option value="Core">Core</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Description / Instructions</label>
            <textarea rows={3} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Default Sets</label>
              <input type="number" min="1" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.defaultSets} onChange={e => setFormData({...formData, defaultSets: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Default Reps</label>
              <input type="number" min="1" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.defaultReps} onChange={e => setFormData({...formData, defaultReps: parseInt(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
           <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-md transition-colors">
             Cancel
           </button>
           <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> Save Exercise
           </button>
        </div>
      </form>
    </div>
  );
}
