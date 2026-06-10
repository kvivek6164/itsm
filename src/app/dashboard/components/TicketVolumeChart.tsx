'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Mar 2', created: 18, resolved: 14, breached: 1 },
  { date: 'Mar 3', created: 24, resolved: 21, breached: 2 },
  { date: 'Mar 4', created: 16, resolved: 18, breached: 0 },
  { date: 'Mar 5', created: 29, resolved: 22, breached: 3 },
  { date: 'Mar 6', created: 31, resolved: 28, breached: 2 },
  { date: 'Mar 7', created: 12, resolved: 15, breached: 1 },
  { date: 'Mar 8', created: 9, resolved: 11, breached: 0 },
  { date: 'Mar 9', created: 22, resolved: 19, breached: 1 },
  { date: 'Mar 10', created: 27, resolved: 24, breached: 2 },
  { date: 'Mar 11', created: 33, resolved: 29, breached: 4 },
  { date: 'Mar 12', created: 28, resolved: 31, breached: 1 },
  { date: 'Mar 13', created: 21, resolved: 25, breached: 0 },
  { date: 'Mar 14', created: 19, resolved: 22, breached: 1 },
  { date: 'Mar 15', created: 26, resolved: 20, breached: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-modal p-3 text-xs">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-slate-600 capitalize">{p.name}</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TicketVolumeChart() {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Ticket Volume — 14 Days</h3>
          <p className="text-xs text-slate-500 mt-0.5">Created vs resolved vs SLA breaches</p>
        </div>
        <div className="flex gap-1">
          {['14d', '30d', '90d'].map((r, i) => (
            <button
              key={r}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                i === 0 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBreached" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          <Area type="monotone" dataKey="created" name="Created" stroke="#3b82f6" strokeWidth={2} fill="url(#gradCreated)" dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} fill="url(#gradResolved)" dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="breached" name="SLA Breached" stroke="#ef4444" strokeWidth={1.5} fill="url(#gradBreached)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}