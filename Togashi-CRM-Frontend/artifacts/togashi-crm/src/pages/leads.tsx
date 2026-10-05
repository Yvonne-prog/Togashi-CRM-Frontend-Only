import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'wouter';
import {
  Add, SearchNormal1, TrendUp, DirectUp, Profile2User, Flashy,
  ArrowLeft, ArrowRight, More, Global, Call, Briefcase, ProfileAdd, ArrowDown2,
  RefreshCircle, CloseCircle,
} from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  useLeads,
  useLeadStats,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  type LeadItem,
} from '@/hooks/useLeads';
import { LeadFormModal } from '@/pages/leads/LeadFormModal';

const STAGE_STYLES: Record<string, string> = {
  'New': 'bg-blue-50 text-blue-700',
  'Contacted': 'bg-amber-50 text-amber-700',
  'Qualified': 'bg-emerald-50 text-emerald-700',
  'Lost': 'bg-red-50 text-red-600',
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  High: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Low: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const TEMP_TO_PRIORITY: Record<string, 'High' | 'Medium' | 'Low'> = {
  Hot: 'High',
  Warm: 'Medium',
  Cold: 'Low',
};

const SOURCE_ICONS: Record<string, React.ComponentType<any>> = {
  'Website': Global,
  'Referral': ProfileAdd,
  'LinkedIn': Briefcase,
  'Cold Call': Call,
  'Trade Show': Briefcase,
  'Event': ProfileAdd,
};

const SCORE_COLOR = (s: number) => s >= 70 ? '#16A34A' : s >= 40 ? '#F59E0B' : '#F97316';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
}

