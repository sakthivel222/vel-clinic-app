import { useState, useEffect } from 'react';
import { Search, Plus, PlayCircle, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';

export default function Exercises() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApi('/exercises').then(setExercises).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 md:pl-64">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Exercise Library</h1>
          <p className="text-slate-500 text-sm">Manage exercises and templates for patients.</p>
        </div>
        <Link to="/exercises/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2 font-medium transition-colors w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Add Exercise
        </Link>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search exercises..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500">No exercises found in the library.</div>
        ) : exercises.map((ex) => (
          <div key={ex.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-100 flex items-center justify-center relative">
               {ex.imageUrl ? (
                 <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
               ) : (
                 <Dumbbell className="w-10 h-10 text-slate-300" />
               )}
               {ex.videoUrl && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                   <PlayCircle className="w-10 h-10 text-white opacity-80" />
                 </div>
               )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{ex.name}</h3>
                <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{ex.targetBodyPart}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{ex.description}</p>
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                 <span>{ex.defaultSets} Sets</span>
                 <span>{ex.defaultReps} Reps</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
