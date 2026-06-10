'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,  } from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const statusSummary = [
  { label: 'Open', count: 47, icon: 'CircleIcon', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', trend: '+3 today', trendUp: true },
  { label: 'Pending', count: 23, icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', trend: '-2 today', trendUp: false },
  { label: 'In Progress', count: 31, icon: 'RefreshCwIcon', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', trend: '+5 today', trendUp: true },
  { label: 'Resolved', count: 189, icon: 'CheckCircleIcon', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', trend: '+19 today', trendUp: true },
  { label: 'Closed', count: 412, icon: 'XCircleIcon', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', trend: '+7 today', trendUp: true },
  { label: 'Escalated', count: 8, icon: 'AlertTriangleIcon', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', trend: '+1 today', trendUp: true },
];

const trendData = [
  { date: 'Apr 1', open: 52, pending: 28, inProgress: 34, resolved: 21, closed: 9, escalated: 5 },
  { date: 'Apr 2', open: 49, pending: 25, inProgress: 30, resolved: 24, closed: 11, escalated: 4 },
  { date: 'Apr 3', open: 44, pending: 22, inProgress: 27, resolved: 28, closed: 14, escalated: 6 },
  { date: 'Apr 4', open: 38, pending: 19, inProgress: 25, resolved: 31, closed: 16, escalated: 3 },
  { date: 'Apr 5', open: 41, pending: 21, inProgress: 28, resolved: 26, closed: 12, escalated: 5 },
  { date: 'Apr 6', open: 46, pending: 24, inProgress: 32, resolved: 22, closed: 10, escalated: 7 },
  { date: 'Apr 7', open: 47, pending: 23, inProgress: 31, resolved: 19, closed: 8, escalated: 8 },
];

const pieData = [
  { name: 'Open', value: 47, color: '#3b82f6' },
  { name: 'Pending', value: 23, color: '#f59e0b' },
  { name: 'In Progress', value: 31, color: '#6366f1' },
  { name: 'Resolved', value: 189, color: '#22c55e' },
  { name: 'Closed', value: 412, color: '#94a3b8' },
  { name: 'Escalated', value: 8, color: '#ef4444' },
];

const priorityData = [
  { priority: 'P1 Critical', open: 3, pending: 1, inProgress: 2, resolved: 8, escalated: 2 },
  { priority: 'P2 High', open: 11, pending: 6, inProgress: 9, resolved: 34, escalated: 4 },
  { priority: 'P3 Medium', open: 22, pending: 10, inProgress: 14, resolved: 87, escalated: 2 },
  { priority: 'P4 Low', open: 11, pending: 6, inProgress: 6, resolved: 60, escalated: 0 },
];

const categoryData = [
  { category: 'Network', open: 14, pending: 6, resolved: 38 },
  { category: 'Software', open: 18, pending: 8, resolved: 45 },
  { category: 'Hardware', open: 9, pending: 4, resolved: 29 },
  { category: 'Identity', open: 6, pending: 2, resolved: 17 },
  { category: 'Security', open: 8, pending: 3, resolved: 12 },
  { category: 'Email', open: 5, pending: 2, resolved: 21 },
  { category: 'Database', open: 4, pending: 1, resolved: 14 },
];

const resolutionTimeData = [
  { name: 'P1 Critical', value: 1.1, fill: '#ef4444' },
  { name: 'P2 High', value: 3.4, fill: '#f97316' },
  { name: 'P3 Medium', value: 8.2, fill: '#f59e0b' },
  { name: 'P4 Low', value: 18.6, fill: '#94a3b8' },
];

const agingData = [
  { range: '< 1 day', count: 28 },
  { range: '1–3 days', count: 19 },
  { range: '3–7 days', count: 14 },
  { range: '7–14 days', count: 9 },
  { range: '> 14 days', count: 6 },
];

const recentTickets = [
  { id: 'TKT-2041', title: 'VPN connectivity failure — Finance floor', priority: 'P1', status: 'Escalated', age: '2h', assignee: 'JO' },
  { id: 'TKT-2039', title: 'Outlook not syncing for 3 users', priority: 'P2', status: 'In Progress', age: '4h', assignee: 'SC' },
  { id: 'TKT-2037', title: 'Printer offline — 3rd floor', priority: 'P3', status: 'Pending', age: '6h', assignee: 'PN' },
  { id: 'TKT-2035', title: 'Password reset request — bulk', priority: 'P3', status: 'Open', age: '8h', assignee: '—' },
  { id: 'TKT-2033', title: 'Laptop screen flickering — Sales', priority: 'P2', status: 'In Progress', age: '10h', assignee: 'DT' },
  { id: 'TKT-2031', title: 'Database slow query — ERP system', priority: 'P1', status: 'Open', age: '12h', assignee: 'AD' },
];

const PRIORITY_COLORS: Record<string, string> = {
  P1: 'bg-red-100 text-red-700',
  P2: 'bg-orange-100 text-orange-700',
  P3: 'bg-yellow-100 text-yellow-700',
  P4: 'bg-slate-100 text-slate-600',
};

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-slate-100 text-slate-600',
  Escalated: 'bg-red-100 text-red-700',
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
              <span className="text-slate-600">{p.name}</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsDashboardPage() {
  const [trendRange, setTrendRange] = useState<'7d' | '14d' | '30d'>('7d');
  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Ticket Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Real-time status overview · All queues · April 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Live data</span>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Icon name="DownloadIcon" size={13} />
              Export
            </button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statusSummary.map((s) => (
            <div key={s.label} className={`bg-white border ${s.border} rounded-xl p-4 flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon name={s.icon as any} size={14} className={s.color} />
                </div>
              </div>
              <span className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.count}</span>
              <div className={`flex items-center gap-1 text-xs font-medium ${s.trendUp ? 'text-slate-500' : 'text-green-600'}`}>
                <Icon name={s.trendUp ? 'TrendingUpIcon' : 'TrendingDownIcon'} size={11} />
                {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Trend Chart + Donut */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Trend Area Chart */}
          <div className="metric-card xl:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Ticket Status Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daily breakdown by status</p>
              </div>
              <div className="flex gap-1">
                {(['7d', '14d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      trendRange === r ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  {[
                    { id: 'open', color: '#3b82f6' },
                    { id: 'pending', color: '#f59e0b' },
                    { id: 'inProgress', color: '#6366f1' },
                    { id: 'resolved', color: '#22c55e' },
                    { id: 'escalated', color: '#ef4444' },
                  ].map(({ id, color }) => (
                    <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="open" name="Open" stroke="#3b82f6" strokeWidth={2} fill="url(#grad-open)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} fill="url(#grad-pending)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#6366f1" strokeWidth={2} fill="url(#grad-inProgress)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} fill="url(#grad-resolved)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="escalated" name="Escalated" stroke="#ef4444" strokeWidth={1.5} fill="url(#grad-escalated)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut: Status Distribution */}
          <div className="metric-card flex flex-col">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Status Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">All-time · {total.toLocaleString()} total tickets</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{total}</span>
                  <span className="text-xs text-slate-500">Total</span>
                </div>
              </div>
              <div className="mt-3 w-full space-y-1.5">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-slate-900">{d.value}</span>
                      <span className="text-slate-400 w-9 text-right">{((d.value / total) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Priority Stacked Bar + Category Bar */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Priority Breakdown Stacked Bar */}
          <div className="metric-card">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Tickets by Priority</h3>
              <p className="text-xs text-slate-500 mt-0.5">Open · Pending · In Progress · Resolved · Escalated</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="open" name="Open" stackId="a" fill="#3b82f6" />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="#6366f1" />
                <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#22c55e" />
                <Bar dataKey="escalated" name="Escalated" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="metric-card">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Tickets by Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Open · Pending · Resolved — current month</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="open" name="Open" fill="#3b82f6" radius={[0, 3, 3, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[0, 3, 3, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 4: Resolution Time + Aging + Recent Tickets */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Avg Resolution Time by Priority */}
          <div className="metric-card">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Avg. Resolution Time</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hours to resolve · by priority</p>
            </div>
            <div className="space-y-4">
              {resolutionTimeData.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-700">{d.name}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: d.fill }}>{d.value}h</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(d.value / 20) * 100}%`, backgroundColor: d.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Overall avg</span>
                <span className="font-semibold text-slate-900">2.4h</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-slate-500">SLA target</span>
                <span className="font-semibold text-green-600">&lt; 3h</span>
              </div>
            </div>
          </div>

          {/* Ticket Aging */}
          <div className="metric-card">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Ticket Aging</h3>
              <p className="text-xs text-slate-500 mt-0.5">Open tickets by age bracket</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={agingData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Tickets" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {agingData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : i === 3 ? '#f97316' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">6 tickets &gt; 14 days old</span>
              <span className="text-red-600 font-medium flex items-center gap-1">
                <Icon name="AlertCircleIcon" size={11} />
                Needs review
              </span>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Tickets</h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest activity · open &amp; in-progress</p>
              </div>
              <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                View all <Icon name="ArrowRightIcon" size={11} />
              </button>
            </div>
            <div className="space-y-2.5">
              {recentTickets.map((t) => (
                <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0 mt-0.5">
                    {t.assignee}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{t.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-slate-400">{t.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{t.age} ago</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 5: Resolution Rate Line Chart */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Daily Resolution Rate</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tickets created vs resolved vs escalated — last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block" />Created</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block" />Resolved</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block" />Escalated</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="open" name="Created" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="escalated" name="Escalated" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </AppLayout>
  );
}