export default function Leads() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState<string>('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const perPage = 12;

  const { data, isLoading, isError, error } = useLeads({
    limit: perPage,
    page,
    search: search || undefined,
    status: stageFilter || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [showCreate, setShowCreate] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  const [deletingLead, setDeletingLead] = useState<LeadItem | null>(null);

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const statusCount = (s: string) => stats?.byStatus.find(x => x.status === s)?.count ?? 0;
  const tempCount = (t: string) => stats?.byTemperature.find(x => x.temperature === t)?.count ?? 0;
  const totalLeads = stats?.total ?? 0;
  const qualified = statusCount('Qualified');
  const hot = tempCount('Hot');
  const newLeads = statusCount('New');
  const qualificationRate = totalLeads > 0 ? Math.round((qualified / totalLeads) * 100) : 0;

  const closeActionMenu = () => setActionMenuId(null);

  const handleCreate = (formData: Partial<LeadItem>) => {
    createLead.mutate(formData, {
      onSuccess: () => {
        setShowCreate(false);
        queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
        toast({ title: 'Lead created', description: 'The lead has been added successfully.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to create lead', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleUpdate = (formData: Partial<LeadItem>) => {
    if (!editingLead) return;
    updateLead.mutate({ id: editingLead.id, data: formData }, {
      onSuccess: () => {
        setEditingLead(null);
        queryClient.invalidateQueries({ queryKey: ['lead', editingLead.id] });
        queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
        toast({ title: 'Lead updated', description: 'Changes saved successfully.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to update lead', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!deletingLead) return;
    deleteLead.mutate(deletingLead.id, {
      onSuccess: () => {
        setDeletingLead(null);
        queryClient.invalidateQueries({ queryKey: ['lead', deletingLead.id] });
        queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
        toast({ title: 'Lead deleted', description: 'The lead has been archived.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to delete lead', description: err.message, variant: 'destructive' });
      },
    });
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]" onClick={() => { if (actionMenuId) setActionMenuId(null); }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Leads</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Qualify and nurture new prospects.</p>
        </div>
        {hasPermission('leads.create') && (<button onClick={() => setShowCreate(true)} className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
          <Add size={18} variant="Linear" color="currentColor" /><span>Add Lead</span>
        </button>)}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Leads', i: Profile2User, v: statsLoading ? '—' : totalLeads, s: 'across all stages' },
          { l: 'Qualified Leads', i: DirectUp, v: statsLoading ? '—' : qualified, s: `${qualificationRate}% qualification rate` },
          { l: 'High Priority Leads', i: TrendUp, v: statsLoading ? '—' : hot, s: 'Awaiting immediate follow-up' },
          { l: 'New Leads', i: Flashy, v: statsLoading ? '—' : newLeads, s: 'leads in the New stage' },
        ].map(({ l, i: Icon, v, s }) => (
          <div key={l} className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon size={14} variant="Linear" color="#64748B" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 leading-tight">{v}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Toolbar + Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" />
              <input type="text" placeholder="Search leads..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" />
            </div>
            <div className="relative">
              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
                onFocus={() => setSelectOpen(true)}
                onBlur={() => setSelectOpen(false)}
                className="border border-slate-200 bg-slate-50 rounded-lg text-xs pl-3 pr-10 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              <ArrowDown2
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none transition-transform duration-150 ${selectOpen ? 'rotate-180' : ''}`}
                variant="Linear"
                color="currentColor"
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setMoreOpen(!moreOpen); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <More size={13} variant="Linear" color="currentColor" />More
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onMouseLeave={() => setMoreOpen(false)}>
                  <button onClick={(e) => { e.stopPropagation(); setMoreOpen(false); setShowCreate(true); }} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Add Lead</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-6 py-20 text-center">
            <RefreshCircle className="mx-auto animate-spin text-[#16A34A] mb-4" size={28} variant="Linear" color="currentColor" />
            <p className="text-sm text-slate-500">Loading leads...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <CloseCircle size={24} variant="Bulk" color="#DC2626" />
            </div>
            <h3 className="text-base font-medium text-slate-900">Failed to load leads</h3>
            <p className="text-xs text-slate-500 mt-1">{error instanceof Error ? error.message : 'Could not connect to the server.'}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && items.length > 0 ? (<>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Source</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" title="Lead Score estimates how likely a lead is to become a customer. A higher score indicates stronger potential.">Score</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Stage</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell" title="Represents the urgency of following up this lead.">Priority</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(l => {
                  const priority = TEMP_TO_PRIORITY[l.temperature ?? ''] || 'Medium';
                  const pStyle = PRIORITY_STYLES[priority];
                  const SourceIcon = SOURCE_ICONS[l.source ?? ''] || Global;
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-4 py-3">
                        <Link href={`/leads/${l.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">{initialsFromName(l.name)}</div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">{l.name}</p>
                            <p className="text-[12px] text-slate-400 truncate">{l.company ?? '—'}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <SourceIcon size={13} variant="Linear" color="#94A3B8" />
                          <span className="text-[12px] text-slate-600">{l.source ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${l.score ?? 0}%`, backgroundColor: SCORE_COLOR(l.score ?? 0) }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{l.score ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STAGE_STYLES[l.status] || 'bg-slate-100 text-slate-700'}`}>{l.status}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${pStyle.bg} ${pStyle.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />{priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === l.id ? null : l.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <More size={15} variant="Linear" color="currentColor" />
                        </button>
                        {actionMenuId === l.id && (
                          <div className="absolute right-2 top-full mt-0.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40" onClick={e => e.stopPropagation()}>
                            <Link href={`/leads/${l.id}`} className="block w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50" onClick={closeActionMenu}>View Lead</Link>
                            <button onClick={() => { closeActionMenu(); setEditingLead(l); }} className="block w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Edit Lead</button>
                            <div className="border-t border-slate-100 my-1" />
                            <button onClick={() => { closeActionMenu(); setDeletingLead(l); }} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">{total === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</div>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"><ArrowLeft size={13} variant="Linear" color="currentColor"/></button>
              <div className="flex items-center gap-0.5">{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${p === page ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>))}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"><ArrowRight size={13} variant="Linear" color="currentColor"/></button>
            </div>
          </div>
        </>) : (
          !isLoading && !isError && (
            <div className="px-6 py-16 text-center">
              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><Profile2User size={24} variant="Bulk" color="#CBD5E1"/></div>
              <h3 className="text-base font-medium text-slate-900">No leads found</h3>
              <p className="text-xs text-slate-500 mt-1">{(search || stageFilter) ? 'Try adjusting your search or filters.' : 'Get started by adding your first lead.'}</p>
              {(search || stageFilter) ? <button onClick={() => { setSearch(''); setStageFilter(''); setPage(1); }} className="mt-3 text-sm font-medium text-[#16A34A]">Clear all filters</button> : (hasPermission('leads.create') && <button onClick={() => setShowCreate(true)} className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold inline-flex items-center gap-1.5"><Add size={16} variant="Linear" color="currentColor"/><span>Add Lead</span></button>)}
            </div>
          )
        )}
      </div>

      {/* Create Modal */}
      <LeadFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        title="Add Lead"
        isSubmitting={createLead.isPending}
      />

      {/* Edit Modal */}
      <LeadFormModal
        open={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        initial={editingLead ?? undefined}
        title="Edit Lead"
        isSubmitting={updateLead.isPending}
      />

      {/* Delete Confirmation */}
      {!!deletingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeletingLead(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Lead</h3>
            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to delete <strong>{deletingLead.name}</strong>? This action will archive the lead.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingLead(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLead.isPending} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleteLead.isPending ? <><RefreshCircle className="animate-spin" size={16} /><span>Deleting...</span></> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}