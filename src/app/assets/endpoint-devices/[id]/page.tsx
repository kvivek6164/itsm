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

// ── Types ─────────────────────────────────────────────────────────────────────

interface SidebarTab {
  id: string;
  label: string;
  count?: number;
}

// ── Sidebar tabs ──────────────────────────────────────────────────────────────

const sidebarTabs: SidebarTab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'summary', label: 'Summary' },
  { id: 'asset-mapping', label: 'Asset Mapping' },
  { id: 'system-information', label: 'System Information' },
  { id: 'performance', label: 'Performance' },
  { id: 'hdd', label: 'HDD', count: 2 },
  { id: 'network', label: 'Network', count: 9 },
  { id: 'installed-software', label: 'Installed Software', count: 74 },
  { id: 'installed-patches', label: 'Installed Patches', count: 0 },
  { id: 'missing-patches', label: 'Missing Patches', count: 0 },
  { id: 'users', label: 'Users', count: 0 },
  { id: 'startup-services', label: 'Startup Services', count: 0 },
  { id: 'usb', label: 'USB', count: 0 },
  { id: 'shared-folders', label: 'Shared Folders', count: 0 },
  { id: 'device-drivers', label: 'Device Drivers', count: 0 },
  { id: 'processes', label: 'Processes', count: 0 },
];

// ── Mock performance data ─────────────────────────────────────────────────────

const perfData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i * 3}m`,
  cpu: Math.floor(Math.random() * 40 + 10),
  disk: Math.floor(Math.random() * 30 + 5),
  memory: Math.floor(Math.random() * 50 + 20),
}));

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
  version: `${Math.floor(Math.random() * 10 + 1)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`,
  publisher: ['Microsoft', 'Google', 'Mozilla', 'Adobe', 'Zoom Video', 'Slack Technologies', 'Open Source'][i % 7],
  installDate: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
}));

// ── Section helpers ───────────────────────────────────────────────────────────

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2 px-3 text-sm text-slate-600 w-1/2">{label}</td>
      <td className={`py-2 px-3 text-sm font-medium ${highlight ? 'text-red-500' : 'text-slate-800'}`}>{value}</td>
    </tr>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{title}</h4>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── Tab content components ────────────────────────────────────────────────────

function DashboardTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* CMDB Profile */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-slate-800 text-center mb-1">CMDB Profile</h3>
        <hr className="border-slate-200 mb-4" />
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Status :</span>
            <span className="text-sm font-medium text-slate-800">In-Store</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Make :</span>
            <span className="text-sm font-medium text-slate-800">HP</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Model :</span>
            <span className="text-sm font-medium text-slate-800">HP Pro SFF 280 G9 Desktop PC</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Serial No. :</span>
            <span className="text-sm font-medium text-slate-800">INI3040CX4</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Warranty Expiry :</span>
            <span className="text-sm font-medium text-slate-800">N/A</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Vendor :</span>
            <span className="text-sm font-medium text-slate-800">N/A</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-28 flex-shrink-0">Total Cost :</span>
            <span className="text-sm font-medium text-slate-800">0 INR</span>
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Icon name="MapPinIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">null</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="UserIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">Allocated To N/A</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CalendarIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">—</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="UserIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">Allocated By N/A</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="UserIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">Created By N/A</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CalendarIcon" size={13} className="text-slate-400" />
            <span className="text-sm text-slate-500">Created On 05/06/2026</span>
          </div>
        </div>
      </div>

      {/* Endpoint Profile */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-slate-800 text-center mb-1">Endpoint Profile</h3>
        <p className="text-xs text-slate-400 text-center mb-3">(Last Scanned 05/06/2026 12:44:34)</p>
        <hr className="border-slate-200 mb-4" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <span className="text-xs text-slate-500">Make :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">HP</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">IP Address :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">192.168.102.66</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Model :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">HP Pro SFF 280 G9 Desktop PC</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Domain :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">lumaxdkjaingroup.net</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Serial No. :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">INI3040CX4</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Logged In User :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">null</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Host Name :</span>
            <span className="text-sm font-medium text-blue-600 ml-1">LIL061010007</span>
          </div>
          <div>
            <span className="text-xs text-slate-500">User Privilege :</span>
            <span className="text-sm font-medium text-slate-800 ml-1">null</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Icon name="CpuChipIcon" size={14} className="text-slate-500" />
            <span className="text-xs text-slate-600">12th Gen Intel(R) Core(TM) i5-12400</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ComputerDesktopIcon" size={14} className="text-slate-500" />
            <span className="text-xs text-slate-600">Windows 11 Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CircleStackIcon" size={14} className="text-slate-500" />
            <span className="text-xs text-slate-600">0 GB RAM</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ServerIcon" size={14} className="text-slate-500" />
            <span className="text-xs text-slate-600">238 GB Drive</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
          {[
            ['OS Updates', false], ['Firewall (Public)', false],
            ['Bitlocker', false], ['Firewall (Private)', false],
            ['System Restore', false], ['Firewall (Domain)', false],
          ].map(([label, active]) => (
            <div key={label as string} className="flex items-center gap-2">
              <span className="text-xs text-slate-600">{label as string}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-green-500' : 'bg-slate-300'}`} />
            </div>
          ))}
        </div>

        <hr className="border-slate-100 mb-3" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">Installed Software</span>
            <span className="text-xs font-semibold text-slate-800">74</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">C Drive Space</span>
            <span className="text-xs font-semibold text-slate-800">37.01 GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">Blacklisted Software</span>
            <span className="text-xs font-semibold text-slate-800">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">Recycle Bin</span>
            <span className="text-xs font-semibold text-slate-800">16.1 MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">Missing Patches</span>
            <span className="text-xs font-semibold text-slate-800">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-500">Temp Files</span>
            <span className="text-xs font-semibold text-slate-800">252.74 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Asset Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          ['Asset Tag', 'LIL061010007'], ['Make', 'HP'], ['Model', 'HP Pro SFF 280 G9 Desktop PC'],
          ['Serial No.', 'INI3040CX4'], ['Status', 'In-Store'], ['Location', 'HQ - Main Building'],
          ['Department', 'IT Operations'], ['Assigned To', 'N/A'], ['Purchase Date', '05/06/2026'],
          ['Warranty Expiry', 'N/A'], ['Vendor', 'N/A'], ['Total Cost', '0 INR'],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <span className="text-sm text-slate-500 w-36 flex-shrink-0">{label} :</span>
            <span className="text-sm font-medium text-slate-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssetMappingTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Asset Mapping</h3>
      <p className="text-sm text-slate-500">No asset mappings configured for this device.</p>
    </div>
  );
}

