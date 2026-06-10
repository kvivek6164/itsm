'use client';


import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/ui/AppIcon';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,  } from 'recharts';

// ── Donut chart data ──────────────────────────────────────────────────────────

const statusData = [
  { name: 'Allocated', value: 45, color: '#3b82f6' },
  { name: 'Handover', value: 12, color: '#f97316' },
  { name: 'In-Repair', value: 8, color: '#eab308' },
  { name: 'In Store', value: 15, color: '#ef4444' },
];

const supportTypeData = [
  { name: 'Under Warranty', value: 7, color: '#3b82f6' },
  { name: 'AMC', value: 3, color: '#22c55e' },
  { name: 'No Support', value: 70, color: '#e5e7eb' },
];

const warrantyExpiryData = [
  { name: '7 Days', value: 1, color: '#f97316' },
  { name: '15 Days', value: 0, color: '#eab308' },
  { name: '30 Days', value: 0, color: '#3b82f6' },
  { name: '90 Days', value: 0, color: '#6366f1' },
];

const lifeExpiryData = [
  { name: '3 Months', value: 0, color: '#3b82f6' },
  { name: '3 to 6 Months', value: 0, color: '#22c55e' },
  { name: '6 to 12 Months', value: 1, color: '#f97316' },
  { name: 'After 1 Year', value: 71, color: '#6366f1' },
  { name: 'Expired', value: 6, color: '#ef4444' },
  { name: 'Status not available', value: 0, color: '#94a3b8' },
];

const amcExpiryData = [
  { name: '30 Days', value: 0, color: '#3b82f6' },
  { name: '60 Days', value: 0, color: '#22c55e' },
  { name: '90 Days', value: 0, color: '#f97316' },
];

const purchaseHistoryData = [
  { name: '2024', value: 4, color: '#3b82f6' },
  { name: '2023', value: 2, color: '#22c55e' },
  { name: '2022', value: 1, color: '#f97316' },
  { name: '2019', value: 2, color: '#ef4444' },
];

// ── Bar chart data ────────────────────────────────────────────────────────────

const vendorData = [
  { name: 'Dell Technologies', value: 6 },
  { name: 'HP', value: 3 },
  { name: 'Apple', value: 3 },
  { name: 'Lenovo', value: 2 },
  { name: 'Cisco', value: 2 },
  { name: 'Samsung', value: 1 },
  { name: 'Microsoft', value: 1 },
  { name: 'Logitech', value: 1 },
];

const categoryData = [
  { name: 'Laptop', value: 12 },
  { name: 'Desktop', value: 8 },
  { name: 'Server', value: 5 },
  { name: 'Network Switch', value: 7 },
  { name: 'UPS', value: 4 },
  { name: 'Printer', value: 6 },
  { name: 'Monitor', value: 18 },
  { name: 'Keyboard', value: 14 },
  { name: 'Mouse', value: 14 },
  { name: 'Docking Station', value: 3 },
  { name: 'Webcam', value: 5 },
  { name: 'Headset', value: 8 },
  { name: 'Router', value: 2 },
  { name: 'Firewall', value: 1 },
  { name: 'Storage', value: 3 },
  { name: 'Tablet', value: 4 },
  { name: 'Projector', value: 2 },
  { name: 'Scanner', value: 2 },
  { name: 'IP Phone', value: 6 },
  { name: 'Other', value: 3 },
];

const subLocationData = [
  { name: 'Floor 1', value: 28 },
  { name: 'Floor 2', value: 22 },
  { name: 'Floor 3', value: 18 },
  { name: 'Server Room', value: 12 },
  { name: 'Storage B', value: 8 },
  { name: 'IT Room', value: 6 },
  { name: 'Conference A', value: 4 },
  { name: 'Conference B', value: 3 },
  { name: 'Reception', value: 5 },
  { name: 'Cafeteria', value: 2 },
  { name: 'Lab 3C', value: 7 },
  { name: 'Hot Desk', value: 9 },
  { name: 'Lobby', value: 3 },
  { name: 'Basement', value: 4 },
  { name: 'Rooftop', value: 1 },
  { name: 'Annex A', value: 5 },
  { name: 'Annex B', value: 3 },
  { name: 'Warehouse', value: 6 },
  { name: 'Parking', value: 1 },
  { name: 'Remote', value: 10 },
];

