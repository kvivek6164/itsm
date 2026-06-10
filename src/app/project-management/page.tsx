'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';
import KanbanBoard from './components/KanbanBoard';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

type ProjectStatus = 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Planning';
type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  manager: string;
  managerInitials: string;
  department: string;
  startDate: string;
  dueDate: string;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  members: number;
  budget: string;
  spent: string;
  tags: string[];
}

const mockProjects: Project[] = [
  {
    id: 'PRJ-001', name: 'IT Infrastructure Modernization', description: 'Upgrade core network infrastructure, replace aging servers, and migrate workloads to hybrid cloud.',
    status: 'Active', priority: 'Critical', manager: 'Marcus Reynolds', managerInitials: 'MR', department: 'IT Operations',
    startDate: '01/15/26', dueDate: '06/30/26', progress: 42, tasksTotal: 38, tasksDone: 16, members: 8, budget: '$240,000', spent: '$98,400', tags: ['Infrastructure', 'Cloud'],
  },
  {
    id: 'PRJ-002', name: 'ITSM Platform Migration', description: 'Migrate from legacy helpdesk to new ITSM platform with full data migration and staff training.',
    status: 'Active', priority: 'High', manager: 'Sarah Chen', managerInitials: 'SC', department: 'IT Service Desk',
    startDate: '02/01/26', dueDate: '05/15/26', progress: 68, tasksTotal: 24, tasksDone: 16, members: 5, budget: '$85,000', spent: '$57,800', tags: ['ITSM', 'Migration'],
  },
  {
    id: 'PRJ-003', name: 'Cybersecurity Compliance Audit', description: 'Conduct full ISO 27001 gap analysis, remediate findings, and prepare for external certification audit.',
    status: 'Active', priority: 'Critical', manager: 'James Okafor', managerInitials: 'JO', department: 'Security',
    startDate: '03/01/26', dueDate: '07/31/26', progress: 25, tasksTotal: 52, tasksDone: 13, members: 6, budget: '$120,000', spent: '$30,000', tags: ['Security', 'Compliance'],
  },
  {
    id: 'PRJ-004', name: 'Employee Onboarding Automation', description: 'Automate IT provisioning workflows for new hires — accounts, devices, and access in under 2 hours.',
    status: 'Planning', priority: 'Medium', manager: 'Priya Nair', managerInitials: 'PN', department: 'HR Technology',
    startDate: '04/01/26', dueDate: '08/31/26', progress: 8, tasksTotal: 18, tasksDone: 1, members: 4, budget: '$45,000', spent: '$3,600', tags: ['Automation', 'HR'],
  },
  {
    id: 'PRJ-005', name: 'Data Center Consolidation', description: 'Consolidate 3 regional data centers into 1 primary and 1 DR site, reducing operational costs by 35%.',
    status: 'On Hold', priority: 'High', manager: 'David Thornton', managerInitials: 'DT', department: 'IT Operations',
    startDate: '11/01/25', dueDate: '09/30/26', progress: 31, tasksTotal: 45, tasksDone: 14, members: 10, budget: '$380,000', spent: '$117,800', tags: ['Infrastructure', 'Cost Reduction'],
  },
  {
    id: 'PRJ-006', name: 'Zero Trust Network Access', description: 'Implement ZTNA architecture replacing legacy VPN for all remote workforce access.',
    status: 'Active', priority: 'High', manager: 'Amara Diallo', managerInitials: 'AD', department: 'Security',
    startDate: '02/15/26', dueDate: '06/15/26', progress: 55, tasksTotal: 30, tasksDone: 16, members: 5, budget: '$95,000', spent: '$52,250', tags: ['Security', 'Network'],
  },
  {
    id: 'PRJ-007', name: 'ERP System Upgrade', description: 'Upgrade ERP from v8 to v12, including custom module migration and 3-month parallel run.',
    status: 'Completed', priority: 'Critical', manager: 'Rebecca Torres', managerInitials: 'RT', department: 'Finance IT',
    startDate: '09/01/25', dueDate: '02/28/26', progress: 100, tasksTotal: 60, tasksDone: 60, members: 12, budget: '$520,000', spent: '$498,000', tags: ['ERP', 'Finance'],
  },
  {
    id: 'PRJ-008', name: 'Mobile Device Management Rollout', description: 'Deploy MDM solution across 1,200 corporate devices with policy enforcement and remote wipe capability.',
    status: 'Active', priority: 'Medium', manager: 'Nathan Park', managerInitials: 'NP', department: 'IT Operations',
    startDate: '03/15/26', dueDate: '07/15/26', progress: 18, tasksTotal: 22, tasksDone: 4, members: 3, budget: '$62,000', spent: '$11,160', tags: ['MDM', 'Mobile'],
  },
];

