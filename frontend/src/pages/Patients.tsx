import { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/patients').then(setPatients).catch(console.error);
  }, []);

  const filteredPatients = patients.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchTerm && !p.fullName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
          <p className="text-slate-500 text-sm">Manage your patient records and history.</p>
        </div>
        <Link to="/patients/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2 font-medium transition-colors w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Add Patient
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or diagnosis..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <select
            className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="DISCHARGED">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Link key={patient.id} to={`/patients/${patient.id}`} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{patient.fullName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {patient.phone}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                patient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                patient.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {patient.status}
              </span>
            </div>
            
            <div className="pt-3 border-t text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Diagnosis:</span>
                <span className="font-medium text-slate-800 text-right">{patient.diagnosis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Visit:</span>
                <span className="text-slate-800">{patient.lastVisit}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
