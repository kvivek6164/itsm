'use client';


import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboardIcon', href: '/dashboard', group: 'Main' },
  { label: 'Tickets', icon: 'TicketIcon', href: '/ticket-management', badge: 12, group: 'Main' },
  { label: 'Ticket Analytics', icon: 'BarChart2Icon', href: '/tickets-dashboard', group: 'Main' },
  { label: 'Requests', icon: 'ClipboardListIcon', href: '/request-management', badge: 5, group: 'Main' },
  { label: 'Projects', icon: 'FolderKanbanIcon', href: '/project-management', group: 'Main' },
  { label: 'Tasks', icon: 'CheckSquareIcon', href: '/tasks', group: 'Main' },
  { label: 'Assets', icon: 'DatabaseIcon', href: '/assets', group: 'Main' },
  { label: 'Asset Dashboard', icon: 'ChartPieIcon', href: '/assets/dashboard', group: 'Main' },
  { label: 'Endpoint Devices', icon: 'MonitorIcon', href: '/assets/endpoint-devices', group: 'Main' },
  { label: 'Reports', icon: 'FileBarChart2Icon', href: '/reports', group: 'Main' },
  { label: 'AI Assistant', icon: 'BotIcon', href: '/chatbot-interface', group: 'Main' },
  { label: 'Admin Panel', icon: 'ShieldCheckIcon', href: '/admin-panel', group: 'Admin' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const groups = ['Main', 'Admin'];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-30 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-slate-200 px-3 ${collapsed ? 'justify-center' : 'gap-2 px-4'}`}>
        <AppLogo size={32} onClick={() => router.push('/dashboard')} />
        {!collapsed && (
          <span className="font-semibold text-slate-900 text-base tracking-tight">
            ITServiceDesk
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-3 mb-1">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="relative group">
                    <button
                      onClick={() => router.push(item.href)}
                      className={`sidebar-nav-item w-full ${isActive ? 'active' : ''} ${
                        collapsed ? 'justify-center px-0' : ''
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        name={item.icon as any}
                        size={18}
                        className={isActive ? 'text-blue-600' : 'text-slate-500'}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                    {/* Tooltip for collapsed */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex items-center gap-1 bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                        {item.badge !== undefined && (
                          <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-slate-200 p-2 space-y-1`}>
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`sidebar-nav-item w-full ${collapsed ? 'justify-center px-0' : ''} group relative`}
          title={collapsed ? 'Expand sidebar' : undefined}
        >
          <Icon
            name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
            size={16}
            className="text-slate-400"
          />
          {!collapsed && <span>Collapse</span>}
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
              Expand sidebar
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          )}
        </button>

        {/* User profile */}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            MR
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">Marcus Reynolds</p>
              <p className="text-xs text-slate-500 truncate">IT Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}