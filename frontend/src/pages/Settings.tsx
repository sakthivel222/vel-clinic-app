import { useState } from 'react';
import { Bell, Shield, Building, Users } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('clinic');

  const tabs = [
    { id: 'clinic', label: 'Clinic Details', icon: <Building className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff Management', icon: <Users className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 md:pl-64">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your clinic preferences and team.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border p-6 min-h-[400px]">
          {activeTab === 'clinic' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Clinic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Clinic Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" defaultValue="Vel Clinic" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Registration Number</label>
                  <input type="text" className="w-full p-2 border rounded-md" defaultValue="REG-982341" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <textarea rows={2} className="w-full p-2 border rounded-md" defaultValue="123 Health Ave, Mumbai" />
                </div>
              </div>
              <button onClick={() => alert('Clinic details saved successfully!')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Save Changes</button>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800">Staff Members</h2>
                <button onClick={() => alert('Invite link sent to new staff member!')} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md font-medium">Add Staff</button>
              </div>
              <div className="divide-y border rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">DK</div>
                    <div>
                      <div className="font-semibold text-slate-800">Dr Kavitha</div>
                      <div className="text-xs text-slate-500">Admin • Chief Physiotherapist</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-800">WhatsApp Reminders</div>
                    <div className="text-xs text-slate-500">Send automated session reminders to patients.</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                </label>
                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-800">Daily Digest Email</div>
                    <div className="text-xs text-slate-500">Receive an email every morning with today's schedule.</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Security</h2>
              <div className="space-y-4">
                <button onClick={() => alert('A password reset link has been sent to your email.')} className="text-blue-600 font-medium hover:underline">Change Password</button>
                <button onClick={() => alert('Redirecting to 2FA Setup...')!} className="block text-red-600 font-medium hover:underline">Enable Two-Factor Authentication</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