const statusColors: Record<ProjectStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  Completed: 'bg-slate-100 text-slate-600',
  Cancelled: 'bg-red-100 text-red-700',
  Planning: 'bg-blue-100 text-blue-700',
};

const priorityColors: Record<ProjectPriority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-slate-100 text-slate-600',
};

const progressColor = (p: number) => {
  if (p >= 80) return 'bg-green-500';
  if (p >= 50) return 'bg-blue-500';
  if (p >= 25) return 'bg-amber-500';
  return 'bg-red-400';
};

const avatarColors = ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600'];
const getAvatarColor = (initials: string) => avatarColors[initials.charCodeAt(0) % avatarColors.length];

interface CreateProjectForm {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  manager: string;
  department: string;
  startDate: string;
  dueDate: string;
  budget: string;
  tags: string;
}

const emptyForm: CreateProjectForm = {
  name: '', description: '', status: 'Planning', priority: 'Medium',
  manager: '', department: '', startDate: '', dueDate: '', budget: '', tags: '',
};

export default function ProjectManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [activeTab, setActiveTab] = useState<'projects' | 'kanban'>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form, setForm] = useState<CreateProjectForm>(emptyForm);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [formErrors, setFormErrors] = useState<Partial<CreateProjectForm>>({});
  const [listFirst, setListFirst] = useState(0);
  const [listRows, setListRows] = useState(5);

  const departments = ['All', ...Array.from(new Set(mockProjects.map((p) => p.department)))];

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchPriority = filterPriority === 'All' || p.priority === filterPriority;
      const matchDept = filterDept === 'All' || p.department === filterDept;
      return matchSearch && matchStatus && matchPriority && matchDept;
    });
  }, [projects, search, filterStatus, filterPriority, filterDept]);

  const paginatedList = useMemo(() => filtered.slice(listFirst, listFirst + listRows), [filtered, listFirst, listRows]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => p.status === 'Active').length,
    onHold: projects.filter((p) => p.status === 'On Hold').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
  }), [projects]);

  const validate = () => {
    const errs: Partial<CreateProjectForm> = {};
    if (!form.name.trim()) errs.name = 'Project name is required';
    if (!form.manager.trim()) errs.manager = 'Manager is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const initials = form.manager.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    const newProject: Project = {
      id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
      name: form.name, description: form.description,
      status: form.status, priority: form.priority,
      manager: form.manager, managerInitials: initials,
      department: form.department || 'General',
      startDate: form.startDate, dueDate: form.dueDate,
      progress: 0, tasksTotal: 0, tasksDone: 0, members: 1,
      budget: form.budget ? `$${form.budget}` : '$0',
      spent: '$0',
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    setProjects([newProject, ...projects]);
    setShowCreateDialog(false);
    setForm(emptyForm);
    setFormErrors({});
  };

  const handleFormChange = (field: keyof CreateProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <AppLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Project Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track and manage all IT projects across departments</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'projects' && (
              <button className="btn-primary" onClick={() => setShowCreateDialog(true)}>
                <Icon name="PlusIcon" size={16} />
                New Project
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icon name="FolderKanbanIcon" size={15} />
            Projects
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icon name="LayoutIcon" size={15} />
            Kanban Board
          </button>
        </div>

        {/* Kanban Tab */}
        {activeTab === 'kanban' && <KanbanBoard />}

        {activeTab === 'projects' && <>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: stats.total, icon: 'FolderKanbanIcon', color: 'text-blue-600 bg-blue-50' },
            { label: 'Active', value: stats.active, icon: 'PlayCircleIcon', color: 'text-green-600 bg-green-50' },
            { label: 'On Hold', value: stats.onHold, icon: 'PauseCircleIcon', color: 'text-amber-600 bg-amber-50' },
            { label: 'Completed', value: stats.completed, icon: 'CheckCircleIcon', color: 'text-slate-600 bg-slate-100' },
          ].map((s) => (
            <div key={s.label} className="metric-card flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon as any} size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-9"
                placeholder="Search projects, managers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="input-field w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              {(['Active', 'Planning', 'On Hold', 'Completed', 'Cancelled'] as ProjectStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select className="input-field w-auto" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="All">All Priority</option>
              {(['Critical', 'High', 'Medium', 'Low'] as ProjectPriority[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select className="input-field w-auto" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              {departments.map((d) => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon name="LayoutGridIcon" size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon name="ListIcon" size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => router.push(`/project-management/${project.id}`)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{project.id}</span>
                        <span className={`badge ${priorityColors[project.priority]}`}>{project.priority}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{project.name}</h3>
                    </div>
                    <span className={`badge ml-2 flex-shrink-0 ${statusColors[project.status]}`}>{project.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500">Progress</span>
                      <span className="text-xs font-semibold text-slate-700">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${progressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{project.tasksDone}/{project.tasksTotal} tasks completed</p>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Icon name="CalendarIcon" size={12} className="text-slate-400" />
                      <span>Due {project.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="UsersIcon" size={12} className="text-slate-400" />
                      <span>{project.members} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="BuildingIcon" size={12} className="text-slate-400" />
                      <span className="truncate">{project.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="DollarSignIcon" size={12} className="text-slate-400" />
                      <span>{project.budget}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Manager */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(project.managerInitials)}`}>
                      {project.managerInitials}
                    </div>
                    <span className="text-xs text-slate-600">{project.manager}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header-cell">Project</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Priority</th>
                  <th className="table-header-cell">Manager</th>
                  <th className="table-header-cell">Progress</th>
                  <th className="table-header-cell">Due Date</th>
                  <th className="table-header-cell">Budget</th>
                  <th className="table-header-cell">Members</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((project) => (
                  <tr key={project.id} className="table-row cursor-pointer" onClick={() => router.push(`/project-management/${project.id}`)}>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-900 hover:text-blue-600 transition-colors">{project.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{project.id}</p>
                      </div>
                    </td>
                    <td className="table-cell"><span className={`badge ${statusColors[project.status]}`}>{project.status}</span></td>
                    <td className="table-cell"><span className={`badge ${priorityColors[project.priority]}`}>{project.priority}</span></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(project.managerInitials)}`}>
                          {project.managerInitials}
                        </div>
                        <span>{project.manager}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${progressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 w-8 text-right">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-600">{project.dueDate}</td>
                    <td className="table-cell text-slate-600">{project.budget}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <Icon name="UsersIcon" size={13} className="text-slate-400" />
                        <span>{project.members}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Icon name="FolderOpenIcon" size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No projects found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="border-t border-slate-200 px-4 py-2">
                <Paginator
                  first={listFirst}
                  rows={listRows}
                  totalRecords={filtered.length}
                  rowsPerPageOptions={[5, 10, 20]}
                  onPageChange={(e) => { setListFirst(e.first); setListRows(e.rows); }}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 && viewMode === 'grid' && (
          <div className="py-16 text-center">
            <Icon name="FolderOpenIcon" size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No projects found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
        </>}
      </div>

      {/* Create Project Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create New Project</h2>
                <p className="text-sm text-slate-500 mt-0.5">Fill in the details to create a new project</p>
              </div>
              <button onClick={() => { setShowCreateDialog(false); setForm(emptyForm); setFormErrors({}); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="XIcon" size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                <input className={`input-field ${formErrors.name ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="e.g. Network Infrastructure Upgrade" value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Brief description of the project scope and objectives..." value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select className="input-field" value={form.status} onChange={(e) => handleFormChange('status', e.target.value as ProjectStatus)}>
                    {(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'] as ProjectStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <select className="input-field" value={form.priority} onChange={(e) => handleFormChange('priority', e.target.value as ProjectPriority)}>
                    {(['Critical', 'High', 'Medium', 'Low'] as ProjectPriority[]).map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Manager <span className="text-red-500">*</span></label>
                  <input className={`input-field ${formErrors.manager ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="e.g. Marcus Reynolds" value={form.manager} onChange={(e) => handleFormChange('manager', e.target.value)} />
                  {formErrors.manager && <p className="text-xs text-red-500 mt-1">{formErrors.manager}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                  <input className="input-field" placeholder="e.g. IT Operations" value={form.department} onChange={(e) => handleFormChange('department', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" className={`input-field ${formErrors.startDate ? 'border-red-400 focus:ring-red-400' : ''}`} value={form.startDate} onChange={(e) => handleFormChange('startDate', e.target.value)} />
                  {formErrors.startDate && <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" className={`input-field ${formErrors.dueDate ? 'border-red-400 focus:ring-red-400' : ''}`} value={form.dueDate} onChange={(e) => handleFormChange('dueDate', e.target.value)} />
                  {formErrors.dueDate && <p className="text-xs text-red-500 mt-1">{formErrors.dueDate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget ($)</label>
                  <input type="number" className="input-field" placeholder="e.g. 50000" value={form.budget} onChange={(e) => handleFormChange('budget', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
                  <input className="input-field" placeholder="e.g. Security, Cloud (comma-separated)" value={form.tags} onChange={(e) => handleFormChange('tags', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button className="btn-secondary" onClick={() => { setShowCreateDialog(false); setForm(emptyForm); setFormErrors({}); }}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate}>
                <Icon name="PlusIcon" size={15} />
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
