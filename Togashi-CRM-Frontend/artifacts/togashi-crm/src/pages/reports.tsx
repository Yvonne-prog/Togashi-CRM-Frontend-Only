import { useState } from 'react';
import {
  revenueData, revenueSummary, projectStats,
  teamMembers, invoices,
  deals, companies,
} from '@/data/dashboardMockData';
import {
  DollarCircle, Timer, Briefcase, TrendUp,
  Profile2User, ReceiptText, DocumentText,
  Bill, TaskSquare,
} from 'iconsax-react';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell,
} from 'recharts';

const formatUgx = (val: number) => 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
const formatUgxCompact = (val: number) => {
  if (val >= 1000000) return 'UGX ' + (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return 'UGX ' + val;
};

const STAGE_LABELS = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'];
const STAGE_COLORS = ['#94A3B8', '#3B82F6', '#8B5CF6', '#F59E0B', '#16A34A'];

const funnelData = STAGE_LABELS.map((stage) => {
  const stageDeals = deals.filter((d) => d.stage === stage);
  const count = stageDeals.length;
  const revenue = stageDeals.reduce((s, d) => s + d.value, 0);
  const totalDeals = deals.length;
  return {
    stage,
    count,
    revenue,
    pct: totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0,
  };
});

const REVENUE_BREAKDOWN = [
  { name: 'Website Development', value: 48000000, color: '#16A34A' },
  { name: 'Custom Software', value: 37000000, color: '#3B82F6' },
  { name: 'Mobile Apps', value: 25000000, color: '#8B5CF6' },
  { name: 'E-commerce', value: 18000000, color: '#F59E0B' },
  { name: 'Other', value: 8800000, color: '#94A3B8' },
];

const revenueTrendData = revenueData.map((d) => ({
  ...d,
  quarterly: d.month,
}));

const topClients = companies
  .filter((c) => c.revenue > 0)
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 6)
  .map((c) => ({
    name: c.name,
    revenue: c.revenue,
    projects: c.openDeals,
  }));

const salesPerformance = teamMembers.map((m) => {
  const wonCount = m.dealsWon;
  const totalCount = wonCount + Math.floor(wonCount * 0.6);
  const winRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;
  return {
    name: m.name,
    revenue: m.revenue,
    dealsWon: wonCount,
    winRate,
  };
});

const upcomingPayments = invoices
  .filter((i) => i.status !== 'Paid' && i.status !== 'Cancelled' && i.status !== 'Draft')
  .sort((a, b) => {
    const da = new Date(a.dueDate + ', 2026').getTime();
    const db = new Date(b.dueDate + ', 2026').getTime();
    return da - db;
  })
  .slice(0, 6);

const STATUS_STYLES: Record<string, string> = {
  'Sent': 'bg-blue-50 text-blue-700',
  'Partially Paid': 'bg-amber-50 text-amber-700',
  'Overdue': 'bg-red-50 text-red-600',
};

const activityItems = [
  { icon: Bill, label: 'Invoice paid', desc: 'TGL-INV-2026-007 · StanChart', time: '2 hours ago', user: 'Grace Nakato' },
  { icon: ReceiptText, label: 'Quotation accepted', desc: 'TGL-QTN-2026-001 · Katrina Fashion', time: 'Yesterday', user: 'Alex Mugisha' },
  { icon: DocumentText, label: 'Receipt issued', desc: 'TGL-RCT-2026-009 · Uganda Breweries', time: '2 days ago', user: 'David Okello' },
  { icon: TaskSquare, label: 'Project completed', desc: 'SafeBoda Fleet Expansion', time: '3 days ago', user: 'Sarah Birungi' },
  { icon: Profile2User, label: 'New client added', desc: 'Uganda Breweries', time: '4 days ago', user: 'David Okello' },
  { icon: Bill, label: 'Payment received', desc: 'TGL-RCT-2026-006 · MTN Uganda', time: '5 days ago', user: 'Alex Mugisha' },
];

