'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Cancelled';
type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface TimeLog {
  id: string;
  date: string;
  loggedBy: string;
  loggedByInitials: string;
  loggedByColor: string;
  hours: number;
  description: string;
}

interface StatusChange {
  id: string;
  from: TaskStatus | null;
  to: TaskStatus;
  changedBy: string;
  changedByInitials: string;
  changedByColor: string;
  timestamp: string;
  note?: string;
}

interface TaskDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  icon: string;
}

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeInitials: string;
  project: string;
  department: string;
  dueDate: string;
  createdDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
}

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

const mockTaskData: Record<string, TaskDetail> = {
  'T-001': {
    id: 'T-001', title: 'Network topology diagram update', description: 'Update all network diagrams to reflect new infrastructure layout after the Q1 data center migration. Ensure all documentation is current and accessible to the infrastructure team.',
    status: 'To Do', priority: 'High', assignee: 'Marcus Reynolds', assigneeInitials: 'MR',
    project: 'IT Infrastructure Modernization', department: 'IT Operations',
    dueDate: '06/15/26', createdDate: '05/01/26', tags: ['Network', 'Docs'], estimatedHours: 8, loggedHours: 0,
  },
  'T-003': {
    id: 'T-003', title: 'ITSM data migration script', description: 'Write and test data migration scripts for legacy helpdesk records. Ensure data integrity and rollback capability.',
    status: 'In Progress', priority: 'Critical', assignee: 'Sarah Chen', assigneeInitials: 'SC',
    project: 'ITSM Platform Migration', department: 'IT Service Desk',
    dueDate: '05/10/26', createdDate: '04/15/26', tags: ['Migration', 'Script'], estimatedHours: 20, loggedHours: 14,
  },
};

const defaultTask: TaskDetail = {
  id: 'T-004', title: 'ISO 27001 gap analysis', description: 'Complete gap analysis against ISO 27001 control set. Document all findings and create a remediation roadmap for compliance.',
  status: 'In Progress', priority: 'Critical', assignee: 'James Okafor', assigneeInitials: 'JO',
  project: 'Cybersecurity Compliance Audit', department: 'Security',
  dueDate: '05/30/26', createdDate: '04/20/26', tags: ['Security', 'Compliance'], estimatedHours: 40, loggedHours: 22,
};

const mockTimeLogs: TimeLog[] = [
  { id: 'tl1', date: '04/20/26', loggedBy: 'James Okafor', loggedByInitials: 'JO', loggedByColor: 'bg-indigo-600', hours: 4, description: 'Initial review of ISO 27001 control framework and scoping document.' },
  { id: 'tl2', date: '04/22/26', loggedBy: 'James Okafor', loggedByInitials: 'JO', loggedByColor: 'bg-indigo-600', hours: 6, description: 'Conducted interviews with department heads for access control assessment.' },
  { id: 'tl3', date: '04/25/26', loggedBy: 'Amara Diallo', loggedByInitials: 'AD', loggedByColor: 'bg-rose-600', hours: 3, description: 'Reviewed network security controls and firewall policy documentation.' },
  { id: 'tl4', date: '04/28/26', loggedBy: 'James Okafor', loggedByInitials: 'JO', loggedByColor: 'bg-indigo-600', hours: 5, description: 'Documented findings for sections A.5 through A.9 of the standard.' },
  { id: 'tl5', date: '05/02/26', loggedBy: 'James Okafor', loggedByInitials: 'JO', loggedByColor: 'bg-indigo-600', hours: 4, description: 'Completed gap analysis for physical security and operations security controls.' },
];

