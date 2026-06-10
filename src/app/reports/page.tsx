'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek: string;
  dayOfMonth: string;
  recipients: string;
  subject: string;
  format: 'pdf' | 'csv' | 'xlsx';
  includeCharts: boolean;
}

interface ReportRow {
  id: string;
  reportName: string;
  subject: string;
  email: string;
  created: string;
  createdBy: string;
  scheduledTime: string;
  status: 'Send' | 'Pending' | 'Failed';
  downloadFormat: 'pdf' | 'xls';
}

// ─── Mock report rows ─────────────────────────────────────────────────────────

const mockReportData: ReportRow[] = [
  { id: 'RPT-001', reportName: 'Ticket Summary Report', subject: 'Weekly Ticket Overview', email: 'manager@company.com', created: '2026-04-01', createdBy: 'Sarah Kim', scheduledTime: '2026-04-07 08:00', status: 'Send', downloadFormat: 'pdf' },
  { id: 'RPT-002', reportName: 'SLA Compliance Report', subject: 'SLA Breach Analysis – March', email: 'director@company.com', created: '2026-04-02', createdBy: 'James Patel', scheduledTime: '2026-04-08 09:00', status: 'Pending', downloadFormat: 'xls' },
  { id: 'RPT-003', reportName: 'Agent Performance Report', subject: 'Agent KPIs – Q1 2026', email: 'hr@company.com', created: '2026-04-03', createdBy: 'Lena Torres', scheduledTime: '2026-04-09 10:00', status: 'Send', downloadFormat: 'pdf' },
  { id: 'RPT-004', reportName: 'Category Breakdown Report', subject: 'Ticket Categories – April', email: 'ops@company.com', created: '2026-04-04', createdBy: 'Marcus Reynolds', scheduledTime: '2026-04-10 08:30', status: 'Failed', downloadFormat: 'xls' },
  { id: 'RPT-005', reportName: 'Priority Analysis Report', subject: 'Critical & High Priority Tickets', email: 'cto@company.com', created: '2026-04-05', createdBy: 'Sarah Kim', scheduledTime: '2026-04-10 11:00', status: 'Pending', downloadFormat: 'pdf' },
  { id: 'RPT-006', reportName: 'Network Issues Report', subject: 'Network Incident Summary', email: 'netops@company.com', created: '2026-04-05', createdBy: 'James Patel', scheduledTime: '2026-04-11 07:00', status: 'Send', downloadFormat: 'xls' },
  { id: 'RPT-007', reportName: 'Security Incidents Report', subject: 'Security Events – April 2026', email: 'security@company.com', created: '2026-04-06', createdBy: 'Marcus Reynolds', scheduledTime: '2026-04-11 09:00', status: 'Failed', downloadFormat: 'pdf' },
  { id: 'RPT-008', reportName: 'Hardware Requests Report', subject: 'Hardware Procurement Summary', email: 'procurement@company.com', created: '2026-04-07', createdBy: 'Lena Torres', scheduledTime: '2026-04-12 10:00', status: 'Pending', downloadFormat: 'xls' },
  { id: 'RPT-009', reportName: 'Software License Report', subject: 'License Expiry & Renewals', email: 'itadmin@company.com', created: '2026-04-08', createdBy: 'Sarah Kim', scheduledTime: '2026-04-12 08:00', status: 'Send', downloadFormat: 'pdf' },
  { id: 'RPT-010', reportName: 'Monthly Digest Report', subject: 'IT Service Desk – Monthly Digest', email: 'all-staff@company.com', created: '2026-04-09', createdBy: 'James Patel', scheduledTime: '2026-04-13 06:00', status: 'Pending', downloadFormat: 'xls' },
];