const locationData = [
  { name: 'HQ - Main Building', value: 52 },
  { name: 'Branch - East', value: 18 },
  { name: 'Branch - West', value: 14 },
  { name: 'Data Center', value: 9 },
  { name: 'Remote Office', value: 7 },
  { name: 'Warehouse', value: 5 },
  { name: 'Disaster Recovery', value: 3 },
  { name: 'Cloud / Virtual', value: 4 },
  { name: 'Partner Site', value: 2 },
  { name: 'Home Office', value: 6 },
  { name: 'Retail Store 1', value: 4 },
  { name: 'Retail Store 2', value: 3 },
  { name: 'Retail Store 3', value: 2 },
  { name: 'Lab', value: 5 },
  { name: 'Training Center', value: 3 },
  { name: 'Executive Floor', value: 4 },
  { name: 'Annex Building', value: 6 },
  { name: 'Offshore', value: 2 },
  { name: 'Co-Working Space', value: 3 },
  { name: 'Unknown', value: 1 },
];

// ── Reusable Donut Card ───────────────────────────────────────────────────────

interface DonutCardProps {
  title: string;
  data: { name: string; value: number; color: string }[];
  total: number;
}

function DonutCard({ title, data, total }: DonutCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-xs font-semibold text-slate-600 mb-2">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="relative">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              cx={75}
              cy={75}
              innerRadius={48}
              outerRadius={72}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, '']} />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-xl font-bold text-slate-800">{total}</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-500">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reusable Bar Card ─────────────────────────────────────────────────────────

interface BarCardProps {
  title: string;
  data: { name: string; value: number }[];
  color?: string;
}

function BarCard({ title, data, color = '#60a5fa' }: BarCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-600">{title}</h3>
        <div className="flex items-center gap-1 text-slate-400">
          <Icon name="ArrowPathIcon" size={13} />
                    <Icon name="MagnifyingGlassPlusIcon" size={13} />
          <Icon name="ArrowDownTrayIcon" size={13} />
          <Icon name="HomeIcon" size={13} />
          <Icon name="ChartBarIcon" size={13} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e2e8f0' }}
          />
          <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AssetsDashboardPage() {
  const router = useRouter();

  const statusTotal = statusData.reduce((s, d) => s + d.value, 0);
  const supportTotal = supportTypeData.reduce((s, d) => s + d.value, 0);
  const warrantyTotal = warrantyExpiryData.reduce((s, d) => s + d.value, 0);
  const lifeTotal = lifeExpiryData.reduce((s, d) => s + d.value, 0);
  const amcTotal = amcExpiryData.reduce((s, d) => s + d.value, 0);
  const purchaseTotal = purchaseHistoryData.reduce((s, d) => s + d.value, 0);

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-0.5">DASHBOARD</p>
            <h1 className="text-xl font-bold text-slate-900">ASSET</h1>
          </div>
          <button
            onClick={() => router.push('/assets')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Icon name="ArrowRightCircleIcon" size={14} />
            Go to Module
          </button>
        </div>

        {/* Row 1 — 4 donut charts */}
        <div className="grid grid-cols-4 gap-4">
          <DonutCard title="Assets By Status" data={statusData} total={statusTotal} />
          <DonutCard title="Assets By Support Type" data={supportTypeData} total={supportTotal} />
          <DonutCard title="Assets By Warranty Expiry" data={warrantyExpiryData} total={warrantyTotal} />
          <DonutCard title="Assets By Life(Expiry)" data={lifeExpiryData} total={lifeTotal} />
        </div>

        {/* Row 2 — 3 donut charts (left-aligned) */}
        <div className="grid grid-cols-4 gap-4">
          <DonutCard title="Assets By Life" data={lifeExpiryData.slice(0, 2)} total={72} />
          <DonutCard title="Assets By AMC Expiry" data={amcExpiryData} total={amcTotal} />
          <DonutCard title="Purchase History" data={purchaseHistoryData} total={purchaseTotal} />
          {/* Empty placeholder to maintain grid */}
          <div />
        </div>

        {/* Bar charts */}
        <BarCard title="Assets By Vendor (Top 8)" data={vendorData} color="#60a5fa" />
        <BarCard title="Assets By Category (Top 20)" data={categoryData} color="#60a5fa" />
        <BarCard title="Assets By Sub Location (Top 20)" data={subLocationData} color="#60a5fa" />

        {/* Last row — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Empty left panel (matches screenshot) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[200px]" />
          <BarCard title="Assets By Location (Top 20)" data={locationData} color="#60a5fa" />
        </div>
      </div>
    </AppLayout>
  );
}
