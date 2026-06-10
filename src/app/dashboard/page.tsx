import AppLayout from '@/components/AppLayout';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import TicketVolumeChart from './components/TicketVolumeChart';
import AtRiskTickets from './components/AtRiskTickets';
import AgentWorkload from './components/AgentWorkload';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* KPI Bento Grid */}
        <MetricsBentoGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <div className="lg:col-span-2 xl:col-span-2">
            <TicketVolumeChart />
          </div>
          <div>
            <CategoryBreakdownChart />
          </div>
        </div>

        {/* Bottom Row: At-Risk + Agent Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
            <AtRiskTickets />
          </div>
          <div className="xl:col-span-2">
            <AgentWorkload />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}