const mockStatusChanges: StatusChange[] = [
  { id: 'sc1', from: null, to: 'To Do', changedBy: 'System', changedByInitials: 'SY', changedByColor: 'bg-slate-500', timestamp: '04/20/26 09:00', note: 'Task created and added to backlog.' },
  { id: 'sc2', from: 'To Do', to: 'In Progress', changedBy: 'James Okafor', changedByInitials: 'JO', changedByColor: 'bg-indigo-600', timestamp: '04/20/26 10:15', note: 'Starting initial scoping and framework review.' },
  { id: 'sc3', from: 'In Progress', to: 'Review', changedBy: 'James Okafor', changedByInitials: 'JO', changedByColor: 'bg-indigo-600', timestamp: '04/28/26 16:30', note: 'First draft of gap analysis submitted for review.' },
  { id: 'sc4', from: 'Review', to: 'In Progress', changedBy: 'Marcus Reynolds', changedByInitials: 'MR', changedByColor: 'bg-blue-600', timestamp: '04/30/26 11:00', note: 'Returned for additional coverage of sections A.12 and A.14.' },
];

const mockDocuments: TaskDocument[] = [
  { id: 'd1', name: 'ISO27001_Gap_Analysis_v1.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'James Okafor', uploadedAt: '04/28/26 16:25', icon: 'FileIcon' },
  { id: 'd2', name: 'Control_Framework_Mapping.xlsx', size: '348 KB', type: 'spreadsheet', uploadedBy: 'James Okafor', uploadedAt: '04/25/26 14:10', icon: 'FileTextIcon' },
  { id: 'd3', name: 'Network_Security_Review.docx', size: '215 KB', type: 'document', uploadedBy: 'Amara Diallo', uploadedAt: '04/25/26 17:45', icon: 'FileTextIcon' },
  { id: 'd4', name: 'Audit_Evidence_Screenshots.zip', size: '4.7 MB', type: 'archive', uploadedBy: 'James Okafor', uploadedAt: '05/02/26 09:30', icon: 'ArchiveIcon' },
];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const task = mockTaskData[taskId] || { ...defaultTask, id: taskId || 'T-004' };

  const [activeTab, setActiveTab] = useState<'timelogs' | 'status-changes' | 'documents'>('timelogs');
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [documents, setDocuments] = useState<TaskDocument[]>(mockDocuments);
  const [statusChanges] = useState<StatusChange[]>(mockStatusChanges);

  // Add Time Log form
  const [showAddLog, setShowAddLog] = useState(false);
  const [logHours, setLogHours] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logDescription, setLogDescription] = useState('');

  // Drag state for doc upload
  const [isDragging, setIsDragging] = useState(false);

  const totalLogged = timeLogs.reduce((sum, l) => sum + l.hours, 0);
  const hoursPercent = task.estimatedHours > 0 ? Math.min(100, (totalLogged / task.estimatedHours) * 100) : 0;

  const handleAddLog = () => {
    if (!logHours || !logDate) return;
    const newLog: TimeLog = {
      id: `tl${Date.now()}`,
      date: logDate,
      loggedBy: 'Marcus Reynolds',
      loggedByInitials: 'MR',
      loggedByColor: 'bg-blue-600',
      hours: parseFloat(logHours),
      description: logDescription.trim() || 'Time logged.',
    };
    setTimeLogs(prev => [newLog, ...prev]);
    setLogHours('');
    setLogDate('');
    setLogDescription('');
    setShowAddLog(false);
  };

  const handleDeleteLog = (id: string) => {
    setTimeLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newDocs: TaskDocument[] = files.map((file, i) => ({
      id: `d${Date.now()}${i}`,
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      type: file.type,
      uploadedBy: 'Marcus Reynolds',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      icon: file.type.includes('image') ? 'ImageIcon' : file.type.includes('pdf') ? 'FileIcon' : 'FileTextIcon',
    }));
    setDocuments(prev => [...newDocs, ...prev]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs: TaskDocument[] = files.map((file, i) => ({
      id: `d${Date.now()}${i}`,
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      type: file.type,
      uploadedBy: 'Marcus Reynolds',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      icon: file.type.includes('image') ? 'ImageIcon' : file.type.includes('pdf') ? 'FileIcon' : 'FileTextIcon',
    }));
    setDocuments(prev => [...newDocs, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-5 max-w-7xl mx-auto fade-in">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.push('/tasks')} className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Icon name="ChevronLeftIcon" size={14} />
            Tasks
          </button>
          <Icon name="ChevronRightIcon" size={13} className="text-slate-300" />
          <span className="font-mono text-slate-700 font-medium">{task.id}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{task.id}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[task.status]}`} />
                  {task.status}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 leading-snug">{task.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={12} />Created {task.createdDate}</span>
                <span className="flex items-center gap-1"><Icon name="ClockIcon" size={12} />Due {task.dueDate}</span>
                <span className="flex items-center gap-1"><Icon name="FolderIcon" size={12} />{task.project}</span>
                <span className="flex items-center gap-1"><Icon name="BuildingIcon" size={12} />{task.department}</span>
              </div>
              {task.tags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/tasks')}
              className="btn-secondary text-sm flex-shrink-0"
            >
              <Icon name="ArrowLeftIcon" size={14} />
              Back to Tasks
            </button>
          </div>
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
              <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>
            </div>

            {/* Tabs: Time Logs | Status Changes | Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/60">
                <button
                  onClick={() => setActiveTab('timelogs')}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'timelogs' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Icon name="TimerIcon" size={14} />
                  Time Logs
                  <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{timeLogs.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('status-changes')}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'status-changes' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Icon name="RefreshCwIcon" size={14} />
                  Status Changes
                  <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{statusChanges.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Icon name="PaperclipIcon" size={14} />
                  Documents
                  <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{documents.length}</span>
                </button>
              </div>

              {/* ── Time Logs Tab ── */}
              {activeTab === 'timelogs' && (
                <div className="p-6 space-y-4">
                  {/* Summary bar */}
                  <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Total Logged</p>
                        <p className="text-lg font-semibold text-slate-900">{totalLogged}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Estimated</p>
                        <p className="text-lg font-semibold text-slate-900">{task.estimatedHours}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Remaining</p>
                        <p className={`text-lg font-semibold ${totalLogged > task.estimatedHours ? 'text-red-600' : 'text-emerald-600'}`}>
                          {Math.max(0, task.estimatedHours - totalLogged)}h
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddLog(!showAddLog)}
                      className="btn-primary text-sm"
                    >
                      <Icon name="PlusIcon" size={14} />
                      Log Time
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>Time Progress</span>
                      <span className={totalLogged > task.estimatedHours ? 'text-red-500 font-medium' : ''}>
                        {Math.round(hoursPercent)}% used
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${totalLogged > task.estimatedHours ? 'bg-red-400' : 'bg-blue-500'}`}
                        style={{ width: `${hoursPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Add Log Form */}
                  {showAddLog && (
                    <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Icon name="TimerIcon" size={14} className="text-blue-600" />
                        Add Time Log
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                          <input
                            type="date"
                            className="input-field text-sm"
                            value={logDate}
                            onChange={(e) => setLogDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Hours Spent</label>
                          <input
                            type="number"
                            min="0.25"
                            step="0.25"
                            placeholder="e.g. 2.5"
                            className="input-field text-sm"
                            value={logHours}
                            onChange={(e) => setLogHours(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <textarea
                          rows={2}
                          placeholder="What did you work on?"
                          className="input-field text-sm resize-none"
                          value={logDescription}
                          onChange={(e) => setLogDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setShowAddLog(false)} className="btn-secondary text-sm">Cancel</button>
                        <button
                          onClick={handleAddLog}
                          disabled={!logHours || !logDate}
                          className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Icon name="CheckIcon" size={13} />
                          Save Log
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Log entries */}
                  <div className="space-y-2">
                    {timeLogs.length === 0 && (
                      <div className="text-center py-10 text-slate-400">
                        <Icon name="TimerIcon" size={28} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No time logs yet. Click "Log Time" to add one.</p>
                      </div>
                    )}
                    {timeLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${log.loggedByColor}`}>
                          {log.loggedByInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-slate-800">{log.loggedBy}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{log.hours}h</span>
                            <span className="text-xs text-slate-400 ml-auto">{log.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{log.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Delete log"
                        >
                          <Icon name="TrashIcon" size={13} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Status Changes Tab ── */}
              {activeTab === 'status-changes' && (
                <div className="p-6">
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />
                    <div className="space-y-5">
                      {statusChanges.map((change) => (
                        <div key={change.id} className="flex gap-4 relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 border-2 border-white ${change.changedByColor}`}>
                            {change.changedByInitials}
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-semibold text-slate-800">{change.changedBy}</span>
                              <span className="text-xs text-slate-500">changed status</span>
                              {change.from ? (
                                <>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[change.from]}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[change.from]}`} />
                                    {change.from}
                                  </span>
                                  <Icon name="ArrowRightIcon" size={12} className="text-slate-400" />
                                </>
                              ) : (
                                <span className="text-xs text-slate-400">Created as</span>
                              )}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[change.to]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[change.to]}`} />
                                {change.to}
                              </span>
                              <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{change.timestamp}</span>
                            </div>
                            {change.note && (
                              <p className="text-xs text-slate-500 mt-1 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{change.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Documents Tab ── */}
              {activeTab === 'documents' && (
                <div className="p-6 space-y-4">
                  {/* Upload zone */}
                  <label
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <input type="file" multiple className="hidden" onChange={handleFileInput} />
                    <Icon name="UploadCloudIcon" size={28} className={`mb-2 ${isDragging ? 'text-blue-400' : 'text-slate-300'}`} />
                    <p className="text-sm font-medium text-slate-600">Drop files here or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, images, documents, and archives up to 25 MB</p>
                  </label>

                  {/* Document list */}
                  {documents.length === 0 && (
                    <div className="text-center py-6 text-slate-400">
                      <Icon name="FileIcon" size={24} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No documents uploaded yet.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <Icon name={doc.icon as any} size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.size} · Uploaded by {doc.uploadedBy} · {doc.uploadedAt}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-white rounded-lg transition-colors" title="Download">
                            <Icon name="DownloadIcon" size={14} className="text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
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

          {/* Right: Task Details Sidebar */}
          <div className="space-y-4">

            {/* Task Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="InfoIcon" size={14} className="text-slate-400" />
                Task Details
              </h3>
              <div className="space-y-3.5">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Assignee</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(task.assigneeInitials)}`}>
                      {task.assigneeInitials}
                    </div>
                    <p className="text-sm font-medium text-slate-800">{task.assignee}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[task.status]}`} />
                    {task.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Project</p>
                  <p className="text-sm text-slate-700">{task.project}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Department</p>
                  <p className="text-sm text-slate-700">{task.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Due Date</p>
                  <p className="text-sm text-slate-700 flex items-center gap-1.5">
                    <Icon name="CalendarIcon" size={12} className="text-slate-400" />
                    {task.dueDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Created</p>
                  <p className="text-sm text-slate-700 flex items-center gap-1.5">
                    <Icon name="CalendarIcon" size={12} className="text-slate-400" />
                    {task.createdDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="TimerIcon" size={14} className="text-slate-400" />
                Time Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Estimated</span>
                  <span className="font-semibold text-slate-800">{task.estimatedHours}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Logged</span>
                  <span className="font-semibold text-slate-800">{totalLogged}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className={`font-semibold ${totalLogged > task.estimatedHours ? 'text-red-600' : 'text-emerald-600'}`}>
                    {Math.max(0, task.estimatedHours - totalLogged)}h
                  </span>
                </div>
                <div className="pt-1">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${totalLogged > task.estimatedHours ? 'bg-red-400' : 'bg-blue-500'}`}
                      style={{ width: `${hoursPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 text-right">{Math.round(hoursPercent)}% of estimate used</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Icon name="BarChart2Icon" size={14} className="text-slate-400" />
                Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Icon name="TimerIcon" size={12} className="text-blue-500" />
                    Time Entries
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{timeLogs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Icon name="RefreshCwIcon" size={12} className="text-violet-500" />
                    Status Changes
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{statusChanges.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Icon name="PaperclipIcon" size={12} className="text-teal-500" />
                    Documents
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{documents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
