'use client';



const agents = [
  { name: 'James Okafor', tickets: 14, capacity: 20, utilization: 70, status: 'online' },
  { name: 'Sarah Chen', tickets: 18, capacity: 20, utilization: 90, status: 'online' },
  { name: 'Priya Nair', tickets: 12, capacity: 20, utilization: 60, status: 'online' },
  { name: 'Marcus Reynolds', tickets: 9, capacity: 20, utilization: 45, status: 'away' },
  { name: 'David Thornton', tickets: 20, capacity: 20, utilization: 100, status: 'busy' },
  { name: 'Amara Diallo', tickets: 7, capacity: 20, utilization: 35, status: 'online' },
];

const statusColors: Record<string, string> = {
  online: 'bg-green-400',
  away: 'bg-amber-400',
  busy: 'bg-red-400',
  offline: 'bg-slate-300',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-modal p-3 text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-slate-600">{payload[0].value} active tickets</p>
        <p className="text-slate-500">Utilization: {Math.round((payload[0].value / 20) * 100)}%</p>
      </div>
    );
  }
  return null;
};

export default function AgentWorkload() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Agent Workload</h3>
          <p className="text-xs text-slate-500 mt-0.5">Active tickets per agent · max 20</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Online</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Away</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Overloaded</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {agents.map((agent) => {
          const pct = agent.utilization;
          const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : '#3b82f6';
          return (
            <div key={agent.name} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColors[agent.status]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700 truncate">{agent.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums flex-shrink-0 ml-2">
                    {agent.tickets}/20
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-medium tabular-nums w-10 text-right"
                style={{ color: barColor }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>6 agents · avg 66.7% utilized</span>
        <span className="text-red-600 font-medium flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          1 agent overloaded
        </span>
      </div>
    </div>
  );
}