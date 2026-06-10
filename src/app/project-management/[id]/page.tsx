'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

// ─── Types ───────────────────────────────────────────────────────────────────
type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';
type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Overdue';

interface Task {
  id: string; title: string; assignee: string; assigneeInitials: string;
  status: TaskStatus; priority: TaskPriority; dueDate: string; estimate: string;
  description: string;
}
interface Member {
  id: string; name: string; initials: string; role: string; email: string;
  department: string; joinedDate: string; tasksAssigned: number;
}
interface Milestone {
  id: string; title: string; description: string; dueDate: string;
  status: MilestoneStatus; progress: number; owner: string;
}
interface TimeLog {
  id: string; member: string; memberInitials: string; date: string;
  hours: number; description: string; taskRef: string; billable: boolean;
}
interface ProjectRisk {
  id: string; title: string; severity: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low'; impact: string; mitigation: string; owner: string; status: 'Open' | 'Mitigated' | 'Closed';
}
interface Purchase {
  id: string; item: string; vendor: string; amount: string; date: string;
  category: string; requestedBy: string; status: 'Approved' | 'Pending' | 'Rejected';
  attachment: string; attachmentName: string;
}
interface ActivityLog {
  id: string; user: string; userInitials: string; action: string; target: string;
  type: 'task' | 'member' | 'milestone' | 'risk' | 'purchase' | 'status' | 'comment';
  timestamp: string; details?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const projectsData: Record<string, {
  id: string; name: string; description: string; status: string; priority: string;
  manager: string; managerInitials: string; department: string; startDate: string;
  dueDate: string; progress: number; tasksTotal: number; tasksDone: number;
  members: number; budget: string; spent: string; tags: string[];
  objective: string; scope: string;
}> = {
  'PRJ-001': {
    id: 'PRJ-001', name: 'IT Infrastructure Modernization',
    description: 'Upgrade core network infrastructure, replace aging servers, and migrate workloads to hybrid cloud.',
    objective: 'Reduce infrastructure operational costs by 30% and improve system availability to 99.9% SLA through modernization of core IT assets.',
    scope: 'Network switches, core servers (32 units), storage arrays, and migration of 18 workloads to Azure hybrid cloud.',
    status: 'Active', priority: 'Critical', manager: 'Marcus Reynolds', managerInitials: 'MR',
    department: 'IT Operations', startDate: '01/15/26', dueDate: '06/30/26',
    progress: 42, tasksTotal: 38, tasksDone: 16, members: 8,
    budget: '$240,000', spent: '$98,400', tags: ['Infrastructure', 'Cloud'],
  },
  'PRJ-002': {
    id: 'PRJ-002', name: 'ITSM Platform Migration',
    description: 'Migrate from legacy helpdesk to new ITSM platform with full data migration and staff training.',
    objective: 'Improve ticket resolution time by 40% and agent productivity by 25% through modern ITSM tooling.',
    scope: 'Full data migration of 50,000+ tickets, 120 agent accounts, SLA policies, automation rules, and integrations.',
    status: 'Active', priority: 'High', manager: 'Sarah Chen', managerInitials: 'SC',
    department: 'IT Service Desk', startDate: '02/01/26', dueDate: '05/15/26',
    progress: 68, tasksTotal: 24, tasksDone: 16, members: 5,
    budget: '$85,000', spent: '$57,800', tags: ['ITSM', 'Migration'],
  },
};

const mockTasks: Task[] = [
  { id: 'TSK-001', title: 'Network topology assessment and documentation', assignee: 'James Okafor', assigneeInitials: 'JO', status: 'Done', priority: 'High', dueDate: '02/15/26', estimate: '16h', description: 'Document current network topology, identify bottlenecks and single points of failure.' },
  { id: 'TSK-002', title: 'Procure replacement core switches (Cisco Catalyst 9300)', assignee: 'Marcus Reynolds', assigneeInitials: 'MR', status: 'Done', priority: 'Critical', dueDate: '02/28/26', estimate: '8h', description: 'Issue PO for 12x Cisco Catalyst 9300 switches. Coordinate with procurement.' },
  { id: 'TSK-003', title: 'Server rack decommission — Building A, Floor 2', assignee: 'David Thornton', assigneeInitials: 'DT', status: 'In Progress', priority: 'High', dueDate: '04/10/26', estimate: '24h', description: 'Safely decommission 8 aging Dell PowerEdge R620 servers. Data wipe and asset disposal.' },
  { id: 'TSK-004', title: 'Azure landing zone configuration', assignee: 'Sarah Chen', assigneeInitials: 'SC', status: 'In Progress', priority: 'Critical', dueDate: '04/20/26', estimate: '40h', description: 'Configure Azure landing zone with hub-spoke topology, policies, and governance.' },
  { id: 'TSK-005', title: 'Workload migration — Finance ERP (Phase 1)', assignee: 'Priya Nair', assigneeInitials: 'PN', status: 'To Do', priority: 'Critical', dueDate: '05/15/26', estimate: '80h', description: 'Migrate Finance ERP application to Azure IaaS. Includes test migration and cutover plan.' },
  { id: 'TSK-006', title: 'Network monitoring setup (SolarWinds)', assignee: 'Nathan Park', assigneeInitials: 'NP', status: 'In Review', priority: 'Medium', dueDate: '04/30/26', estimate: '20h', description: 'Configure SolarWinds NPM for new network infrastructure. Set up dashboards and alerts.' },
  { id: 'TSK-007', title: 'Disaster recovery runbook update', assignee: 'Amara Diallo', assigneeInitials: 'AD', status: 'To Do', priority: 'High', dueDate: '06/01/26', estimate: '12h', description: 'Update DR runbooks to reflect new hybrid cloud architecture.' },
  { id: 'TSK-008', title: 'Staff training — Azure administration', assignee: 'James Okafor', assigneeInitials: 'JO', status: 'Blocked', priority: 'Medium', dueDate: '05/30/26', estimate: '16h', description: 'Conduct Azure admin training for 6 IT staff. Blocked pending Azure environment setup.' },
];

const mockMembers: Member[] = [
  { id: 'M001', name: 'Marcus Reynolds', initials: 'MR', role: 'Project Manager', email: 'marcus.reynolds@company.com', department: 'IT Operations', joinedDate: '01/15/26', tasksAssigned: 3 },
  { id: 'M002', name: 'James Okafor', initials: 'JO', role: 'Network Engineer', email: 'james.okafor@company.com', department: 'IT Operations', joinedDate: '01/15/26', tasksAssigned: 5 },
  { id: 'M003', name: 'Sarah Chen', initials: 'SC', role: 'Cloud Architect', email: 'sarah.chen@company.com', department: 'Cloud & DevOps', joinedDate: '01/20/26', tasksAssigned: 7 },
  { id: 'M004', name: 'David Thornton', initials: 'DT', role: 'Systems Engineer', email: 'david.thornton@company.com', department: 'IT Operations', joinedDate: '01/20/26', tasksAssigned: 4 },
  { id: 'M005', name: 'Priya Nair', initials: 'PN', role: 'Migration Specialist', email: 'priya.nair@company.com', department: 'IT Operations', joinedDate: '02/01/26', tasksAssigned: 6 },
  { id: 'M006', name: 'Nathan Park', initials: 'NP', role: 'Network Analyst', email: 'nathan.park@company.com', department: 'IT Operations', joinedDate: '02/01/26', tasksAssigned: 3 },
  { id: 'M007', name: 'Amara Diallo', initials: 'AD', role: 'Security Engineer', email: 'amara.diallo@company.com', department: 'Security', joinedDate: '02/10/26', tasksAssigned: 4 },
  { id: 'M008', name: 'Rebecca Torres', initials: 'RT', role: 'Business Analyst', email: 'rebecca.torres@company.com', department: 'IT Strategy', joinedDate: '02/10/26', tasksAssigned: 2 },
];

const mockMilestones: Milestone[] = [
  { id: 'MS-001', title: 'Phase 1: Assessment & Planning Complete', description: 'All network assessments, server inventories, and migration plans finalized and approved.', dueDate: '02/28/26', status: 'Completed', progress: 100, owner: 'Marcus Reynolds' },
  { id: 'MS-002', title: 'Phase 2: Hardware Procurement & Delivery', description: 'All replacement hardware procured, delivered, and staged in data center.', dueDate: '03/31/26', status: 'Completed', progress: 100, owner: 'David Thornton' },
  { id: 'MS-003', title: 'Phase 3: Core Network Upgrade', description: 'Replace all core and distribution switches. Validate connectivity and performance.', dueDate: '04/30/26', status: 'In Progress', progress: 65, owner: 'James Okafor' },
  { id: 'MS-004', title: 'Phase 4: Server Decommission & Cloud Migration', description: 'Decommission 32 legacy servers and migrate 18 workloads to Azure hybrid cloud.', dueDate: '05/31/26', status: 'Upcoming', progress: 15, owner: 'Sarah Chen' },
  { id: 'MS-005', title: 'Phase 5: Testing, DR Validation & Go-Live', description: 'Full end-to-end testing, DR failover validation, and production go-live sign-off.', dueDate: '06/30/26', status: 'Upcoming', progress: 0, owner: 'Marcus Reynolds' },
];

const mockTimeLogs: TimeLog[] = [
  { id: 'TL-001', member: 'James Okafor', memberInitials: 'JO', date: '03/20/26', hours: 6, description: 'Network topology documentation and Visio diagrams', taskRef: 'TSK-001', billable: false },
  { id: 'TL-002', member: 'Sarah Chen', memberInitials: 'SC', date: '03/21/26', hours: 8, description: 'Azure landing zone hub-spoke configuration', taskRef: 'TSK-004', billable: false },
  { id: 'TL-003', member: 'David Thornton', memberInitials: 'DT', date: '03/22/26', hours: 5, description: 'Server rack decommission prep — cable labeling and documentation', taskRef: 'TSK-003', billable: false },
  { id: 'TL-004', member: 'Nathan Park', memberInitials: 'NP', date: '03/23/26', hours: 4, description: 'SolarWinds NPM initial configuration and node discovery', taskRef: 'TSK-006', billable: false },
  { id: 'TL-005', member: 'Marcus Reynolds', memberInitials: 'MR', date: '03/24/26', hours: 3, description: 'Stakeholder status meeting and project plan update', taskRef: 'PRJ-001', billable: false },
  { id: 'TL-006', member: 'Priya Nair', memberInitials: 'PN', date: '03/25/26', hours: 7, description: 'Finance ERP test migration to Azure staging environment', taskRef: 'TSK-005', billable: false },
  { id: 'TL-007', member: 'Amara Diallo', memberInitials: 'AD', date: '03/26/26', hours: 4, description: 'Security policy review for Azure landing zone', taskRef: 'TSK-004', billable: false },
];

const mockRisks: ProjectRisk[] = [
  { id: 'RSK-001', title: 'Azure migration timeline slippage due to workload complexity', severity: 'High', probability: 'Medium', impact: 'Phase 4 delayed by 4-6 weeks, affecting go-live date', mitigation: 'Engage Azure FastTrack team. Run parallel migrations where possible.', owner: 'Sarah Chen', status: 'Open' },
  { id: 'RSK-002', title: 'Hardware delivery delays from supplier', severity: 'Medium', probability: 'Low', impact: 'Phase 3 network upgrade delayed by 2-3 weeks', mitigation: 'Secondary supplier identified. PO placed 6 weeks in advance.', owner: 'David Thornton', status: 'Mitigated' },
  { id: 'RSK-003', title: 'Staff availability during critical migration windows', severity: 'Medium', probability: 'Medium', impact: 'Reduced team capacity during peak migration phases', mitigation: 'Resource plan locked. Contractor backup identified for key roles.', owner: 'Marcus Reynolds', status: 'Open' },
  { id: 'RSK-004', title: 'Data loss during server decommission', severity: 'High', probability: 'Low', impact: 'Irreversible loss of business-critical data', mitigation: 'Triple-verified backup policy. Data wipe only after 30-day retention.', owner: 'David Thornton', status: 'Mitigated' },
];

const mockPurchases: Purchase[] = [
  { id: 'PUR-001', item: 'Cisco Catalyst 9300 Switches (x12)', vendor: 'Cisco Systems', amount: '$48,000', date: '02/10/26', category: 'Hardware', requestedBy: 'Marcus Reynolds', status: 'Approved', attachment: '#', attachmentName: 'cisco_po_001.pdf' },
  { id: 'PUR-002', item: 'Azure Reserved Instances (1-year)', vendor: 'Microsoft Azure', amount: '$24,500', date: '03/01/26', category: 'Cloud Services', requestedBy: 'Sarah Chen', status: 'Approved', attachment: '#', attachmentName: 'azure_ri_invoice.pdf' },
  { id: 'PUR-003', item: 'SolarWinds NPM License (50 nodes)', vendor: 'SolarWinds', amount: '$8,200', date: '03/15/26', category: 'Software', requestedBy: 'Nathan Park', status: 'Approved', attachment: '#', attachmentName: 'solarwinds_license.pdf' },
  { id: 'PUR-004', item: 'Dell PowerEdge R750 Servers (x4)', vendor: 'Dell Technologies', amount: '$32,000', date: '03/22/26', category: 'Hardware', requestedBy: 'David Thornton', status: 'Pending', attachment: '#', attachmentName: 'dell_quote_r750.pdf' },
  { id: 'PUR-005', item: 'Azure Training Credits (6 staff)', vendor: 'Microsoft Learning', amount: '$3,600', date: '04/01/26', category: 'Training', requestedBy: 'James Okafor', status: 'Pending', attachment: '#', attachmentName: 'training_credits_req.pdf' },
  { id: 'PUR-006', title: 'Fiber Optic Cabling (500m)', vendor: 'Belden Inc.', amount: '$2,100', date: '04/05/26', category: 'Hardware', requestedBy: 'James Okafor', status: 'Rejected', attachment: '#', attachmentName: 'fiber_quote.pdf' } as any,
];

const mockActivityLogs: ActivityLog[] = [
  { id: 'ACT-001', user: 'Sarah Chen', userInitials: 'SC', action: 'updated status of', target: 'Azure landing zone configuration', type: 'task', timestamp: '2 hours ago', details: 'Changed from "To Do" to "In Progress"' },
  { id: 'ACT-002', user: 'David Thornton', userInitials: 'DT', action: 'completed task', target: 'Server rack decommission prep', type: 'task', timestamp: '5 hours ago', details: 'Marked as Done' },
  { id: 'ACT-003', user: 'Marcus Reynolds', userInitials: 'MR', action: 'added milestone', target: 'Phase 3: Core Network Upgrade', type: 'milestone', timestamp: '1 day ago', details: 'New milestone added with due date 04/30/26' },
  { id: 'ACT-004', user: 'James Okafor', userInitials: 'JO', action: 'logged 6 hours on', target: 'Network topology documentation', type: 'task', timestamp: '2 days ago', details: '6 billable hours logged' },
  { id: 'ACT-005', user: 'Priya Nair', userInitials: 'PN', action: 'added purchase request for', target: 'Dell PowerEdge R750 Servers', type: 'purchase', timestamp: '3 days ago', details: 'Purchase request PUR-004 submitted for $32,000' },
  { id: 'ACT-006', user: 'Marcus Reynolds', userInitials: 'MR', action: 'changed project status to', target: 'Active', type: 'status', timestamp: '4 days ago', details: 'Project moved from Planning to Active' },
  { id: 'ACT-007', user: 'Amara Diallo', userInitials: 'AD', action: 'added risk', target: 'Staff availability during critical migration windows', type: 'risk', timestamp: '5 days ago', details: 'Risk RSK-003 identified with Medium severity' },
  { id: 'ACT-008', user: 'Nathan Park', userInitials: 'NP', action: 'commented on', target: 'Network monitoring setup (SolarWinds)', type: 'comment', timestamp: '6 days ago', details: 'Initial node discovery completed. 47 of 50 nodes discovered.' },
  { id: 'ACT-009', user: 'Rebecca Torres', userInitials: 'RT', action: 'added member', target: 'Priya Nair', type: 'member', timestamp: '1 week ago', details: 'Priya Nair added as Migration Specialist' },
  { id: 'ACT-010', user: 'Sarah Chen', userInitials: 'SC', action: 'approved purchase', target: 'Azure Reserved Instances', type: 'purchase', timestamp: '1 week ago', details: 'PUR-002 approved for $24,500' },
];

// ─── Color helpers ────────────────────────────────────────────────────────────
const taskStatusColors: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'In Review': 'bg-violet-100 text-violet-700',
  'Done': 'bg-green-100 text-green-700',
  'Blocked': 'bg-red-100 text-red-700',
};
const taskPriorityColors: Record<TaskPriority, string> = {
  Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-slate-100 text-slate-600',
};
const milestoneStatusColors: Record<MilestoneStatus, string> = {
  Upcoming: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-indigo-100 text-indigo-700',
  Completed: 'bg-green-100 text-green-700', Overdue: 'bg-red-100 text-red-700',
};
const riskSeverityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-green-100 text-green-700',
};
const avatarColors = ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600'];
const getAvatarColor = (initials: string) => avatarColors[initials.charCodeAt(0) % avatarColors.length];