function SystemInformationTab() {
  return (
    <div className="space-y-0">
      <SectionCard title="System Details">
        <table className="w-full">
          <tbody>
            <InfoRow label="Make" value="HP" />
            <InfoRow label="Model" value="HP Pro SFF 280 G9 Desktop PC" />
            <InfoRow label="Serial No" value="9KD040CX4" />
            <InfoRow label="Host Name" value="LIL061010007" />
            <InfoRow label="Domain Name" value="lumaxdkjaingroup.net" />
            <InfoRow label="Last Updated" value="05-06-2026 12:55:26" />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="CPU Details">
        <table className="w-full">
          <tbody>
            <InfoRow label="Graphics Details" value="12th Gen Intel(R) Core(TM) i5-12400" />
            <InfoRow label="CPU Architecture" value="x64-based PC" />
            <InfoRow label="No of Processors" value="1" />
            <InfoRow label="Total Cores" value="12" />
            <InfoRow label="Physical Cores" value="6" />
            <InfoRow label="CPU Usage" value="12.5" />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="HDD Details">
        <table className="w-full">
          <tbody>
            <InfoRow label="HDD Serial No" value="VXVDSUBEX4GLTOA7N0" />
            <InfoRow label="HDD Model" value="CONSISTENT M.2 50 256GB SSD" />
            <InfoRow label="Partition Name" value="C" />
            <InfoRow label="HDD Size" value="238 GB" />
            <InfoRow label="HDD Usage" value="84.8%" />
            <InfoRow label="HDD Status" value="Healthy" />
            <InfoRow label="HDD Type" value="SSD" />
            <InfoRow label="HDD Bus Type" value="RAID" />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Graphic Details">
        <table className="w-full">
          <tbody>
            <InfoRow label="Graphics Card Name" value="" />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="OS Details">
        <div className="p-3 grid grid-cols-2 gap-x-8 gap-y-1">
          {[
            ['Operating System', 'Windows 11 Pro', false], ['OS Serial No', 'Not Available', true],
            ['Activation Status', 'Not Available', true], ['OS Version', 'Not Available', true],
            ['Display Version', 'Not Available', true], ['Product Name', 'Not Available', true],
            ['Architecture', 'Not Available', true], ['Installation Type', 'Not Available', true],
            ['System Root', 'Not Available', true], ['Product Key Type', 'Not Available', true],
            ['Is Genuine', 'Not Available', true], ['Is Volume Licensed', 'Not Available', true],
            ['Activation Method', 'Not Available', true],
          ].map(([label, value, red]) => (
            <div key={label} className="flex gap-2">
              <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
              <span className={`text-xs font-medium ${red ? 'text-red-500' : 'text-slate-800'}`}>{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="RAM Details">
        <table className="w-full">
          <tbody>
            <InfoRow label="Size of RAM" value="" />
            <InfoRow label="Type of RAM" value="" />
            <InfoRow label="Total Slots" value="0" />
            <InfoRow label="Used Slots" value="0" />
            <InfoRow label="Empty Slots" value="0" />
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Keyboard Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['Device Name', 'Description', 'Function Keys', 'Connection Type'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 text-xs">No data available in table</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 px-3 py-2">Showing 0 to 0 of 0 entries</p>
        </div>
      </SectionCard>

      <SectionCard title="Mouse Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['Device Name', 'Manufacturer', 'Connection Type', 'Handedness'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 text-xs">No data available in table</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 px-3 py-2">Showing 0 to 0 of 0 entries</p>
        </div>
      </SectionCard>

      <SectionCard title="Monitor Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['Device Name', 'Manufacturer', 'Screen Height', 'Screen Width'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 text-xs">No data available in table</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 px-3 py-2">Showing 0 to 0 of 0 entries</p>
        </div>
      </SectionCard>

      <SectionCard title="Anti-virus Information">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['Serial No', 'Name', 'Update Status', 'Enable Status'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400 text-xs">No data available in table</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 px-3 py-2">Showing 0 to 0 of 0 entries</p>
        </div>
      </SectionCard>

      <SectionCard title="System Health">
        <table className="w-full">
          <tbody>
            <InfoRow label="System Health" value="" />
            <InfoRow label="Last Boot Time" value="05/06/2026 07:48:25" />
            <InfoRow label="Last Boot Duration(Sec)" value="Unknown" />
            <InfoRow label="Last Logon Duration(Sec)" value="Unknown" />
            <InfoRow label="Logged In User" value="" />
            <InfoRow label="User Privileges" value="" />
            <InfoRow label="C partition free space" value="37.01 GB" />
            <InfoRow label="Recycle Bin" value="16.1 MB" />
            <InfoRow label="Temporary File" value="252.74 MB" />
            <InfoRow label="Bitlocker Protection Status" value="null" />
            <InfoRow label="Bitlocker Lock Status" value="null" />
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function PerformanceTab() {
  return (
    <div className="space-y-4">
      {[
        { label: 'CPU Utilization(%)', key: 'cpu', color: '#3b82f6' },
        { label: 'Disk Utilization(%)', key: 'disk', color: '#10b981' },
        { label: 'Memory Utilization(%)', key: 'memory', color: '#8b5cf6' },
      ].map(({ label, key, color }) => (
        <div key={key} className="bg-white border border-slate-200 rounded-xl p-4">
          <h4 className="text-sm font-medium text-blue-600 mb-3">{label}</h4>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={perfData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

function HDDTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-600">
            <option>10 Rows</option>
            <option>25 Rows</option>
            <option>50 Rows</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Search:</span>
          <input type="text" className="text-xs border border-slate-200 rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-blue-400" />
          <div className="flex items-center gap-1 text-slate-400">
            <Icon name="ArrowPathIcon" size={13} />
            <Icon name="ArrowDownTrayIcon" size={13} />
            <Icon name="DocumentTextIcon" size={13} />
            <Icon name="ChartBarIcon" size={13} />
          </div>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['Id', 'Drive', 'Size', 'Free', 'Description'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1">{h} <Icon name="ChevronUpDownIcon" size={10} className="text-slate-400" /></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {hddData.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.id}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.drive}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.size}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.free}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100">
        <span className="text-xs text-slate-500">Showing 1 to 2 of 2 entries</span>
        <div className="flex items-center gap-1">
          <button className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50">Previous</button>
          <button className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}

function NetworkTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['#', 'Adapter', 'IP Address', 'MAC Address', 'Speed', 'Status'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {networkData.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-2.5 text-xs text-slate-500">{row.id}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.adapter}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.ipAddress}</td>
              <td className="px-4 py-2.5 text-sm font-mono text-slate-600">{row.macAddress}</td>
              <td className="px-4 py-2.5 text-sm text-slate-700">{row.speed}</td>
              <td className="px-4 py-2.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.status === 'Connected' || row.status === 'Active' || row.status === 'Enabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2.5 border-t border-slate-100">
        <span className="text-xs text-slate-500">Showing 1 to {networkData.length} of {networkData.length} entries</span>
      </div>
    </div>
  );
}

function InstalledSoftwareTab() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const filtered = softwareData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-600">
          <option>10 Rows</option><option>25 Rows</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Search:</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="text-xs border border-slate-200 rounded px-2 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['#', 'Name', 'Version', 'Publisher', 'Install Date'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginated.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-xs text-slate-400">{row.id}</td>
              <td className="px-4 py-2 text-sm text-slate-700">{row.name}</td>
              <td className="px-4 py-2 text-sm text-slate-600">{row.version}</td>
              <td className="px-4 py-2 text-sm text-slate-600">{row.publisher}</td>
              <td className="px-4 py-2 text-sm text-slate-600">{row.installDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100">
        <span className="text-xs text-slate-500">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40">Previous</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`text-xs px-2.5 py-1 rounded ${page === p ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
      <Icon name="ArchiveBoxIcon" size={32} className="text-slate-300 mx-auto mb-2" />
      <p className="text-sm text-slate-500">No {label} data available for this device.</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EndpointDeviceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || 'LIL061010007';

  const [activeTab, setActiveTab] = useState('dashboard');

  function renderContent() {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'summary': return <SummaryTab />;
      case 'asset-mapping': return <AssetMappingTab />;
      case 'system-information': return <SystemInformationTab />;
      case 'performance': return <PerformanceTab />;
      case 'hdd': return <HDDTab />;
      case 'network': return <NetworkTab />;
      case 'installed-software': return <InstalledSoftwareTab />;
      case 'installed-patches': return <EmptyTab label="Installed Patches" />;
      case 'missing-patches': return <EmptyTab label="Missing Patches" />;
      case 'users': return <EmptyTab label="Users" />;
      case 'startup-services': return <EmptyTab label="Startup Services" />;
      case 'usb': return <EmptyTab label="USB" />;
      case 'shared-folders': return <EmptyTab label="Shared Folders" />;
      case 'device-drivers': return <EmptyTab label="Device Drivers" />;
      case 'processes': return <EmptyTab label="Processes" />;
      default: return <DashboardTab />;
    }
  }

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

          <div className="flex min-h-[600px]">
            {/* Left sidebar */}
            <div className="w-52 flex-shrink-0 border-r border-slate-200 overflow-y-auto">
              {sidebarTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-slate-100 last:border-0 ${
                      isActive
                        ? 'bg-slate-800 text-white font-medium' :'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`ml-1 font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        ({tab.count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content panel */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
