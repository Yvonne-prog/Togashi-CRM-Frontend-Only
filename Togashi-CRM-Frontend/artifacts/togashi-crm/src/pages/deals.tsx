import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { deals as mockDeals, dealStats } from '@/data/dashboardMockData';
import type { Deal } from '@/data/dashboardMockData';
import {
  Add, SearchNormal1, More, Calendar, ArrowRight,
  WalletMoney, StatusUp, ChartSquare, TickCircle, ArrowLeft,
  Call, Sms, Timer, Sort, ArrowDown2,
  Eye, Edit, Copy, Trash, NoteAdd, CloseCircle,
} from 'iconsax-react';

const STAGE_COLORS: Record<string, string> = {
  'New': 'bg-slate-100 text-slate-700',
  'Qualified': 'bg-blue-50 text-blue-700',
  'Proposal Sent': 'bg-purple-50 text-purple-700',
  'Negotiation': 'bg-amber-50 text-amber-700',
  'Won': 'bg-emerald-50 text-emerald-700',
  'Lost': 'bg-red-50 text-red-600',
};

const formatUgx = (val: number) => 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

const formatUgxShort = (val: number) => {
  if (val >= 1000000) return 'UGX ' + (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return 'UGX ' + val;
};

export default function Deals() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = deals.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q);
    const matchesStage = stageFilter === 'All' || d.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleStageChange = (id: string, newStage: string) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage: newStage } : d)));
    setActionMenuId(null);
  };

  const handleDelete = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
    setActionMenuId(null);
    if (detailDeal?.id === id) setDetailDeal(null);
  };

  const actionsForDeal = (deal: Deal) => {
    const items: { label: string; icon: typeof Eye; action: () => void; danger?: boolean }[] = [
      { label: 'View', icon: Eye, action: () => { setDetailDeal(deal); setActionMenuId(null); } },
    ];

    if (deal.stage !== 'Won' && deal.stage !== 'Lost') {
      items.push({ label: 'Edit', icon: Edit, action: () => { setActionMenuId(null); } });
    }

    items.push({ label: 'Duplicate', icon: Copy, action: () => { setActionMenuId(null); } });
    items.push({ label: 'Create Quotation', icon: NoteAdd, action: () => { setActionMenuId(null); } });

    if (deal.stage !== 'Won' && deal.stage !== 'Lost') {
      if (hasPermission('deals.change_stage')) {
        items.push({ label: 'Change Stage', icon: Calendar, action: () => { setActionMenuId(null); } });
      }
      items.push({ label: 'Mark as Won', icon: TickCircle, action: () => handleStageChange(deal.id, 'Won') });
      items.push({ label: 'Mark as Lost', icon: CloseCircle, action: () => handleStageChange(deal.id, 'Lost') });
    }

    if (deal.stage !== 'Won' && deal.stage !== 'Lost') {
      if (hasPermission('deals.delete')) {
        items.push({ label: 'Delete', icon: Trash, action: () => { setDeleteConfirm(deal.id); setActionMenuId(null); }, danger: true });
      }
    } else {
      if (hasPermission('deals.delete')) {
        items.push({ label: 'Delete', icon: Trash, action: () => { setDeleteConfirm(deal.id); setActionMenuId(null); }, danger: true });
      }
    }

    return items;
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]" onClick={() => { if (actionMenuId) setActionMenuId(null); }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Deals</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Track and manage your sales opportunities.</p>
        </div>
        {hasPermission('deals.create') && (<button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
          <Add size={18} variant="Linear" color="currentColor" /><span>New Deal</span>
        </button>)}
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: 'Potential Sales Value', i: ChartSquare, v: formatUgx(dealStats.pipelineValue) },
          { l: 'Active Deals', i: StatusUp, v: String(dealStats.activeDeals) },
          { l: 'Expected Revenue', i: WalletMoney, v: formatUgx(dealStats.expectedRevenue) },
          { l: 'Success Rate', i: TickCircle, v: `${dealStats.successRate}%` },
        ].map(({ l, i: Icon, v }) => (
          <div key={l} className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon size={14} variant="Linear" color="#64748B" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 leading-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-4 py-3 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              onFocus={() => setStageOpen(true)}
              onBlur={() => setStageOpen(false)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
            <ArrowDown2 className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform duration-150 ${stageOpen ? 'rotate-180' : ''}`} size={12} variant="Linear" color="currentColor" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Sort size={14} variant="Linear" color="currentColor" />Sort
          </button>
          <div className="relative">
            <button onClick={() => setMoreOpen(!moreOpen)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <More size={14} variant="Linear" color="currentColor" />More
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onMouseLeave={() => setMoreOpen(false)}>
                <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Import</button>
                <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Export</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] py-16 text-center">
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <ChartSquare size={24} variant="Bulk" color="#CBD5E1" />
          </div>
          <h3 className="text-base font-medium text-slate-900">No deals found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {search || stageFilter !== 'All' ? 'Try adjusting your search or filters.' : 'Get started by adding your first deal.'}
          </p>
          {(search || stageFilter !== 'All') ? (
            <button onClick={() => { setSearch(''); setStageFilter('All'); }} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
              Clear all filters
            </button>
          ) : (
            hasPermission('deals.create') && (<button className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors">
              <Add size={16} variant="Linear" color="currentColor" /><span>New Deal</span>
            </button>)
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deal</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Value</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Stage</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" title="Estimated likelihood that the deal will be won.">
                    Win Probability
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Expected Close</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => setDetailDeal(deal)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">{deal.initials}</div>
                        <span className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">{deal.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] text-slate-600 truncate max-w-[140px] block">{deal.companyName}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-[13px] font-semibold text-slate-900">{formatUgxShort(deal.value)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STAGE_COLORS[deal.stage] || 'bg-slate-100 text-slate-700'}`}>{deal.stage}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-semibold text-slate-700">{deal.probability}%</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-[12px] text-slate-500">{deal.expectedCloseDate}</span>
                    </td>
                    <td className="px-5 py-3 relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === deal.id ? null : deal.id); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <More size={15} variant="Linear" color="currentColor" />
                      </button>
                      {actionMenuId === deal.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1 z-20" onClick={(e) => e.stopPropagation()}>
                            {actionsForDeal(deal).map((a) => (
                              <button
                                key={a.label}
                                onClick={a.action}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                <a.icon size={14} variant="Linear" color="currentColor" />
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Slide-in Panel */}
      {detailDeal && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailDeal(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full sm:max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <button onClick={() => setDetailDeal(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STAGE_COLORS[detailDeal.stage] || 'bg-slate-100 text-slate-700'}`}>{detailDeal.stage}</span>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-sm font-semibold shrink-0">{detailDeal.initials}</div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{detailDeal.title}</h2>
                  <p className="text-sm text-slate-500">{detailDeal.companyName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Value</p>
                  <p className="text-base font-bold text-slate-900">{formatUgx(detailDeal.value)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Win Probability</p>
                  <p className="text-base font-bold text-slate-700">{detailDeal.probability}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Stage</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[detailDeal.stage] || 'bg-slate-100 text-slate-700'}`}>{detailDeal.stage}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Close Date</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Calendar size={14} variant="Linear" color="#94A3B8" />{detailDeal.expectedCloseDate}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ i: Call, l: 'Call' }, { i: Sms, l: 'Email' }, { i: Calendar, l: 'Schedule' }, { i: Timer, l: 'Follow Up' }].map(({ i: Icon, l }) => (
                      <button key={l} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                        <Icon size={14} variant="Linear" color="#94A3B8" />{l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>Proposal draft updated · 2 hours ago</p>
                    <p>Meeting notes added · Yesterday</p>
                    <p>Deal moved to {detailDeal.stage} · {detailDeal.lastActivity}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex gap-1 mb-3">
                    {['Notes', 'Tasks', 'Files', 'Emails'].map(t => (
                      <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">{t}</button>
                    ))}
                  </div>
                  <div className="text-center py-8">
                    <p className="text-[11px] text-slate-400">No items yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Delete Deal</h3>
            <p className="text-sm text-slate-500">This action cannot be undone. Are you sure you want to delete this deal?</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
