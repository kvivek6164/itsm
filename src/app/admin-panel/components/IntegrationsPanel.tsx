'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'Connected' | 'Disconnected' | 'Error' | 'Pending';
  lastSync?: string;
  details?: string;
}

const integrations: Integration[] = [
  { id: 'slack', name: 'Slack', description: 'Receive ticket notifications and create tickets from Slack messages', icon: 'MessageSquareIcon', status: 'Connected', lastSync: '2 min ago', details: 'Workspace: itservicedesk.slack.com' },
  { id: 'jira', name: 'Jira Software', description: 'Sync P1/P2 tickets to Jira for engineering escalations', icon: 'GitBranchIcon', status: 'Connected', lastSync: '15 min ago', details: 'Project: INFRA · 14 synced issues' },
  { id: 'azure_ad', name: 'Microsoft Azure AD', description: 'Sync user directory and enable SSO authentication', icon: 'ShieldCheckIcon', status: 'Connected', lastSync: '1h ago', details: '247 users synced' },
  { id: 'google_workspace', name: 'Google Workspace', description: 'Google SSO and calendar integration for scheduling', icon: 'GlobeIcon', status: 'Connected', lastSync: '30 min ago', details: 'Domain: itservicedesk.io' },
  { id: 'pagerduty', name: 'PagerDuty', description: 'Auto-create P1 incidents and trigger on-call rotations', icon: 'AlertTriangleIcon', status: 'Error', lastSync: '3h ago', details: 'Authentication token expired — reconnect required' },
  { id: 'datadog', name: 'Datadog', description: 'Create tickets automatically from Datadog monitor alerts', icon: 'ActivityIcon', status: 'Disconnected', details: 'Not configured' },
  { id: 'servicenow', name: 'ServiceNow', description: 'Bidirectional sync with ServiceNow CMDB and incident management', icon: 'DatabaseIcon', status: 'Pending', details: 'OAuth flow in progress' },
  { id: 'freshdesk', name: 'Freshdesk', description: 'Import historical tickets from Freshdesk during migration', icon: 'ArchiveIcon', status: 'Disconnected', details: 'Not configured' },
];

const statusConfig: Record<string, { color: string; badge: string; icon: string }> = {
  Connected: { color: 'text-green-600', badge: 'bg-green-100 text-green-700', icon: 'CheckCircleIcon' },
  Disconnected: { color: 'text-slate-400', badge: 'bg-slate-100 text-slate-500', icon: 'MinusCircleIcon' },
  Error: { color: 'text-red-600', badge: 'bg-red-100 text-red-700', icon: 'AlertCircleIcon' },
  Pending: { color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', icon: 'ClockIcon' },
};

export default function IntegrationsPanel() {
  const [integrationsState, setIntegrationsState] = useState(integrations);

  const handleConnect = (id: string) => {
    toast.info(`Connecting ${integrations.find(i => i.id === id)?.name} — OAuth flow starting`);
  };

  const handleDisconnect = (id: string) => {
    setIntegrationsState(prev => prev.map(i => i.id === id ? { ...i, status: 'Disconnected' as const } : i));
    toast.success(`${integrations.find(i => i.id === id)?.name} disconnected`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {integrationsState.filter(i => i.status === 'Connected').length} connected ·{' '}
          {integrationsState.filter(i => i.status === 'Error').length > 0 && (
            <span className="text-red-600 font-medium">{integrationsState.filter(i => i.status === 'Error').length} with errors</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
        {integrationsState.map((integration) => {
          const cfg = statusConfig[integration.status];
          return (
            <div
              key={integration.id}
              className={`bg-white rounded-xl border shadow-card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow ${
                integration.status === 'Error' ? 'border-red-200' : 'border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                integration.status === 'Connected' ? 'bg-blue-50' : 'bg-slate-100'
              }`}>
                <Icon name={integration.icon as any} size={20} className={integration.status === 'Connected' ? 'text-blue-600' : 'text-slate-400'} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-slate-900">{integration.name}</p>
                  <span className={`badge ${cfg.badge} text-[10px]`}>
                    <Icon name={cfg.icon as any} size={10} className="mr-1" />
                    {integration.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{integration.description}</p>
                {integration.details && (
                  <p className={`text-xs mt-1.5 ${integration.status === 'Error' ? 'text-red-600 font-medium' : 'text-slate-400'}`}>
                    {integration.details}
                  </p>
                )}
                {integration.lastSync && integration.status !== 'Error' && (
                  <p className="text-[10px] text-slate-400 mt-1">Last sync: {integration.lastSync}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                {integration.status === 'Connected' ? (
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="text-xs text-slate-500 hover:text-red-600 px-2.5 py-1.5 border border-slate-200 hover:border-red-200 rounded-lg transition-all"
                  >
                    Disconnect
                  </button>
                ) : integration.status === 'Error' ? (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="text-xs text-red-600 hover:text-red-700 px-2.5 py-1.5 border border-red-200 hover:border-red-300 bg-red-50 rounded-lg transition-all font-medium"
                  >
                    Reconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 px-2.5 py-1.5 border border-blue-200 hover:border-blue-300 bg-blue-50 rounded-lg transition-all font-medium"
                  >
                    {integration.status === 'Pending' ? 'Continue' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}