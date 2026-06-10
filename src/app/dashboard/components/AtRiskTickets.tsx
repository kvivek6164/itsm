'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const atRiskTickets = [
  {
    id: 'TKT-1042',
    title: 'VPN connectivity failure — entire Engineering floor',
    priority: 'P1',
    assignee: 'Unassigned',
    slaRemaining: 'BREACHED',
    slaStatus: 'breached',
    category: 'Network',
    openFor: '5h 12m',
  },
  {
    id: 'TKT-1039',
    title: 'Active Directory sync failure — 12 users locked out',
    priority: 'P1',
    assignee: 'James Okafor',
    slaRemaining: 'BREACHED',
    slaStatus: 'breached',
    category: 'Identity & Access',
    openFor: '3h 47m',
  },
  {
    id: 'TKT-1045',
    title: 'Production database backup job failing nightly',
    priority: 'P2',
    assignee: 'Sarah Chen',
    slaRemaining: '1h 22m',
    slaStatus: 'warning',
    category: 'Database',
    openFor: '2h 30m',
  },
  {
    id: 'TKT-1047',
    title: 'Email gateway rejecting external messages — SMTP config',
    priority: 'P2',
    assignee: 'Priya Nair',
    slaRemaining: '2h 08m',
    slaStatus: 'warning',
    category: 'Email / Messaging',
    openFor: '1h 55m',
  },
  {
    id: 'TKT-1051',
    title: 'SSL certificate expiry on customer portal — 2 days',
    priority: 'P2',
    assignee: 'Marcus Reynolds',
    slaRemaining: '4h 15m',
    slaStatus: 'ok',
    category: 'Security',
    openFor: '45m',
  },
];

const priorityColors: Record<string, string> = {
  P1: 'badge-p1',
  P2: 'badge-p2',
  P3: 'badge-p3',
  P4: 'badge-p4',
};

const slaColors: Record<string, string> = {
  breached: 'text-red-600 bg-red-50 border border-red-200',
  warning: 'text-amber-600 bg-amber-50 border border-amber-200',
  ok: 'text-green-600 bg-green-50 border border-green-200',
};

export default function AtRiskTickets() {
  const router = useRouter();

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">At-Risk Tickets</h3>
          <p className="text-xs text-slate-500 mt-0.5">SLA breaches and near-breach — requires immediate action</p>
        </div>
        <button
          onClick={() => router.push('/ticket-management')}
          className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
        >
          View all <Icon name="ArrowRightIcon" size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {atRiskTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all duration-150 ${
              ticket.slaStatus === 'breached' ?'bg-red-50/50 border-red-100 hover:border-red-200'
                : ticket.slaStatus === 'warning' ?'bg-amber-50/30 border-amber-100 hover:border-amber-200' :'bg-white border-slate-100 hover:border-slate-200'
            }`}
            onClick={() => router.push('/ticket-management')}
          >
            <div className="flex-shrink-0">
              {ticket.slaStatus === 'breached' ? (
                <Icon name="AlertTriangleIcon" size={16} className="text-red-500" />
              ) : ticket.slaStatus === 'warning' ? (
                <Icon name="ClockIcon" size={16} className="text-amber-500" />
              ) : (
                <Icon name="CheckCircleIcon" size={16} className="text-green-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-slate-500">{ticket.id}</span>
                <span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                <span className="text-xs text-slate-400">{ticket.category}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 truncate">{ticket.title}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Icon name="UserIcon" size={11} />
                  {ticket.assignee}
                </span>
                <span className="text-xs text-slate-400">Open {ticket.openFor}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg tabular-nums ${slaColors[ticket.slaStatus]}`}>
                {ticket.slaRemaining}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}