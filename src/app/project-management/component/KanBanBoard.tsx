'use client';

import { useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';
type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeInitials: string;
  project: string;
  dueDate: string;
  tags: string[];
}

const initialTasks: KanbanTask[] = [
  { id: 'T-001', title: 'Network topology diagram update', description: 'Update all network diagrams to reflect new infrastructure layout.', status: 'To Do', priority: 'High', assignee: 'Marcus Reynolds', assigneeInitials: 'MR', project: 'PRJ-001', dueDate: '06/15/26', tags: ['Network', 'Docs'] },
  { id: 'T-002', title: 'Server rack labeling audit', description: 'Audit and relabel all server racks in DC1 and DC2.', status: 'To Do', priority: 'Medium', assignee: 'Nathan Park', assigneeInitials: 'NP', project: 'PRJ-001', dueDate: '06/20/26', tags: ['Hardware'] },
  { id: 'T-003', title: 'ITSM data migration script', description: 'Write and test data migration scripts for legacy helpdesk records.', status: 'In Progress', priority: 'Critical', assignee: 'Sarah Chen', assigneeInitials: 'SC', project: 'PRJ-002', dueDate: '05/10/26', tags: ['Migration', 'Script'] },
  { id: 'T-004', title: 'ISO 27001 gap analysis', description: 'Complete gap analysis against ISO 27001 control set.', status: 'In Progress', priority: 'Critical', assignee: 'James Okafor', assigneeInitials: 'JO', project: 'PRJ-003', dueDate: '05/30/26', tags: ['Security', 'Compliance'] },
  { id: 'T-005', title: 'ZTNA policy configuration', description: 'Configure access policies for all user groups in ZTNA platform.', status: 'In Progress', priority: 'High', assignee: 'Amara Diallo', assigneeInitials: 'AD', project: 'PRJ-006', dueDate: '05/25/26', tags: ['Security', 'Network'] },
  { id: 'T-006', title: 'MDM enrollment portal setup', description: 'Configure self-service enrollment portal for corporate devices.', status: 'Review', priority: 'Medium', assignee: 'Nathan Park', assigneeInitials: 'NP', project: 'PRJ-008', dueDate: '06/01/26', tags: ['MDM', 'Portal'] },
  { id: 'T-007', title: 'Onboarding workflow design', description: 'Design automated workflow for new hire IT provisioning.', status: 'Review', priority: 'High', assignee: 'Priya Nair', assigneeInitials: 'PN', project: 'PRJ-004', dueDate: '05/28/26', tags: ['Automation', 'HR'] },
  { id: 'T-008', title: 'ERP v12 UAT sign-off', description: 'Obtain final UAT sign-off from Finance team for ERP v12.', status: 'Done', priority: 'Critical', assignee: 'Rebecca Torres', assigneeInitials: 'RT', project: 'PRJ-007', dueDate: '02/28/26', tags: ['ERP', 'UAT'] },
  { id: 'T-009', title: 'Cloud cost optimization report', description: 'Analyze cloud spend and produce optimization recommendations.', status: 'Done', priority: 'Medium', assignee: 'Marcus Reynolds', assigneeInitials: 'MR', project: 'PRJ-001', dueDate: '03/15/26', tags: ['Cloud', 'Cost'] },
  { id: 'T-010', title: 'Security awareness training', description: 'Deliver phishing simulation and security awareness training to all staff.', status: 'To Do', priority: 'High', assignee: 'James Okafor', assigneeInitials: 'JO', project: 'PRJ-003', dueDate: '07/01/26', tags: ['Security', 'Training'] },
  { id: 'T-011', title: 'Firewall rule review', description: 'Review and clean up legacy firewall rules across all perimeter devices.', status: 'In Progress', priority: 'High', assignee: 'Amara Diallo', assigneeInitials: 'AD', project: 'PRJ-006', dueDate: '06/10/26', tags: ['Network', 'Security'] },
  { id: 'T-012', title: 'Backup verification test', description: 'Run full restore test from backup for critical systems.', status: 'Review', priority: 'Critical', assignee: 'David Thornton', assigneeInitials: 'DT', project: 'PRJ-005', dueDate: '06/05/26', tags: ['Backup', 'DR'] },
];

