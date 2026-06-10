'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { useForm } from 'react-hook-form';

type Priority = 'P1' | 'P2' | 'P3' | 'P4';
type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Escalated';
type SlaHealth = 'OK' | 'Warning' | 'Breached';

interface Ticket {
  id: string;
  title: string;
  requester: string;
  requesterDept: string;
  priority: Priority;
  category: string;
  assignee: string;
  status: TicketStatus;
  created: string;
  slaDue: string;
  slaHealth: SlaHealth;
  channel: string;
}

const mockTickets: Ticket[] = [
  { id: 'TKT-1042', title: 'VPN connectivity failure — entire Engineering floor', requester: 'Nathan Park', requesterDept: 'Engineering', priority: 'P1', category: 'Network', assignee: 'Unassigned', status: 'New', created: '03/16/26 05:12', slaDue: '03/16/26 09:12', slaHealth: 'Breached', channel: 'Email' },
  { id: 'TKT-1041', title: 'Active Directory sync failure — 12 users locked out', requester: 'Lisa Huang', requesterDept: 'HR', priority: 'P1', category: 'Identity & Access', assignee: 'James Okafor', status: 'In Progress', created: '03/16/26 02:25', slaDue: '03/16/26 06:25', slaHealth: 'Breached', channel: 'Phone' },
  { id: 'TKT-1040', title: 'Production database backup job failing since last night', requester: 'Omar Hassan', requesterDept: 'Engineering', priority: 'P2', category: 'Database', assignee: 'Sarah Chen', status: 'Assigned', created: '03/15/26 22:10', slaDue: '03/16/26 10:10', slaHealth: 'Warning', channel: 'Portal' },
  { id: 'TKT-1039', title: 'Email gateway rejecting all external messages — SMTP config', requester: 'Rebecca Torres', requesterDept: 'Marketing', priority: 'P2', category: 'Email / Messaging', assignee: 'Priya Nair', status: 'In Progress', created: '03/15/26 20:44', slaDue: '03/16/26 12:44', slaHealth: 'Warning', channel: 'Portal' },
  { id: 'TKT-1038', title: 'SSL certificate expiry warning on customer portal in 2 days', requester: 'Sam Whitfield', requesterDept: 'DevOps', priority: 'P2', category: 'Security', assignee: 'Marcus Reynolds', status: 'In Progress', created: '03/15/26 18:30', slaDue: '03/16/26 18:30', slaHealth: 'OK', channel: 'Monitoring' },
  { id: 'TKT-1037', title: 'Laptop screen flickering on Dell XPS 15 — recurring issue', requester: 'Jasmine Osei', requesterDept: 'Finance', priority: 'P3', category: 'Hardware', assignee: 'David Thornton', status: 'Pending', created: '03/15/26 14:20', slaDue: '03/17/26 14:20', slaHealth: 'OK', channel: 'Portal' },
  { id: 'TKT-1036', title: 'Microsoft Teams audio not working on macOS Sonoma', requester: 'Carlos Mendez', requesterDept: 'Sales', priority: 'P3', category: 'Software', assignee: 'Amara Diallo', status: 'In Progress', created: '03/15/26 11:15', slaDue: '03/17/26 11:15', slaHealth: 'OK', channel: 'Chat' },
  { id: 'TKT-1035', title: 'Shared printer on Floor 3 not discoverable on network', requester: 'Anna Kowalski', requesterDept: 'Legal', priority: 'P3', category: 'Printing', assignee: 'James Okafor', status: 'Resolved', created: '03/14/26 16:45', slaDue: '03/16/26 16:45', slaHealth: 'OK', channel: 'Phone' },
  { id: 'TKT-1034', title: 'Password reset request — user unable to log in after MFA setup', requester: 'Tunde Adeyemi', requesterDept: 'Operations', priority: 'P3', category: 'Identity & Access', assignee: 'Priya Nair', status: 'Resolved', created: '03/14/26 09:30', slaDue: '03/16/26 09:30', slaHealth: 'OK', channel: 'Portal' },
  { id: 'TKT-1033', title: 'Zoom license not activating for new hire — license pool issue', requester: 'Michelle Grant', requesterDept: 'HR', priority: 'P4', category: 'Software', assignee: 'Amara Diallo', status: 'Assigned', created: '03/13/26 15:20', slaDue: '03/18/26 15:20', slaHealth: 'OK', channel: 'Email' },
  { id: 'TKT-1032', title: 'USB-C docking station not charging laptop — power delivery', requester: 'Kevin Lim', requesterDept: 'Finance', priority: 'P4', category: 'Hardware', assignee: 'David Thornton', status: 'Pending', created: '03/13/26 11:05', slaDue: '03/18/26 11:05', slaHealth: 'OK', channel: 'Portal' },
  { id: 'TKT-1031', title: 'Request for additional storage quota on shared drive', requester: 'Fatou Diallo', requesterDept: 'Marketing', priority: 'P4', category: 'Storage', assignee: 'Sarah Chen', status: 'Closed', created: '03/12/26 08:50', slaDue: '03/17/26 08:50', slaHealth: 'OK', channel: 'Portal' },
];

