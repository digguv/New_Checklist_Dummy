import React, { useState } from 'react';
import { Briefcase, Plus, Search, Filter, Phone, Mail, UserCheck } from 'lucide-react';

export function SalesLeadsPage() {
  const [search, setSearch] = useState('');
  
  const leads = [
    { id: 'LD-101', name: 'Aarav Sharma', company: 'TechSolutions India', phone: '+91 98201 44102', email: 'aarav@techsolutions.in', stage: 'Qualified', value: '₹ 4,50,000' },
    { id: 'LD-102', name: 'Priya Verma', company: 'Apex Global Logistics', phone: '+91 97110 33819', email: 'p.verma@apexglobal.com', stage: 'Negotiation', value: '₹ 8,20,000' },
    { id: 'LD-103', name: 'Vikram Patel', company: 'Surat Textiles Hub', phone: '+91 98980 12345', email: 'vikram@surattextiles.com', stage: 'New Lead', value: '₹ 2,10,000' },
    { id: 'LD-104', name: 'Sneha Kulkarni', company: 'Pune Pharma Labs', phone: '+91 94220 99812', email: 'sneha@punepharma.org', stage: 'Proposal Sent', value: '₹ 12,00,000' },
  ];

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-500" />
            <span>Sales Leads Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track and manage prospect leads, inquiries and sales opportunities.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>All Stages</span>
          </button>
        </div>
      </div>

      {/* Leads Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded uppercase">
                  {lead.id}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">{lead.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{lead.company}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {lead.stage}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1 text-slate-500">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lead.email}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Deal Value</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{lead.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
