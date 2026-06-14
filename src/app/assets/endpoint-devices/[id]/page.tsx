'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Mock performance data ─────────────────────────────────────────────────────

const perfData = [
  { time: '0m', cpu: 18, disk: 12, memory: 42 },
  { time: '3m', cpu: 24, disk: 8, memory: 45 },
  { time: '6m', cpu: 31, disk: 15, memory: 48 },
  { time: '9m', cpu: 22, disk: 10, memory: 44 },
  { time: '12m', cpu: 28, disk: 18, memory: 51 },
  { time: '15m', cpu: 35, disk: 22, memory: 55 },
  { time: '18m', cpu: 19, disk: 9, memory: 43 },
  { time: '21m', cpu: 26, disk: 14, memory: 47 },
  { time: '24m', cpu: 33, disk: 20, memory: 52 },
  { time: '27m', cpu: 21, disk: 11, memory: 46 },
  { time: '30m', cpu: 29, disk: 16, memory: 49 },
  { time: '33m', cpu: 38, disk: 25, memory: 58 },
  { time: '36m', cpu: 23, disk: 13, memory: 44 },
  { time: '39m', cpu: 27, disk: 17, memory: 50 },
  { time: '42m', cpu: 32, disk: 21, memory: 53 },
  { time: '45m', cpu: 20, disk: 10, memory: 45 },
  { time: '48m', cpu: 25, disk: 15, memory: 48 },
  { time: '51m', cpu: 36, disk: 23, memory: 56 },
  { time: '54m', cpu: 22, disk: 12, memory: 43 },
  { time: '57m', cpu: 30, disk: 18, memory: 51 },
];

// ── HDD data ──────────────────────────────────────────────────────────────────

const hddData = [
  { id: 3530, drive: 'C:\\', size: '280.01 GB', free: '37.01 GB', description: 'NTFS Drive' },
  { id: 3531, drive: 'D:\\', size: '195.31 GB', free: '163.01 GB', description: 'NTFS Drive' },
];

// ── Network data ──────────────────────────────────────────────────────────────

const networkData = [
  { id: 1, adapter: 'Ethernet', ipAddress: '192.168.102.66', macAddress: 'A4:C3:F0:12:34:56', speed: '1 Gbps', status: 'Connected' },
  { id: 2, adapter: 'Wi-Fi', ipAddress: '192.168.1.45', macAddress: 'B8:E8:56:AB:CD:EF', speed: '300 Mbps', status: 'Connected' },
  { id: 3, adapter: 'Bluetooth', ipAddress: 'N/A', macAddress: 'C0:18:50:DE:F0:12', speed: 'N/A', status: 'Enabled' },
  { id: 4, adapter: 'VPN Adapter', ipAddress: '10.8.0.2', macAddress: 'D4:85:64:12:34:78', speed: 'N/A', status: 'Connected' },
  { id: 5, adapter: 'Loopback', ipAddress: '127.0.0.1', macAddress: 'N/A', speed: 'N/A', status: 'Active' },
  { id: 6, adapter: 'Hyper-V', ipAddress: '172.16.0.1', macAddress: 'E8:6A:64:AB:12:CD', speed: 'N/A', status: 'Active' },
  { id: 7, adapter: 'Docker Bridge', ipAddress: '172.17.0.1', macAddress: 'F0:2F:74:CD:EF:01', speed: 'N/A', status: 'Active' },
  { id: 8, adapter: 'WSL Adapter', ipAddress: '172.18.0.1', macAddress: '00:3E:E1:23:45:67', speed: 'N/A', status: 'Active' },
  { id: 9, adapter: 'Teredo', ipAddress: 'N/A', macAddress: 'N/A', speed: 'N/A', status: 'Disabled' },
];

// ── Installed Software (sample 74) ────────────────────────────────────────────

