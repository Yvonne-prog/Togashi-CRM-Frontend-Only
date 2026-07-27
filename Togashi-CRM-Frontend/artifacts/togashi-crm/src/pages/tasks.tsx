import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { taskList, taskStats } from '@/data/dashboardMockData';
import type { Task } from '@/data/dashboardMockData';
import { Link } from 'wouter';
import { TickCircle, Timer, Warning2, SearchNormal1, Sort, More, Add, StatusUp, MessageText, Edit2 } from 'iconsax-react';

const PRIORITY_STYLES: Record<string, string> = { High: 'bg-amber-50 text-amber-700', Medium: 'bg-blue-50 text-blue-700', Low: 'bg-slate-100 text-slate-500' };
const STATUS_STYLES: Record<string, string> = { 'Not Started': 'bg-slate-100 text-slate-600', 'In Progress': 'bg-blue-50 text-blue-700', Review: 'bg-purple-50 text-purple-700', Completed: 'bg-emerald-50 text-emerald-700', Blocked: 'bg-red-50 text-red-700', Overdue: 'bg-red-50 text-red-700' };

export default function Tasks() {
  const { hasPermission } = useAuth();
  const [tab, setTab] = useState<'my' | 'assigned' | 'completed' | 'overdue'>('my');
  const [search, setSearch] = useState(''); const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(taskList); const [moreOpen, setMoreOpen] = useState(false);
  const projects = [...new Set(taskList.map(t => t.project))];
  const myName = 'Alex Mugisha';

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    let m = !q || t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
    if (priorityFilter && t.priority !== priorityFilter) m = false;
    if (projectFilter && t.project !== projectFilter) m = false;
    if (tab === 'my' && (t.assignee !== myName || t.completed)) m = false;
    else if (tab === 'assigned' && t.completed) m = false;
    else if (tab === 'completed' && !t.completed) m = false;
    else if (tab === 'overdue' && t.status !== 'Overdue' && t.status !== 'Blocked') m = false;
    return m;
  });

  const toggleComplete = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'Completed' as const : 'In Progress' as const } : t));

  const TABS: { key: typeof tab; label: string }[] = [{ key: 'my', label: 'My Tasks' }, { key: 'assigned', label: 'Assigned' }, { key: 'completed', label: 'Completed' }, { key: 'overdue', label: 'Overdue' }];

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Tasks</h2><p className="text-slate-500 mt-1 text-sm">Track and manage your workflow.</p></div>
        {hasPermission('tasks.create') && (<button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"><Add size={18} variant="Linear" color="currentColor"/><span>Add Task</span></button>)}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: 'My Tasks', i: StatusUp, v: taskStats.myTasks, c: '#64748B' }, { l: 'Due Today', i: Timer, v: taskStats.dueToday, c: '#F59E0B' }, { l: 'Overdue', i: Warning2, v: taskStats.overdue, c: '#DC2626' }, { l: 'Completed', i: TickCircle, v: taskStats.completed, c: '#16A34A' }].map(({ l, i: Icon, v, c }) => (
          <div key={l} className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"><div className="flex items-center gap-1.5 mb-1"><Icon size={15} variant="Linear" color={c}/><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span></div><p className="text-xl font-semibold text-slate-900">{v}</p></div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="border-b border-slate-100 flex bg-slate-50/50">
          {TABS.map(t => (<button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? (t.key === 'overdue' ? 'text-red-600 border-red-600 bg-white' : 'text-[#16A34A] border-[#16A34A] bg-white') : 'text-slate-500 border-transparent hover:text-slate-900'}`}>{t.label}</button>))}
        </div>
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-56"><SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor"/><input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"/></div>
            <div className="flex gap-1.5">{['High', 'Medium', 'Low'].map(p => (<button key={p} onClick={() => setPriorityFilter(priorityFilter === p ? null : p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${priorityFilter === p ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{p}</button>))}</div>
          </div>
          <div className="flex items-center gap-2">
            <select value={projectFilter || ''} onChange={e => setProjectFilter(e.target.value || null)} className="border border-slate-200 bg-slate-50 rounded-lg text-xs px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"><option value="">All Projects</option>{projects.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <div className="relative"><button onClick={() => setMoreOpen(!moreOpen)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"><Sort size={14} variant="Linear" color="currentColor"/>Sort</button></div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center"><div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><TickCircle size={24} variant="Bulk" color="#CBD5E1"/></div><h3 className="text-base font-medium text-slate-900">No tasks found</h3><p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search.</p></div>
          ) : (
            filtered.map(task => (
              <div key={task.id} className={`px-5 py-3.5 flex items-start gap-4 hover:bg-slate-50/60 transition-colors group ${task.completed ? 'opacity-60' : ''}`}>
                <button onClick={() => toggleComplete(task.id)} className="mt-0.5 shrink-0"><TickCircle size={18} variant={task.completed ? 'Bold' : 'Linear'} color={task.completed ? '#16A34A' : '#CBD5E1'}/></button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link href={`/tasks/${task.id}`} className={`text-[14px] font-medium hover:text-[#16A34A] transition-colors ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</Link>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[task.status]}`}>{task.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-slate-500">
                    <span className="flex items-center gap-1"><TickCircle size={10} variant="Linear" color="#94A3B8"/>{task.project}</span>
                    <span>{task.assignee}</span>
                    {task.dueDate && <span className={`flex items-center gap-1 ${task.status === 'Overdue' || task.status === 'Blocked' ? 'text-red-600 font-medium' : ''}`}>{(task.status === 'Overdue' || task.status === 'Blocked') ? <Warning2 size={10} variant="Linear" color="currentColor"/> : <Timer size={10} variant="Linear" color="currentColor"/>}{task.dueDate}</span>}
                    <span className="text-slate-400">{task.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!task.completed && <button onClick={() => toggleComplete(task.id)} className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="Complete"><TickCircle size={14} variant="Linear" color="currentColor"/></button>}
                  <Link href={`/tasks/${task.id}`} className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Edit"><Edit2 size={14} variant="Linear" color="currentColor"/></Link>
                  <button className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50" title="Comment"><MessageText size={14} variant="Linear" color="currentColor"/></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
