'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const slaData = [{ name: 'SLA', value: 94.7, fill: '#2563eb' }];

const priorityBreakdown = [
  { label: 'P1 — Critical', count: 3, color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  { label: 'P2 — High', count: 11, color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
  { label: 'P3 — Medium', count: 28, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  { label: 'P4 — Low', count: 47, color: 'bg-slate-400', textColor: 'text-slate-600', bgColor: 'bg-slate-50' },
];

export default function MetricsBentoGrid() {
  const [lastUpdated] = useState('06:24 AM');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">IT Service Desk</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monday, March 16, 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Live · Updated {lastUpdated}</span>
        </div>
      </div>
      {/* Bento grid: 4 cols — row1: hero(2col) + 2 cards, row2: 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">

        {/* HERO: SLA Compliance — spans 2 cols, 2 rows */}
        <div className="metric-card col-span-1 md:col-span-2 row-span-2 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">SLA Compliance Rate</p>
              <p className="text-slate-500 text-xs mt-0.5">Last 30 days · All priorities</p>
            </div>
            <span className="badge bg-green-100 text-green-700">
              <Icon name="TrendingUpIcon" size={11} className="mr-1" />
              +1.2% vs last month
            </span>
          </div>
          <div className="flex items-center gap-6 flex-1">
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={140} height={140}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  data={slaData}
                >
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f1f5f9' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 tabular-nums">94.7</span>
                <span className="text-xs text-slate-500 font-medium">%</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {priorityBreakdown?.map((p) => (
                <div key={p?.label} className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${p?.bgColor}`}>
                  <span className={`text-xs font-medium ${p?.textColor}`}>{p?.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${p?.textColor}`}>{p?.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>89 total open tickets</span>
            <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View all tickets <Icon name="ArrowRightIcon" size={12} />
            </button>
          </div>
        </div>

        {/* MTTR */}
        <div className="metric-card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Avg. Resolution Time</p>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">2.4</span>
            <span className="text-sm text-slate-500 mb-1">hours</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="TrendingDownIcon" size={14} className="text-green-500" />
            <span className="text-xs text-green-600 font-medium">↓ 22 min vs yesterday</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: &lt;3h · P1 avg: 1.1h</p>
        </div>

        {/* First Response Time */}
        <div className="metric-card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">First Response Time</p>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">18</span>
            <span className="text-sm text-slate-500 mb-1">min</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="TrendingUpIcon" size={14} className="text-red-500" />
            <span className="text-xs text-red-600 font-medium">↑ 4 min vs yesterday</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: &lt;15 min · SLA threshold</p>
        </div>

        {/* SLA Breaches — ALERT STATE */}
        <div className="metric-card border-red-200 bg-red-50/60">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">SLA Breaches Today</p>
            <Icon name="AlertTriangleIcon" size={16} className="text-red-500" />
          </div>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-3xl font-bold text-red-700 tabular-nums">4</span>
            <span className="text-sm text-red-500 mb-1">tickets</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="AlertCircleIcon" size={14} className="text-red-500" />
            <span className="text-xs text-red-600 font-medium">2 P1 · 2 P2 — needs action</span>
          </div>
          <button className="mt-2 text-xs text-red-600 font-semibold hover:text-red-700 flex items-center gap-1">
            Review breaches <Icon name="ArrowRightIcon" size={11} />
          </button>
        </div>

        {/* Tickets Today */}
        <div className="metric-card">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tickets Today</p>
          <div className="flex items-end gap-3 mt-3">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Created</p>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">23</span>
            </div>
            <div className="text-slate-300 mb-1 text-xl">/</div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Resolved</p>
              <span className="text-2xl font-bold text-green-600 tabular-nums">19</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '82.6%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">82.6% resolution rate today</p>
        </div>

        {/* Pending Approvals — WARNING */}
        <div className="metric-card border-amber-200 bg-amber-50/50">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending Approvals</p>
            <Icon name="ClockIcon" size={16} className="text-amber-500" />
          </div>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-3xl font-bold text-amber-700 tabular-nums">5</span>
            <span className="text-sm text-amber-600 mb-1">requests</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-amber-700 font-medium">2 overdue · oldest 3 days</span>
          </div>
          <button className="mt-2 text-xs text-amber-700 font-semibold hover:text-amber-800 flex items-center gap-1">
            Review approvals <Icon name="ArrowRightIcon" size={11} />
          </button>
        </div>

      </div>
    </div>
  );
}