const softwareData = Array.from({ length: 74 }, (_, i) => ({
  id: i + 1,
  name: [
    'Microsoft Office 365', 'Google Chrome', 'Mozilla Firefox', 'Adobe Acrobat Reader',
    'Zoom', 'Slack', 'Visual Studio Code', 'Git', 'Node.js', '7-Zip',
    'VLC Media Player', 'Notepad++', 'Python 3.11', 'Docker Desktop', 'Postman',
    'Microsoft Teams', 'OneDrive', 'Windows Defender', 'Malwarebytes', 'CCleaner',
  ][i % 20],
  version: `${(i % 10) + 1}.${i % 9}.${i % 9}`,
  publisher: ['Microsoft', 'Google', 'Mozilla', 'Adobe', 'Zoom Video', 'Slack Technologies', 'Open Source'][i % 7],
  installDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

// ── Main Bento Grid ───────────────────────────────────────────────────────────

function BentoGrid() {
  const [softwareSearch, setSoftwareSearch] = useState('');
  const [softwarePage, setSoftwarePage] = useState(1);
  const perPage = 8;
  const filteredSoftware = softwareData.filter(s =>
    s.name.toLowerCase().includes(softwareSearch.toLowerCase())
  );
  const paginatedSoftware = filteredSoftware.slice((softwarePage - 1) * perPage, softwarePage * perPage);
  const totalSoftwarePages = Math.ceil(filteredSoftware.length / perPage);

  return (
    <div className="space-y-4">

      {/* ── Row 1: Identity + CPU + OS ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Identity card — 2 cols */}
        <div className="col-span-2 bg-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Icon name="ComputerDesktopIcon" size={16} className="text-white" />
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-widest">Endpoint Device</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">LIL061010007</h2>
            <p className="text-slate-400 text-xs">HP Pro SFF 280 G9 Desktop PC</p>
            <p className="text-slate-500 text-xs mt-0.5">Serial: INI3040CX4</p>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Icon name="GlobeAltIcon" size={12} className="text-slate-400" />
              <span className="text-xs text-slate-300">192.168.102.66</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="BuildingOfficeIcon" size={12} className="text-slate-400" />
              <span className="text-xs text-slate-300">lumaxdkjaingroup.net</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CalendarIcon" size={12} className="text-slate-400" />
              <span className="text-xs text-slate-300">Scanned 05/06/2026 12:44</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 text-xs font-semibold rounded-full">In-Store</span>
            <span className="text-xs text-slate-500">Asset Tag: LIL061010007</span>
          </div>
        </div>

        {/* CPU card */}
        <div className="col-span-1 bg-violet-50 border border-violet-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="CpuChipIcon" size={14} className="text-violet-600" />
            <span className="text-xs font-semibold text-violet-700">CPU</span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-tight">i5-12400</p>
          <p className="text-xs text-slate-500 mt-0.5">12th Gen Intel Core</p>
          <p className="text-xs text-slate-400 mt-0.5">x64-based PC</p>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 bg-white rounded-lg p-2 text-center">
              <p className="text-base font-bold text-violet-600">12</p>
              <p className="text-[10px] text-slate-500">Cores</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-2 text-center">
              <p className="text-base font-bold text-violet-600">6</p>
              <p className="text-[10px] text-slate-500">Physical</p>
            </div>
          </div>
          <div className="mt-2 bg-white rounded-lg p-2 text-center">
            <p className="text-base font-bold text-violet-600">12.5%</p>
            <p className="text-[10px] text-slate-500">Current Usage</p>
          </div>
        </div>

        {/* OS card */}
        <div className="col-span-1 bg-sky-50 border border-sky-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ComputerDesktopIcon" size={14} className="text-sky-600" />
            <span className="text-xs font-semibold text-sky-700">Operating System</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Windows 11 Pro</p>
          <p className="text-xs text-slate-500 mt-0.5">x64-based PC</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Last Boot</span>
              <span className="text-xs font-medium text-slate-700">05/06/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Boot Time</span>
              <span className="text-xs font-medium text-slate-700">07:48:25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Logged User</span>
              <span className="text-xs font-medium text-slate-700">N/A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Activation</span>
              <span className="text-xs font-medium text-red-500">Not Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Storage + Security + Software count + System Health ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Storage — 2 cols */}
        <div className="col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="CircleStackIcon" size={14} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Storage (HDD)</span>
            <span className="ml-auto text-xs font-bold text-slate-700">2 drives</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {hddData.map(d => (
              <div key={d.id} className="bg-white rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">{d.drive}</span>
                  <span className="text-xs text-slate-500">{d.size}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: d.drive === 'C:\\' ? '87%' : '16%' }}
                  />
                </div>
                <p className="text-xs text-slate-500">{d.free} free</p>
                <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {['Drive', 'Size', 'Free', 'Type'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hddData.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-700">{row.drive}</td>
                    <td className="px-3 py-2 text-slate-600">{row.size}</td>
                    <td className="px-3 py-2 text-slate-600">{row.free}</td>
                    <td className="px-3 py-2 text-slate-600">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security card */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ShieldCheckIcon" size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Security</span>
          </div>
          <div className="space-y-2">
            {[
              ['OS Updates', false],
              ['Firewall (Public)', false],
              ['Firewall (Private)', false],
              ['Firewall (Domain)', false],
              ['Bitlocker', false],
              ['System Restore', false],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{l as string}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {v ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Missing Patches</span>
              <span className="text-xs font-bold text-slate-700">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Blacklisted SW</span>
              <span className="text-xs font-bold text-slate-700">0</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="col-span-1 bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="HeartIcon" size={14} className="text-rose-500" />
            <span className="text-xs font-semibold text-rose-700">System Health</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'C Drive', value: '87%', sub: 'used', warn: true },
              { label: 'Temp Files', value: '252MB', sub: 'on disk', warn: false },
              { label: 'Recycle Bin', value: '16MB', sub: 'pending', warn: false },
              { label: 'CPU Usage', value: '12.5%', sub: 'current', warn: false },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl p-2 text-center">
                <p className={`text-sm font-bold ${m.warn ? 'text-rose-500' : 'text-slate-700'}`}>{m.value}</p>
                <p className="text-[10px] text-slate-500">{m.label}</p>
                <p className="text-[10px] text-slate-400">{m.sub}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Last Boot</span>
              <span className="text-xs font-medium text-slate-700">05/06/2026 07:48</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">C Drive Free</span>
              <span className="text-xs font-medium text-slate-700">37.01 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Network + Software count ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Network — 3 cols */}
        <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="WifiIcon" size={14} className="text-rose-500" />
            <span className="text-xs font-semibold text-slate-700">Network Adapters</span>
            <span className="ml-auto text-xs font-bold text-slate-800">9 total</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {['#', 'Adapter', 'IP Address', 'MAC Address', 'Speed', 'Status'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {networkData.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-400">{row.id}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{row.adapter}</td>
                    <td className="px-3 py-2 text-slate-600">{row.ipAddress}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">{row.macAddress}</td>
                    <td className="px-3 py-2 text-slate-600">{row.speed}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        row.status === 'Connected' || row.status === 'Active' || row.status === 'Enabled' ?'bg-emerald-50 text-emerald-700' :'bg-slate-100 text-slate-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Software count card */}
        <div className="col-span-1 bg-blue-600 rounded-2xl p-4 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="SquaresPlusIcon" size={14} className="text-blue-200" />
              <span className="text-xs font-semibold text-blue-200">Software</span>
            </div>
            <p className="text-4xl font-bold text-white">74</p>
            <p className="text-xs text-blue-200 mt-0.5">Installed apps</p>
          </div>
          <div className="space-y-2 pt-3 border-t border-blue-500">
            <div className="flex justify-between">
              <span className="text-xs text-blue-300">Blacklisted</span>
              <span className="text-xs font-bold text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-blue-300">Patches</span>
              <span className="text-xs font-bold text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-blue-300">Missing</span>
              <span className="text-xs font-bold text-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Asset Summary + System Information ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Asset Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ServerIcon" size={14} className="text-blue-500" />
            <span className="text-xs font-semibold text-slate-700">Asset Summary (CMDB)</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              ['Asset Tag', 'LIL061010007'],
              ['Make', 'HP'],
              ['Model', 'HP Pro SFF 280 G9 Desktop PC'],
              ['Serial No.', 'INI3040CX4'],
              ['Status', 'In-Store'],
              ['Location', 'HQ - Main Building'],
              ['Department', 'IT Operations'],
              ['Assigned To', 'N/A'],
              ['Purchase Date', '05/06/2026'],
              ['Warranty Expiry', 'N/A'],
              ['Vendor', 'N/A'],
              ['Total Cost', '0 INR'],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="text-xs text-slate-500 w-28 flex-shrink-0">{label}:</span>
                <span className="text-xs font-medium text-slate-800 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="InformationCircleIcon" size={14} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">System Information</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">System Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  ['Make', 'HP'],
                  ['Model', 'HP Pro SFF 280 G9 Desktop PC'],
                  ['Serial No', '9KD040CX4'],
                  ['Host Name', 'LIL061010007'],
                  ['Domain', 'lumaxdkjaingroup.net'],
                  ['Last Updated', '05-06-2026 12:55:26'],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2">
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">{l}:</span>
                    <span className="text-xs font-medium text-slate-800 truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">HDD Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  ['HDD Model', 'CONSISTENT M.2 50 256GB SSD'],
                  ['HDD Serial', 'VXVDSUBEX4GLTOA7N0'],
                  ['HDD Size', '238 GB'],
                  ['HDD Type', 'SSD'],
                  ['HDD Usage', '84.8%'],
                  ['HDD Bus Type', 'RAID'],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2">
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">{l}:</span>
                    <span className="text-xs font-medium text-slate-800 truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">RAM Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  ['Total Slots', '0'],
                  ['Used Slots', '0'],
                  ['Empty Slots', '0'],
                  ['RAM Size', 'N/A'],
                  ['RAM Type', 'N/A'],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2">
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">{l}:</span>
                    <span className="text-xs font-medium text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 5: Performance Charts ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="ChartBarIcon" size={14} className="text-blue-500" />
          <span className="text-xs font-semibold text-slate-700">Performance Monitoring</span>
          <span className="ml-auto text-xs text-slate-400">Last 60 minutes</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'CPU Utilization (%)', key: 'cpu', color: '#3b82f6' },
            { label: 'Disk Utilization (%)', key: 'disk', color: '#10b981' },
            { label: 'Memory Utilization (%)', key: 'memory', color: '#8b5cf6' },
          ].map(({ label, key, color }) => (
            <div key={key}>
              <h4 className="text-xs font-medium text-slate-600 mb-2">{label}</h4>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={perfData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#94a3b8' }} interval={4} />
                  <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 6: Installed Software ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="SquaresPlusIcon" size={14} className="text-blue-500" />
          <span className="text-xs font-semibold text-slate-700">Installed Software</span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">74</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">Search:</span>
            <input
              type="text"
              value={softwareSearch}
              onChange={e => { setSoftwareSearch(e.target.value); setSoftwarePage(1); }}
              className="text-xs border border-slate-200 rounded px-2 py-1 w-36 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Filter software..."
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['#', 'Name', 'Version', 'Publisher', 'Install Date'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSoftware.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-400">{row.id}</td>
                  <td className="px-3 py-2 font-medium text-slate-700">{row.name}</td>
                  <td className="px-3 py-2 text-slate-600">{row.version}</td>
                  <td className="px-3 py-2 text-slate-600">{row.publisher}</td>
                  <td className="px-3 py-2 text-slate-600">{row.installDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">
            Showing {(softwarePage - 1) * perPage + 1} to {Math.min(softwarePage * perPage, filteredSoftware.length)} of {filteredSoftware.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoftwarePage(p => Math.max(1, p - 1))}
              disabled={softwarePage === 1}
              className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalSoftwarePages) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setSoftwarePage(p)}
                className={`text-xs px-2.5 py-1 rounded ${softwarePage === p ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setSoftwarePage(p => Math.min(totalSoftwarePages, p + 1))}
              disabled={softwarePage === totalSoftwarePages}
              className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 7: Asset Mapping + Empty sections ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Asset Mapping */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="LinkIcon" size={14} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Asset Mapping</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Icon name="ArchiveBoxIcon" size={28} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">No asset mappings configured for this device.</p>
          </div>
        </div>

        {/* Installed Patches */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ArrowDownTrayIcon" size={14} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Installed Patches</span>
            <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">0</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Icon name="ArchiveBoxIcon" size={28} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">No installed patches data available.</p>
          </div>
        </div>

        {/* Missing Patches */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-700">Missing Patches</span>
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">0</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Icon name="CheckCircleIcon" size={28} className="text-emerald-300 mb-2" />
            <p className="text-xs text-slate-400">No missing patches. Device is up to date.</p>
          </div>
        </div>
      </div>

      {/* ── Row 8: Users + Startup Services + USB + Shared Folders ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Users', icon: 'UsersIcon', count: 0 },
          { label: 'Startup Services', icon: 'BoltIcon', count: 0 },
          { label: 'USB Devices', icon: 'CpuChipIcon', count: 0 },
          { label: 'Shared Folders', icon: 'FolderIcon', count: 0 },
        ].map(item => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name={item.icon as any} size={14} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{item.count}</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Icon name="ArchiveBoxIcon" size={24} className="text-slate-300 mb-1.5" />
              <p className="text-[10px] text-slate-400">No data available.</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 9: Device Drivers + Processes ── */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Device Drivers', icon: 'CpuChipIcon', count: 0 },
          { label: 'Processes', icon: 'ChartBarIcon', count: 0 },
        ].map(item => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name={item.icon as any} size={14} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{item.count}</span>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Icon name="ArchiveBoxIcon" size={28} className="text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">No {item.label.toLowerCase()} data available for this device.</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EndpointDeviceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || 'LIL061010007';

  return (
    <AppLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <button onClick={() => router.push('/assets')} className="hover:text-blue-600 transition-colors">Assets</button>
          <Icon name="ChevronRightIcon" size={14} />
          <button onClick={() => router.push('/assets/endpoint-devices')} className="hover:text-blue-600 transition-colors">Endpoint Devices</button>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-slate-800 font-medium">{deviceId}</span>
        </div>

        {/* Main card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Asset tag header */}
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              ASSET TAG NO – <span className="text-blue-600">{deviceId}</span>
            </h2>
          </div>

          {/* Bento content */}
          <div className="p-5 bg-slate-50/50">
            <BentoGrid />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
