'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

type RequestStatus = 'Pending Approval' | 'Approved' | 'In Fulfillment' | 'Fulfilled' | 'Rejected' | 'Cancelled';
type RequestType = 'Software License' | 'Hardware' | 'Access Request' | 'New Hire Setup' | 'Account Provisioning' | 'Cloud Resource';

interface ServiceRequest {
  id: string;
  serviceItem: string;
  requester: string;
  department: string;
  type: RequestType;
  status: RequestStatus;
  approver: string;
  submitted: string;
  slaDue: string;
  priority: string;
  cost: string;
  notes: string;
}

const mockRequests: ServiceRequest[] = [
  { id: 'REQ-0301', serviceItem: 'Adobe Creative Cloud — Annual License', requester: 'Sofia Martinez', department: 'Marketing', type: 'Software License', status: 'Pending Approval', approver: 'Marcus Reynolds', submitted: '03/16/26 08:14', slaDue: '03/17/26 08:14', priority: 'P3', cost: '$599/yr', notes: 'Needed for campaign design work' },
  { id: 'REQ-0300', serviceItem: 'MacBook Pro 16" M3 — New Hire Setup', requester: 'HR Automation', department: 'HR', type: 'New Hire Setup', status: 'In Fulfillment', approver: 'Auto-approved', submitted: '03/16/26 07:00', slaDue: '03/18/26 07:00', priority: 'P2', cost: '$2,499', notes: 'Starting date: 03/18/26' },
  { id: 'REQ-0299', serviceItem: 'AWS EC2 t3.large — Staging environment', requester: 'Rajan Mehta', department: 'Engineering', type: 'Cloud Resource', status: 'Pending Approval', approver: 'Marcus Reynolds', submitted: '03/15/26 16:30', slaDue: '03/16/26 16:30', priority: 'P2', cost: '$145/mo', notes: 'Required for Q2 load testing' },
  { id: 'REQ-0298', serviceItem: 'GitHub Enterprise — 5 additional seats', requester: 'Yuki Tanaka', department: 'Engineering', type: 'Software License', status: 'Approved', approver: 'Marcus Reynolds', submitted: '03/15/26 14:10', slaDue: '03/17/26 14:10', priority: 'P3', cost: '$231', notes: '' },
  { id: 'REQ-0297', serviceItem: 'Salesforce CRM — Read access for Finance team', requester: 'Diane Okonkwo', department: 'Finance', type: 'Access Request', status: 'Pending Approval', approver: 'Marcus Reynolds', submitted: '03/15/26 11:45', slaDue: '03/16/26 11:45', priority: 'P3', cost: 'No cost', notes: 'For quarterly reporting' },
  { id: 'REQ-0296', serviceItem: 'Logitech MX Keys keyboard + MX Master 3 mouse', requester: 'Tom Eriksson', department: 'Engineering', type: 'Hardware', status: 'Fulfilled', approver: 'Auto-approved', submitted: '03/14/26 09:20', slaDue: '03/16/26 09:20', priority: 'P4', cost: '$189', notes: 'Ergonomic upgrade' },
  { id: 'REQ-0295', serviceItem: 'VPN client — GlobalProtect for contractor', requester: 'Anita Ramos', department: 'Operations', type: 'Account Provisioning', status: 'Approved', approver: 'Sarah Chen', submitted: '03/14/26 08:00', slaDue: '03/15/26 08:00', priority: 'P3', cost: 'No cost', notes: 'Contractor: Raj Patel, 3-month engagement' },
  { id: 'REQ-0294', serviceItem: 'Figma Professional — 3 seats', requester: 'Chloe Bennett', department: 'Product', type: 'Software License', status: 'Rejected', approver: 'Marcus Reynolds', submitted: '03/13/26 15:30', slaDue: '03/15/26 15:30', priority: 'P4', cost: '$144/yr', notes: 'Rejected: existing seats available' },
  { id: 'REQ-0293', serviceItem: 'Dell 27" 4K Monitor — UltraSharp U2723QE', requester: 'Patrick Nwosu', department: 'Finance', type: 'Hardware', status: 'In Fulfillment', approver: 'Auto-approved', submitted: '03/13/26 10:15', slaDue: '03/16/26 10:15', priority: 'P4', cost: '$699', notes: '' },
  { id: 'REQ-0292', serviceItem: 'Okta SSO — New application integration (Notion)', requester: 'Dev Sharma', department: 'IT Infrastructure', type: 'Account Provisioning', status: 'Fulfilled', approver: 'Marcus Reynolds', submitted: '03/12/26 14:00', slaDue: '03/14/26 14:00', priority: 'P3', cost: 'No cost', notes: 'Integrated successfully' },
];

