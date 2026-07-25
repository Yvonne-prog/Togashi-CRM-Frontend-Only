import { useState } from 'react';
import { deals as mockDeals, dealStats } from '@/data/dashboardMockData';
import type { Deal } from '@/data/dashboardMockData';
import { Link } from 'wouter';
import {
  Add, Grid1, SliderHorizontal, More, Calendar, ArrowRight,
  WalletMoney, StatusUp, ChartSquare, TickCircle, ArrowLeft, Call, Sms, Timer,
  SearchNormal1,
} from 'iconsax-react';

const STAGES = [
  { id: 'New', label: 'New', color: '#CBD5E1' },
  { id: 'Qualified', label: 'Qualified', color: '#60A5FA' },
  { id: 'Proposal Sent', label: 'Proposal Sent', color: '#C084FC' },
  { id: 'Negotiation', label: 'Negotiation', color: '#FBBF24' },
  { id: 'Won', label: 'Won', color: '#22C55E' },
  { id: 'Lost', label: 'Lost', color: '#F87171' },
];

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
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDeal(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedDeal) return;
    setDeals((prev) => prev.map((d) => (d.id === draggedDeal ? { ...d, stage: stageId } : d)));
    setDraggedDeal(null);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Deals</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Track and manage your sales opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              <SliderHorizontal size={17} variant="Linear" color="currentColor" />
            </button>
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              <Grid1 size={17} variant="Linear" color="currentColor" />
            </button>
          </div>
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
            <Add size={18} variant="Linear" color="currentColor" /><span>New Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
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

      {/* Table View */}
      {view === 'list' && (
        <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-slate-100">
            <div className="relative w-56">
              <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor" />
              <input
                type="text"
                placeholder="Search deals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deal</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Value</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Stage</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Probability</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Expected Close</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Priority</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {deals
                  .filter((d) => {
                    if (!search) return true;
                    const q = search.toLowerCase();
                    return d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q);
                  })
                  .map((deal) => (
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
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-semibold text-slate-900">{formatUgxShort(deal.value)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STAGE_COLORS[deal.stage] || 'bg-slate-100 text-slate-700'}`}>{deal.stage}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-[12px] font-semibold text-slate-700">{deal.probability}%</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-[12px] text-slate-500">{deal.expectedCloseDate}</span>
                      </td>
                      <td className="px-5 py-3 hidden xl:table-cell">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          deal.priority === 'High' ? 'bg-amber-50 text-amber-700' : deal.priority === 'Medium' ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'
                        }`}>{deal.priority}</span>
                      </td>
                      <td className="px-5 py-3">
                        <ArrowRight size={14} variant="Linear" color="#CBD5E1" className="opacity-0 group-hover:opacity-100 transition-all" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 min-h-0">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className="w-[260px] shrink-0 flex flex-col bg-slate-50/70 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
                onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div
                  className="px-4 py-2.5 border-t-2"
                  style={{ borderTopColor: stage.color }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-sm text-slate-800">{stage.label}</h3>
                    <span className="bg-white text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {stageTotal > 0 ? formatUgxShort(stageTotal) : 'No deals'}
                  </p>
                </div>

                <div className="px-3 pb-3 flex-1 overflow-y-auto space-y-2">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-10 px-2">
                      <div className="mb-2 mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <ChartSquare size={16} variant="Linear" color="#CBD5E1" />
                      </div>
                      <p className="text-[11px] text-slate-400">No deals in this stage</p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal.id)}
                        onClick={() => setDetailDeal(deal)}
                        className={`bg-white rounded-xl p-3 border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all ${
                          draggedDeal === deal.id ? 'opacity-50' : ''
                        }`}
                      >
                        <p className="text-[13px] font-medium text-slate-900 leading-snug mb-1">{deal.title}</p>
                        <p className="text-[11px] text-slate-400 mb-2">{deal.companyName}</p>
                        <p className="text-[15px] font-bold text-slate-900 mb-2">{formatUgxShort(deal.value)}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-500">
                            Win Probability: <span className="text-slate-700 font-semibold">{deal.probability}%</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Slide-in Panel */}
      {detailDeal && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailDeal(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <button onClick={() => setDetailDeal(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                  detailDeal.priority === 'High' ? 'bg-amber-50 text-amber-700' : detailDeal.priority === 'Medium' ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'
                }`}>{detailDeal.priority}</span>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><More size={18} variant="Linear" color="currentColor" /></button>
              </div>
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
    </div>
  );
}
