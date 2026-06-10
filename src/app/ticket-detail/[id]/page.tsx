'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

type Priority = 'P1' | 'P2' | 'P3' | 'P4';
type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Escalated';

interface TimelineEvent {
  id: string;
  type: 'created' | 'status_change' | 'assigned' | 'comment' | 'attachment' | 'escalated' | 'resolved' | 'sla_breach';
  actor: string;
  actorInitials: string;
  actorColor: string;
  timestamp: string;
  description: string;
  detail?: string;
}

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  role: string;
  timestamp: string;
  body: string;
  isInternal: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  icon: string;
}

const priorityColors: Record<Priority, string> = {
  P1: 'badge-p1', P2: 'badge-p2', P3: 'badge-p3', P4: 'badge-p4',
};

const statusColors: Record<TicketStatus, string> = {
  New: 'badge-new', Assigned: 'badge-assigned', 'In Progress': 'badge-inprogress',
  Pending: 'badge-pending', Resolved: 'badge-resolved', Closed: 'badge-closed', Escalated: 'badge-escalated',
};

const allStatuses: TicketStatus[] = ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Escalated'];

const ticketData: Record<string, {
  id: string; title: string; description: string; requester: string; requesterDept: string; requesterEmail: string;
  priority: Priority; category: string; assignee: string; assigneeEmail: string; status: TicketStatus;
  created: string; slaDue: string; slaHealth: string; channel: string; tags: string[];
  affectedUsers: number; relatedTickets: string[];
}> = {
  'TKT-1042': {
    id: 'TKT-1042', title: 'VPN connectivity failure — entire Engineering floor',
    description: 'All users on the Engineering floor (approx. 45 people) are unable to connect to the corporate VPN. The issue started at approximately 05:00 AM. Users are receiving "Authentication failed" errors. Remote workers are also affected. This is blocking all development work and access to internal systems.',
    requester: 'Nathan Park', requesterDept: 'Engineering', requesterEmail: 'n.park@company.com',
    priority: 'P1', category: 'Network', assignee: 'Unassigned', assigneeEmail: '',
    status: 'New', created: '03/16/26 05:12', slaDue: '03/16/26 09:12', slaHealth: 'Breached',
    channel: 'Email', tags: ['VPN', 'Network', 'Critical', 'Engineering'],
    affectedUsers: 45, relatedTickets: ['TKT-1041', 'TKT-1038'],
  },
  'TKT-1041': {
    id: 'TKT-1041', title: 'Active Directory sync failure — 12 users locked out',
    description: 'Active Directory synchronization has failed, resulting in 12 users being locked out of their accounts. The affected users are unable to log in to any company systems. The issue appears to have started after the scheduled maintenance window last night.',
    requester: 'Lisa Huang', requesterDept: 'HR', requesterEmail: 'l.huang@company.com',
    priority: 'P1', category: 'Identity & Access', assignee: 'James Okafor', assigneeEmail: 'j.okafor@company.com',
    status: 'In Progress', created: '03/16/26 02:25', slaDue: '03/16/26 06:25', slaHealth: 'Breached',
    channel: 'Phone', tags: ['Active Directory', 'Authentication', 'Lockout'],
    affectedUsers: 12, relatedTickets: ['TKT-1042'],
  },
};

const defaultTicket = {
  id: 'TKT-1040', title: 'Production database backup job failing since last night',
  description: 'The automated database backup job has been failing since approximately 22:00 last night. The backup logs show timeout errors after 30 minutes. This affects our disaster recovery capability and needs immediate attention.',
  requester: 'Omar Hassan', requesterDept: 'Engineering', requesterEmail: 'o.hassan@company.com',
  priority: 'P2' as Priority, category: 'Database', assignee: 'Sarah Chen', assigneeEmail: 's.chen@company.com',
  status: 'Assigned' as TicketStatus, created: '03/15/26 22:10', slaDue: '03/16/26 10:10', slaHealth: 'Warning',
  channel: 'Portal', tags: ['Database', 'Backup', 'Production'],
  affectedUsers: 3, relatedTickets: ['TKT-1039'],
};

