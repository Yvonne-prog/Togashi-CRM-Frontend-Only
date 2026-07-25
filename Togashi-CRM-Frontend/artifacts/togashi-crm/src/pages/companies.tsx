import { useState } from 'react';
import { companies as mockCompanies, companySummary } from '@/data/dashboardMockData';
import { Link } from 'wouter';
import {
  Add, SearchNormal1, Buildings, Location, Profile2User,
  ArrowLeft, ArrowRight, Sort, More, ArrowDown2,
} from 'iconsax-react';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Prospect: 'bg-purple-50 text-purple-700',
  Inactive: 'bg-slate-100 text-slate-500',
};

const ACTIVITY_SHORT: Record<string, string> = {
  'Today': 'Today', 'Yesterday': 'Yest.', '1 week ago': '1w ago',
  '2 weeks ago': '2w ago', '8 days ago': '1w ago', '6 days ago': '6d ago',
  '5 days ago': '5d ago', '4 days ago': '4d ago', '3 days ago': '3d ago',
  '2 days ago': '2d ago', '1 day ago': '1d ago',
};

const formatUgx = (val: number) =>
  val === 0 ? '—' : 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

export default function Companies() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const perPage = 12;

  const filtered = mockCompanies.filter((c) => {
    const q = search.toLowerCase();
    const m = !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    return m && (!statusFilter || c.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const sf = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const st = Math.min(page * perPage, filtered.length);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Companies</h2><p className="text-slate-500 mt-1 text-sm">Manage accounts and organizations.</p></div>
        <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"><Add size={18} variant="Linear" color="currentColor"/><span>Add Company</span></button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ label: 'Total Companies', icon: Buildings, val: companySummary.total, dot: null },
          { label: 'Active Companies', icon: null, val: companySummary.active, dot: 'bg-emerald-500' },
          { label: 'Prospects', icon: null, val: companySummary.prospects, dot: 'bg-purple-500' },
          { label: 'Inactive Companies', icon: null, val: companySummary.inactive, dot: 'bg-slate-400' },
        ].map(({ label, icon: Icon, val, dot }) => (
          <div key={label} className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-1">
              {Icon ? <Icon size={15} variant="Linear" color="#64748B" /> : <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />}
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">{val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-56"><SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor"/><input type="text" placeholder="Search companies..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"/></div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                onFocus={() => setSelectOpen(true)}
                onBlur={() => setSelectOpen(false)}
                className="border border-slate-200 bg-slate-50 rounded-lg text-xs pl-3 pr-10 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ArrowDown2
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none transition-transform duration-150 ${selectOpen ? 'rotate-180' : ''}`}
                variant="Linear"
                color="currentColor"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Sort size={14} variant="Linear" color="currentColor"/>Sort</button>
            <div className="relative"><button onClick={() => setMoreOpen(!moreOpen)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><More size={14} variant="Linear" color="currentColor"/>More</button>
              {moreOpen && <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onMouseLeave={() => setMoreOpen(false)}><button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Columns</button><button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Import</button><button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Export</button></div>}
            </div>
          </div>
        </div>

        {paginated.length > 0 ? (<>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Industry</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Location</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deals</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Revenue</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(c => (<tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-3.5"><Link href={`/companies/${c.id}`} className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">{c.initials}</div><span className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">{c.name}</span></Link></td>
                <td className="px-5 py-3.5"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">{c.industry}</span></td>
                <td className="px-5 py-3.5 hidden md:table-cell"><div className="flex items-center gap-1 text-xs text-slate-600"><Location size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor"/>{c.location}</div></td>
                <td className="px-5 py-3.5"><span className={`text-sm font-medium ${c.openDeals > 0 ? 'text-slate-900' : 'text-slate-400'}`}>{c.openDeals || '—'}</span></td>
                <td className="px-5 py-3.5 hidden lg:table-cell text-xs font-medium text-slate-700">{formatUgx(c.revenue)}</td>
                <td className="px-5 py-3.5"><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[c.status]}`}>{c.status}</span></td>
                <td className="px-5 py-3.5"><button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"><More size={15} variant="Linear" color="currentColor"/></button></td>
              </tr>))}
            </tbody></table></div>
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">{sf}–{st} of {filtered.length}</div>
            <div className="flex gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"><ArrowLeft size={14} variant="Linear" color="currentColor"/></button>
              <div className="flex items-center gap-0.5">{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${p === page ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>))}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"><ArrowRight size={14} variant="Linear" color="currentColor"/></button>
            </div>
          </div>
        </>) : (
          <div className="px-6 py-16 text-center"><div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><Buildings size={24} variant="Bulk" color="#CBD5E1"/></div><h3 className="text-base font-medium text-slate-900">No companies found</h3><p className="text-xs text-slate-500 mt-1">{(search || statusFilter) ? 'Try adjusting your search or filters.' : 'Get started by adding your first company.'}</p>{(search || statusFilter) ? <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} className="mt-3 text-sm font-medium text-[#16A34A]">Clear all filters</button> : <button className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold inline-flex items-center gap-1.5"><Add size={16} variant="Linear" color="currentColor"/><span>Add Company</span></button>}</div>
        )}
      </div>
    </div>
  );
}