const columns: { id: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { id: 'To Do', label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-50', dot: 'bg-slate-400' },
  { id: 'In Progress', label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  { id: 'Review', label: 'Review', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  { id: 'Done', label: 'Done', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' },
];

const priorityColors: Record<TaskPriority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-slate-100 text-slate-600',
};

const priorityBorder: Record<TaskPriority, string> = {
  Critical: 'border-l-red-500',
  High: 'border-l-orange-400',
  Medium: 'border-l-yellow-400',
  Low: 'border-l-slate-300',
};

const avatarColors = ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600'];
const getAvatarColor = (initials: string) => avatarColors[initials.charCodeAt(0) % avatarColors.length];

const PIE_COLORS = ['#64748b', '#3b82f6', '#f59e0b', '#22c55e'];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [showCharts, setShowCharts] = useState(true);
  const dragTaskId = useRef<string | null>(null);

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    dragTaskId.current = taskId;
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(status);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData('text/plain') || dragTaskId.current;
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => t.id === taskId ? { ...t, status } : t)
      );
    }
    setDraggingId(null);
    setDragOverCol(null);
    dragTaskId.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverCol(null);
    dragTaskId.current = null;
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  }, []);

  // Chart data
  const pieData = columns.map((col) => ({
    name: col.label,
    value: tasksByStatus(col.id).length,
  }));

  const priorityBarData = (['Critical', 'High', 'Medium', 'Low'] as TaskPriority[]).map((p) => ({
    priority: p,
    count: tasks.filter((t) => t.priority === p).length,
  }));

  const progressData = columns.map((col) => ({
    status: col.label,
    count: tasksByStatus(col.id).length,
  }));

  return (
    <div className="space-y-5">
      {/* Charts Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Kanban Board</h2>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-blue-300 transition-colors"
        >
          <Icon name={showCharts ? 'EyeOffIcon' : 'BarChart2Icon'} size={14} />
          {showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {/* Charts Row */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Distribution Pie */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Task Distribution</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} tasks`, '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Breakdown Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Priority Breakdown</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={priorityBarData} barSize={28}>
                <XAxis dataKey="priority" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [`${v} tasks`, 'Count']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityBarData.map((entry, i) => {
                    const colors = ['#ef4444', '#f97316', '#eab308', '#94a3b8'];
                    return <Cell key={i} fill={colors[i]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Progress Overview</p>
            <div className="space-y-3 mt-2">
              {columns.map((col, i) => {
                const count = tasksByStatus(col.id).length;
                const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                const barColors = ['bg-slate-400', 'bg-blue-500', 'bg-amber-500', 'bg-green-500'];
                return (
                  <div key={col.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 font-medium">{col.label}</span>
                      <span className="text-xs text-slate-500">{count} tasks ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColors[i]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Tasks</span>
              <span className="text-sm font-bold text-slate-800">{tasks.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasksByStatus(col.id);
          const isOver = dragOverCol === col.id;
          return (
            <div
              key={col.id}
              className={`rounded-xl border-2 transition-all duration-150 ${isOver ? 'border-blue-400 bg-blue-50/60' : 'border-slate-200 bg-slate-50/50'}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragLeave={handleDragLeave}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.color} border border-current/20`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="p-2 space-y-2 min-h-[200px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg border border-l-4 border-slate-200 ${priorityBorder[task.priority]} shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 select-none ${draggingId === task.id ? 'opacity-40 scale-95' : 'opacity-100'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400">{task.id}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-snug mb-1.5">{task.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>

                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(task.assigneeInitials)}`}>
                          {task.assigneeInitials}
                        </div>
                        <span className="text-xs text-slate-500 truncate max-w-[80px]">{task.assignee.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Icon name="CalendarIcon" size={11} />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className={`flex flex-col items-center justify-center py-8 rounded-lg border-2 border-dashed ${isOver ? 'border-blue-300 bg-blue-50' : 'border-slate-200'} transition-colors`}>
                    <Icon name="PlusCircleIcon" size={20} className={isOver ? 'text-blue-400' : 'text-slate-300'} />
                    <p className="text-xs text-slate-400 mt-1.5">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