const progressColor = (p: number) => {
  if (p >= 80) return 'bg-green-500';
  if (p >= 50) return 'bg-blue-500';
  if (p >= 25) return 'bg-amber-500';
  return 'bg-red-400';
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-10 h-10 text-sm' : size === 'md' ? 'w-8 h-8 text-xs' : 'w-7 h-7 text-xs';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(initials)}`}>
      {initials}
    </div>
  );
}

// ─── Task Dialog ──────────────────────────────────────────────────────────────
interface TaskDialogProps {
  open: boolean; onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  initial?: Task | null;
}
function TaskDialog({ open, onClose, onSave, initial }: TaskDialogProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? '', description: initial?.description ?? '',
    assignee: initial?.assignee ?? '', assigneeInitials: initial?.assigneeInitials ?? '',
    status: (initial?.status ?? 'To Do') as TaskStatus,
    priority: (initial?.priority ?? 'Medium') as TaskPriority,
    dueDate: initial?.dueDate ?? '', estimate: initial?.estimate ?? '',
  });
  if (!open) return null;
  const handleSave = () => {
    if (!form.title.trim()) return;
    const initials = form.assignee.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'NA';
    onSave({ ...form, assigneeInitials: initials });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{initial ? 'Edit Task' : 'Add Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title <span className="text-red-500">*</span></label>
            <input className="input-field" placeholder="Describe the task..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Additional details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                {(['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'] as TaskStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
                {(['Critical', 'High', 'Medium', 'Low'] as TaskPriority[]).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignee</label>
              <input className="input-field" placeholder="e.g. James Okafor" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimate</label>
              <input className="input-field" placeholder="e.g. 8h" value={form.estimate} onChange={(e) => setForm({ ...form, estimate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
            <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}><Icon name="CheckIcon" size={15} />{initial ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Member Dialog ────────────────────────────────────────────────────────────
interface MemberDialogProps { open: boolean; onClose: () => void; onSave: (m: Omit<Member, 'id' | 'tasksAssigned'>) => void; }
function MemberDialog({ open, onClose, onSave }: MemberDialogProps) {
  const [form, setForm] = useState({ name: '', role: '', email: '', department: '', initials: '', joinedDate: '' });
  if (!open) return null;
  const handleSave = () => {
    if (!form.name.trim()) return;
    const initials = form.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    onSave({ ...form, initials });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Add Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input className="input-field" placeholder="e.g. John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <input className="input-field" placeholder="e.g. Network Engineer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <input className="input-field" placeholder="e.g. IT Operations" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" className="input-field" placeholder="john.smith@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Join Date</label>
            <input type="date" className="input-field" value={form.joinedDate} onChange={(e) => setForm({ ...form, joinedDate: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}><Icon name="UserPlusIcon" size={15} />Add Member</button>
        </div>
      </div>
    </div>
  );
}

// ─── Milestone Dialog ─────────────────────────────────────────────────────────
interface MilestoneDialogProps { open: boolean; onClose: () => void; onSave: (m: Omit<Milestone, 'id'>) => void; initial?: Milestone | null; }
function MilestoneDialog({ open, onClose, onSave, initial }: MilestoneDialogProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? '', description: initial?.description ?? '',
    dueDate: initial?.dueDate ?? '', status: (initial?.status ?? 'Upcoming') as MilestoneStatus,
    progress: initial?.progress ?? 0, owner: initial?.owner ?? '',
  });
  if (!open) return null;
  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{initial ? 'Edit Milestone' : 'Add Milestone'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Milestone Title <span className="text-red-500">*</span></label>
            <input className="input-field" placeholder="e.g. Phase 1 Complete" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={2} placeholder="What does completing this milestone mean?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MilestoneStatus })}>
                {(['Upcoming', 'In Progress', 'Completed', 'Overdue'] as MilestoneStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Owner</label>
              <input className="input-field" placeholder="e.g. Marcus Reynolds" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Progress ({form.progress}%)</label>
              <input type="range" min={0} max={100} step={5} className="w-full mt-2" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}><Icon name="FlagIcon" size={15} />{initial ? 'Save Changes' : 'Add Milestone'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Time Log Dialog ──────────────────────────────────────────────────────────
interface TimeLogDialogProps { open: boolean; onClose: () => void; onSave: (t: Omit<TimeLog, 'id'>) => void; }
function TimeLogDialog({ open, onClose, onSave }: TimeLogDialogProps) {
  const [form, setForm] = useState({ member: '', memberInitials: '', date: '', hours: 1, description: '', taskRef: '', billable: false });
  if (!open) return null;
  const handleSave = () => {
    if (!form.member.trim() || !form.date) return;
    const initials = form.member.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    onSave({ ...form, memberInitials: initials });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Log Time</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Member <span className="text-red-500">*</span></label>
            <input className="input-field" placeholder="e.g. James Okafor" value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date <span className="text-red-500">*</span></label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hours</label>
              <input type="number" min={0.5} max={24} step={0.5} className="input-field" value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Reference</label>
            <input className="input-field" placeholder="e.g. TSK-004" value={form.taskRef} onChange={(e) => setForm({ ...form, taskRef: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={3} placeholder="What was worked on?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" checked={form.billable} onChange={(e) => setForm({ ...form, billable: e.target.checked })} />
            <span className="text-sm text-slate-700">Billable hours</span>
          </label>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}><Icon name="ClockIcon" size={15} />Log Time</button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Status Dialog ─────────────────────────────────────────────────────
interface ChangeStatusDialogProps { open: boolean; onClose: () => void; currentStatus: string; onSave: (status: string, note: string) => void; }
function ChangeStatusDialog({ open, onClose, currentStatus, onSave }: ChangeStatusDialogProps) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  if (!open) return null;
  const statuses = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'];
  const statusColors: Record<string, string> = {
    Planning: 'bg-blue-100 text-blue-700 border-blue-200',
    Active: 'bg-green-100 text-green-700 border-green-200',
    'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
    Completed: 'bg-slate-100 text-slate-600 border-slate-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Change Project Status</h2>
            <p className="text-sm text-slate-500 mt-0.5">Update the current project status</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Select New Status</label>
            <div className="grid grid-cols-1 gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${status === s ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[s]}`}>{s}</span>
                  </div>
                  {status === s && <Icon name="CheckCircleIcon" size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Note (optional)</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Reason for status change..." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onSave(status, note); onClose(); }}>
            <Icon name="RefreshCwIcon" size={15} />Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Email Dialog ─────────────────────────────────────────────────────────────
interface EmailDialogProps { open: boolean; onClose: () => void; projectName: string; }
function EmailDialog({ open, onClose, projectName }: EmailDialogProps) {
  const [form, setForm] = useState({
    to: '', cc: '', subject: `Update: ${projectName}`, body: '', priority: 'Normal\' as \'High\' | \'Normal\' | \'Low',
  });
  if (!open) return null;
  const handleSend = () => {
    if (!form.to.trim() || !form.subject.trim()) return;
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Send Email</h2>
            <p className="text-sm text-slate-500 mt-0.5">Send project update to stakeholders</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icon name="XIcon" size={18} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">To <span className="text-red-500">*</span></label>
            <input className="input-field" placeholder="recipient@company.com" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">CC</label>
            <input className="input-field" placeholder="cc@company.com (comma-separated)" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
            <input className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="flex items-center gap-2">
              {(['High', 'Normal', 'Low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.priority === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <textarea className="input-field resize-none" rows={6} placeholder="Write your message here..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSend}>
            <Icon name="SendIcon" size={15} />Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'tasks' | 'members' | 'milestones' | 'timelogs' | 'risks' | 'purchases' | 'activitylogs';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) ?? 'PRJ-001';
  const project = projectsData[projectId] ?? projectsData['PRJ-001'];

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [risks] = useState<ProjectRisk[]>(mockRisks);
  const [purchases] = useState<Purchase[]>(mockPurchases);
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [projectStatus, setProjectStatus] = useState(project.status);

  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');

  // Dialogs
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [showTimeLogDialog, setShowTimeLogDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const q = taskSearch.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
    return matchSearch && matchStatus;
  });

  const totalHours = timeLogs.reduce((sum, t) => sum + t.hours, 0);
  const budgetNum = parseInt(project.budget.replace(/[^0-9]/g, ''));
  const spentNum = parseInt(project.spent.replace(/[^0-9]/g, ''));
  const budgetPct = Math.round((spentNum / budgetNum) * 100);

  const tabs: { id: TabId; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboardIcon' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquareIcon', count: tasks.length },
    { id: 'members', label: 'Members', icon: 'UsersIcon', count: members.length },
    { id: 'milestones', label: 'Milestones', icon: 'FlagIcon', count: milestones.length },
    { id: 'timelogs', label: 'Time Logs', icon: 'ClockIcon', count: timeLogs.length },
    { id: 'risks', label: 'Risks', icon: 'AlertTriangleIcon', count: risks.length },
    { id: 'purchases', label: 'Misc. Purchases', icon: 'ShoppingCartIcon', count: purchases.length },
    { id: 'activitylogs', label: 'Activity Logs', icon: 'ActivityIcon', count: activityLogs.length },
  ];

  const statusColors: Record<string, string> = {
    Active: 'bg-green-100 text-green-700', 'On Hold': 'bg-amber-100 text-amber-700',
    Completed: 'bg-slate-100 text-slate-600', Cancelled: 'bg-red-100 text-red-700', Planning: 'bg-blue-100 text-blue-700',
  };
  const priorityColors: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-slate-100 text-slate-600',
  };

  const activityTypeIcon: Record<ActivityLog['type'], string> = {
    task: 'CheckSquareIcon', member: 'UserPlusIcon', milestone: 'FlagIcon',
    risk: 'AlertTriangleIcon', purchase: 'ShoppingCartIcon', status: 'RefreshCwIcon', comment: 'MessageSquareIcon',
  };
  const activityTypeColor: Record<ActivityLog['type'], string> = {
    task: 'bg-blue-100 text-blue-600', member: 'bg-violet-100 text-violet-600',
    milestone: 'bg-green-100 text-green-600', risk: 'bg-red-100 text-red-600',
    purchase: 'bg-amber-100 text-amber-600', status: 'bg-indigo-100 text-indigo-600',
    comment: 'bg-slate-100 text-slate-600',
  };

  return (
    <AppLayout>
      <div className="space-y-6 fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.push('/project-management')} className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Icon name="FolderKanbanIcon" size={14} />
            Projects
          </button>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-slate-900 font-medium">{project.name}</span>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{project.id}</span>
                <span className={`badge ${statusColors[projectStatus] ?? 'bg-slate-100 text-slate-600'}`}>{projectStatus}</span>
                <span className={`badge ${priorityColors[project.priority] ?? 'bg-slate-100 text-slate-600'}`}>{project.priority}</span>
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{tag}</span>
                ))}
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-1">{project.name}</h1>
              <p className="text-sm text-slate-500">{project.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
              <button
                onClick={() => setShowChangeStatusDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Icon name="RefreshCwIcon" size={13} />
                Change Status
              </button>
              <button
                onClick={() => setShowEmailDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Icon name="MailIcon" size={13} />
                Email
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Icon name="PencilIcon" size={13} />
                Edit
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 border-red-200">
                <Icon name="ArchiveIcon" size={13} />
                Archive
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-5 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Manager</p>
              <div className="flex items-center gap-1.5">
                <Avatar initials={project.managerInitials} />
                <span className="text-sm font-medium text-slate-800 truncate">{project.manager}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Department</p>
              <p className="text-sm font-medium text-slate-800">{project.department}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Start Date</p>
              <p className="text-sm font-medium text-slate-800">{project.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Due Date</p>
              <p className="text-sm font-medium text-slate-800">{project.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Budget</p>
              <p className="text-sm font-medium text-slate-800">{project.budget}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${progressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{project.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-white rounded-t-xl">
          <nav className="flex gap-1 px-4 pt-2 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon name={tab.icon as any} size={15} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Objective</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.objective}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Scope</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.scope}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Task Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {(['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'] as TaskStatus[]).map((s) => {
                        const count = tasks.filter((t) => t.status === s).length;
                        return (
                          <div key={s} className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="text-xl font-bold text-slate-900">{count}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{s}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {activityLogs.slice(0, 4).map((a) => (
                        <div key={a.id} className="flex items-start gap-3">
                          <Avatar initials={a.userInitials} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700">
                              <span className="font-medium">{a.user}</span>{' '}
                              <span className="text-slate-500">{a.action}</span>{' '}
                              <span className="font-medium text-blue-600">{a.target}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{a.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Budget Overview</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Budget</span>
                        <span className="font-semibold text-slate-900">{project.budget}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Spent</span>
                        <span className="font-semibold text-slate-900">{project.spent}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Remaining</span>
                        <span className="font-semibold text-green-600">${(budgetNum - spentNum).toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Budget utilization</span>
                          <span>{budgetPct}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${budgetPct > 85 ? 'bg-red-500' : budgetPct > 60 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${budgetPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Project Stats</h3>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Total Tasks', value: tasks.length, icon: 'CheckSquareIcon' },
                        { label: 'Completed', value: tasks.filter((t) => t.status === 'Done').length, icon: 'CheckCircleIcon' },
                        { label: 'Team Members', value: members.length, icon: 'UsersIcon' },
                        { label: 'Milestones', value: milestones.length, icon: 'FlagIcon' },
                        { label: 'Hours Logged', value: `${totalHours}h`, icon: 'ClockIcon' },
                        { label: 'Open Risks', value: risks.filter((r) => r.status === 'Open').length, icon: 'AlertTriangleIcon' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Icon name={s.icon as any} size={14} className="text-slate-400" />
                            {s.label}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Milestone Progress</h3>
                    <div className="space-y-2.5">
                      {milestones.slice(0, 3).map((m) => (
                        <div key={m.id}>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span className="truncate flex-1 mr-2">{m.title.split(':')[0]}</span>
                            <span className="font-medium">{m.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${progressColor(m.progress)}`} style={{ width: `${m.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TASKS ── */}
          {activeTab === 'tasks' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap flex-1">
                  <div className="relative min-w-[200px]">
                    <Icon name="SearchIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input-field pl-9 text-sm" placeholder="Search tasks..." value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} />
                  </div>
                  <select className="input-field w-auto text-sm" value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    {(['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'] as TaskStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button className="btn-primary text-sm" onClick={() => { setEditingTask(null); setShowTaskDialog(true); }}>
                  <Icon name="PlusIcon" size={15} />Add Task
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="table-header-cell">Task</th>
                      <th className="table-header-cell">Assignee</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Priority</th>
                      <th className="table-header-cell">Due Date</th>
                      <th className="table-header-cell">Estimate</th>
                      <th className="table-header-cell w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="table-row">
                        <td className="table-cell">
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{task.title}</p>
                            <p className="text-xs text-slate-400 font-mono">{task.id}</p>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={task.assigneeInitials} />
                            <span className="text-sm text-slate-700">{task.assignee}</span>
                          </div>
                        </td>
                        <td className="table-cell"><span className={`badge ${taskStatusColors[task.status]}`}>{task.status}</span></td>
                        <td className="table-cell"><span className={`badge ${taskPriorityColors[task.priority]}`}>{task.priority}</span></td>
                        <td className="table-cell text-slate-600 text-sm">{task.dueDate}</td>
                        <td className="table-cell text-slate-600 text-sm">{task.estimate}</td>
                        <td className="table-cell">
                          <button onClick={() => { setEditingTask(task); setShowTaskDialog(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                            <Icon name="PencilIcon" size={13} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTasks.length === 0 && (
                  <div className="py-12 text-center">
                    <Icon name="CheckSquareIcon" size={36} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No tasks found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MEMBERS ── */}
          {activeTab === 'members' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{members.length} team members</p>
                <button className="btn-primary text-sm" onClick={() => setShowMemberDialog(true)}>
                  <Icon name="UserPlusIcon" size={15} />Add Member
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <Avatar initials={member.initials} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                          <p className="text-xs text-blue-600 font-medium">{member.role}</p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">Joined {member.joinedDate}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Icon name="BuildingIcon" size={11} />{member.department}</span>
                        <span className="flex items-center gap-1"><Icon name="MailIcon" size={11} />{member.email}</span>
                        <span className="flex items-center gap-1"><Icon name="CheckSquareIcon" size={11} />{member.tasksAssigned} tasks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MILESTONES ── */}
          {activeTab === 'milestones' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{milestones.length} milestones</p>
                <button className="btn-primary text-sm" onClick={() => { setEditingMilestone(null); setShowMilestoneDialog(true); }}>
                  <Icon name="PlusIcon" size={15} />Add Milestone
                </button>
              </div>
              <div className="space-y-4">
                {milestones.map((ms, idx) => (
                  <div key={ms.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ms.status === 'Completed' ? 'bg-green-100 text-green-700' : ms.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ms.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                        {ms.status === 'Completed' ? <Icon name="CheckIcon" size={14} /> : idx + 1}
                      </div>
                      {idx < milestones.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{ms.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{ms.description}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`badge ${milestoneStatusColors[ms.status]}`}>{ms.status}</span>
                            <button onClick={() => { setEditingMilestone(ms); setShowMilestoneDialog(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                              <Icon name="PencilIcon" size={13} className="text-slate-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={11} />Due {ms.dueDate}</span>
                          <span className="flex items-center gap-1"><Icon name="UserIcon" size={11} />{ms.owner}</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{ms.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${progressColor(ms.progress)}`} style={{ width: `${ms.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TIME LOGS ── */}
          {activeTab === 'timelogs' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{timeLogs.length} entries</p>
                  <p className="text-xs text-slate-400 mt-0.5">Total: <span className="font-semibold text-slate-700">{totalHours}h</span> logged</p>
                </div>
                <button className="btn-primary text-sm" onClick={() => setShowTimeLogDialog(true)}>
                  <Icon name="PlusIcon" size={15} />Log Time
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="table-header-cell">Member</th>
                      <th className="table-header-cell">Date</th>
                      <th className="table-header-cell">Hours</th>
                      <th className="table-header-cell">Task Ref</th>
                      <th className="table-header-cell">Description</th>
                      <th className="table-header-cell">Billable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeLogs.map((log) => (
                      <tr key={log.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={log.memberInitials} />
                            <span className="text-sm text-slate-700">{log.member}</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-600 text-sm">{log.date}</td>
                        <td className="table-cell"><span className="font-semibold text-slate-900">{log.hours}h</span></td>
                        <td className="table-cell"><span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{log.taskRef}</span></td>
                        <td className="table-cell text-slate-600 text-sm max-w-xs truncate">{log.description}</td>
                        <td className="table-cell">
                          <span className={`badge ${log.billable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {log.billable ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RISKS ── */}
          {activeTab === 'risks' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{risks.length} risks identified — {risks.filter((r) => r.status === 'Open').length} open</p>
              </div>
              <div className="space-y-3">
                {risks.map((risk) => (
                  <div key={risk.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${risk.severity === 'High' ? 'bg-red-100' : risk.severity === 'Medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                          <Icon name="AlertTriangleIcon" size={15} className={risk.severity === 'High' ? 'text-red-600' : risk.severity === 'Medium' ? 'text-amber-600' : 'text-green-600'} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{risk.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{risk.impact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge ${riskSeverityColors[risk.severity]}`}>{risk.severity}</span>
                        <span className={`badge ${risk.status === 'Open' ? 'bg-amber-100 text-amber-700' : risk.status === 'Mitigated' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{risk.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="font-medium text-slate-600 mb-1">Mitigation Plan</p>
                        <p className="text-slate-500">{risk.mitigation}</p>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500">
                        <span className="flex items-center gap-1"><Icon name="AlertCircleIcon" size={11} />Probability: <span className="font-medium text-slate-700">{risk.probability}</span></span>
                        <span className="flex items-center gap-1"><Icon name="UserIcon" size={11} />Owner: <span className="font-medium text-slate-700">{risk.owner}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MISC. PURCHASES ── */}
          {activeTab === 'purchases' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{purchases.length} purchase records</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total approved: <span className="font-semibold text-slate-700">
                      ${purchases.filter(p => p.status === 'Approved').reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}
                    </span>
                  </p>
                </div>
                <button className="btn-primary text-sm">
                  <Icon name="PlusIcon" size={15} />Add Purchase
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Approved', count: purchases.filter(p => p.status === 'Approved').length, color: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Pending', count: purchases.filter(p => p.status === 'Pending').length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                  { label: 'Rejected', count: purchases.filter(p => p.status === 'Rejected').length, color: 'bg-red-50 border-red-200 text-red-700' },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-xl border ${s.color} text-center`}>
                    <p className="text-2xl font-bold">{s.count}</p>
                    <p className="text-xs font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="table-header-cell">ID</th>
                      <th className="table-header-cell">Item / Description</th>
                      <th className="table-header-cell">Vendor</th>
                      <th className="table-header-cell">Category</th>
                      <th className="table-header-cell">Amount</th>
                      <th className="table-header-cell">Date</th>
                      <th className="table-header-cell">Requested By</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <tr key={p.id} className="table-row">
                        <td className="table-cell">
                          <span className="text-xs font-mono text-slate-400">{p.id}</span>
                        </td>
                        <td className="table-cell">
                          <p className="font-medium text-slate-900 text-sm">{p.item || (p as any).title}</p>
                        </td>
                        <td className="table-cell text-slate-600 text-sm">{p.vendor}</td>
                        <td className="table-cell">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{p.category}</span>
                        </td>
                        <td className="table-cell">
                          <span className="font-semibold text-slate-900 text-sm">{p.amount}</span>
                        </td>
                        <td className="table-cell text-slate-600 text-sm">{p.date}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={p.requestedBy.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)} />
                            <span className="text-sm text-slate-700">{p.requestedBy}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${p.status === 'Approved' ? 'bg-green-100 text-green-700' : p.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="table-cell">
                          <a
                            href={p.attachment}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Icon name="PaperclipIcon" size={13} />
                            <span className="truncate max-w-[120px]">{p.attachmentName}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ACTIVITY LOGS ── */}
          {activeTab === 'activitylogs' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{activityLogs.length} activity records</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">All time</span>
                  <Icon name="CalendarIcon" size={14} className="text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                {activityLogs.map((log, idx) => (
                  <div key={log.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activityTypeColor[log.type]}`}>
                        <Icon name={activityTypeIcon[log.type] as any} size={14} />
                      </div>
                      {idx < activityLogs.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 mt-1 min-h-[16px]" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <Avatar initials={log.userInitials} />
                            <div>
                              <p className="text-sm text-slate-800">
                                <span className="font-semibold">{log.user}</span>{' '}
                                <span className="text-slate-500">{log.action}</span>{' '}
                                <span className="font-medium text-blue-600">{log.target}</span>
                              </p>
                              {log.details && (
                                <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activityTypeColor[log.type]}`}>
                              {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                            </span>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TaskDialog
        open={showTaskDialog}
        onClose={() => { setShowTaskDialog(false); setEditingTask(null); }}
        onSave={(t) => {
          if (editingTask) {
            setTasks(tasks.map((tk) => tk.id === editingTask.id ? { ...t, id: editingTask.id } : tk));
          } else {
            setTasks([...tasks, { ...t, id: `TSK-${String(tasks.length + 1).padStart(3, '0')}` }]);
          }
        }}
        initial={editingTask}
      />
      <MemberDialog
        open={showMemberDialog}
        onClose={() => setShowMemberDialog(false)}
        onSave={(m) => setMembers([...members, { ...m, id: `M${String(members.length + 1).padStart(3, '0')}`, tasksAssigned: 0 }])}
      />
      <MilestoneDialog
        open={showMilestoneDialog}
        onClose={() => { setShowMilestoneDialog(false); setEditingMilestone(null); }}
        onSave={(m) => {
          if (editingMilestone) {
            setMilestones(milestones.map((ms) => ms.id === editingMilestone.id ? { ...m, id: editingMilestone.id } : ms));
          } else {
            setMilestones([...milestones, { ...m, id: `MS-${String(milestones.length + 1).padStart(3, '0')}` }]);
          }
        }}
        initial={editingMilestone}
      />
      <TimeLogDialog
        open={showTimeLogDialog}
        onClose={() => setShowTimeLogDialog(false)}
        onSave={(t) => setTimeLogs([...timeLogs, { ...t, id: `TL-${String(timeLogs.length + 1).padStart(3, '0')}` }])}
      />
      <ChangeStatusDialog
        open={showChangeStatusDialog}
        onClose={() => setShowChangeStatusDialog(false)}
        currentStatus={projectStatus}
        onSave={(status) => setProjectStatus(status)}
      />
      <EmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        projectName={project.name}
      />
    </AppLayout>
  );
}
