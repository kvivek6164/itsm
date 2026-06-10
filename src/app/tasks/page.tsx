'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Cancelled';
type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeInitials: string;
  project: string;
  projectId: string;
  department: string;
  dueDate: string;
  createdDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
}

const mockTasks: Task[] = [
  { id: 'T-001', title: 'Network topology diagram update', description: 'Update all network diagrams to reflect new infrastructure layout.', status: 'To Do', priority: 'High', assignee: 'Marcus Reynolds', assigneeInitials: 'MR', project: 'IT Infrastructure Modernization', projectId: 'PRJ-001', department: 'IT Operations', dueDate: '06/15/26', createdDate: '05/01/26', tags: ['Network', 'Docs'], estimatedHours: 8, loggedHours: 0 },
  { id: 'T-002', title: 'Server rack labeling audit', description: 'Audit and relabel all server racks in DC1 and DC2.', status: 'To Do', priority: 'Medium', assignee: 'Nathan Park', assigneeInitials: 'NP', project: 'IT Infrastructure Modernization', projectId: 'PRJ-001', department: 'IT Operations', dueDate: '06/20/26', createdDate: '05/02/26', tags: ['Hardware'], estimatedHours: 4, loggedHours: 0 },
  { id: 'T-003', title: 'ITSM data migration script', description: 'Write and test data migration scripts for legacy helpdesk records.', status: 'In Progress', priority: 'Critical', assignee: 'Sarah Chen', assigneeInitials: 'SC', project: 'ITSM Platform Migration', projectId: 'PRJ-002', department: 'IT Service Desk', dueDate: '05/10/26', createdDate: '04/15/26', tags: ['Migration', 'Script'], estimatedHours: 20, loggedHours: 14 },
  { id: 'T-004', title: 'ISO 27001 gap analysis', description: 'Complete gap analysis against ISO 27001 control set.', status: 'In Progress', priority: 'Critical', assignee: 'James Okafor', assigneeInitials: 'JO', project: 'Cybersecurity Compliance Audit', projectId: 'PRJ-003', department: 'Security', dueDate: '05/30/26', createdDate: '04/20/26', tags: ['Security', 'Compliance'], estimatedHours: 40, loggedHours: 22 },
  { id: 'T-005', title: 'ZTNA policy configuration', description: 'Configure access policies for all user groups in ZTNA platform.', status: 'In Progress', priority: 'High', assignee: 'Amara Diallo', assigneeInitials: 'AD', project: 'Zero Trust Network Access', projectId: 'PRJ-006', department: 'Security', dueDate: '05/25/26', createdDate: '04/18/26', tags: ['Security', 'Network'], estimatedHours: 16, loggedHours: 10 },
  { id: 'T-006', title: 'MDM enrollment portal setup', description: 'Configure self-service enrollment portal for corporate devices.', status: 'Review', priority: 'Medium', assignee: 'Nathan Park', assigneeInitials: 'NP', project: 'Mobile Device Management Rollout', projectId: 'PRJ-008', department: 'IT Operations', dueDate: '06/01/26', createdDate: '04/25/26', tags: ['MDM', 'Portal'], estimatedHours: 12, loggedHours: 11 },
  { id: 'T-007', title: 'Onboarding workflow design', description: 'Design automated workflow for new hire IT provisioning.', status: 'Review', priority: 'High', assignee: 'Priya Nair', assigneeInitials: 'PN', project: 'Employee Onboarding Automation', projectId: 'PRJ-004', department: 'HR Technology', dueDate: '05/28/26', createdDate: '04/10/26', tags: ['Automation', 'HR'], estimatedHours: 24, loggedHours: 20 },
  { id: 'T-008', title: 'ERP v12 UAT sign-off', description: 'Obtain final UAT sign-off from Finance team for ERP v12.', status: 'Done', priority: 'Critical', assignee: 'Rebecca Torres', assigneeInitials: 'RT', project: 'ERP System Upgrade', projectId: 'PRJ-007', department: 'Finance IT', dueDate: '02/28/26', createdDate: '02/01/26', tags: ['ERP', 'UAT'], estimatedHours: 8, loggedHours: 9 },
  { id: 'T-009', title: 'Cloud cost optimization report', description: 'Analyze cloud spend and produce optimization recommendations.', status: 'Done', priority: 'Medium', assignee: 'Marcus Reynolds', assigneeInitials: 'MR', project: 'IT Infrastructure Modernization', projectId: 'PRJ-001', department: 'IT Operations', dueDate: '03/15/26', createdDate: '02/20/26', tags: ['Cloud', 'Cost'], estimatedHours: 10, loggedHours: 10 },
  { id: 'T-010', title: 'Security awareness training', description: 'Deliver phishing simulation and security awareness training to all staff.', status: 'To Do', priority: 'High', assignee: 'James Okafor', assigneeInitials: 'JO', project: 'Cybersecurity Compliance Audit', projectId: 'PRJ-003', department: 'Security', dueDate: '07/01/26', createdDate: '05/05/26', tags: ['Security', 'Training'], estimatedHours: 16, loggedHours: 0 },
  { id: 'T-011', title: 'Firewall rule review', description: 'Review and clean up legacy firewall rules across all perimeter devices.', status: 'In Progress', priority: 'High', assignee: 'Amara Diallo', assigneeInitials: 'AD', project: 'Zero Trust Network Access', projectId: 'PRJ-006', department: 'Security', dueDate: '06/10/26', createdDate: '05/03/26', tags: ['Network', 'Security'], estimatedHours: 12, loggedHours: 5 },
  { id: 'T-012', title: 'Backup verification test', description: 'Run full restore test from backup for critical systems.', status: 'Review', priority: 'Critical', assignee: 'David Thornton', assigneeInitials: 'DT', project: 'Data Center Consolidation', projectId: 'PRJ-005', department: 'IT Operations', dueDate: '06/05/26', createdDate: '05/01/26', tags: ['Backup', 'DR'], estimatedHours: 6, loggedHours: 5 },
  { id: 'T-013', title: 'VPN decommission plan', description: 'Create detailed plan for decommissioning legacy VPN infrastructure.', status: 'To Do', priority: 'Medium', assignee: 'Amara Diallo', assigneeInitials: 'AD', project: 'Zero Trust Network Access', projectId: 'PRJ-006', department: 'Security', dueDate: '06/30/26', createdDate: '05/10/26', tags: ['Network', 'VPN'], estimatedHours: 8, loggedHours: 0 },
  { id: 'T-014', title: 'ERP custom module migration', description: 'Migrate 4 custom ERP modules from v8 to v12 API.', status: 'Done', priority: 'Critical', assignee: 'Rebecca Torres', assigneeInitials: 'RT', project: 'ERP System Upgrade', projectId: 'PRJ-007', department: 'Finance IT', dueDate: '01/31/26', createdDate: '10/01/25', tags: ['ERP', 'Dev'], estimatedHours: 80, loggedHours: 92 },
  { id: 'T-015', title: 'DC consolidation risk assessment', description: 'Assess risks for consolidating 3 regional data centers.', status: 'Cancelled', priority: 'High', assignee: 'David Thornton', assigneeInitials: 'DT', project: 'Data Center Consolidation', projectId: 'PRJ-005', department: 'IT Operations', dueDate: '04/30/26', createdDate: '03/01/26', tags: ['Infrastructure', 'Risk'], estimatedHours: 20, loggedHours: 6 },
];