const mockTimeline: TimelineEvent[] = [
  { id: 'e1', type: 'created', actor: 'System', actorInitials: 'SY', actorColor: 'bg-slate-500', timestamp: '03/15/26 22:10', description: 'Ticket created via Portal', detail: 'Ticket auto-assigned priority P2 based on category rules' },
  { id: 'e2', type: 'assigned', actor: 'Marcus Reynolds', actorInitials: 'MR', actorColor: 'bg-blue-600', timestamp: '03/15/26 22:35', description: 'Assigned to Sarah Chen', detail: 'Assigned based on workload balancing' },
  { id: 'e3', type: 'comment', actor: 'Sarah Chen', actorInitials: 'SC', actorColor: 'bg-violet-600', timestamp: '03/15/26 23:05', description: 'Added internal note', detail: 'Checked backup logs — seeing timeout at 30 min mark. Investigating disk I/O.' },
  { id: 'e4', type: 'status_change', actor: 'Sarah Chen', actorInitials: 'SC', actorColor: 'bg-violet-600', timestamp: '03/15/26 23:10', description: 'Status changed from New → Assigned', detail: '' },
  { id: 'e5', type: 'attachment', actor: 'Sarah Chen', actorInitials: 'SC', actorColor: 'bg-violet-600', timestamp: '03/15/26 23:22', description: 'Attached backup_error_log.txt', detail: '2.4 KB — error log from last 3 failed runs' },
  { id: 'e6', type: 'sla_breach', actor: 'System', actorInitials: 'SY', actorColor: 'bg-amber-500', timestamp: '03/16/26 06:10', description: 'SLA Warning threshold reached', detail: '4 hours remaining before SLA breach' },
  { id: 'e7', type: 'comment', actor: 'Omar Hassan', actorInitials: 'OH', actorColor: 'bg-emerald-600', timestamp: '03/16/26 08:30', description: 'Requester added update', detail: 'Still seeing failures. Last backup was 36 hours ago. This is becoming critical.' },
];

const mockComments: Comment[] = [
  { id: 'c1', author: 'Sarah Chen', authorInitials: 'SC', authorColor: 'bg-violet-600', role: 'IT Engineer', timestamp: '03/15/26 23:05', body: 'Checked the backup logs and I\'m seeing consistent timeout errors at the 30-minute mark. This looks like a disk I/O bottleneck. Running diagnostics on the storage array now. Will update shortly.', isInternal: true },
  { id: 'c2', author: 'Omar Hassan', authorInitials: 'OH', authorColor: 'bg-emerald-600', role: 'Requester', timestamp: '03/16/26 08:30', body: 'Hi Sarah, just checking in — the backup job failed again at 08:00. We\'re now 36 hours without a successful backup. This is becoming a compliance risk. Can we get an ETA on resolution?', isInternal: false },
  { id: 'c3', author: 'Sarah Chen', authorInitials: 'SC', authorColor: 'bg-violet-600', role: 'IT Engineer', timestamp: '03/16/26 09:15', body: 'Omar, I\'ve identified the root cause — the storage array is running at 94% capacity which is causing the I/O timeouts. I\'m coordinating with the infrastructure team to free up space. ETA for fix: 2 hours.', isInternal: false },
];

const mockAttachments: Attachment[] = [
  { id: 'a1', name: 'backup_error_log.txt', size: '2.4 KB', type: 'text', uploadedBy: 'Sarah Chen', uploadedAt: '03/15/26 23:22', icon: 'FileTextIcon' },
  { id: 'a2', name: 'storage_diagnostics_report.pdf', size: '148 KB', type: 'pdf', uploadedBy: 'Sarah Chen', uploadedAt: '03/16/26 09:10', icon: 'FileIcon' },
  { id: 'a3', name: 'disk_usage_screenshot.png', size: '87 KB', type: 'image', uploadedBy: 'Marcus Reynolds', uploadedAt: '03/16/26 09:45', icon: 'ImageIcon' },
];

