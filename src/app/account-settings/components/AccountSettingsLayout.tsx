'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';
import ConfigDataTable, { ConfigColumn, ConfigRow } from './ConfigDataTable';

interface SubMenuItem {
  label: string;
  path: string;
  icon: string;
}

const subMenuItems: SubMenuItem[] = [
  { label: 'Manage Profile', path: '/account-settings/manage-profile', icon: 'UserIcon' },
  { label: 'Preferences', path: '/account-settings/preferences', icon: 'SlidersIcon' },
  { label: 'Look & Feel', path: '/account-settings/look-and-feel', icon: 'EyeIcon' },
  { label: 'Security', path: '/account-settings/security', icon: 'ShieldIcon' },
  { label: 'Notifications', path: '/account-settings/notifications', icon: 'BellIcon' },
];

interface PageConfig {
  title: string;
  description: string;
  columns: ConfigColumn[];
  initialRows: ConfigRow[];
  addButtonLabel: string;
  modalTitle: string;
  nameLabel: string;
}

const pageConfigs: Record<string, PageConfig> = {
  'manage-profile': {
    title: 'Manage Profile',
    description: 'Manage user profiles and their organization roles',
    columns: [
      { field: 'name', header: 'Profile Name', width: '200px' },
      { field: 'description', header: 'Description' },
      { field: 'roles', header: 'Organization Roles', width: '260px' },
      { field: 'createdAt', header: 'Created', width: '140px' },
    ],
    initialRows: [
      { id: 1, name: 'Marcus Reynolds', description: 'IT Manager profile with full admin access', roles: ['IT Manager', 'Admin'], createdAt: 'Jan 10, 2026' },
      { id: 2, name: 'Sarah Chen', description: 'Senior support engineer profile', roles: ['Support Engineer'], createdAt: 'Jan 15, 2026' },
    ],
    addButtonLabel: 'Add Profile',
    modalTitle: 'New Profile',
    nameLabel: 'Profile Name',
  },
  'preferences': {
    title: 'Preferences',
    description: 'Configure user preferences and default settings',
    columns: [
      { field: 'name', header: 'Preference Name', width: '200px' },
      { field: 'description', header: 'Description' },
      { field: 'roles', header: 'Applicable Roles', width: '260px' },
      { field: 'createdAt', header: 'Created', width: '140px' },
    ],
    initialRows: [
      { id: 1, name: 'Dark Mode Default', description: 'Enable dark mode by default for all users', roles: ['All Users'], createdAt: 'Feb 01, 2026' },
      { id: 2, name: 'Compact View', description: 'Use compact table view for ticket lists', roles: ['Support Engineer', 'IT Manager'], createdAt: 'Feb 05, 2026' },
    ],
    addButtonLabel: 'Add Preference',
    modalTitle: 'New Preference',
    nameLabel: 'Preference Name',
  },
  'look-and-feel': {
    title: 'Look & Feel',
    description: 'Customize themes, layouts, and visual appearance',
    columns: [
      { field: 'name', header: 'Theme Name', width: '200px' },
      { field: 'description', header: 'Description' },
      { field: 'roles', header: 'Assigned Roles', width: '260px' },
      { field: 'createdAt', header: 'Created', width: '140px' },
    ],
    initialRows: [
      { id: 1, name: 'Corporate Blue', description: 'Default corporate theme with blue accent colors', roles: ['All Users'], createdAt: 'Jan 20, 2026' },
      { id: 2, name: 'High Contrast', description: 'Accessibility-focused high contrast theme', roles: ['Accessibility Users'], createdAt: 'Feb 10, 2026' },
    ],
    addButtonLabel: 'Add Theme',
    modalTitle: 'New Theme',
    nameLabel: 'Theme Name',
  },
  'security': {
    title: 'Security',
    description: 'Manage security policies and access controls',
    columns: [
      { field: 'name', header: 'Policy Name', width: '200px' },
      { field: 'description', header: 'Description' },
      { field: 'roles', header: 'Applied Roles', width: '260px' },
      { field: 'createdAt', header: 'Created', width: '140px' },
    ],
    initialRows: [
      { id: 1, name: 'MFA Required', description: 'Enforce multi-factor authentication for all logins', roles: ['IT Manager', 'Admin'], createdAt: 'Jan 05, 2026' },
      { id: 2, name: 'Session Timeout', description: 'Auto-logout after 30 minutes of inactivity', roles: ['All Users'], createdAt: 'Jan 08, 2026' },
    ],
    addButtonLabel: 'Add Policy',
    modalTitle: 'New Security Policy',
    nameLabel: 'Policy Name',
  },
  'notifications': {
    title: 'Notifications',
    description: 'Configure notification rules and alert preferences',
    columns: [
      { field: 'name', header: 'Notification Rule', width: '200px' },
      { field: 'description', header: 'Description' },
      { field: 'roles', header: 'Target Roles', width: '260px' },
      { field: 'createdAt', header: 'Created', width: '140px' },
    ],
    initialRows: [
      { id: 1, name: 'SLA Breach Alert', description: 'Send email when ticket breaches SLA threshold', roles: ['IT Manager', 'Support Engineer'], createdAt: 'Jan 12, 2026' },
      { id: 2, name: 'New Assignment', description: 'Notify agent when a ticket is assigned to them', roles: ['Support Engineer'], createdAt: 'Jan 14, 2026' },
    ],
    addButtonLabel: 'Add Rule',
    modalTitle: 'New Notification Rule',
    nameLabel: 'Rule Name',
  },
};

interface AccountSettingsLayoutProps {
  activeSection: string;
}

export default function AccountSettingsLayout({ activeSection }: AccountSettingsLayoutProps) {
  const router = useRouter();
  const config = pageConfigs[activeSection] ?? pageConfigs['manage-profile'];

  const [rows, setRows] = useState<ConfigRow[]>(config.initialRows);

  const handleAddRow = (data: { name: string; description: string; roles: string[] }) => {
    const newRow: ConfigRow = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      roles: data.roles,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setRows((prev) => [...prev, newRow]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <button onClick={() => router.push('/dashboard')} className="hover:text-blue-600 transition-colors">
                Home
              </button>
              <Icon name="ChevronRightIcon" size={12} />
              <span>Account Settings</span>
              <Icon name="ChevronRightIcon" size={12} />
              <span className="text-slate-700 font-medium">{config.title}</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">{config.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{config.description}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <Icon name="UserIcon" size={15} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Account Settings</span>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* Left Sub-menu */}
          <div className="w-52 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account Settings</p>
              </div>
              <nav className="py-1">
                {subMenuItems.map((item) => {
                  const isActive = item.path.endsWith(activeSection);
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600' :'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon name={item.icon as any} size={15} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ConfigDataTable
              columns={config.columns}
              rows={rows}
              onAddRow={handleAddRow}
              addButtonLabel={config.addButtonLabel}
              modalTitle={config.modalTitle}
              nameLabel={config.nameLabel}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
