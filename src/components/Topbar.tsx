'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

const notifications = [
  { id: 1, type: 'breach', message: 'TKT-1042 has breached SLA — P1 VPN outage', time: '3m ago', read: false },
  { id: 2, type: 'assigned', message: 'TKT-1039 assigned to you by Sarah Chen', time: '18m ago', read: false },
  { id: 3, type: 'approval', message: 'Software request REQ-0287 awaiting your approval', time: '45m ago', read: false },
  { id: 4, type: 'resolved', message: 'TKT-1035 resolved by James Okafor', time: '1h ago', read: true },
  { id: 5, type: 'comment', message: 'New comment on TKT-1030 from Priya Nair', time: '2h ago', read: true },
];

const configMenuItems = [
  {
    icon: 'UserIcon',
    label: 'Account Settings',
    description: 'Manage your profile and preferences',
    subItems: [
      { label: 'Manage Profile', path: '/account-settings/manage-profile' },
      { label: 'Preferences', path: '/account-settings/preferences' },
      { label: 'Look & Feel', path: '/account-settings/look-and-feel' },
      { label: 'Security', path: '/account-settings/security' },
      { label: 'Notifications', path: '/account-settings/notifications' },
    ],
  },
  {
    icon: 'BellIcon',
    label: 'Notification Preferences',
    description: 'Configure alert and notification rules',
    subItems: [
      { label: 'Email Alerts', path: '/admin-panel' },
      { label: 'Push Notifications', path: '/admin-panel' },
      { label: 'SLA Breach Alerts', path: '/admin-panel' },
      { label: 'Digest Settings', path: '/admin-panel' },
    ],
  },
  {
    icon: 'ShieldIcon',
    label: 'Security & Access',
    description: 'Password, 2FA, and session management',
    subItems: [
      { label: 'Change Password', path: '/admin-panel' },
      { label: 'Two-Factor Auth', path: '/admin-panel' },
      { label: 'Active Sessions', path: '/admin-panel' },
      { label: 'Login History', path: '/admin-panel' },
    ],
  },
  {
    icon: 'LayoutIcon',
    label: 'Display & Theme',
    description: 'Customize layout, theme, and language',
    subItems: [
      { label: 'Theme Mode', path: '/admin-panel' },
      { label: 'Language & Region', path: '/admin-panel' },
      { label: 'Density & Layout', path: '/admin-panel' },
      { label: 'Accessibility', path: '/admin-panel' },
    ],
  },
  {
    icon: 'LinkIcon',
    label: 'Integrations',
    description: 'Connect third-party tools and services',
    subItems: [
      { label: 'Connected Apps', path: '/admin-panel' },
      { label: 'API Keys', path: '/admin-panel' },
      { label: 'Webhooks', path: '/admin-panel' },
      { label: 'OAuth Providers', path: '/admin-panel' },
    ],
  },
  {
    icon: 'DatabaseIcon',
    label: 'Data & Storage',
    description: 'Manage data retention and exports',
    subItems: [
      { label: 'Data Retention', path: '/admin-panel' },
      { label: 'Export Data', path: '/admin-panel' },
      { label: 'Backup Settings', path: '/admin-panel' },
      { label: 'Audit Logs', path: '/admin-panel' },
    ],
  },
  {
    icon: 'UsersIcon',
    label: 'Team Management',
    description: 'Roles, permissions, and team members',
    subItems: [
      { label: 'Manage Members', path: '/admin-panel' },
      { label: 'Roles & Permissions', path: '/admin-panel' },
      { label: 'Invite Users', path: '/admin-panel' },
      { label: 'Departments', path: '/admin-panel' },
    ],
  },
  {
    icon: 'SettingsIcon',
    label: 'System Configuration',
    description: 'Advanced system and SLA settings',
    subItems: [
      { label: 'SLA Policies', path: '/admin-panel' },
      { label: 'Ticket Categories', path: '/admin-panel' },
      { label: 'Automation Rules', path: '/admin-panel' },
      { label: 'System Health', path: '/admin-panel' },
    ],
  },
];

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifIcon = (type: string) => {
    switch (type) {
      case 'breach': return { icon: 'AlertTriangleIcon', color: 'text-red-500' };
      case 'assigned': return { icon: 'UserCheckIcon', color: 'text-blue-500' };
      case 'approval': return { icon: 'ClipboardCheckIcon', color: 'text-amber-500' };
      case 'resolved': return { icon: 'CheckCircleIcon', color: 'text-green-500' };
      case 'comment': return { icon: 'MessageSquareIcon', color: 'text-purple-500' };
      default: return { icon: 'BellIcon', color: 'text-slate-500' };
    }
  };

  const handleCloseAll = () => {
    setShowNotifications(false);
    setShowSettings(false);
  };

  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-6 transition-all duration-300 ${
          sidebarCollapsed ? 'left-16' : 'left-60'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icon name="SearchIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, requests, users… (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Create Ticket Quick Action */}
          <button
            onClick={() => router.push('/ticket-management')}
            className="btn-primary text-xs px-3 py-1.5"
          >
            <Icon name="PlusIcon" size={14} />
            New Ticket
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Icon name="BellIcon" size={18} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-modal overflow-hidden fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-900">Notifications</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((notif) => {
                    const { icon, color } = notifIcon(notif.type);
                    return (
                      <div
                        key={notif.id}
                        className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <Icon name={icon as any} size={16} className={`${color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${notif.read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button className="text-xs text-slate-500 hover:text-slate-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Icon */}
          <button
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
            className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${showSettings ? 'bg-slate-100' : ''}`}
          >
            <Icon name="SettingsIcon" size={18} className={`transition-transform duration-300 ${showSettings ? 'rotate-45 text-blue-600' : 'text-slate-600'}`} />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
              MR
            </div>
          </div>
        </div>

        {/* Click outside to close */}
        {(showNotifications || showSettings) && (
          <div className="fixed inset-0 z-40" onClick={handleCloseAll} />
        )}
      </header>

      {/* Settings Slide-Down Panel */}
      <div
        className={`fixed top-16 right-0 bg-white border-b border-l border-slate-200 shadow-xl z-30 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'left-16' : 'left-60'
        }`}
        style={{
          height: showSettings ? '25vh' : '0',
          opacity: showSettings ? 1 : 0,
        }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Icon name="SettingsIcon" size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Configuration</span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded hover:bg-slate-200 transition-colors"
            >
              <Icon name="XIcon" size={14} className="text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-0 divide-x divide-slate-100">
            {configMenuItems.map((item, index) => (
              <div key={index}>
                {/* Main menu item */}
                <button
                  onClick={() => { router.push('/admin-panel'); setShowSettings(false); }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon name={item.icon as any} size={15} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 group-hover:text-blue-700 transition-colors">{item.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.description}</p>
                  </div>
                </button>

                {/* Sub-menu items - always visible */}
                <div className="bg-slate-50">
                  {item.subItems.map((sub, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => { router.push(sub.path); setShowSettings(false); }}
                      className="w-full flex items-center gap-2 pl-8 pr-4 py-1.5 hover:bg-blue-50 transition-colors text-left group/sub"
                    >
                      <div className="w-1 h-1 rounded-full bg-slate-300 group-hover/sub:bg-blue-400 flex-shrink-0 transition-colors" />
                      <span className="text-[11px] text-slate-600 group-hover/sub:text-blue-600 transition-colors">{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}