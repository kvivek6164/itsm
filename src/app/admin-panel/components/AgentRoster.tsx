'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

type AgentStatus = 'Active' | 'Away' | 'Offline' | 'On Leave';
type AgentRole = 'L1 Support' | 'L2 Support' | 'L3 Engineer' | 'IT Manager' | 'Security Analyst';

interface Agent {
  id: string;
  name: string;
  email: string;
  role: AgentRole;
  department: string;
  status: AgentStatus;
  activeTickets: number;
  resolvedThisMonth: number;
  avgResolutionHrs: number;
  slaCompliance: number;
  skills: string[];
  joined: string;
}

const agents: Agent[] = [
  { id: 'AGT-001', name: 'Marcus Reynolds', email: 'marcus.reynolds@itservicedesk.io', role: 'IT Manager', department: 'IT Infrastructure', status: 'Active', activeTickets: 9, resolvedThisMonth: 34, avgResolutionHrs: 1.8, slaCompliance: 97, skills: ['Network', 'Security', 'Cloud'], joined: '01/15/22' },
  { id: 'AGT-002', name: 'James Okafor', email: 'j.okafor@itservicedesk.io', role: 'L2 Support', department: 'IT Infrastructure', status: 'Active', activeTickets: 14, resolvedThisMonth: 61, avgResolutionHrs: 2.3, slaCompliance: 94, skills: ['Network', 'Identity & Access', 'Hardware'], joined: '03/10/23' },
  { id: 'AGT-003', name: 'Sarah Chen', email: 's.chen@itservicedesk.io', role: 'L3 Engineer', department: 'IT Infrastructure', status: 'Active', activeTickets: 18, resolvedThisMonth: 48, avgResolutionHrs: 3.1, slaCompliance: 91, skills: ['Database', 'Cloud', 'Security', 'Network'], joined: '06/22/21' },
  { id: 'AGT-004', name: 'Priya Nair', email: 'p.nair@itservicedesk.io', role: 'L2 Support', department: 'Service Desk', status: 'Active', activeTickets: 12, resolvedThisMonth: 72, avgResolutionHrs: 1.6, slaCompliance: 96, skills: ['Software', 'Identity & Access', 'Email'], joined: '09/05/22' },
  { id: 'AGT-005', name: 'David Thornton', email: 'd.thornton@itservicedesk.io', role: 'L1 Support', department: 'Service Desk', status: 'Active', activeTickets: 20, resolvedThisMonth: 89, avgResolutionHrs: 1.2, slaCompliance: 88, skills: ['Hardware', 'Software', 'Printing'], joined: '11/14/23' },
  { id: 'AGT-006', name: 'Amara Diallo', email: 'a.diallo@itservicedesk.io', role: 'L1 Support', department: 'Service Desk', status: 'Away', activeTickets: 7, resolvedThisMonth: 55, avgResolutionHrs: 1.4, slaCompliance: 95, skills: ['Software', 'Hardware', 'Email'], joined: '02/28/24' },
  { id: 'AGT-007', name: 'Kevin Park', email: 'k.park@itservicedesk.io', role: 'Security Analyst', department: 'IT Security', status: 'Active', activeTickets: 5, resolvedThisMonth: 18, avgResolutionHrs: 4.2, slaCompliance: 99, skills: ['Security', 'Identity & Access', 'Cloud'], joined: '07/01/22' },
  { id: 'AGT-008', name: 'Laura Whitmore', email: 'l.whitmore@itservicedesk.io', role: 'L2 Support', department: 'Service Desk', status: 'On Leave', activeTickets: 0, resolvedThisMonth: 28, avgResolutionHrs: 2.1, slaCompliance: 93, skills: ['Network', 'Hardware', 'Software'], joined: '05/17/23' },
];

const statusColors: Record<AgentStatus, string> = {
  Active: 'bg-green-400',
  Away: 'bg-amber-400',
  Offline: 'bg-slate-300',
  'On Leave': 'bg-blue-300',
};

const statusBadge: Record<AgentStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  Away: 'bg-amber-100 text-amber-700',
  Offline: 'bg-slate-100 text-slate-500',
  'On Leave': 'bg-blue-100 text-blue-700',
};

export default function AgentRoster() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const filtered = agents.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    const matchRole = filterRole === 'All' || a.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Agent Roster</h2>
          <p className="text-sm text-slate-500 mt-0.5">{agents.filter(a => a.status === 'Active').length} active · {agents.length} total</p>
        </div>
        <button
          onClick={() => toast.info('Invite agent — coming soon')}
          className="btn-primary text-sm"
        >
          <Icon name="UserPlusIcon" size={15} />
          Invite Agent
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-1.5 text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="input-field py-1.5 text-sm w-auto min-w-[150px]"
        >
          <option value="All">All Roles</option>
          {['L1 Support','L2 Support','L3 Engineer','IT Manager','Security Analyst'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="table-header-cell">Agent</th>
              <th className="table-header-cell">Role</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Active Tickets</th>
              <th className="table-header-cell">Resolved / Mo</th>
              <th className="table-header-cell">Avg. Resolution</th>
              <th className="table-header-cell">SLA Compliance</th>
              <th className="table-header-cell">Skills</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => (
              <tr key={agent.id} className="table-row group">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColors[agent.status]}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="text-xs text-slate-600">{agent.role}</span>
                </td>
                <td className="table-cell">
                  <span className={`badge ${statusBadge[agent.status]}`}>{agent.status}</span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold tabular-nums ${agent.activeTickets >= 18 ? 'text-red-600' : agent.activeTickets >= 14 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {agent.activeTickets}
                    </span>
                    <div className="w-16 bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${agent.activeTickets >= 18 ? 'bg-red-500' : agent.activeTickets >= 14 ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${(agent.activeTickets / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="text-sm font-semibold text-slate-800 tabular-nums">{agent.resolvedThisMonth}</span>
                </td>
                <td className="table-cell">
                  <span className="text-sm text-slate-700 tabular-nums">{agent.avgResolutionHrs}h</span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold tabular-nums ${agent.slaCompliance >= 95 ? 'text-green-600' : agent.slaCompliance >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                      {agent.slaCompliance}%
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex flex-wrap gap-1">
                    {agent.skills.slice(0, 2).map(s => (
                      <span key={s} className="badge bg-slate-100 text-slate-600 text-[10px]">{s}</span>
                    ))}
                    {agent.skills.length > 2 && (
                      <span className="badge bg-slate-100 text-slate-400 text-[10px]">+{agent.skills.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                      <Icon name="PencilIcon" size={13} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => toast.info(`Viewing profile: ${agent.name}`)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Icon name="EyeIcon" size={13} className="text-slate-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}