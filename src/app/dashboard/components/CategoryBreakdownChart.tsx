'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

const data = [
  { category: 'Network', open: 18, resolved: 34 },
  { category: 'Hardware', open: 12, resolved: 28 },
  { category: 'Software', open: 22, resolved: 41 },
  { category: 'Identity', open: 9, resolved: 15 },
  { category: 'Email', open: 7, resolved: 19 },
  { category: 'Security', open: 11, resolved: 8 },
  { category: 'Database', open: 6, resolved: 12 },
  { category: 'Printing', open: 4, resolved: 22 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-modal p-3 text-xs">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.fill }} />
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

export default function CategoryBreakdownChart() {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Tickets by Category</h3>
          <p className="text-xs text-slate-500 mt-0.5">Open vs resolved — current month</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm bg-blue-500 inline-block" />Open</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm bg-slate-300 inline-block" />Resolved</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={10} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="open" name="Open" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="resolved" name="Resolved" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}