import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { projects as mockProjects, projectStats } from '@/data/dashboardMockData';
import type { Project } from '@/data/dashboardMockData';
import { Link } from 'wouter';
import {
  Add, SearchNormal1, Briefcase, Calendar, TickCircle, StatusUp,
  ClipboardTick, Grid1, SliderHorizontal, Sort, ArrowLeft, Timer,
} from 'iconsax-react';

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'On Track': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'At Risk': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Delayed': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'Completed': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const formatUgxShort = (val: number) => {
  if (val >= 1000000) return 'UGX ' + (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (val >= 1000) return 'UGX ' + Math.round(val / 1000) + 'K';
  return 'UGX ' + val;
};

const formatUgx = (val: number) => 'UGX ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

function daysRemaining(dueDate: string): string {
  const due = new Date(dueDate + ', 2026');
  const now = new Date(2026, 6, 22);
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  return `${diff}d remaining`;
}

export default function Projects() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const filtered = mockProjects.filter((p) => {
    const q = search.toLowerCase();
    return (!q || p.name.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q))
      && (!statusFilter || p.status === statusFilter);
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Projects</h2><p className="text-slate-500 mt-0.5 text-sm">Manage deliverables and track implementation progress.</p></div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <button onClick={() => setView('cards')} className={`p-1.5 rounded-md transition-colors ${view === 'cards' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}><Grid1 size={16} variant="Linear" color="currentColor"/></button>
            <button onClick={() => setView('table')} className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}><SliderHorizontal size={16} variant="Linear" color="currentColor"/></button>
          </div>
          {hasPermission('projects.create') && (<button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"><Add size={18} variant="Linear" color="currentColor"/><span>New Project</span></button>)}
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: 'Active Projects', i: ClipboardTick, v: projectStats.activeProjects, c: '#64748B' },
          { l: 'Completed This Month', i: TickCircle, v: projectStats.completedThisMonth, c: '#16A34A' },
          { l: 'Overdue Projects', i: Timer, v: projectStats.overdueProjects, c: '#F59E0B' },
          { l: 'Avg Completion Rate', i: StatusUp, v: `${projectStats.avgCompletionRate}%`, c: '#64748B' },
        ].map(({ l, i: Icon, v, c }) => (
          <div key={l} className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5"><Icon size={14} variant="Linear" color={c}/><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span></div>
            <p className="text-xl font-semibold text-slate-900 leading-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-4 py-3 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48">
            <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor"/>
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"/>
          </div>
          <div className="flex gap-1.5">
            {['On Track', 'At Risk', 'Delayed', 'Completed'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? null : s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Sort size={14} variant="Linear" color="currentColor"/>Sort</button>
        </div>
      </div>

      {/* Cards View */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><Briefcase size={24} variant="Bulk" color="#CBD5E1"/></div>
              <h3 className="text-base font-medium text-slate-900">No projects found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filtered.map((project) => {
              const statusStyle = STATUS_STYLES[project.status];
              return (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow flex flex-col cursor-pointer" onClick={() => setDetailProject(project)}>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        <div className={`w-1 h-1 rounded-full ${statusStyle.dot}`}/>{project.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{project.budget > 0 ? formatUgxShort(project.budget) : '—'}</span>
                    </div>

                    <h3 className="font-semibold text-base text-slate-900 leading-snug mb-1">{project.name}</h3>
                    <p className="text-[13px] text-slate-500 mb-3">{project.companyName}</p>

                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${project.progress}%` }}/>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-9 text-right">{project.progress}%</span>
                    </div>

                    <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={12} variant="Linear" color="#94A3B8"/>
                        <span>Due {project.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center"><div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><Briefcase size={24} variant="Bulk" color="#CBD5E1"/></div><h3 className="text-base font-medium text-slate-900">No projects found</h3><p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Budget</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Due</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((project) => {
                    const statusStyle = STATUS_STYLES[project.status];
                    return (
                      <tr key={project.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => setDetailProject(project)}>
                        <td className="px-5 py-3.5">
                          <div><p className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{project.name}</p><p className="text-[12px] text-slate-400">{project.companyName}</p></div>
                        </td>
                        <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}><div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}/>{project.status}</span></td>
                        <td className="px-5 py-3.5"><div className="flex items-center gap-1.5"><div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${project.progress}%` }}/></div><span className="text-[11px] font-semibold text-slate-700">{project.progress}%</span></div></td>
                        <td className="px-5 py-3.5 hidden lg:table-cell text-xs font-medium text-slate-700">{project.budget > 0 ? formatUgxShort(project.budget) : '—'}</td>
                        <td className="px-5 py-3.5 text-[12px] text-slate-500">Due {project.dueDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Slide-in Panel */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailProject(null)}>
          <div className="absolute inset-0 bg-black/20"/>
          <div className="relative w-full sm:max-w-lg bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <button onClick={() => setDetailProject(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} variant="Linear" color="currentColor"/></button>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATUS_STYLES[detailProject.status].bg} ${STATUS_STYLES[detailProject.status].text}`}><div className={`w-1 h-1 rounded-full ${STATUS_STYLES[detailProject.status].dot}`}/>{detailProject.status}</span>
            </div>
            <div className="px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">{detailProject.name}</h2>
              <p className="text-sm text-slate-500 mb-5">{detailProject.companyName}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Budget</p><p className="text-base font-bold text-slate-900">{formatUgx(detailProject.budget)}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Timeline</p><div className="flex items-center gap-1.5 text-sm text-slate-700"><Calendar size={14} variant="Linear" color="#94A3B8"/>{detailProject.startDate} — {detailProject.dueDate}</div></div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <div className="flex justify-between items-center mb-1"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Progress</p><span className="text-xs font-bold text-slate-700">{detailProject.progress}%</span></div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${detailProject.progress === 100 ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${detailProject.progress}%` }}/></div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Milestones</p>
                  <div className="space-y-2">
                    {detailProject.milestones.map((m, i) => (
                      <div key={m.label} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${m.completed ? 'bg-emerald-500 text-white' : m.current ? 'bg-slate-700 text-white ring-2 ring-slate-200' : 'bg-slate-100 text-slate-400'}`}>{m.completed ? '\u2713' : '\u25CB'}</div>
                        <span className={`text-sm ${m.completed ? 'text-emerald-700 font-medium' : m.current ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>{m.label}</span>
                        {i < detailProject.milestones.length - 1 && <div className="w-px h-4 bg-slate-200 ml-2"/>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex gap-1 mb-3">{['Overview','Tasks','Timeline','Files','Notes'].map(t => (<button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">{t}</button>))}</div>
                  <div className="text-center py-8"><p className="text-[11px] text-slate-400">Select a tab to view details</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
