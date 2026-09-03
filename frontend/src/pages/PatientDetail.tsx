import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, FileText, Calendar as CalendarIcon, Clock, Paperclip, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchApi } from '../api';

export default function PatientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    fetchApi(`/patients/${id}`).then(setPatient).catch(console.error);
  }, [id]);

  if (!patient) return <div className="p-10 text-center text-slate-500 flex flex-col items-center gap-4"><Activity className="w-8 h-8 animate-spin" /> Loading Patient...</div>;

  // Build timeline from relations
  const timeline: any[] = [];
  if (patient.sessions) {
    patient.sessions.forEach((s: any) => timeline.push({ type: 'session', date: new Date(s.date), title: 'Treatment Session', desc: s.plan || 'Session recorded' }));
  }
  if (patient.payments) {
    patient.payments.forEach((p: any) => timeline.push({ type: 'payment', date: new Date(p.date), title: 'Payment', desc: `₹${p.amount} (${p.method})` }));
  }
  if (patient.appointments) {
    patient.appointments.forEach((a: any) => timeline.push({ type: 'session', date: new Date(a.date), title: 'Appointment', desc: a.type }));
  }
  // Sort timeline by date desc
  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  const painData = [
    { session: 'S1', before: 8, after: 6 },
    { session: 'S2', before: 7, after: 4 },
    { session: 'S3', before: 5, after: 2 },
  ];

  return (
    <div className="space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">{patient.fullName}</h1>
        </div>
        <button className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md font-medium transition-colors">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{patient.status}</span>
              <span className="text-sm text-slate-500">ID: PT-100{patient.id.substring(0,4)}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-800">{patient.phone || '-'}</span></div>
              <div><span className="text-slate-500">Age/Gender:</span> <span className="font-medium text-slate-800">{patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'}, {patient.gender || '-'}</span></div>
              <div className="pt-3 border-t">
                <span className="text-slate-500 block mb-1">Diagnosis:</span> 
                <span className="font-semibold text-slate-800">{patient.diagnosis || 'None recorded'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Chief Complaint:</span> 
                <span className="text-slate-700">{patient.chiefComplaint}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/sessions/new" className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-slate-800">New Treatment Note</div>
                  <div className="text-xs text-slate-500">Record today's session</div>
                </div>
              </Link>
              <Link to="/calendar/new" className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                <div>
                  <div className="font-medium text-slate-800">Book Appointment</div>
                  <div className="text-xs text-slate-500">Schedule next visit</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Pain Progress</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painData}>
                  <XAxis dataKey="session" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 10]} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="before" stroke="#f43f5e" name="Before" strokeWidth={2} />
                  <Line type="monotone" dataKey="after" stroke="#10b981" name="After" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Patient Timeline</h2>
            </div>
            <div className="p-5">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {item.type === 'session' && <Clock className="w-4 h-4 text-blue-500" />}
                      {item.type === 'payment' && <span className="font-bold text-emerald-500 text-sm">₹</span>}
                      {item.type === 'document' && <Paperclip className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <time className="text-xs font-medium text-slate-500">{item.date instanceof Date ? item.date.toLocaleDateString() : item.date}</time>
                      </div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