const priorityColors: Record<Priority, string> = {
  P1: 'badge-p1', P2: 'badge-p2', P3: 'badge-p3', P4: 'badge-p4',
};

const statusColors: Record<TicketStatus, string> = {
  New: 'badge-new', Assigned: 'badge-assigned', 'In Progress': 'badge-inprogress',
  Pending: 'badge-pending', Resolved: 'badge-resolved', Closed: 'badge-closed', Escalated: 'badge-escalated',
};

const slaColors: Record<SlaHealth, string> = {
  OK: 'text-green-600 bg-green-50', Warning: 'text-amber-600 bg-amber-50', Breached: 'text-red-600 bg-red-50',
};

const allStatuses: TicketStatus[] = ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Escalated'];
const allPriorities: Priority[] = ['P1', 'P2', 'P3', 'P4'];
const allCategories = ['All', 'Network', 'Hardware', 'Software', 'Identity & Access', 'Email / Messaging', 'Security', 'Database', 'Printing', 'Storage'];

export default function TicketTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortCol, setSortCol] = useState<string>('created');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'All' || t.status === filterStatus;
      const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
      const matchCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }, [tickets, search, filterStatus, filterPriority, filterCategory]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'id') return a.id.localeCompare(b.id) * dir;
      if (sortCol === 'priority') return ['P1','P2','P3','P4'].indexOf(a.priority) - ['P1','P2','P3','P4'].indexOf(b.priority) * dir;
      if (sortCol === 'created') return a.created.localeCompare(b.created) * dir;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginated.map((t) => t.id)));
  };

  const handleBulkDelete = () => {
    const count = selectedRows.size;
    setTickets((prev) => prev.filter((t) => !selectedRows.has(t.id)));
    setSelectedRows(new Set());
    toast.success(`${count} ticket${count > 1 ? 's' : ''} deleted`);
  };

  const handleBulkAssign = () => {
    toast.info(`Assign ${selectedRows.size} tickets — agent picker coming soon`);
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: newStatus } : t));
    setStatusDropdown(null);
    toast.success(`${ticketId} status updated to ${newStatus}`);
  };

  const SortIcon = ({ col }: { col: string }) => (
    <Icon
      name={sortCol === col ? (sortDir === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon') : 'ChevronsUpDownIcon'}
      size={13}
      className={sortCol === col ? 'text-blue-600' : 'text-slate-400'}
    />
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ticket Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} tickets · {tickets.filter(t => t.slaHealth === 'Breached').length} SLA breached</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            <Icon name="DownloadIcon" size={15} />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-sm"
          >
            <Icon name="PlusIcon" size={15} />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, ID, requester…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 py-1.5 text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="input-field py-1.5 text-sm w-auto min-w-[140px]"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
            className="input-field py-1.5 text-sm w-auto min-w-[130px]"
          >
            <option value="All">All Priorities</option>
            {allPriorities.map((p) => <option key={p}>{p}</option>)}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="input-field py-1.5 text-sm w-auto min-w-[150px]"
          >
            {allCategories.map((c) => <option key={c}>{c}</option>)}
          </select>

          {(search || filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All') && (
            <button
              onClick={() => { setSearch(''); setFilterStatus('All'); setFilterPriority('All'); setFilterCategory('All'); setPage(1); }}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Icon name="XIcon" size={13} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl px-5 py-3 slide-up shadow-md">
          <span className="text-sm font-medium">{selectedRows.size} ticket{selectedRows.size > 1 ? 's' : ''} selected</span>
          <div className="flex gap-2">
            <button onClick={handleBulkAssign} className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
              <Icon name="UserCheckIcon" size={13} />
              Assign
            </button>
            <button
              onClick={() => {
                const ids = Array.from(selectedRows).join(', ');
                toast.info(`Escalating: ${ids}`);
              }}
              className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Icon name="AlertTriangleIcon" size={13} />
              Escalate
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 text-xs bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">
              <Icon name="TrashIcon" size={13} />
              Delete
            </button>
            <button onClick={() => setSelectedRows(new Set())} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors">
              <Icon name="XIcon" size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header-cell w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                </th>
                <th className="table-header-cell cursor-pointer hover:text-slate-700" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">ID <SortIcon col="id" /></div>
                </th>
                <th className="table-header-cell min-w-[260px]">Title</th>
                <th className="table-header-cell">Requester</th>
                <th className="table-header-cell cursor-pointer hover:text-slate-700" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1">Priority <SortIcon col="priority" /></div>
                </th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Assignee</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell cursor-pointer hover:text-slate-700" onClick={() => toggleSort('created')}>
                  <div className="flex items-center gap-1">Created <SortIcon col="created" /></div>
                </th>
                <th className="table-header-cell">SLA Due</th>
                <th className="table-header-cell">SLA Health</th>
                <th className="table-header-cell w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="TicketIcon" size={36} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No tickets match your filters</p>
                      <p className="text-xs text-slate-400">Try adjusting the search or filter criteria above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((ticket) => (
                  <tr key={ticket.id} className={`table-row group ${selectedRows.has(ticket.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="table-cell w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(ticket.id)}
                        onChange={() => toggleRow(ticket.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => router.push(`/ticket-detail/${ticket.id}`)}
                        className="font-mono text-xs text-blue-600 font-medium hover:underline"
                      >
                        {ticket.id}
                      </button>
                    </td>
                    <td className="table-cell min-w-[260px]">
                      <button
                        onClick={() => router.push(`/ticket-detail/${ticket.id}`)}
                        className="text-left hover:text-blue-600 transition-colors"
                      >
                        <p className="font-medium text-slate-800 text-sm truncate max-w-xs hover:text-blue-600" title={ticket.title}>
                          {ticket.title}
                        </p>
                      </button>
                      <p className="text-xs text-slate-400 mt-0.5">{ticket.channel}</p>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-slate-700 font-medium whitespace-nowrap">{ticket.requester}</p>
                      <p className="text-xs text-slate-400">{ticket.requesterDept}</p>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap">{ticket.category}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        {ticket.assignee !== 'Unassigned' ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold flex-shrink-0">
                              {ticket.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs text-slate-700 whitespace-nowrap">{ticket.assignee.split(' ')[0]}</span>
                          </>
                        ) : (
                          <span className="text-xs text-red-500 font-medium">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell relative">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setStatusDropdown(statusDropdown === ticket.id ? null : ticket.id)}
                          className={`badge cursor-pointer hover:opacity-80 transition-opacity ${statusColors[ticket.status]}`}
                        >
                          {ticket.status}
                          <Icon name="ChevronDownIcon" size={10} className="ml-1" />
                        </button>
                        {statusDropdown === ticket.id && (
                          <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-modal z-20 py-1 min-w-[140px] fade-in">
                            {allStatuses.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(ticket.id, s)}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 ${s === ticket.status ? 'font-semibold text-blue-600' : 'text-slate-700'}`}
                              >
                                <span className={`badge ${statusColors[s]} text-[10px] px-1.5`}>{s}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap tabular-nums">{ticket.created}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap tabular-nums">{ticket.slaDue}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg tabular-nums ${slaColors[ticket.slaHealth]}`}>
                        {ticket.slaHealth}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => router.push(`/ticket-detail/${ticket.id}`)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Icon name="EyeIcon" size={13} className="text-slate-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tooltip:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                            View details
                          </div>
                        </div>
                        <div className="relative group/tooltip">
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                            <Icon name="PencilIcon" size={13} className="text-blue-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tooltip:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                            Edit ticket
                          </div>
                        </div>
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => { setTickets(prev => prev.filter(t => t.id !== ticket.id)); toast.success(`${ticket.id} deleted`); }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Icon name="TrashIcon" size={13} className="text-red-500" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tooltip:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                            Delete ticket — cannot be undone
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}</span>
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

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal onClose={() => setShowCreateModal(false)} onCreated={(t) => { setTickets(prev => [t, ...prev]); setShowCreateModal(false); toast.success(`${t.id} created successfully`); }} />
      )}

      {/* Close status dropdown on outside click */}
      {statusDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(null)} />
      )}
    </div>
  );
}

function CreateTicketModal({ onClose, onCreated }: { onClose: () => void; onCreated: (t: Ticket) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{
    title: string; requester: string; department: string; priority: Priority; category: string; assignee: string; description: string;
  }>();

  const onSubmit = async (data: any) => {
    await new Promise(r => setTimeout(r, 800));
    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1053 + Math.random() * 100)}`,
      title: data.title,
      requester: data.requester,
      requesterDept: data.department,
      priority: data.priority,
      category: data.category,
      assignee: data.assignee || 'Unassigned',
      status: 'New',
      created: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      slaDue: new Date(Date.now() + 8 * 3600000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      slaHealth: 'OK',
      channel: 'Portal',
    };
    onCreated(newTicket);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Create New Ticket</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Icon name="XIcon" size={16} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Title <span className="text-red-500">*</span></label>
            <input {...register('title', { required: 'Title is required' })} placeholder="Brief description of the issue" className="input-field" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Requester <span className="text-red-500">*</span></label>
              <input {...register('requester', { required: 'Required' })} placeholder="Full name" className="input-field" />
              {errors.requester && <p className="text-xs text-red-500 mt-1">{errors.requester.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <select {...register('department')} className="input-field">
                <option value="">Select…</option>
                {['Engineering','Finance','HR','Legal','Marketing','Operations','Sales'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority <span className="text-red-500">*</span></label>
              <select {...register('priority', { required: 'Required' })} className="input-field">
                <option value="">Select…</option>
                {['P1','P2','P3','P4'].map(p => <option key={p}>{p}</option>)}
              </select>
              {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select {...register('category', { required: 'Required' })} className="input-field">
                <option value="">Select…</option>
                {['Network','Hardware','Software','Identity & Access','Email / Messaging','Security','Database','Printing','Storage'].map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign To</label>
            <select {...register('assignee')} className="input-field">
              <option value="">Leave unassigned</option>
              {['James Okafor','Sarah Chen','Priya Nair','Marcus Reynolds','David Thornton','Amara Diallo'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Detailed description of the issue, steps to reproduce, affected users…" className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? (
                <><Icon name="Loader2Icon" size={15} className="animate-spin" />Creating…</>
              ) : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}