import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  kpiMetrics,
  pipelineStages,
  scheduleEvents,
  healthSegments,
  healthClients,
  upcomingTasks as mockTasks,
  recentActivities,
  topDeals,
  teamMembers,
  revenueData,
  revenueSummary,
} from '@/data/dashboardMockData';
import type {
  UpcomingTask,
} from '@/data/dashboardMockData';
import {
  TickCircle,
  Timer,
  ArrowRight,
  ChartSquare,
  StatusUp,
  WalletMoney,
  ClipboardTick,
  Video,
  Call,
  Location,
  ProfileAdd,
  DocumentDownload,
  MoneySend,
  Flag,
  Profile2User,
} from 'iconsax-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Link } from 'wouter';

const ACTIVITY_ICONS: Record<string, React.ComponentType<any>> = {
  lead: ProfileAdd,
  proposal: DocumentDownload,
  payment: MoneySend,
  milestone: Flag,
  contact: Profile2User,
};

const ACTIVITY_COLORS: Record<string, string> = {
  lead: '#3B82F6',
  proposal: '#8B5CF6',
  payment: '#16A34A',
  milestone: '#F59E0B',
  contact: '#3B82F6',
};

const MONTH_NAMES: Record<string, string> = {
  Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April',
  May: 'May', Jun: 'June', Jul: 'July', Aug: 'August',
  Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [pipelineRange, setPipelineRange] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');
  const [tasks, setTasks] = useState<UpcomingTask[]>(mockTasks);

  const formatUgx = (val: number) => {
    return 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
  };

  const formatUgxCompact = (val: number) => {
    if (val >= 1000000) {
      return 'UGX ' + (val / 1000000).toFixed(1) + 'M';
    }
    return 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );
  };

  const HEALTH_COLORS = ['#16A34A', '#F59E0B', '#DC2626'];
  const healthData = healthSegments.map((s, i) => ({
    name: s.name,
    value: s.value,
    color: HEALTH_COLORS[i],
  }));

  const sortedDeals = [...topDeals].sort((a, b) => b.value - a.value);
  const visibleTasks = tasks.slice(0, 3);

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 style={{ fontSize: '25px', fontWeight: 500, lineHeight: 1.2, color: '#0f172a' }}>
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name}
          </h2>
          <p style={{ fontSize: '15px', fontWeight: 400, color: '#64748B', lineHeight: 1.5, marginTop: '8px' }}>
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pipeline Value */}
        <div className="rounded-[26px] border-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-5 py-5 min-h-[112px]" style={{ backgroundColor: '#CFC3FF' }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center" style={{ gap: '11px' }}>
              <ChartSquare size={22} variant="Linear" color="#000000" />
              <p className="text-xs font-medium" style={{ color: 'rgba(15,23,42,0.75)' }}>Potential Sales Value</p>
            </div>
            <p className="text-2xl font-semibold mt-2" style={{ color: '#0f172a' }}>{formatUgx(kpiMetrics.pipelineValue)}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(15,23,42,0.60)' }}>+{kpiMetrics.pipelineChange}% from last month</p>
          </div>
        </div>

        {/* Active Deals */}
        <div className="rounded-[26px] border-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-5 py-5 min-h-[112px]" style={{ backgroundColor: '#AFCFFF' }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center" style={{ gap: '11px' }}>
              <StatusUp size={22} variant="Linear" color="#000000" />
              <p className="text-xs font-medium" style={{ color: 'rgba(15,23,42,0.75)' }}>Active Deals</p>
            </div>
            <p className="text-2xl font-semibold mt-2" style={{ color: '#0f172a' }}>{kpiMetrics.activeDeals}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(15,23,42,0.60)' }}>{kpiMetrics.closingThisMonth} closing this month</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-[26px] border-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-5 py-5 min-h-[112px]" style={{ backgroundColor: '#A7E8C8' }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center" style={{ gap: '11px' }}>
              <WalletMoney size={22} variant="Linear" color="#000000" />
              <p className="text-xs font-medium" style={{ color: 'rgba(15,23,42,0.75)' }}>Total Revenue</p>
            </div>
            <p className="text-2xl font-semibold mt-2" style={{ color: '#0f172a' }}>{formatUgx(kpiMetrics.totalRevenue)}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(15,23,42,0.60)' }}>+{kpiMetrics.revenueChange}% from last month</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-[26px] border-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-5 py-5 min-h-[112px]" style={{ backgroundColor: '#4DB8C8' }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center" style={{ gap: '11px' }}>
              <ClipboardTick size={22} variant="Linear" color="#000000" />
              <p className="text-xs font-medium" style={{ color: 'rgba(15,23,42,0.75)' }}>Active Projects</p>
            </div>
            <p className="text-2xl font-semibold mt-2" style={{ color: '#0f172a' }}>{kpiMetrics.activeProjects}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(15,23,42,0.60)' }}>{kpiMetrics.openTasks} open tasks</p>
          </div>
        </div>
      </div>

      {/* Row 1: Sales Pipeline | Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Sales Overview</h3>
            <div className="bg-slate-100 rounded-full p-1 flex">
              {(['Weekly', 'Monthly', 'Quarterly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setPipelineRange(range)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    pipelineRange === range
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineStages} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="stage"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickFormatter={(val: number) => formatUgxCompact(val)}
                />
                <RechartsTooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value: number) => [formatUgx(value), 'Value']}
                />
                <Bar dataKey="value" fill="#1E293B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="weightedValue" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1E293B]"></div>Total Value</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>Weighted Value</div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-slate-900">Today's Schedule</h3>
            <Link href="/calendar" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium flex items-center gap-1 shrink-0">
              View calendar <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="space-y-4">
            {scheduleEvents.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="w-12 text-right shrink-0">
                  <div className="text-sm font-medium text-slate-900">{event.time}</div>
                </div>
                <div className="w-px bg-slate-200 relative shrink-0">
                  <div className={`absolute top-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    event.type === 'Meeting' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{event.relatedContactName}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    {event.location.includes('Online') || event.location.includes('Meet') ? (
                      <Video size={12} variant="Linear" color="currentColor" />
                    ) : event.type === 'Call' ? (
                      <Call size={12} variant="Linear" color="currentColor" />
                    ) : (
                      <Location size={12} variant="Linear" color="currentColor" />
                    )}
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Overview | Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <h3 className="text-xl font-semibold text-slate-900 mb-5">Revenue Overview</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Month</p>
              <p className="text-lg font-semibold text-slate-900 mt-0.5">{formatUgx(revenueSummary.currentMonth)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Growth</p>
              <p className="text-lg font-semibold text-[#16A34A] mt-0.5">+{revenueSummary.growth}% <span className="text-xs font-normal text-slate-400">from last month</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Annual Revenue</p>
              <p className="text-lg font-semibold text-slate-900 mt-0.5">{formatUgx(revenueSummary.annual)}</p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  dy={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(val: number) => formatUgxCompact(val)}
                  width={65}
                />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  labelFormatter={(label: string) => MONTH_NAMES[label] || label}
                  formatter={(value: number) => [formatUgx(value), 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ fill: '#16A34A', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Deals */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-slate-900">Top Deals</h3>
            <Link href="/deals" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="space-y-4">
            {sortedDeals.map((deal) => (
              <div key={deal.id} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-snug">{deal.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{deal.stage} · {formatUgx(deal.value)}</p>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${deal.probability}%`,
                        backgroundColor: deal.probability >= 75 ? '#16A34A' :
                          deal.probability >= 50 ? '#F59E0B' : '#F97316',
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-900 shrink-0">{deal.probability}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Team Performance | Customer Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance */}
        <div className="lg:col-span-2 bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="px-7 py-5 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-900">Team Performance</h3>
            <Link href="/settings" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium flex items-center gap-1">
              View team <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-7 py-3 text-xs font-semibold uppercase tracking-wider">Member</th>
                  <th className="px-7 py-3 text-xs font-semibold uppercase tracking-wider">Deals Won</th>
                  <th className="px-7 py-3 text-xs font-semibold uppercase tracking-wider">Revenue</th>
                  <th className="px-7 py-3 text-xs font-semibold uppercase tracking-wider">Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {teamMembers.map((member) => (
                  <tr key={member.userId} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-7 py-3.5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-semibold">
                        {member.initials}
                      </div>
                      <span className="font-medium text-slate-900">{member.name}</span>
                    </td>
                    <td className="px-7 py-3.5">{member.dealsWon}</td>
                    <td className="px-7 py-3.5 font-medium text-slate-900">{formatUgx(member.revenue)}</td>
                    <td className="px-7 py-3.5 text-slate-500">{member.tasksCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Health */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-slate-900">Customer Health</h3>
            <Link href="/reports" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="flex items-center gap-5 mb-4">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {healthSegments.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: HEALTH_COLORS[i] }}></div>
                    <span className="text-sm text-slate-500">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                    <span className="text-xs text-slate-400 ml-1">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            {healthClients.map((client) => (
              <div key={client.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{
                    backgroundColor: client.status === 'Healthy' ? '#16A34A' :
                      client.status === 'Needs Attention' ? '#F59E0B' : '#DC2626'
                  }}></div>
                  <span className="text-sm text-slate-700">{client.name}</span>
                </div>
                <span className="text-xs text-slate-400">{client.lastActivity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity | Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="px-6 py-5 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
            <Link href="/communications" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="px-2 pb-2">
            {recentActivities.map((activity) => {
              const ActivityIcon = ACTIVITY_ICONS[activity.type] || TickCircle;
              const iconColor = ACTIVITY_COLORS[activity.type] || '#94A3B8';
              return (
                <div key={activity.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors rounded-xl mx-2 flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <ActivityIcon size={16} variant="Linear" color={iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600">{activity.description}</p>
                    {activity.extra && (
                      <p className="text-xs font-medium text-[#16A34A] mt-0.5">{activity.extra}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">{activity.timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
          <div className="px-7 py-5 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-900">Upcoming Tasks</h3>
            <Link href="/tasks" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} variant="Linear" color="currentColor" />
            </Link>
          </div>
          <div className="px-2 pb-2">
            {visibleTasks.map((task) => (
              <div key={task.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors flex items-start gap-4 rounded-xl mx-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 shrink-0"
                >
                  <TickCircle
                    size={18}
                    variant={task.completed ? 'Bold' : 'Linear'}
                    color={task.completed ? '#16A34A' : '#94A3B8'}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      task.priority === 'Medium' ? 'bg-slate-100 text-slate-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer size={12} variant="Linear" color="currentColor" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
