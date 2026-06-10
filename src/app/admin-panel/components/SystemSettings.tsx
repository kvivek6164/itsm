'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  value: boolean;
  group: string;
}

const initialSettings: ToggleSetting[] = [
  { id: 'auto_assign', label: 'Auto-assign tickets', description: 'Automatically assign incoming tickets to available agents based on skills and workload', value: true, group: 'Ticket Handling' },
  { id: 'sla_notifications', label: 'SLA breach notifications', description: 'Send email and in-app alerts when tickets are approaching or have breached SLA', value: true, group: 'Ticket Handling' },
  { id: 'auto_escalate', label: 'Auto-escalate P1/P2 unassigned', description: 'Automatically escalate critical tickets that remain unassigned after 30 minutes', value: true, group: 'Ticket Handling' },
  { id: 'requester_updates', label: 'Requester status updates', description: 'Notify requesters via email when their ticket status changes', value: true, group: 'Ticket Handling' },
  { id: 'kb_suggestions', label: 'Knowledge base auto-suggestions', description: 'Show relevant KB articles to requesters before they submit a ticket', value: true, group: 'Self-Service' },
  { id: 'chatbot_enabled', label: 'AI chatbot enabled', description: 'Enable the AI assistant for self-service ticket creation and status lookup', value: true, group: 'Self-Service' },
  { id: 'satisfaction_survey', label: 'Post-resolution satisfaction survey', description: 'Send a 1-question CSAT survey to requesters when tickets are resolved', value: false, group: 'Self-Service' },
  { id: 'google_sso', label: 'Google Workspace SSO', description: 'Allow users to sign in with their Google Workspace accounts', value: true, group: 'Authentication' },
  { id: 'microsoft_sso', label: 'Microsoft 365 SSO', description: 'Allow users to sign in with their Microsoft 365 / Azure AD accounts', value: true, group: 'Authentication' },
  { id: 'enforce_mfa', label: 'Enforce MFA for agents', description: 'Require multi-factor authentication for all agent and admin accounts', value: true, group: 'Authentication' },
  { id: 'session_timeout', label: 'Auto session timeout (8 hours)', description: 'Automatically log out users after 8 hours of inactivity', value: true, group: 'Authentication' },
  { id: 'audit_log', label: 'Detailed audit logging', description: 'Log all ticket changes, status updates, and admin actions for compliance', value: true, group: 'Compliance' },
  { id: 'data_retention', label: 'Auto-archive closed tickets (90 days)', description: 'Move resolved and closed tickets to archive after 90 days', value: false, group: 'Compliance' },
];

const groups = ['Ticket Handling', 'Self-Service', 'Authentication', 'Compliance'];

export default function SystemSettings() {
  const [settings, setSettings] = useState<ToggleSetting[]>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const toggle = async (id: string) => {
    setSaving(id);
    // Backend integration: PATCH /api/admin/settings
    await new Promise(r => setTimeout(r, 400));
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value: !s.value } : s));
    setSaving(null);
    const setting = settings.find(s => s.id === id);
    toast.success(`${setting?.label} ${setting?.value ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">System Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Configure global behavior for your IT service desk</p>
      </div>

      {groups.map((group) => {
        const groupSettings = settings.filter(s => s.group === group);
        return (
          <div key={group} className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-800">{group}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {groupSettings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 mr-8">
                    <p className="text-sm font-medium text-slate-800">{setting.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {saving === setting.id && (
                      <Icon name="Loader2Icon" size={13} className="text-slate-400 animate-spin" />
                    )}
                    <button
                      onClick={() => toggle(setting.id)}
                      disabled={saving === setting.id}
                      className={`toggle-track w-9 h-5 ${setting.value ? 'bg-blue-600' : 'bg-slate-200'} disabled:opacity-60`}
                    >
                      <span className={`toggle-thumb left-0.5 ${setting.value ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-red-100 bg-red-50/50">
          <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
        </div>
        <div className="divide-y divide-red-50">
          {[
            { label: 'Reset all SLA breach counters', sub: 'Clear current breach counts — does not affect historical data', action: 'Reset Counters' },
            { label: 'Purge closed ticket archive', sub: 'Permanently delete all archived tickets older than 1 year — cannot be undone', action: 'Purge Archive' },
            { label: 'Reset agent workload distribution', sub: 'Unassign all pending tickets and trigger re-assignment', action: 'Reset Workload' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
              </div>
              <button
                onClick={() => toast.error(`${item.action} — confirm in modal (coming soon)`)}
                className="btn-danger text-xs px-3 py-1.5 flex-shrink-0 ml-4"
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}