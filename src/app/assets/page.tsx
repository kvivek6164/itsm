'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

interface AssetCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
  active: number;
  retired: number;
  color: string;
  href: string;
  description: string;
}

const categories: AssetCategory[] = [
  {
    id: 'endpoint-devices',
    label: 'Endpoint Devices',
    icon: 'MonitorIcon',
    count: 248,
    active: 221,
    retired: 27,
    color: 'blue',
    href: '/assets/endpoint-devices',
    description: 'Laptops, desktops, workstations, and thin clients',
  },
  {
    id: 'mobile-devices',
    label: 'Mobile Devices',
    icon: 'SmartphoneIcon',
    count: 134,
    active: 128,
    retired: 6,
    color: 'violet',
    href: '/assets/endpoint-devices',
    description: 'Smartphones, tablets, and mobile accessories',
  },
  {
    id: 'network-equipment',
    label: 'Network Equipment',
    icon: 'NetworkIcon',
    count: 87,
    active: 82,
    retired: 5,
    color: 'emerald',
    href: '/assets/endpoint-devices',
    description: 'Switches, routers, firewalls, and access points',
  },
  {
    id: 'servers',
    label: 'Servers',
    icon: 'ServerIcon',
    count: 42,
    active: 40,
    retired: 2,
    color: 'amber',
    href: '/assets/endpoint-devices',
    description: 'Physical and virtual servers, storage arrays',
  },
  {
    id: 'peripherals',
    label: 'Peripherals',
    icon: 'PrinterIcon',
    count: 196,
    active: 181,
    retired: 15,
    color: 'rose',
    href: '/assets/endpoint-devices',
    description: 'Printers, monitors, keyboards, and docking stations',
  },
  {
    id: 'software-licenses',
    label: 'Software Licenses',
    icon: 'PackageIcon',
    count: 312,
    active: 298,
    retired: 14,
    color: 'cyan',
    href: '/assets/endpoint-devices',
    description: 'OS licenses, SaaS subscriptions, and enterprise software',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   iconBg: 'bg-blue-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', iconBg: 'bg-violet-100' },
  emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',iconBg: 'bg-emerald-100' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  iconBg: 'bg-amber-100' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   iconBg: 'bg-rose-100' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   iconBg: 'bg-cyan-100' },
};

const recentActivity = [
  { id: 'ACT-001', action: 'Asset Assigned', asset: 'Dell XPS 15 (DEV-0248)', user: 'Marcus Reynolds', dept: 'Engineering', time: '2 hours ago', type: 'assign' },
  { id: 'ACT-002', action: 'Maintenance Scheduled', asset: 'HP LaserJet Pro (PRT-0041)', user: 'David Thornton', dept: 'IT Ops', time: '4 hours ago', type: 'maintenance' },
  { id: 'ACT-003', action: 'Asset Retired', asset: 'Cisco Catalyst 2960 (NET-0018)', user: 'Sarah Chen', dept: 'Infrastructure', time: '1 day ago', type: 'retire' },
  { id: 'ACT-004', action: 'New Asset Added', asset: 'MacBook Pro M3 (DEV-0249)', user: 'Priya Nair', dept: 'HR', time: '1 day ago', type: 'add' },
  { id: 'ACT-005', action: 'License Renewed', asset: 'Adobe CC — 10 seats (LIC-0087)', user: 'Marcus Reynolds', dept: 'IT Admin', time: '2 days ago', type: 'license' },
];

const activityIcon: Record<string, { icon: string; color: string }> = {
  assign:      { icon: 'UserCheckIcon',    color: 'text-blue-600 bg-blue-50' },
  maintenance: { icon: 'WrenchIcon',       color: 'text-amber-600 bg-amber-50' },
  retire:      { icon: 'ArchiveIcon',      color: 'text-slate-600 bg-slate-100' },
  add:         { icon: 'PlusCircleIcon',   color: 'text-emerald-600 bg-emerald-50' },
  license:     { icon: 'RefreshCwIcon',    color: 'text-violet-600 bg-violet-50' },
};

export default function AssetsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const totalAssets = categories.reduce((s, c) => s + c.count, 0);
  const totalActive = categories.reduce((s, c) => s + c.active, 0);
  const totalRetired = categories.reduce((s, c) => s + c.retired, 0);

  const filteredCategories = categories.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track, manage, and maintain all IT assets across the organization</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Icon name="DownloadIcon" size={15} />
              Export
            </button>
            <button
              onClick={() => router.push('/assets/endpoint-devices')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="PlusIcon" size={15} />
              Add Asset
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Total Assets</span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon name="DatabaseIcon" size={18} className="text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalAssets.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Across {categories.length} categories</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Active Assets</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Icon name="CheckCircleIcon" size={18} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalActive.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-1">
              {Math.round((totalActive / totalAssets) * 100)}% utilization rate
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Retired / EOL</span>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon name="ArchiveIcon" size={18} className="text-slate-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalRetired}</p>
            <p className="text-xs text-slate-400 mt-1">Pending decommission or disposal</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search asset categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredCategories.map(cat => {
            const c = colorMap[cat.color];
            return (
              <button
                key={cat.id}
                onClick={() => router.push(cat.href)}
                className={`text-left bg-white border ${c.border} rounded-xl p-5 hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                    <Icon name={cat.icon as any} size={22} className={c.text} />
                  </div>
                  <Icon name="ArrowRightIcon" size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{cat.count}</p>
                    <p className="text-xs text-slate-400">Total</p>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div>
                    <p className={`text-sm font-semibold ${c.text}`}>{cat.active}</p>
                    <p className="text-xs text-slate-400">Active</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400">{cat.retired}</p>
                    <p className="text-xs text-slate-400">Retired</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.bg.replace('bg-', 'bg-').replace('-50', '-400')}`}
                    style={{ width: `${Math.round((cat.active / cat.count) * 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-xs text-blue-600 hover:underline font-medium">View all</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map(act => {
              const ai = activityIcon[act.type];
              return (
                <div key={act.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ai.color}`}>
                    <Icon name={ai.icon as any} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{act.action}</p>
                    <p className="text-xs text-slate-500 truncate">{act.asset}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-slate-700">{act.user}</p>
                    <p className="text-xs text-slate-400">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
