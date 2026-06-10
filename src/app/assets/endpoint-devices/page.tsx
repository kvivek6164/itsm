'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';

type DeviceStatus = 'Active' | 'In Maintenance' | 'Retired' | 'In Storage' | 'Lost / Stolen';
type DeviceType = 'Laptop' | 'Desktop' | 'Workstation' | 'Thin Client' | 'Server';
type OSType = 'Windows 11' | 'Windows 10' | 'macOS Sonoma' | 'macOS Ventura' | 'Ubuntu 22.04' | 'RHEL 9';

interface EndpointDevice {
  id: string;
  name: string;
  type: DeviceType;
  make: string;
  model: string;
  serial: string;
  os: OSType;
  osVersion: string;
  assignedTo: string;
  department: string;
  location: string;
  status: DeviceStatus;
  purchaseDate: string;
  warrantyExpiry: string;
  lastSeen: string;
  ipAddress: string;
  macAddress: string;
  cpu: string;
  ram: string;
  storage: string;
  notes: string;
}

const mockDevices: EndpointDevice[] = [
  { id: 'DEV-0248', name: 'ENG-LAPTOP-248', type: 'Laptop', make: 'Dell', model: 'XPS 15 9530', serial: 'DL9530X248', os: 'Windows 11', osVersion: '23H2', assignedTo: 'Nathan Park', department: 'Engineering', location: 'Floor 3 - Desk 3A-12', status: 'Active', purchaseDate: '2024-03-15', warrantyExpiry: '2027-03-15', lastSeen: '2026-06-06 06:45', ipAddress: '10.10.3.48', macAddress: 'A4:C3:F0:12:34:56', cpu: 'Intel Core i9-13900H', ram: '32 GB DDR5', storage: '1 TB NVMe SSD', notes: '' },
  { id: 'DEV-0247', name: 'FIN-LAPTOP-247', type: 'Laptop', make: 'Apple', model: 'MacBook Pro 16" M3', serial: 'APMBP16M3247', os: 'macOS Sonoma', osVersion: '14.4', assignedTo: 'Jasmine Osei', department: 'Finance', location: 'Floor 2 - Desk 2B-07', status: 'Active', purchaseDate: '2024-01-10', warrantyExpiry: '2027-01-10', lastSeen: '2026-06-06 07:10', ipAddress: '10.10.2.47', macAddress: 'B8:E8:56:AB:CD:EF', cpu: 'Apple M3 Pro', ram: '18 GB Unified', storage: '512 GB SSD', notes: '' },
  { id: 'DEV-0246', name: 'HR-LAPTOP-246', type: 'Laptop', make: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 11', serial: 'LNX1C11246', os: 'Windows 11', osVersion: '23H2', assignedTo: 'Lisa Huang', department: 'HR', location: 'Floor 1 - Desk 1A-03', status: 'Active', purchaseDate: '2023-11-20', warrantyExpiry: '2026-11-20', lastSeen: '2026-06-05 17:30', ipAddress: '10.10.1.46', macAddress: 'C0:18:50:DE:F0:12', cpu: 'Intel Core i7-1365U', ram: '16 GB LPDDR5', storage: '512 GB NVMe SSD', notes: 'Warranty expiring soon' },
  { id: 'DEV-0245', name: 'MKT-DESKTOP-245', type: 'Desktop', make: 'HP', model: 'EliteDesk 800 G9', serial: 'HPED800G9245', os: 'Windows 11', osVersion: '22H2', assignedTo: 'Sofia Martinez', department: 'Marketing', location: 'Floor 2 - Desk 2A-15', status: 'Active', purchaseDate: '2023-08-05', warrantyExpiry: '2026-08-05', lastSeen: '2026-06-06 05:55', ipAddress: '10.10.2.45', macAddress: 'D4:85:64:12:34:78', cpu: 'Intel Core i7-12700', ram: '32 GB DDR5', storage: '2 TB NVMe SSD', notes: '' },
  { id: 'DEV-0244', name: 'ENG-WS-244', type: 'Workstation', make: 'Dell', model: 'Precision 5680', serial: 'DLP5680244', os: 'Ubuntu 22.04', osVersion: '22.04.4 LTS', assignedTo: 'Omar Hassan', department: 'Engineering', location: 'Floor 3 - Lab 3C', status: 'In Maintenance', purchaseDate: '2023-06-12', warrantyExpiry: '2026-06-12', lastSeen: '2026-06-04 14:20', ipAddress: '10.10.3.44', macAddress: 'E8:6A:64:AB:12:CD', cpu: 'Intel Xeon W-2435', ram: '64 GB ECC DDR5', storage: '4 TB NVMe RAID', notes: 'GPU fan replacement in progress' },
  { id: 'DEV-0243', name: 'OPS-LAPTOP-243', type: 'Laptop', make: 'HP', model: 'EliteBook 840 G10', serial: 'HPEB840G10243', os: 'Windows 11', osVersion: '23H2', assignedTo: 'Tunde Adeyemi', department: 'Operations', location: 'Floor 1 - Desk 1B-09', status: 'Active', purchaseDate: '2024-02-28', warrantyExpiry: '2027-02-28', lastSeen: '2026-06-06 07:00', ipAddress: '10.10.1.43', macAddress: 'F0:2F:74:CD:EF:01', cpu: 'Intel Core i5-1345U', ram: '16 GB DDR5', storage: '512 GB SSD', notes: '' },
  { id: 'DEV-0242', name: 'SALES-LAPTOP-242', type: 'Laptop', make: 'Apple', model: 'MacBook Air M2', serial: 'APMBAM2242', os: 'macOS Ventura', osVersion: '13.6', assignedTo: 'Carlos Mendez', department: 'Sales', location: 'Floor 2 - Hot Desk', status: 'Active', purchaseDate: '2023-04-18', warrantyExpiry: '2026-04-18', lastSeen: '2026-06-06 06:30', ipAddress: '10.10.2.42', macAddress: '00:3E:E1:23:45:67', cpu: 'Apple M2', ram: '8 GB Unified', storage: '256 GB SSD', notes: 'OS upgrade pending' },
  { id: 'DEV-0241', name: 'LEGAL-LAPTOP-241', type: 'Laptop', make: 'Lenovo', model: 'ThinkPad T14s Gen 4', serial: 'LNT14SG4241', os: 'Windows 10', osVersion: '22H2', assignedTo: 'Anna Kowalski', department: 'Legal', location: 'Floor 1 - Desk 1C-02', status: 'Active', purchaseDate: '2022-09-01', warrantyExpiry: '2025-09-01', lastSeen: '2026-06-05 16:45', ipAddress: '10.10.1.41', macAddress: '14:58:D0:34:56:89', cpu: 'AMD Ryzen 7 PRO 7840U', ram: '16 GB LPDDR5', storage: '512 GB SSD', notes: 'Warranty expired — schedule replacement' },
  { id: 'DEV-0240', name: 'IT-LAPTOP-240', type: 'Laptop', make: 'Dell', model: 'Latitude 5540', serial: 'DLL5540240', os: 'Windows 11', osVersion: '23H2', assignedTo: 'David Thornton', department: 'IT Operations', location: 'IT Room - Floor 1', status: 'Active', purchaseDate: '2024-04-10', warrantyExpiry: '2027-04-10', lastSeen: '2026-06-06 07:15', ipAddress: '10.10.1.40', macAddress: '28:F0:76:45:67:AB', cpu: 'Intel Core i7-1365U', ram: '32 GB DDR4', storage: '1 TB SSD', notes: '' },
  { id: 'DEV-0239', name: 'RETIRED-LAPTOP-239', type: 'Laptop', make: 'HP', model: 'ProBook 450 G8', serial: 'HPPB450G8239', os: 'Windows 10', osVersion: '21H2', assignedTo: 'Unassigned', department: 'IT Operations', location: 'Storage Room B', status: 'Retired', purchaseDate: '2021-03-15', warrantyExpiry: '2024-03-15', lastSeen: '2025-12-01 09:00', ipAddress: 'N/A', macAddress: '3C:A9:F4:56:78:CD', cpu: 'Intel Core i5-1135G7', ram: '8 GB DDR4', storage: '256 GB SSD', notes: 'End of life — awaiting disposal' },
  { id: 'DEV-0238', name: 'FIN-LAPTOP-238', type: 'Laptop', make: 'Dell', model: 'XPS 13 9340', serial: 'DLX139340238', os: 'Windows 11', osVersion: '23H2', assignedTo: 'Kevin Lim', department: 'Finance', location: 'Floor 2 - Desk 2B-11', status: 'Active', purchaseDate: '2024-05-20', warrantyExpiry: '2027-05-20', lastSeen: '2026-06-06 06:50', ipAddress: '10.10.2.38', macAddress: '50:EB:F6:67:89:EF', cpu: 'Intel Core i7-1360P', ram: '16 GB LPDDR5', storage: '512 GB SSD', notes: '' },
  { id: 'DEV-0237', name: 'PROD-LAPTOP-237', type: 'Laptop', make: 'Apple', model: 'MacBook Pro 14" M3', serial: 'APMBP14M3237', os: 'macOS Sonoma', osVersion: '14.4', assignedTo: 'Chloe Bennett', department: 'Product', location: 'Floor 3 - Desk 3B-05', status: 'In Storage', purchaseDate: '2024-01-05', warrantyExpiry: '2027-01-05', lastSeen: '2026-05-15 11:00', ipAddress: 'N/A', macAddress: '64:CB:E8:78:9A:01', cpu: 'Apple M3', ram: '16 GB Unified', storage: '512 GB SSD', notes: 'Spare unit — available for deployment' },
];

const statusColors: Record<DeviceStatus, string> = {
  'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'In Maintenance': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Retired': 'bg-slate-100 text-slate-600 border border-slate-200',
  'In Storage': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Lost / Stolen': 'bg-red-50 text-red-700 border border-red-200',
};

const typeIcons: Record<DeviceType, string> = {
  'Laptop': 'LaptopIcon',
  'Desktop': 'MonitorIcon',
  'Workstation': 'CpuIcon',
  'Thin Client': 'ServerIcon',
  'Server': 'ServerIcon',
};

const allStatuses: DeviceStatus[] = ['Active', 'In Maintenance', 'Retired', 'In Storage', 'Lost / Stolen'];
const allTypes: DeviceType[] = ['Laptop', 'Desktop', 'Workstation', 'Thin Client', 'Server'];
const allDepts = ['All', 'Engineering', 'Finance', 'HR', 'Marketing', 'Sales', 'Operations', 'Legal', 'IT Operations', 'Product'];

const emptyDevice: Omit<EndpointDevice, 'id'> = {
  name: '', type: 'Laptop', make: '', model: '', serial: '', os: 'Windows 11', osVersion: '',
  assignedTo: '', department: '', location: '', status: 'Active', purchaseDate: '', warrantyExpiry: '',
  lastSeen: '', ipAddress: '', macAddress: '', cpu: '', ram: '', storage: '', notes: '',
};

export default function EndpointDevicesPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<EndpointDevice[]>(mockDevices);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<EndpointDevice | null>(null);
  const [formData, setFormData] = useState<Omit<EndpointDevice, 'id'>>(emptyDevice);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EndpointDevice, string>>>({});

  const filtered = useMemo(() => {
    return devices.filter(d => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) ||
        d.assignedTo.toLowerCase().includes(q) || d.make.toLowerCase().includes(q) || d.model.toLowerCase().includes(q) ||
        d.serial.toLowerCase().includes(q) || d.ipAddress.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'All' || d.status === filterStatus;
      const matchType = filterType === 'All' || d.type === filterType;
      const matchDept = filterDept === 'All' || d.department === filterDept;
      return matchSearch && matchStatus && matchType && matchDept;
    });
  }, [devices, search, filterStatus, filterType, filterDept]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const activeCount = devices.filter(d => d.status === 'Active').length;
  const maintenanceCount = devices.filter(d => d.status === 'In Maintenance').length;
  const retiredCount = devices.filter(d => d.status === 'Retired').length;

  function validateForm(): boolean {
    const errs: Partial<Record<keyof EndpointDevice, string>> = {};
    if (!formData.name.trim()) errs.name = 'Device name is required';
    if (!formData.make.trim()) errs.make = 'Make is required';
    if (!formData.model.trim()) errs.model = 'Model is required';
    if (!formData.serial.trim()) errs.serial = 'Serial number is required';
    if (!formData.assignedTo.trim()) errs.assignedTo = 'Assigned user is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function openCreate() {
    setFormData(emptyDevice);
    setFormErrors({});
    setShowCreateDialog(true);
  }

  function openEdit(device: EndpointDevice) {
    setSelectedDevice(device);
    const { id, ...rest } = device;
    setFormData(rest);
    setFormErrors({});
    setShowEditDialog(true);
  }

  function openView(device: EndpointDevice) {
    setSelectedDevice(device);
    setShowViewDialog(true);
  }

  function openDelete(device: EndpointDevice) {
    setSelectedDevice(device);
    setShowDeleteDialog(true);
  }

  function handleCreate() {
    if (!validateForm()) return;
    const newId = `DEV-${String(Math.max(...devices.map(d => parseInt(d.id.split('-')[1]))) + 1).padStart(4, '0')}`;
    setDevices(prev => [{ id: newId, ...formData }, ...prev]);
    setShowCreateDialog(false);
  }

  function handleEdit() {
    if (!validateForm() || !selectedDevice) return;
    setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { id: d.id, ...formData } : d));
    setShowEditDialog(false);
  }

  function handleDelete() {
    if (!selectedDevice) return;
    setDevices(prev => prev.filter(d => d.id !== selectedDevice.id));
    setShowDeleteDialog(false);
    setSelectedDevice(null);
  }

  function handleStatusChange(deviceId: string, status: DeviceStatus) {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status } : d));
  }

  function Field({ label, value, half }: { label: string; value: string; half?: boolean }) {
    return (
      <div className={half ? 'col-span-1' : 'col-span-2'}>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value || '—'}</p>
      </div>
    );
  }

  function FormField({
    label, field, type = 'text', required, options
  }: {
    label: string;
    field: keyof Omit<EndpointDevice, 'id'>;
    type?: string;
    required?: boolean;
    options?: string[];
  }) {
    const val = formData[field] as string;
    const err = formErrors[field as keyof EndpointDevice];
    return (
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {options ? (
          <select
            value={val}
            onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${err ? 'border-red-400' : 'border-slate-200'}`}
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={val}
            onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-400' : 'border-slate-200'}`}
          />
        )}
        {err && <p className="text-xs text-red-500 mt-0.5">{err}</p>}
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.push('/assets')} className="hover:text-blue-600 transition-colors">Asset Management</button>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-slate-800 font-medium">Endpoint Devices</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Endpoint Devices</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage laptops, desktops, and workstations across the organization</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Icon name="DownloadIcon" size={15} />
              Export CSV
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="PlusIcon" size={15} />
              Add Device
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Devices', value: devices.length, icon: 'MonitorIcon', color: 'text-blue-600 bg-blue-50' },
            { label: 'Active', value: activeCount, icon: 'CheckCircleIcon', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'In Maintenance', value: maintenanceCount, icon: 'WrenchIcon', color: 'text-amber-600 bg-amber-50' },
            { label: 'Retired', value: retiredCount, icon: 'ArchiveIcon', color: 'text-slate-600 bg-slate-100' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon as any} size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search devices, serials, IPs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Types</option>
            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterDept}
            onChange={e => { setFilterDept(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {allDepts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          {(search || filterStatus !== 'All' || filterType !== 'All' || filterDept !== 'All') && (
            <button
              onClick={() => { setSearch(''); setFilterStatus('All'); setFilterType('All'); setFilterDept('All'); setPage(1); }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
            >
              <Icon name="XIcon" size={13} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs text-slate-400">{filtered.length} device{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Device</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">OS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Seen</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      <Icon name="MonitorOffIcon" size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No devices found</p>
                    </td>
                  </tr>
                ) : paginated.map(device => (
                  <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <button onClick={() => router.push(`/assets/endpoint-devices/${device.id}`)} className="font-semibold text-blue-600 hover:underline text-sm">{device.id}</button>
                        <p className="text-xs text-slate-500 mt-0.5">{device.name}</p>
                        <p className="text-xs text-slate-400">{device.make} {device.model}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon name={typeIcons[device.type] as any} size={14} className="text-slate-400" />
                        <span className="text-slate-700">{device.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800 font-medium">{device.assignedTo}</p>
                      <p className="text-xs text-slate-400">{device.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{device.os}</p>
                      <p className="text-xs text-slate-400">{device.osVersion}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{device.ipAddress}</td>
                    <td className="px-4 py-3">
                      <select
                        value={device.status}
                        onChange={e => handleStatusChange(device.id, e.target.value as DeviceStatus)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[device.status]}`}
                      >
                        {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{device.lastSeen || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openView(device)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Icon name="EyeIcon" size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(device)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit device"
                        >
                          <Icon name="PencilIcon" size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(device)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete device"
                        >
                          <Icon name="Trash2Icon" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronLeftIcon" size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronRightIcon" size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── CREATE DIALOG ─── */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add New Device</h2>
                <p className="text-xs text-slate-500">Register a new endpoint device in the asset inventory</p>
              </div>
              <button onClick={() => setShowCreateDialog(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="XIcon" size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Device Name" field="name" required />
                <FormField label="Serial Number" field="serial" required />
                <FormField label="Type" field="type" options={allTypes} />
                <FormField label="Status" field="status" options={allStatuses} />
                <FormField label="Make / Brand" field="make" required />
                <FormField label="Model" field="model" required />
                <FormField label="Operating System" field="os" options={['Windows 11','Windows 10','macOS Sonoma','macOS Ventura','Ubuntu 22.04','RHEL 9']} />
                <FormField label="OS Version" field="osVersion" />
                <FormField label="Assigned To" field="assignedTo" required />
                <FormField label="Department" field="department" required />
                <FormField label="Location" field="location" />
                <FormField label="IP Address" field="ipAddress" />
                <FormField label="MAC Address" field="macAddress" />
                <FormField label="CPU" field="cpu" />
                <FormField label="RAM" field="ram" />
                <FormField label="Storage" field="storage" />
                <FormField label="Purchase Date" field="purchaseDate" type="date" />
                <FormField label="Warranty Expiry" field="warrantyExpiry" type="date" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowCreateDialog(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT DIALOG ─── */}
      {showEditDialog && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Device</h2>
                <p className="text-xs text-slate-500">{selectedDevice.id} — {selectedDevice.name}</p>
              </div>
              <button onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="XIcon" size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Device Name" field="name" required />
                <FormField label="Serial Number" field="serial" required />
                <FormField label="Type" field="type" options={allTypes} />
                <FormField label="Status" field="status" options={allStatuses} />
                <FormField label="Make / Brand" field="make" required />
                <FormField label="Model" field="model" required />
                <FormField label="Operating System" field="os" options={['Windows 11','Windows 10','macOS Sonoma','macOS Ventura','Ubuntu 22.04','RHEL 9']} />
                <FormField label="OS Version" field="osVersion" />
                <FormField label="Assigned To" field="assignedTo" required />
                <FormField label="Department" field="department" required />
                <FormField label="Location" field="location" />
                <FormField label="IP Address" field="ipAddress" />
                <FormField label="MAC Address" field="macAddress" />
                <FormField label="CPU" field="cpu" />
                <FormField label="RAM" field="ram" />
                <FormField label="Storage" field="storage" />
                <FormField label="Purchase Date" field="purchaseDate" type="date" />
                <FormField label="Warranty Expiry" field="warrantyExpiry" type="date" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowEditDialog(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleEdit} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW DIALOG ─── */}
      {showViewDialog && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon name={typeIcons[selectedDevice.type] as any} size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedDevice.id}</h2>
                  <p className="text-xs text-slate-500">{selectedDevice.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[selectedDevice.status]}`}>
                  {selectedDevice.status}
                </span>
                <button onClick={() => setShowViewDialog(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Icon name="XIcon" size={18} className="text-slate-500" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Device Info</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Field label="Type" value={selectedDevice.type} half />
                  <Field label="Make / Model" value={`${selectedDevice.make} ${selectedDevice.model}`} half />
                  <Field label="Serial Number" value={selectedDevice.serial} half />
                  <Field label="OS" value={`${selectedDevice.os} ${selectedDevice.osVersion}`} half />
                  <Field label="CPU" value={selectedDevice.cpu} half />
                  <Field label="RAM" value={selectedDevice.ram} half />
                  <Field label="Storage" value={selectedDevice.storage} half />
                </div>
              </section>
              <div className="border-t border-slate-100" />
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Assignment</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Field label="Assigned To" value={selectedDevice.assignedTo} half />
                  <Field label="Department" value={selectedDevice.department} half />
                  <Field label="Location" value={selectedDevice.location} half />
                </div>
              </section>
              <div className="border-t border-slate-100" />
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Network</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Field label="IP Address" value={selectedDevice.ipAddress} half />
                  <Field label="MAC Address" value={selectedDevice.macAddress} half />
                  <Field label="Last Seen" value={selectedDevice.lastSeen} half />
                </div>
              </section>
              <div className="border-t border-slate-100" />
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Lifecycle</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Field label="Purchase Date" value={selectedDevice.purchaseDate} half />
                  <Field label="Warranty Expiry" value={selectedDevice.warrantyExpiry} half />
                </div>
              </section>
              {selectedDevice.notes && (
                <>
                  <div className="border-t border-slate-100" />
                  <section>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{selectedDevice.notes}</p>
                  </section>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => { setShowViewDialog(false); openEdit(selectedDevice); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Icon name="PencilIcon" size={14} /> Edit
              </button>
              <button onClick={() => setShowViewDialog(false)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE DIALOG ─── */}
      {showDeleteDialog && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Icon name="Trash2Icon" size={22} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 text-center mb-1">Delete Device</h2>
              <p className="text-sm text-slate-500 text-center mb-4">
                Are you sure you want to remove <span className="font-semibold text-slate-800">{selectedDevice.id}</span> ({selectedDevice.name}) from the inventory? This action cannot be undone.
              </p>
              <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-600 mb-5">
                <p><span className="font-medium">Make/Model:</span> {selectedDevice.make} {selectedDevice.model}</p>
                <p><span className="font-medium">Assigned To:</span> {selectedDevice.assignedTo}</p>
                <p><span className="font-medium">Serial:</span> {selectedDevice.serial}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
