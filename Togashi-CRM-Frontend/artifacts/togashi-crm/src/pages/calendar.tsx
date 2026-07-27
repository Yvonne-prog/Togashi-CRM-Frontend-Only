import { useState, useMemo } from 'react';
import { calendarEvents } from '@/data/dashboardMockData';
import type { CalendarEvent } from '@/data/dashboardMockData';
import {
  addDays, startOfWeek, endOfWeek, format, isSameDay, isToday,
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
} from 'date-fns';
import {
  ArrowLeft, ArrowRight, Add, Calendar as CalendarIcon, Video, Location, Clock, CloseSquare,
} from 'iconsax-react';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
const HOUR_HEIGHT = 72;
type ViewMode = 'month' | 'week' | 'day' | 'agenda';

const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  Meeting: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Project: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Deal: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Task: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Deadline: { bg: 'bg-red-50', text: 'text-red-700' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function computeDayLayout(dayEvents: CalendarEvent[]) {
  if (dayEvents.length === 0) return [];
  const sorted = [...dayEvents].sort((a, b) => parseInt(a.time) - parseInt(b.time));
  const groups: CalendarEvent[][] = [];
  sorted.forEach((event) => {
    const h = parseInt(event.time.split(':')[0]);
    let placed = false;
    for (const col of groups) {
      const last = col[col.length - 1];
      if (h >= parseInt(last.time.split(':')[0]) + 1) { col.push(event); placed = true; break; }
    }
    if (!placed) groups.push([event]);
  });
  return sorted.map((event) => {
    const colIndex = groups.findIndex((g) => g.includes(event));
    return { event, totalCols: groups.length, colIndex };
  });
}

function isWeekend(date: Date): boolean {
  const d = getDay(date);
  return d === 0 || d === 6;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 22));
  const [view, setView] = useState<ViewMode>('month');
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [agendaOpen, setAgendaOpen] = useState(true);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;

  const navigate = (dir: -1 | 1) => {
    if (view === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
    else if (view === 'week') setCurrentDate((d) => addDays(d, dir * 7));
    else if (view === 'day') setCurrentDate((d) => addDays(d, dir));
  };

  const goToday = () => setCurrentDate(new Date(2026, 6, 22));
  const getEventsForDay = (date: Date) => calendarEvents.filter((e) => isSameDay(new Date(e.date), date));
  const todayEvents = getEventsForDay(new Date(2026, 6, 22));
  const displayDays = view === 'week' ? weekDays : view === 'day' ? [currentDate] : weekDays;
  const currentHour = new Date().getHours();

  const headerLabel = useMemo(() => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
    if (view === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    return 'Agenda';
  }, [view, currentDate, weekStart, weekEnd]);

  return (
    <div className="h-[calc(100vh-64px)] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 flex flex-col bg-[#F7F7F5] overflow-auto">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
            <button onClick={() => navigate(-1)} className="px-2.5 py-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200">
              <ArrowLeft size={14} variant="Linear" color="currentColor" />
            </button>
            <button onClick={goToday} className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200">Today</button>
            <button onClick={() => navigate(1)} className="px-2.5 py-2 hover:bg-slate-50 text-slate-600 transition-colors">
              <ArrowRight size={14} variant="Linear" color="currentColor" />
            </button>
          </div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">{headerLabel}</h2>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex-1 sm:flex-initial">
            {(['month', 'week', 'day', 'agenda'] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${view === v ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{v}</button>
            ))}
          </div>
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-9 sm:h-9 px-4 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"><Add size={16} variant="Linear" color="currentColor"/><span className="hidden sm:inline">New Event</span><span className="sm:hidden">+</span></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0">
        {/* Calendar Grid */}
        <div className={`flex-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col min-w-0 transition-all ${agendaOpen ? '' : 'lg:flex-initial'}`}>
          {(view === 'week' || view === 'day') && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex border-b border-slate-200 shrink-0">
                <div className="w-12 shrink-0 border-r border-slate-200" />
                {displayDays.map((day) => {
                  const today = isToday(day);
                  const weekend = isWeekend(day);
                  return (
                    <div key={day.toISOString()} className={`flex-1 text-center py-2.5 border-r border-slate-200 last:border-r-0 ${today ? 'bg-blue-50/40' : weekend ? 'bg-slate-50/60' : ''}`}>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{format(day, 'EEE')}</div>
                      <div className={`text-[15px] font-bold mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full ${today ? 'bg-[#16A34A] text-white' : 'text-slate-800'}`}>{format(day, 'd')}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1" style={{ minHeight: `${HOURS.length * HOUR_HEIGHT}px` }}>
                <div className="flex">
                  <div className="w-12 shrink-0 border-r border-slate-200">
                    {HOURS.map((h) => (
                      <div key={h} className="flex items-start justify-end pr-1.5" style={{ height: `${HOUR_HEIGHT}px` }}>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</span>
                      </div>
                    ))}
                  </div>
                  {displayDays.map((day) => {
                    const layout = computeDayLayout(getEventsForDay(day));
                    const today = isToday(day);
                    const weekend = isWeekend(day);
                    return (
                      <div key={day.toISOString()} className={`flex-1 relative border-r border-slate-200 last:border-r-0 ${today ? 'bg-blue-50/20' : weekend ? 'bg-slate-50/40' : ''}`}>
                        {HOURS.map((h) => (
                          <div key={h} className="border-b border-slate-100" style={{ height: `${HOUR_HEIGHT}px` }} />
                        ))}
                        {today && currentHour >= 8 && currentHour < 19 && (
                          <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: `${(currentHour - 8) * HOUR_HEIGHT + (new Date().getMinutes() / 60) * HOUR_HEIGHT}px` }}>
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 -ml-0.5" />
                              <div className="flex-1 h-px bg-red-500" />
                            </div>
                          </div>
                        )}
                        {layout.map(({ event, totalCols, colIndex }) => {
                          const h = parseInt(event.time.split(':')[0]);
                          const top = (h - 8) * HOUR_HEIGHT + 4;
                          const width = totalCols > 1 ? `calc(${100 / totalCols}% - 6px)` : 'calc(100% - 6px)';
                          const left = totalCols > 1 ? `${colIndex * (100 / totalCols) + 1.5}%` : '3px';
                          return (
                            <div key={event.id} className="absolute rounded-lg px-2 py-1.5 text-xs cursor-pointer hover:shadow-md transition-shadow border overflow-hidden z-10"
                              style={{ top: `${top}px`, left, width, minHeight: '52px', backgroundColor: event.color + '15', borderColor: event.color + '45' }}
                              onClick={(e) => { e.stopPropagation(); setDetailEvent(event); }}
                            >
                              <p className="text-[11px] font-semibold text-slate-500">{event.time}</p>
                              <p className="text-xs font-medium text-slate-800 leading-snug mt-0.5 line-clamp-2">{event.title}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {view === 'month' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="grid grid-cols-7 border-b border-slate-200 shrink-0">
                {DAYS.map((d) => (
                  <div key={d} className="text-center py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">{d}</div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 auto-rows-fr" style={{ minHeight: '500px' }}>
                {Array.from({ length: startPadding }).map((_, i) => (
                  <div key={`pad-${i}`} className="border-r border-b border-slate-100 bg-slate-50/40 p-1.5" />
                ))}
                {monthDays.map((day) => {
                  const today = isToday(day);
                  const weekend = isWeekend(day);
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div key={day.toISOString()} className={`border-r border-b border-slate-100 p-1.5 overflow-hidden ${today ? 'bg-blue-50/40' : weekend ? 'bg-slate-50/40' : ''}`}>
                      <div className={`text-xs font-semibold mb-1 ${today ? 'bg-[#16A34A] text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>{format(day, 'd')}</div>
                      <div className="space-y-0.5">{dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="truncate text-[11px] font-medium px-1.5 py-0.5 rounded cursor-pointer" style={{ backgroundColor: event.color + '20', color: event.color }} onClick={() => setDetailEvent(event)}>{event.time} {event.title}</div>
                      ))}{dayEvents.length > 3 && <div className="text-[11px] text-slate-400 px-1.5">+{dayEvents.length - 3} more</div>}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'agenda' && (
            <div className="flex-1 divide-y divide-slate-100" style={{ minHeight: '500px' }}>
              {calendarEvents.map((event) => (
                <div key={event.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-start gap-4 cursor-pointer" onClick={() => setDetailEvent(event)}>
                  <div className="w-12 shrink-0 text-right"><div className="text-sm font-semibold text-slate-900">{event.time}</div><div className="text-[11px] text-slate-400 mt-0.5">{format(new Date(event.date), 'MMM d')}</div></div>
                  <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900">{event.title}</p><p className="text-xs text-slate-500 mt-0.5">{event.relatedEntity}{event.location ? ` · ${event.location}` : ''}</p></div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 ${(EVENT_COLORS[event.type] || EVENT_COLORS.Meeting).bg} ${(EVENT_COLORS[event.type] || EVENT_COLORS.Meeting).text}`}>{event.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Agenda Panel - overlay on mobile */}
        <div className={`${agendaOpen ? 'fixed sm:relative sm:flex inset-0 z-40 sm:z-auto bg-white sm:bg-transparent p-4 sm:p-0' : ''} lg:w-72 xl:w-80 shrink-0 flex flex-col transition-all`}>
          {agendaOpen && <div className="sm:hidden flex items-center justify-between mb-4"><h3 className="text-base font-semibold text-slate-900">Today's Agenda</h3><button onClick={() => setAgendaOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><CloseSquare size={18} variant="Linear" color="currentColor" /></button></div>}
          {!agendaOpen && (
            <button onClick={() => setAgendaOpen(true)} className="sm:hidden fixed bottom-6 right-4 z-30 bg-[#16A34A] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              <CalendarIcon size={22} variant="Linear" color="currentColor" />
            </button>
          )}
          {agendaOpen && (
          <div className="sm:bg-white sm:rounded-2xl sm:shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-0 sm:p-5 flex flex-col flex-1 overflow-hidden transition-all">
          <div className="hidden sm:flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-base font-semibold text-slate-900">Today's Agenda</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">{todayEvents.length}</span>
              <button onClick={() => setAgendaOpen(!agendaOpen)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors hidden lg:block">
                {<ArrowRight size={16} variant="Linear" color="currentColor" />}
              </button>
            </div>
          </div>
            <div className="space-y-3 overflow-y-auto flex-1">
              {todayEvents.length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarIcon size={24} variant="Bulk" color="#CBD5E1" className="mx-auto mb-2"/>
                  <p className="text-sm text-slate-400">No events today</p>
                </div>
              ) : (
                todayEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 cursor-pointer group" onClick={() => setDetailEvent(event)}>
                    <div className="w-1 shrink-0 rounded-full" style={{ backgroundColor: event.color }}/>
                    <div className="flex-1 min-w-0 pb-3 border-b border-slate-50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={12} variant="Linear" color="#94A3B8"/>
                        <span className="text-xs font-semibold text-slate-500">{event.time}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-snug group-hover:text-[#16A34A] transition-colors">{event.title}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 flex-wrap">
                        {event.location && (
                          <span className="flex items-center gap-0.5">
                            {event.location.includes('Online') || event.location.includes('Meet') ? <Video size={11} variant="Linear" color="currentColor"/> : <Location size={11} variant="Linear" color="currentColor"/>}
                            {event.location}
                          </span>
                        )}
                        {event.relatedEntity && <span>{event.relatedEntity}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Event Detail Drawer */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailEvent(null)}>
          <div className="absolute inset-0 bg-black/20"/>
          <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-semibold text-slate-900">Event Details</h3>
              <button onClick={() => setDetailEvent(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><CloseSquare size={18} variant="Linear" color="currentColor"/></button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: detailEvent.color }}/>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${(EVENT_COLORS[detailEvent.type] || EVENT_COLORS.Meeting).bg} ${(EVENT_COLORS[detailEvent.type] || EVENT_COLORS.Meeting).text}`}>{detailEvent.type}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{detailEvent.title}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm"><Clock size={16} variant="Linear" color="#94A3B8"/><span className="text-slate-700">{detailEvent.date} at {detailEvent.time}</span></div>
                {detailEvent.location && <div className="flex items-center gap-3 text-sm">{(detailEvent.location.includes('Online') || detailEvent.location.includes('Meet')) ? <Video size={16} variant="Linear" color="#94A3B8"/> : <Location size={16} variant="Linear" color="#94A3B8"/>}<span className="text-slate-700">{detailEvent.location}</span></div>}
                {detailEvent.relatedEntity && <div className="flex items-center gap-3 text-sm"><CalendarIcon size={16} variant="Linear" color="#94A3B8"/><span className="text-slate-700">{detailEvent.relatedEntity}</span></div>}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Actions</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                  <button className="flex-1 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-xs text-slate-500">No notes for this event.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