const timelineIcons: Record<string, { icon: string; color: string }> = {
  created: { icon: 'PlusCircleIcon', color: 'text-blue-600 bg-blue-50' },
  status_change: { icon: 'RefreshCwIcon', color: 'text-violet-600 bg-violet-50' },
  assigned: { icon: 'UserCheckIcon', color: 'text-indigo-600 bg-indigo-50' },
  comment: { icon: 'MessageSquareIcon', color: 'text-slate-600 bg-slate-100' },
  attachment: { icon: 'PaperclipIcon', color: 'text-teal-600 bg-teal-50' },
  escalated: { icon: 'AlertTriangleIcon', color: 'text-red-600 bg-red-50' },
  resolved: { icon: 'CheckCircleIcon', color: 'text-green-600 bg-green-50' },
  sla_breach: { icon: 'ClockIcon', color: 'text-amber-600 bg-amber-50' },
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;

  const ticket = ticketData[ticketId] || { ...defaultTicket, id: ticketId || 'TKT-1040' };

  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'comments' | 'attachments'>('timeline');
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionCategory, setResolutionCategory] = useState('');
  const [resolved, setResolved] = useState(status === 'Resolved' || status === 'Closed');

  const handleStatusChange = (s: TicketStatus) => {
    setStatus(s);
    setShowStatusDropdown(false);
    if (s === 'Resolved') setShowResolutionModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `c${Date.now()}`,
      author: 'Marcus Reynolds',
      authorInitials: 'MR',
      authorColor: 'bg-blue-600',
      role: 'IT Manager',
      timestamp: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      body: newComment.trim(),
      isInternal,
    };
    setComments(prev => [...prev, c]);
    setNewComment('');
  };

  const handleResolve = () => {
    setResolved(true);
    setStatus('Resolved');
    setShowResolutionModal(false);
  };

  const slaHealthColor = ticket.slaHealth === 'Breached' ?'text-red-600 bg-red-50 border-red-200'
    : ticket.slaHealth === 'Warning' ?'text-amber-600 bg-amber-50 border-amber-200' :'text-green-600 bg-green-50 border-green-200';

  return (
    <AppLayout>
      <div className="space-y-5 max-w-7xl mx-auto">

        {/* Breadcrumb + Back */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.push('/ticket-management')} className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Icon name="ChevronLeftIcon" size={14} />
            Ticket Management
          </button>
          <Icon name="ChevronRightIcon" size={13} className="text-slate-300" />
          <span className="font-mono text-slate-700 font-medium">{ticket.id}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{ticket.id}</span>
                <span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className={`badge cursor-pointer hover:opacity-80 transition-opacity ${statusColors[status]} flex items-center gap-1`}
                  >
                    {status}
                    <Icon name="ChevronDownIcon" size={10} />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                      <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-modal z-20 py-1 min-w-[150px] fade-in">
                        {allStatuses.map((s) => (
                          <button key={s} onClick={() => handleStatusChange(s)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 ${s === status ? 'font-semibold text-blue-600' : 'text-slate-700'}`}>
                            <span className={`badge ${statusColors[s]} text-[10px] px-1.5`}>{s}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${slaHealthColor}`}>
                  SLA: {ticket.slaHealth}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 leading-snug">{ticket.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={12} />Created {ticket.created}</span>
                <span className="flex items-center gap-1"><Icon name="ClockIcon" size={12} />SLA Due {ticket.slaDue}</span>
                <span className="flex items-center gap-1"><Icon name="TagIcon" size={12} />{ticket.category}</span>
                <span className="flex items-center gap-1"><Icon name="MonitorIcon" size={12} />{ticket.channel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!resolved && (
                <button
                  onClick={() => setShowResolutionModal(true)}
                  className="btn-primary text-sm"
                >
                  <Icon name="CheckCircleIcon" size={15} />
                  Resolve Ticket
                </button>
              )}
              {resolved && (
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <Icon name="CheckCircleIcon" size={15} />
                  Resolved
                </div>
              )}
              <button className="btn-secondary text-sm">
                <Icon name="MoreHorizontalIcon" size={15} />
              </button>
            </div>
          </div>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-4 flex-wrap">
              {ticket.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* Left: Description + Tabs */}
          <div className="col-span-2 space-y-5">

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Icon name="AlignLeftIcon" size={15} className="text-slate-400" />
                Description
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/60">
                {(['timeline', 'comments', 'attachments'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 bg-white' :'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'timeline' && <span className="flex items-center gap-1.5"><Icon name="ActivityIcon" size={14} />Timeline</span>}
                    {tab === 'comments' && <span className="flex items-center gap-1.5"><Icon name="MessageSquareIcon" size={14} />Comments <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{comments.length}</span></span>}
                    {tab === 'attachments' && <span className="flex items-center gap-1.5"><Icon name="PaperclipIcon" size={14} />Attachments <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{mockAttachments.length}</span></span>}
                  </button>
                ))}
              </div>

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="p-6">
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />
                    <div className="space-y-5">
                      {mockTimeline.map((event) => {
                        const iconConfig = timelineIcons[event.type] || timelineIcons.comment;
                        return (
                          <div key={event.id} className="flex gap-4 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${iconConfig.color} border-2 border-white`}>
                              <Icon name={iconConfig.icon as any} size={16} />
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-slate-800">{event.actor}</span>
                                <span className="text-sm text-slate-600">{event.description}</span>
                                <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{event.timestamp}</span>
                              </div>
                              {event.detail && (
                                <p className="text-xs text-slate-500 mt-1 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{event.detail}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="p-6 space-y-5">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`rounded-xl border p-4 ${comment.isInternal ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${comment.authorColor}`}>
                          {comment.authorInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                            <span className="text-xs text-slate-400">{comment.role}</span>
                            {comment.isInternal && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Internal Note</span>
                            )}
                            <span className="text-xs text-slate-400 ml-auto">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <button
                        onClick={() => setIsInternal(false)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${!isInternal ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Public Reply
                      </button>
                      <button
                        onClick={() => setIsInternal(true)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${isInternal ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Internal Note
                      </button>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder={isInternal ? 'Add an internal note (not visible to requester)…' : 'Write a reply to the requester…'}
                      className={`w-full px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none ${isInternal ? 'bg-amber-50/40' : 'bg-white'}`}
                    />
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors" title="Attach file">
                          <Icon name="PaperclipIcon" size={14} className="text-slate-500" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors" title="Mention">
                          <Icon name="AtSignIcon" size={14} className="text-slate-500" />
                        </button>
                      </div>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="btn-primary text-xs py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Icon name="SendIcon" size={13} />
                        {isInternal ? 'Add Note' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments Tab */}
              {activeTab === 'attachments' && (
                <div className="p-6 space-y-3">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <Icon name="UploadCloudIcon" size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">Drop files here or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, images, logs, and documents up to 25 MB</p>
                  </div>
                  <div className="space-y-2">
                    {mockAttachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <Icon name={att.icon as any} size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{att.name}</p>
                          <p className="text-xs text-slate-400">{att.size} · Uploaded by {att.uploadedBy} · {att.uploadedAt}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-white rounded-lg transition-colors" title="Download">
                            <Icon name="DownloadIcon" size={14} className="text-slate-600" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Icon name="TrashIcon" size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details Sidebar */}
          <div className="space-y-4">

            {/* Ticket Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="InfoIcon" size={14} className="text-slate-400" />
                Ticket Details
              </h3>
              <div className="space-y-3.5">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Requester</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {ticket.requester.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{ticket.requester}</p>
                      <p className="text-xs text-slate-400">{ticket.requesterDept}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Assigned To</p>
                  {ticket.assignee !== 'Unassigned' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {ticket.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{ticket.assignee}</p>
                        <p className="text-xs text-slate-400">{ticket.assigneeEmail}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <Icon name="UserIcon" size={13} className="text-slate-400" />
                      </div>
                      <span className="text-sm text-red-500 font-medium">Unassigned</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Priority</p>
                    <span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Category</p>
                    <p className="text-xs font-medium text-slate-700">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Channel</p>
                    <p className="text-xs font-medium text-slate-700">{ticket.channel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Affected Users</p>
                    <p className="text-xs font-medium text-slate-700">{ticket.affectedUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="ClockIcon" size={14} className="text-slate-400" />
                SLA Status
              </h3>
              <div className="space-y-3">
                <div className={`rounded-xl p-3 border ${slaHealthColor}`}>
                  <div className="flex items-center gap-2">
                    <Icon name={ticket.slaHealth === 'Breached' ? 'AlertCircleIcon' : ticket.slaHealth === 'Warning' ? 'AlertTriangleIcon' : 'CheckCircleIcon'} size={16} />
                    <span className="text-sm font-semibold">{ticket.slaHealth}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Due Date</p>
                  <p className="text-sm font-medium text-slate-700 tabular-nums">{ticket.slaDue}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Created</p>
                  <p className="text-sm font-medium text-slate-700 tabular-nums">{ticket.created}</p>
                </div>
              </div>
            </div>

            {/* Resolution Workflow */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="GitBranchIcon" size={14} className="text-slate-400" />
                Resolution Workflow
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Ticket Created', done: true, icon: 'PlusCircleIcon' },
                  { label: 'Assigned to Agent', done: ticket.assignee !== 'Unassigned', icon: 'UserCheckIcon' },
                  { label: 'Investigation Started', done: ['In Progress', 'Pending', 'Resolved', 'Closed'].includes(status), icon: 'SearchIcon' },
                  { label: 'Pending Confirmation', done: ['Pending', 'Resolved', 'Closed'].includes(status), icon: 'HourglassIcon' },
                  { label: 'Resolved', done: ['Resolved', 'Closed'].includes(status), icon: 'CheckCircleIcon' },
                  { label: 'Closed', done: status === 'Closed', icon: 'ArchiveIcon' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Icon name={step.icon as any} size={13} />
                    </div>
                    <span className={`text-xs font-medium ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
                    {step.done && <Icon name="CheckIcon" size={12} className="text-green-500 ml-auto" />}
                  </div>
                ))}
              </div>
              {!resolved && (
                <button
                  onClick={() => setShowResolutionModal(true)}
                  className="w-full mt-4 btn-primary text-sm"
                >
                  <Icon name="CheckCircleIcon" size={14} />
                  Mark as Resolved
                </button>
              )}
            </div>

            {/* Related Tickets */}
            {ticket.relatedTickets.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="LinkIcon" size={14} className="text-slate-400" />
                  Related Tickets
                </h3>
                <div className="space-y-2">
                  {ticket.relatedTickets.map(id => (
                    <button
                      key={id}
                      onClick={() => router.push(`/ticket-detail/${id}`)}
                      className="w-full text-left flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <Icon name="TicketIcon" size={13} className="text-slate-400" />
                      <span className="font-mono text-xs text-blue-600 font-medium group-hover:underline">{id}</span>
                      <Icon name="ArrowRightIcon" size={11} className="text-slate-300 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircleIcon" size={16} className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Resolve Ticket</h2>
              </div>
              <button onClick={() => setShowResolutionModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="XIcon" size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resolution Category <span className="text-red-500">*</span></label>
                <select
                  value={resolutionCategory}
                  onChange={(e) => setResolutionCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select resolution type…</option>
                  <option>Fixed — Root cause identified and resolved</option>
                  <option>Workaround — Temporary fix applied</option>
                  <option>User Error — Requester issue, guidance provided</option>
                  <option>Duplicate — Merged with another ticket</option>
                  <option>No Action Required — Issue resolved itself</option>
                  <option>Escalated to Vendor — Awaiting vendor fix</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resolution Notes <span className="text-red-500">*</span></label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                  placeholder="Describe what was done to resolve this ticket, root cause, and any follow-up actions required…"
                  className="input-field resize-none"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Icon name="InfoIcon" size={14} className="text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">The requester will be notified via email with the resolution summary.</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowResolutionModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={handleResolve}
                  disabled={!resolutionNote.trim() || !resolutionCategory}
                  className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="CheckCircleIcon" size={15} />
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
