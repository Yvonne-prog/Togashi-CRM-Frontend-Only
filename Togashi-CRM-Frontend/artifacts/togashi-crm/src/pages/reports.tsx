import { useState } from 'react';
import { useGetSalesReport } from '@workspace/api-client-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar as CalendarIcon, TrendUp, DollarCircle, DirectUp, Star } from 'iconsax-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month');
  const { data } = useGetSalesReport();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Analytics & Reports</h2>
          <p className="text-slate-500 mt-1">Track key performance indicators and revenue metrics.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <DollarCircle size={20} variant="Linear" color="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-500">Total Revenue</span>
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950">{formatCurrency(data?.totalRevenue || 0)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <DirectUp size={20} variant="Linear" color="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-500">Win Rate</span>
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950">{data?.winRate || 0}%</div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <TrendUp size={20} variant="Linear" color="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-500">Avg Deal Value</span>
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950">{formatCurrency(data?.avgDealValue || 0)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <Star size={20} variant="Linear" color="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-500">Deals Won</span>
          </div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950">{data?.wonDeals || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <h3 className="font-bold text-slate-900 mb-6">Revenue Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueByPeriod || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Area type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6">
          <h3 className="font-bold text-slate-900 mb-6">Revenue by Rep</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueByOwner || []} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="ownerName" type="category" axisLine={false} tickLine={false} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="revenue" fill="#0F172A" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