const businessSummary = [
  { metric: 'Revenue', today: { value: 3500000, label: 'UGX 3.5M' }, week: { value: 22000000, label: 'UGX 22M' }, month: { value: 52000000, label: 'UGX 52M' }, growth: '+13%' },
  { metric: 'Deals Won', today: { value: 0, label: '0' }, week: { value: 1, label: '1' }, month: { value: 3, label: '3' }, growth: '+12%' },
  { metric: 'Quotations', today: { value: 1, label: '1' }, week: { value: 2, label: '2' }, month: { value: 9, label: '9' }, growth: '+8%' },
  { metric: 'Invoices', today: { value: 0, label: '0' }, week: { value: 2, label: '2' }, month: { value: 10, label: '10' }, growth: '+5%' },
  { metric: 'Receipts', today: { value: 0, label: '0' }, week: { value: 3, label: '3' }, month: { value: 10, label: '10' }, growth: '+15%' },
  { metric: 'Projects', today: { value: 0, label: '0' }, week: { value: 1, label: '1' }, month: { value: 3, label: '3' }, growth: '+20%' },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month');

  const outstandingPayments = invoices
    .filter((i) => i.status !== 'Paid' && i.status !== 'Cancelled')
    .reduce((s, i) => s + i.balance, 0);

  const completedThisMonth = projectStats.completedThisMonth;

  const wonDeals = deals.filter((d) => d.stage === 'Won').length;
  const allDeals = deals.filter((d) => d.stage !== 'Lost').length;
  const winRateVal = allDeals > 0 ? Math.round((wonDeals / allDeals) * 100) : 0;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Reports</h2>
          <p className="text-slate-500 mt-1 text-sm">Monitor sales performance, revenue, projects and business growth.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range.toLowerCase().replace(' ', '-'))}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                dateRange === range.toLowerCase().replace(' ', '-')
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarCircle size={16} variant="Linear" color="#16A34A" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{formatUgx(revenueSummary.currentMonth)}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">&#8593; {revenueSummary.growth}% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Payments</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Timer size={16} variant="Linear" color="#F59E0B" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{formatUgx(outstandingPayments)}</p>
          <p className="text-xs text-slate-400 mt-1">Invoices awaiting payment</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects Completed</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase size={16} variant="Linear" color="#3B82F6" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{completedThisMonth}</p>
          <p className="text-xs text-slate-400 mt-1">Completed this month</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Win Rate</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendUp size={16} variant="Linear" color="#8B5CF6" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{winRateVal}%</p>
          <p className="text-xs text-slate-400 mt-1">Deals won this month</p>
        </div>
      </div>

      {/* Row 1: Revenue Trend + Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Revenue Trend</h3>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              <button className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white text-slate-700 shadow-sm">Monthly</button>
              <button className="px-2.5 py-1 rounded text-[10px] font-semibold text-slate-500 hover:text-slate-700">Quarterly</button>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v: number) => formatUgxCompact(v)} width={60} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }}
                  formatter={(value: number) => [formatUgx(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Revenue Breakdown</h3>
          <div className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REVENUE_BREAKDOWN} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {REVENUE_BREAKDOWN.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }}
                  formatter={(value: number) => [formatUgx(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {REVENUE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-800">{formatUgxCompact(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Top Clients + Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Top Clients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topClients.map((client) => (
                  <tr key={client.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-slate-900">{client.name}</td>
                    <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-700">{formatUgxCompact(client.revenue)}</td>
                    <td className="px-5 py-3 text-right text-[13px] text-slate-500">{client.projects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Top Sales Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Representative</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Deals Won</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {salesPerformance.map((rep) => (
                  <tr key={rep.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                          {rep.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[13px] font-medium text-slate-900">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-700">{formatUgxCompact(rep.revenue)}</td>
                    <td className="px-5 py-3 text-right text-[13px] text-slate-600">{rep.dealsWon}</td>
                    <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-700">{rep.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Sales Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <h3 className="text-sm font-semibold text-slate-900 mb-5">Sales Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {funnelData.map((stage, i) => (
            <div key={stage.stage} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: STAGE_COLORS[i] + '20', color: STAGE_COLORS[i] }}>
                  {stage.count}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-700 mb-0.5">{stage.stage}</p>
              <p className="text-[11px] font-medium mb-1" style={{ color: STAGE_COLORS[i] }}>{stage.pct}%</p>
              <p className="text-[11px] text-slate-400">{formatUgxCompact(stage.revenue)}</p>
              {i < STAGE_LABELS.length - 1 && (
                <div className="hidden sm:flex justify-center mt-2 text-slate-300">
                  <svg width="20" height="12" viewBox="0 0 20 12"><path d="M0 6h16m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Recent Activity + Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Business Activity</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {activityItems.map((item, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="mt-0.5 shrink-0">
                  <item.icon size={15} variant="Linear" color="#94A3B8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-slate-900">{item.label}</p>
                    <span className="text-[11px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 truncate">{item.desc}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Upcoming Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Invoice</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {upcomingPayments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-slate-900">{inv.number}</p>
                        <p className="text-[12px] text-slate-400 truncate max-w-[140px]">{inv.companyName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-[13px] font-semibold ${inv.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {inv.balance > 0 ? formatUgxCompact(inv.balance) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] text-slate-500">{inv.dueDate}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[inv.status] || 'bg-slate-100 text-slate-500'}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 5: Business Summary */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Business Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Metric</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Today</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">This Week</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">This Month</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {businessSummary.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-medium text-slate-900">{row.metric}</td>
                  <td className="px-5 py-3 text-right text-[13px] text-slate-700">{row.today.label}</td>
                  <td className="px-5 py-3 text-right text-[13px] text-slate-700">{row.week.label}</td>
                  <td className="px-5 py-3 text-right text-[13px] font-semibold text-slate-800">{row.month.label}</td>
                  <td className="px-5 py-3 text-right text-[13px] font-semibold text-emerald-600">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