const statusColors: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Review': 'bg-amber-100 text-amber-700',
  'Done': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const statusDotColors: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  'Review': 'bg-amber-500',
  'Done': 'bg-green-500',
  'Cancelled': 'bg-red-500',
};

const priorityColors: Record<TaskPriority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-slate-100 text-slate-600',
};

const avatarColors = ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600'];
const getAvatarColor = (initials: string) => avatarColors[initials.charCodeAt(0) % avatarColors.length];

const ALL_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Done', 'Cancelled'];
const ALL_PRIORITIES: TaskPriority[] = ['Critical', 'High', 'Medium', 'Low'];
const ALL_ASSIGNEES = ['Marcus Reynolds', 'Nathan Park', 'Sarah Chen', 'James Okafor', 'Amara Diallo', 'Priya Nair', 'Rebecca Torres', 'David Thornton'];

// ─── Task Details Dialog ──────────────────────────────────────────────────────
function TaskDetailDialog({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (updated: Task) => void }) {
  const [form, setForm] = useState<Task>({ ...task });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave(form);
    setSaving(false);
  };

  const hoursPercent = form.estimatedHours > 0 ? Math.min(100, (form.loggedHours / form.estimatedHours) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{task.id}</span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 leading-snug">{task.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Created {task.createdDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-4">
            <Icon name="XIcon" size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.status === s
                        ? `${statusColors[s]} border-current ring-2 ring-offset-1 ring-blue-400`
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[s]}`} />
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {ALL_PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.priority === p
                        ? `${priorityColors[p]} border-current ring-2 ring-offset-1 ring-blue-400`
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Assignee & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assignee</label>
              <select
                className="input-field"
                value={form.assignee}
                onChange={(e) => {
                  const name = e.target.value;
                  const initials = name.split(' ').map((n) => n[0]).join('');
                  setForm((f) => ({ ...f, assignee: name, assigneeInitials: initials }));
                }}
              >
                {ALL_ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Department</label>
              <input
                className="input-field"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </div>
          </div>

          {/* Project & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Project</label>
              <input
                className="input-field"
                value={form.project}
                onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Due Date</label>
              <input
                className="input-field"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Estimated Hours</label>
              <input
                type="number"
                className="input-field"
                value={form.estimatedHours}
                onChange={(e) => setForm((f) => ({ ...f, estimatedHours: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Logged Hours</label>
              <input
                type="number"
                className="input-field"
                value={form.loggedHours}
                onChange={(e) => setForm((f) => ({ ...f, loggedHours: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Hours progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className={form.loggedHours > form.estimatedHours ? 'text-red-500 font-medium' : ''}>
                {form.loggedHours}h / {form.estimatedHours}h ({Math.round(hoursPercent)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${form.loggedHours > form.estimatedHours ? 'bg-red-400' : 'bg-blue-500'}`}
                style={{ width: `${hoursPercent}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                  {tag}
                  <button
                    onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
                    className="hover:text-red-500 transition-colors"
                  >
                    <Icon name="XIcon" size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? (
              <><Icon name="Loader2Icon" size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><Icon name="CheckIcon" size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Status Dialog ─────────────────────────────────────────────────────
function ChangeStatusDialog({ count, onClose, onApply }: { count: number; onClose: () => void; onApply: (status: TaskStatus) => void }) {
  const [selected, setSelected] = useState<TaskStatus | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Change Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">Update status for {count} selected task{count > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Icon name="XIcon" size={15} className="text-slate-500" />
          </button>
        </div>
        <div className="p-5 space-y-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                selected === s
                  ? 'border-blue-500 bg-blue-50 text-blue-700' :'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotColors[s]}`} />
              {s}
              {selected === s && <Icon name="CheckIcon" size={14} className="ml-auto text-blue-600" />}
            </button>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={() => selected && onApply(selected)}
            disabled={!selected}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  const [sortField, setSortField] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const departments = ['All', ...Array.from(new Set(mockTasks.map((t) => t.department)))];
  const projects = ['All', ...Array.from(new Set(mockTasks.map((t) => t.project)))];

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchStatus = filterStatus === 'All' || t.status === filterStatus;
      const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
      const matchDept = filterDept === 'All' || t.department === filterDept;
      const matchProject = filterProject === 'All' || t.project === filterProject;
      return matchSearch && matchStatus && matchPriority && matchDept && matchProject;
    });

    result = [...result].sort((a, b) => {
      let av: string | number = (a as any)[sortField] ?? '';
      let bv: string | number = (b as any)[sortField] ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, search, filterStatus, filterPriority, filterDept, filterProject, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'To Do').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    review: tasks.filter((t) => t.status === 'Review').length,
    done: tasks.filter((t) => t.status === 'Done').length,
  }), [tasks]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length && paginated.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((t) => t.id)));
    }
  };

  const handleBulkStatusApply = (newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => selectedRows.has(t.id) ? { ...t, status: newStatus } : t));
    setSelectedRows(new Set());
    setShowChangeStatus(false);
  };

  const handleTaskSave = (updated: Task) => {
    setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setDetailTask(null);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <Icon name="ChevronsUpDownIcon" size={12} className="text-slate-300 ml-1" />;
    return <Icon name={sortDir === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} className="text-blue-500 ml-1" />;
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterDept('All');
    setFilterProject('All');
    setPage(1);
  };

  const hasActiveFilters = search || filterStatus !== 'All' || filterPriority !== 'All' || filterDept !== 'All' || filterProject !== 'All';

  return (
    <AppLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track all tasks across projects</p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-red-300 transition-colors">
                <Icon name="XCircleIcon" size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-600 bg-slate-50', icon: 'ListChecksIcon' },
            { label: 'To Do', value: stats.todo, color: 'text-slate-600 bg-slate-50', icon: 'CircleIcon' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600 bg-blue-50', icon: 'LoaderIcon' },
            { label: 'Review', value: stats.review, color: 'text-amber-600 bg-amber-50', icon: 'EyeIcon' },
            { label: 'Done', value: stats.done, color: 'text-green-600 bg-green-50', icon: 'CheckCircleIcon' },
          ].map((s) => (
            <div key={s.label} className="metric-card flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon as any} size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
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
                placeholder="Search tasks, assignees, tags..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="input-field w-auto" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="All">All Status</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input-field w-auto" value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}>
              <option value="All">All Priority</option>
              {ALL_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="input-field w-auto" value={filterDept} onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}>
              {departments.map((d) => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
            <select className="input-field w-auto max-w-[200px]" value={filterProject} onChange={(e) => { setFilterProject(e.target.value); setPage(1); }}>
              <option value="All">All Projects</option>
              {projects.filter((p) => p !== 'All').map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-2">{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Bulk Action Bar */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl px-5 py-3 slide-up shadow-md">
            <span className="text-sm font-medium">{selectedRows.size} task{selectedRows.size > 1 ? 's' : ''} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChangeStatus(true)}
                className="flex items-center gap-1.5 text-xs bg-white text-blue-700 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Icon name="RefreshCwIcon" size={13} />
                Change Status
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors"
              >
                <Icon name="XIcon" size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header-cell w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="table-header-cell cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center">ID <SortIcon field="id" /></div>
                  </th>
                  {[
                    { label: 'Task', field: 'title' },
                    { label: 'Status', field: 'status' },
                    { label: 'Priority', field: 'priority' },
                    { label: 'Assignee', field: 'assignee' },
                    { label: 'Project', field: 'project' },
                    { label: 'Department', field: 'department' },
                    { label: 'Due Date', field: 'dueDate' },
                    { label: 'Hours', field: 'loggedHours' },
                    { label: 'Tags', field: '' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`table-header-cell ${col.field ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}`}
                      onClick={() => col.field && handleSort(col.field)}
                    >
                      <div className="flex items-center">
                        {col.label}
                        {col.field && <SortIcon field={col.field} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((task) => (
                  <tr key={task.id} className={`table-row group ${selectedRows.has(task.id) ? 'bg-blue-50/50' : ''}`}>
                    {/* Checkbox */}
                    <td className="table-cell w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(task.id)}
                        onChange={() => toggleRow(task.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </td>

                    {/* ID — clickable */}
                    <td className="table-cell">
                      <button
                        onClick={() => router.push(`/task-detail/${task.id}`)}
                        className="font-mono text-xs text-blue-600 font-semibold hover:underline whitespace-nowrap"
                      >
                        {task.id}
                      </button>
                    </td>

                    {/* Task title */}
                    <td className="table-cell max-w-[220px]">
                      <button
                        onClick={() => router.push(`/task-detail/${task.id}`)}
                        className="text-left hover:text-blue-600 transition-colors"
                      >
                        <p className="font-medium text-slate-900 text-sm leading-snug line-clamp-1 hover:text-blue-600">{task.title}</p>
                      </button>
                    </td>

                    {/* Status — badge only, no dropdown */}
                    <td className="table-cell">
                      <span className={`badge ${statusColors[task.status]}`}>{task.status}</span>
                    </td>

                    {/* Priority */}
                    <td className="table-cell">
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </td>

                    {/* Assignee */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${getAvatarColor(task.assigneeInitials)}`}>
                          {task.assigneeInitials}
                        </div>
                        <span className="text-sm text-slate-700 truncate max-w-[100px]">{task.assignee}</span>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="table-cell max-w-[160px]">
                      <div>
                        <p className="text-sm text-slate-700 line-clamp-1">{task.project}</p>
                        <p className="text-xs text-slate-400 font-mono">{task.projectId}</p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="table-cell">
                      <span className="text-sm text-slate-600">{task.department}</span>
                    </td>

                    {/* Due Date */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Icon name="CalendarIcon" size={13} className="text-slate-400" />
                        {task.dueDate}
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="table-cell">
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">{task.loggedHours}</span>
                        <span className="text-slate-400">/{task.estimatedHours}h</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full mt-1 w-16 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${task.loggedHours > task.estimatedHours ? 'bg-red-400' : 'bg-blue-400'}`}
                          style={{ width: `${Math.min(100, task.estimatedHours > 0 ? (task.loggedHours / task.estimatedHours) * 100 : 0)}%` }}
                        />
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">{tag}</span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-xs rounded">+{task.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Icon name="ClipboardXIcon" size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tasks found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:underline">Clear all filters</button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="ChevronLeftIcon" size={14} className="text-slate-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="ChevronRightIcon" size={14} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Dialog */}
      {detailTask && (
        <TaskDetailDialog
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onSave={handleTaskSave}
        />
      )}

      {/* Change Status Dialog */}
      {showChangeStatus && (
        <ChangeStatusDialog
          count={selectedRows.size}
          onClose={() => setShowChangeStatus(false)}
          onApply={handleBulkStatusApply}
        />
      )}
    </AppLayout>
  );
}