const statusColors: Record<string, string> = {
  Send: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Failed: 'bg-red-100 text-red-700',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('2026-03-24');
  const [dateTo, setDateTo] = useState('2026-04-09');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [reportType, setReportType] = useState('Ticket Summary');
  const [downloadFormats, setDownloadFormats] = useState<Record<string, 'pdf' | 'xls'>>({});

  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    frequency: 'weekly',
    time: '08:00',
    dayOfWeek: 'Monday',
    dayOfMonth: '1',
    recipients: '',
    subject: 'Scheduled IT Report',
    format: 'pdf',
    includeCharts: true,
  });
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const filtered = mockReportData.filter((row) => {
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    return true;
  });

  const getRowFormat = (row: ReportRow): 'pdf' | 'xls' => downloadFormats[row.id] ?? row.downloadFormat;

  const handleDownloadRow = (row: ReportRow) => {
    const fmt = getRowFormat(row);
    const filename = `${row.reportName.replace(/\s+/g, '_')}_${row.id}.${fmt}`;
    const content = `Report: ${row.reportName}\nSubject: ${row.subject}\nEmail: ${row.email}\nCreated: ${row.created}\nCreated By: ${row.createdBy}\nScheduled: ${row.scheduledTime}\nStatus: ${row.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const headers = ['ID', 'Report Name', 'Subject', 'Email', 'Created', 'Created By', 'Scheduled Time', 'Status'];
    const rows = filtered.map((r) => [r.id, r.reportName, r.subject, r.email, r.created, r.createdBy, r.scheduledTime, r.status]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IT_Report_${reportType.replace(/\s+/g, '_')}_${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSchedule = () => {
    setScheduleSaved(true);
    setTimeout(() => {
      setScheduleSaved(false);
      setShowScheduler(false);
    }, 1800);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-sm text-slate-500 mt-0.5">Generate, filter, and export IT service desk reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Icon name="DownloadIcon" size={16} />
              Download Report
            </button>
            <button
              onClick={() => setShowScheduler(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Icon name="CalendarClockIcon" size={16} />
              Schedule Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="SlidersHorizontalIcon" size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Ticket Summary', 'SLA Compliance', 'Agent Performance', 'Category Breakdown', 'Priority Analysis'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['All', 'Send', 'Pending', 'Failed'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['All', 'Network', 'Software', 'Hardware', 'Identity', 'Security', 'Email', 'Database'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: filtered.length, icon: 'FileTextIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Sent', value: filtered.filter((r) => r.status === 'Send').length, icon: 'CheckCircleIcon', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', value: filtered.filter((r) => r.status === 'Pending').length, icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Failed', value: filtered.filter((r) => r.status === 'Failed').length, icon: 'AlertCircleIcon', color: 'text-red-600', bg: 'bg-red-50' },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={card.icon as any} size={20} className={card.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Icon name="TableIcon" size={16} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">{reportType}</span>
              <span className="text-xs text-slate-400 ml-1">({filtered.length} records)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['ID', 'Report Name', 'Subject', 'Email', 'Created', 'Created By', 'Scheduled Time', 'Status', 'Download'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                      No records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium whitespace-nowrap">{row.id}</td>
                      <td className="px-4 py-3 text-slate-800 max-w-[160px] truncate font-medium">{row.reportName}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{row.subject}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.email}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.created}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.createdBy}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.scheduledTime}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={getRowFormat(row)}
                            onChange={(e) => setDownloadFormats((prev) => ({ ...prev, [row.id]: e.target.value as 'pdf' | 'xls' }))}
                            className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-medium"
                          >
                            <option value="pdf">PDF</option>
                            <option value="xls">XLS</option>
                          </select>
                          <button
                            onClick={() => handleDownloadRow(row)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                          >
                            <Icon name="DownloadIcon" size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon name="CalendarClockIcon" size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Schedule Report</h2>
                  <p className="text-xs text-slate-500">Configure automated email delivery</p>
                </div>
              </div>
              <button onClick={() => setShowScheduler(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <Icon name="XIcon" size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Report info pill */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <Icon name="FileTextIcon" size={14} className="text-blue-500" />
                <span className="text-xs text-blue-700 font-medium">Report: {reportType}</span>
                <span className="text-xs text-blue-400 ml-auto">{dateFrom} → {dateTo}</span>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Frequency</label>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setScheduleConfig((c) => ({ ...c, frequency: f }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                        scheduleConfig.frequency === f
                          ? 'bg-blue-600 text-white border-blue-600' :'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day of week (weekly) */}
              {scheduleConfig.frequency === 'weekly' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Day of Week</label>
                  <select
                    value={scheduleConfig.dayOfWeek}
                    onChange={(e) => setScheduleConfig((c) => ({ ...c, dayOfWeek: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Day of month (monthly) */}
              {scheduleConfig.frequency === 'monthly' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Day of Month</label>
                  <select
                    value={scheduleConfig.dayOfMonth}
                    onChange={(e) => setScheduleConfig((c) => ({ ...c, dayOfMonth: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 28 }, (_, i) => String(i + 1)).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Delivery Time</label>
                <input
                  type="time"
                  value={scheduleConfig.time}
                  onChange={(e) => setScheduleConfig((c) => ({ ...c, time: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Recipients</label>
                <input
                  type="text"
                  placeholder="e.g. manager@company.com, team@company.com"
                  value={scheduleConfig.recipients}
                  onChange={(e) => setScheduleConfig((c) => ({ ...c, recipients: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400 mt-1">Separate multiple emails with commas</p>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Email Subject</label>
                <input
                  type="text"
                  value={scheduleConfig.subject}
                  onChange={(e) => setScheduleConfig((c) => ({ ...c, subject: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Export Format</label>
                <div className="flex gap-2">
                  {(['pdf', 'csv', 'xlsx'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setScheduleConfig((c) => ({ ...c, format: fmt }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border uppercase transition-colors ${
                        scheduleConfig.format === fmt
                          ? 'bg-blue-600 text-white border-blue-600' :'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Charts toggle */}
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-700">Include Charts</p>
                  <p className="text-xs text-slate-400">Attach visual charts to the report</p>
                </div>
                <button
                  onClick={() => setScheduleConfig((c) => ({ ...c, includeCharts: !c.includeCharts }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${scheduleConfig.includeCharts ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${scheduleConfig.includeCharts ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Schedule preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex items-start gap-3">
                <Icon name="InfoIcon" size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  {scheduleConfig.frequency === 'daily' && `Report will be sent every day at ${scheduleConfig.time}.`}
                  {scheduleConfig.frequency === 'weekly' && `Report will be sent every ${scheduleConfig.dayOfWeek} at ${scheduleConfig.time}.`}
                  {scheduleConfig.frequency === 'monthly' && `Report will be sent on day ${scheduleConfig.dayOfMonth} of each month at ${scheduleConfig.time}.`}
                  {scheduleConfig.recipients ? ` Delivered to: ${scheduleConfig.recipients}.` : ' No recipients added yet.'}
                  {` Format: ${scheduleConfig.format.toUpperCase()}.`}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                disabled={scheduleSaved}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scheduleSaved
                    ? 'bg-green-600 text-white' :'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {scheduleSaved ? (
                  <>
                    <Icon name="CheckIcon" size={15} />
                    Schedule Saved!
                  </>
                ) : (
                  <>
                    <Icon name="CalendarCheckIcon" size={15} />
                    Save Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