const statusColors: Record<RequestStatus, string> = {
  'Pending Approval': 'badge-pending',
  'Approved': 'badge-assigned',
  'In Fulfillment': 'badge-inprogress',
  'Fulfilled': 'badge-resolved',
  'Rejected': 'badge-breached',
  'Cancelled': 'badge-closed',
};

const typeIcons: Record<RequestType, string> = {
  'Software License': 'PackageIcon',
  'Hardware': 'MonitorIcon',
  'Access Request': 'KeyIcon',
  'New Hire Setup': 'UserPlusIcon',
  'Account Provisioning': 'ShieldIcon',
  'Cloud Resource': 'CloudIcon',
};

const allStatuses: RequestStatus[] = ['Pending Approval', 'Approved', 'In Fulfillment', 'Fulfilled', 'Rejected', 'Cancelled'];
const allTypes: RequestType[] = ['Software License', 'Hardware', 'Access Request', 'New Hire Setup', 'Account Provisioning', 'Cloud Resource'];

export default function RequestTable() {
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const pendingCount = requests.filter(r => r.status === 'Pending Approval').length;

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.toLowerCase().includes(q) || r.serviceItem.toLowerCase().includes(q) || r.requester.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      const matchType = filterType === 'All' || r.type === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [requests, search, filterStatus, filterType]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setConfirmAction(null);
    toast.success(`${id} approved — moving to fulfillment queue`);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', notes: rejectNote || 'Rejected by approver' } : r));
    setConfirmAction(null);
    setRejectNote('');
    toast.error(`${id} rejected`);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Request Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} requests ·{' '}
            <span className="text-amber-600 font-medium">{pendingCount} pending approval</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            <Icon name="DownloadIcon" size={15} />
            Export
          </button>
          <button className="btn-primary text-sm">
            <Icon name="PlusIcon" size={15} />
            New Request
          </button>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <Icon name="ClockIcon" size={18} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {pendingCount} request{pendingCount > 1 ? 's' : ''} awaiting your approval
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Oldest pending: REQ-0297 — submitted 3/15/26 · 1 day overdue
            </p>
          </div>
          <button
            onClick={() => setFilterStatus('Pending Approval')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Review now <Icon name="ArrowRightIcon" size={12} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests, requester, ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 py-1.5 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="input-field py-1.5 text-sm w-auto min-w-[160px]"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="input-field py-1.5 text-sm w-auto min-w-[160px]"
          >
            <option value="All">All Types</option>
            {allTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          {(search || filterStatus !== 'All' || filterType !== 'All') && (
            <button
              onClick={() => { setSearch(''); setFilterStatus('All'); setFilterType('All'); setPage(1); }}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
            >
              <Icon name="XIcon" size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl px-5 py-3 slide-up">
          <span className="text-sm font-medium">{selectedRows.size} selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                selectedRows.forEach(id => handleApprove(id));
                setSelectedRows(new Set());
              }}
              className="text-xs bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Icon name="CheckIcon" size={13} />
              Approve All
            </button>
            <button
              onClick={() => { setSelectedRows(new Set()); }}
              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors"
            >
              <Icon name="XIcon" size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header-cell w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={() => {
                      if (selectedRows.size === paginated.length) setSelectedRows(new Set());
                      else setSelectedRows(new Set(paginated.map(r => r.id)));
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                </th>
                <th className="table-header-cell">Request ID</th>
                <th className="table-header-cell min-w-[220px]">Service Item</th>
                <th className="table-header-cell">Requester</th>
                <th className="table-header-cell">Type</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Approver</th>
                <th className="table-header-cell">Submitted</th>
                <th className="table-header-cell">SLA Due</th>
                <th className="table-header-cell">Est. Cost</th>
                <th className="table-header-cell w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="ClipboardListIcon" size={36} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No service requests match your filters</p>
                      <p className="text-xs text-slate-400">Adjust search terms or filter criteria above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((req) => (
                  <tr
                    key={req.id}
                    className={`table-row group ${
                      req.status === 'Pending Approval' ? 'bg-amber-50/30 hover:bg-amber-50/60' : selectedRows.has(req.id) ?'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="table-cell w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(req.id)}
                        onChange={() => toggleRow(req.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs text-blue-600 font-medium">{req.id}</span>
                    </td>
                    <td className="table-cell min-w-[220px]">
                      <div className="flex items-start gap-2">
                        <Icon name={typeIcons[req.type] as any} size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]" title={req.serviceItem}>
                            {req.serviceItem}
                          </p>
                          {req.notes && (
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{req.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-slate-700 font-medium whitespace-nowrap">{req.requester}</p>
                      <p className="text-xs text-slate-400">{req.department}</p>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap">{req.type}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${statusColors[req.status]}`}>
                        {req.status === 'Pending Approval' && (
                          <Icon name="ClockIcon" size={10} className="mr-1" />
                        )}
                        {req.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap">{req.approver}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap tabular-nums">{req.submitted}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-slate-600 whitespace-nowrap tabular-nums">{req.slaDue}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs font-medium text-slate-700 tabular-nums">{req.cost}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {req.status === 'Pending Approval' ? (
                          <>
                            <button
                              onClick={() => setConfirmAction({ id: req.id, action: 'approve' })}
                              className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors"
                            >
                              <Icon name="CheckIcon" size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => setConfirmAction({ id: req.id, action: 'reject' })}
                              className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                            >
                              <Icon name="XIcon" size={12} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                              <Icon name="PencilIcon" size={13} className="text-blue-600" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                              <Icon name="EyeIcon" size={13} className="text-slate-500" />
                            </button>
                          </div>
                        )}
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
          <span className="text-xs text-slate-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 transition-colors"
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
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 transition-colors"
            >
              <Icon name="ChevronRightIcon" size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confirmAction.action === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                <Icon
                  name={confirmAction.action === 'approve' ? 'CheckCircleIcon' : 'XCircleIcon'}
                  size={20}
                  className={confirmAction.action === 'approve' ? 'text-green-600' : 'text-red-600'}
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 capitalize">
                  {confirmAction.action} Request
                </h3>
                <p className="text-xs text-slate-500">{confirmAction.id}</p>
              </div>
            </div>

            {confirmAction.action === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Rejection Reason <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={2}
                  placeholder="Explain why this request is being rejected…"
                  className="input-field resize-none text-sm"
                />
              </div>
            )}

            <p className="text-sm text-slate-600 mb-6">
              {confirmAction.action === 'approve' ?'This will move the request to the fulfillment queue and notify the requester.' :'The requester will be notified with your rejection reason.'}
            </p>

            <div className="flex gap-3">
              <button onClick={() => { setConfirmAction(null); setRejectNote(''); }} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => confirmAction.action === 'approve' ? handleApprove(confirmAction.id) : handleReject(confirmAction.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg active:scale-95 transition-all ${
                  confirmAction.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'btn-danger'
                }`}
              >
                <Icon name={confirmAction.action === 'approve' ? 'CheckIcon' : 'XIcon'} size={15} />
                Confirm {confirmAction.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}