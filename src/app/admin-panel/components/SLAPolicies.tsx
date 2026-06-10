'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

interface SLAPolicy {
  id: string;
  name: string;
  priority: string;
  firstResponseMins: number;
  resolutionHrs: number;
  escalationHrs: number;
  businessHoursOnly: boolean;
  applicableTo: string[];
  active: boolean;
}

const defaultPolicies: SLAPolicy[] = [
  { id: 'SLA-001', name: 'Critical Incident SLA', priority: 'P1', firstResponseMins: 15, resolutionHrs: 4, escalationHrs: 2, businessHoursOnly: false, applicableTo: ['Network', 'Security', 'Identity & Access'], active: true },
  { id: 'SLA-002', name: 'High Priority SLA', priority: 'P2', firstResponseMins: 30, resolutionHrs: 8, escalationHrs: 4, businessHoursOnly: false, applicableTo: ['All categories'], active: true },
  { id: 'SLA-003', name: 'Standard SLA', priority: 'P3', firstResponseMins: 60, resolutionHrs: 24, escalationHrs: 12, businessHoursOnly: true, applicableTo: ['All categories'], active: true },
  { id: 'SLA-004', name: 'Low Priority SLA', priority: 'P4', firstResponseMins: 240, resolutionHrs: 72, escalationHrs: 48, businessHoursOnly: true, applicableTo: ['All categories'], active: true },
  { id: 'SLA-005', name: 'VIP User SLA', priority: 'P2', firstResponseMins: 15, resolutionHrs: 4, escalationHrs: 2, businessHoursOnly: false, applicableTo: ['Executive group'], active: false },
];

const priorityColors: Record<string, string> = {
  P1: 'border-red-200 bg-red-50/30',
  P2: 'border-orange-200 bg-orange-50/30',
  P3: 'border-yellow-200 bg-yellow-50/20',
  P4: 'border-slate-200 bg-slate-50/30',
};

const priorityBadge: Record<string, string> = {
  P1: 'badge-p1', P2: 'badge-p2', P3: 'badge-p3', P4: 'badge-p4',
};

export default function SLAPolicies() {
  const [policies, setPolicies] = useState<SLAPolicy[]>(defaultPolicies);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<SLAPolicy>>({});

  const startEdit = (policy: SLAPolicy) => {
    setEditing(policy.id);
    setEditValues({ ...policy });
  };

  const saveEdit = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...editValues } : p));
    setEditing(null);
    toast.success(`${editValues.name} updated successfully`);
  };

  const toggleActive = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const policy = policies.find(p => p.id === id);
    toast.success(`${policy?.name} ${policy?.active ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">SLA Policies</h2>
          <p className="text-sm text-slate-500 mt-0.5">{policies.filter(p => p.active).length} active policies</p>
        </div>
        <button
          onClick={() => toast.info('Create SLA policy — coming soon')}
          className="btn-primary text-sm"
        >
          <Icon name="PlusIcon" size={15} />
          Add Policy
        </button>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={`border rounded-xl overflow-hidden transition-all ${priorityColors[policy.priority]} ${!policy.active ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={`badge ${priorityBadge[policy.priority]}`}>{policy.priority}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{policy.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Applies to: {policy.applicableTo.join(', ')} ·{' '}
                    {policy.businessHoursOnly ? 'Business hours only' : '24/7 coverage'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(policy.id)}
                  className={`toggle-track w-9 h-5 ${policy.active ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`toggle-thumb left-0.5 ${policy.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <button
                  onClick={() => editing === policy.id ? setEditing(null) : startEdit(policy)}
                  className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
                >
                  <Icon name={editing === policy.id ? 'XIcon' : 'PencilIcon'} size={14} className="text-slate-500" />
                </button>
              </div>
            </div>

            {editing === policy.id ? (
              <div className="border-t border-slate-200 bg-white px-5 py-4 space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">First Response (min)</label>
                    <input
                      type="number"
                      value={editValues.firstResponseMins}
                      onChange={(e) => setEditValues(prev => ({ ...prev, firstResponseMins: Number(e.target.value) }))}
                      className="input-field text-sm py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Resolution Time (hrs)</label>
                    <input
                      type="number"
                      value={editValues.resolutionHrs}
                      onChange={(e) => setEditValues(prev => ({ ...prev, resolutionHrs: Number(e.target.value) }))}
                      className="input-field text-sm py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Escalation After (hrs)</label>
                    <input
                      type="number"
                      value={editValues.escalationHrs}
                      onChange={(e) => setEditValues(prev => ({ ...prev, escalationHrs: Number(e.target.value) }))}
                      className="input-field text-sm py-1.5"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setEditValues(prev => ({ ...prev, businessHoursOnly: !prev.businessHoursOnly }))}
                      className={`toggle-track w-9 h-5 ${editValues.businessHoursOnly ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`toggle-thumb left-0.5 ${editValues.businessHoursOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-sm text-slate-600">Business hours only</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(null)} className="btn-secondary text-sm py-1.5 px-3">Cancel</button>
                    <button onClick={() => saveEdit(policy.id)} className="btn-primary text-sm py-1.5 px-3">Save Policy</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 border-t border-slate-200/60 divide-x divide-slate-200/60">
                {[
                  { label: 'First Response', value: `${policy.firstResponseMins} min`, icon: 'ZapIcon' },
                  { label: 'Resolution Target', value: `${policy.resolutionHrs}h`, icon: 'CheckCircleIcon' },
                  { label: 'Escalation After', value: `${policy.escalationHrs}h`, icon: 'AlertTriangleIcon' },
                ].map((stat) => (
                  <div key={stat.label} className="px-5 py-3 bg-white/50">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon name={stat.icon as any} size={12} className="text-slate-400" />
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 tabular-nums">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}