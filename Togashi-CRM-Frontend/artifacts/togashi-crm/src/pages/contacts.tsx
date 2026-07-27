import { useState } from 'react';
import { contacts as mockContacts, contactSummary } from '@/data/dashboardMockData';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'wouter';
import {
  Add,
  SearchNormal1,
  Sms,
  Call,
  Buildings,
  Profile2User,
  ArrowLeft,
  ArrowRight,
  Sort,
  More,
  ArrowDown2,
} from 'iconsax-react';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Prospect: 'bg-purple-50 text-purple-700',
  Inactive: 'bg-slate-100 text-slate-500',
};

const ACTIVITY_SHORT: Record<string, string> = {
  'Today': 'Today',
  'Yesterday': 'Yesterday',
  '1 day ago': '1d ago',
  '2 days ago': '2d ago',
  '3 days ago': '3d ago',
  '4 days ago': '4d ago',
  '5 days ago': '5d ago',
  '6 days ago': '6d ago',
  '1 week ago': '1w ago',
  '2 weeks ago': '2w ago',
  '3 weeks ago': '3w ago',
  '1 month ago': '1mo ago',
  '2 months ago': '2mo ago',
};

export default function Contacts() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const perPage = 12;

  const filtered = mockContacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.phone.includes(q);
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, filtered.length);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Contacts</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage your client and prospect relationships.</p>
        </div>
        {hasPermission('contacts.create') && (
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
            <Add size={18} variant="Linear" color="currentColor" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5 mb-1">
            <Profile2User size={15} variant="Linear" color="#64748B" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Contacts</span>
          </div>
          <p className="text-xl font-semibold text-slate-900">{contactSummary.total}</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Contacts</span>
          </div>
          <p className="text-xl font-semibold text-slate-900">{contactSummary.active}</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Prospects</span>
          </div>
          <p className="text-xl font-semibold text-slate-900">{contactSummary.prospects}</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inactive Contacts</span>
          </div>
          <p className="text-xl font-semibold text-slate-900">{contactSummary.inactive}</p>
        </div>
      </div>

      {/* Toolbar + Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Sort size={14} variant="Linear" color="currentColor" />
              Sort
            </button>
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <More size={14} variant="Linear" color="currentColor" />
                More
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onMouseLeave={() => setMoreOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Columns</button>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Import</button>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Export</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {paginated.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell w-24">Last Activity</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <Link href={`/contacts/${contact.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                            {contact.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-[12px] text-slate-400 truncate">{contact.jobTitle}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center text-[9px] font-semibold text-slate-500 shrink-0">
                            {contact.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[13px] text-slate-700 truncate">{contact.company}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Sms size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor" />
                            <span className="text-[12px] text-slate-600 truncate max-w-[140px]">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Call size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor" />
                            <span className="text-[12px] text-slate-500">{contact.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[contact.status]}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-[12px] text-slate-400">{ACTIVITY_SHORT[contact.lastActivity] || contact.lastActivity}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                          <More size={15} variant="Linear" color="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {showingFrom}–{showingTo} of {filtered.length}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14} variant="Linear" color="currentColor" />
                </button>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                        p === page ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={14} variant="Linear" color="currentColor" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Profile2User size={24} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-base font-medium text-slate-900">No contacts found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search || statusFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first contact.'}
            </p>
            {(search || statusFilter) ? (
              <button onClick={clearFilters} className="mt-3 text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
                Clear all filters
              </button>
            ) : (
              <button className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-1.5">
                <Add size={16} variant="Linear" color="currentColor" />
                <span>Add Contact</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
