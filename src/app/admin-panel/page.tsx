'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AgentRoster from './components/AgentRoster';
import SLAPolicies from './components/SLAPolicies';
import SystemSettings from './components/SystemSettings';
import IntegrationsPanel from './components/IntegrationsPanel';
import Icon from '@/components/ui/AppIcon';

type AdminTab = 'agents' | 'sla' | 'integrations' | 'settings';

const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
  { id: 'agents', label: 'Agents', icon: 'UsersIcon' },
  { id: 'sla', label: 'SLA Policies', icon: 'ClockIcon' },
  { id: 'integrations', label: 'Integrations', icon: 'LinkIcon', badge: 1 },
  { id: 'settings', label: 'System Settings', icon: 'SettingsIcon' },
];

function AdminContent({ tab }: { tab: AdminTab }) {
  switch (tab) {
    case 'agents': return <AgentRoster />;
    case 'sla': return <SLAPolicies />;
    case 'integrations': return <IntegrationsPanel />;
    case 'settings': return <SystemSettings />;
  }
}

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('agents');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Configure agents, SLA policies, integrations, and system behavior
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <Icon name="ShieldCheckIcon" size={15} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-700">IT Manager access</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
              {tab.badge !== undefined && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="fade-in">
          <AdminContent tab={activeTab} />
        </div>
      </div>
    </AppLayout>
  );
}