import { useState, useEffect } from 'react';
import { IndianRupee, FileText, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/payments').then(setPayments).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payments & Billing</h1>
          <p className="text-slate-500 text-sm">Manage transactions and generated invoices.</p>
        </div>
        <Link to="/payments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2 font-medium transition-colors w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Record Payment
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Today's Revenue</div>
          <div className="text-2xl font-bold text-slate-800">₹5,000</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-slate-500 mb-1">This Week</div>
          <div className="text-2xl font-bold text-slate-800">₹12,400</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-amber-600 mb-1 font-medium">Pending Dues</div>
          <div className="text-2xl font-bold text-amber-700">₹2,500</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-indigo-600 mb-1 font-medium">Active Packages</div>
          <div className="text-2xl font-bold text-indigo-700">8</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search payments by patient name..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No recent transactions.</div>
          ) : payments.map((payment) => (
            <div key={payment.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{payment.patient?.fullName || 'Unknown'}</h3>
                  <div className="text-sm text-slate-500 flex gap-2">
                    <span>{new Date(payment.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{payment.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
                <div className="text-right">
                  <div className="font-bold text-lg text-slate-800">₹{payment.amount}</div>
                  <div className="text-sm font-medium text-slate-500">{payment.method}</div>
                </div>
                <button onClick={() => alert('Invoice PDF generation would open here!')} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                  <FileText className="w-4 h-4" /> Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
