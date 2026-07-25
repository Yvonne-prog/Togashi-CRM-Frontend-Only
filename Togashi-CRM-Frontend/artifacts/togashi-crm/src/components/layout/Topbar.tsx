import { useLocation, Link, useRouter } from 'wouter';
import { SearchNormal1, Notification, ArrowRight, Clock } from 'iconsax-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNotifications } from '@/data/notificationData';
import { searchAll, type SearchResult } from '@/lib/search';

const TYPE_COLORS: Record<string, string> = {
  Contacts: '#3B82F6',
  Companies: '#F59E0B',
  Leads: '#8B5CF6',
  Deals: '#10B981',
  Projects: '#6366F1',
  Tasks: '#F97316',
  Calendar: '#EC4899',
  Notifications: '#94A3B8',
};

export function Topbar() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications } = useNotifications();
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const debouncedQuery = useDebounce(searchQuery, 200);

  const sections = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchAll(debouncedQuery);
  }, [debouncedQuery]);

  const allResults: (SearchResult & { sectionType: string })[] = useMemo(() => {
    const flat: (SearchResult & { sectionType: string })[] = [];
    sections.forEach((s) => {
      s.results.forEach((r) => {
        flat.push({ ...r, sectionType: s.type });
      });
      if (s.results.length >= 3) {
        flat.push({
          id: `see-all-${s.type}`,
          type: 'see-all',
          typeLabel: s.typeLabel,
          title: `See all ${s.typeLabel} →`,
          subtitle: '',
          url: getSeeAllUrl(s.type),
          sectionType: s.type,
        });
      }
    });
    return flat;
  }, [sections]);

  const isShowing = panelOpen && (debouncedQuery.trim() ? sections.length > 0 || searchQuery.trim() : recentSearches.length > 0);

  const addRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 5);
    });
  };

  const handleSelect = (result: SearchResult) => {
    addRecent(searchQuery);
    setPanelOpen(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    router.push(result.url);
  };

  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    setSelectedIndex(-1);
    if (val.trim()) {
      setPanelOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!panelOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allResults.length) {
        const selected = allResults[selectedIndex];
        if (selected.type !== 'see-all') {
          handleSelect(selected);
        }
      } else if (debouncedQuery.trim() && sections.length > 0 && sections[0].results.length > 0) {
        handleSelect(sections[0].results[0]);
      }
    } else if (e.key === 'Escape') {
      setPanelOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setPanelOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPanelOpen(false); inputRef.current?.blur(); }
    };
    if (panelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [panelOpen]);

  let pageTitle = 'Dashboard';
  if (location.startsWith('/contacts')) pageTitle = 'Contacts';
  else if (location.startsWith('/companies')) pageTitle = 'Companies';
  else if (location.startsWith('/leads')) pageTitle = 'Leads';
  else if (location.startsWith('/deals')) pageTitle = 'Deals';
  else if (location.startsWith('/projects')) pageTitle = 'Projects';
  else if (location.startsWith('/tasks')) pageTitle = 'Tasks';
  else if (location.startsWith('/calendar')) pageTitle = 'Calendar';
  else if (location.startsWith('/documents')) pageTitle = 'Documents';
  else if (location.startsWith('/communications')) pageTitle = 'Communications';
  else if (location.startsWith('/reports')) pageTitle = 'Reports';
  else if (location.startsWith('/notifications')) pageTitle = 'Notifications';
  else if (location.startsWith('/settings')) pageTitle = 'Settings';

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 z-10">
      <h1 className="font-semibold text-slate-900 tracking-tight" style={{ fontSize: '24px' }}>{pageTitle}</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-64 md:w-80">
          <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} variant="Linear" color="currentColor" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => { if (!searchQuery.trim() && recentSearches.length > 0) setPanelOpen(true); }}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />

          {/* Search Panel */}
          {isShowing && (
            <div
              ref={panelRef}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden z-50 max-h-[480px] overflow-y-auto"
            >
              {/* Recent Searches */}
              {!debouncedQuery.trim() && recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => { setSearchQuery(s); addRecent(s); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-sm ${
                        i === selectedIndex ? 'bg-slate-50' : ''
                      }`}
                    >
                      <Clock size={16} variant="Linear" color="#94A3B8" />
                      <span className="text-slate-700">{s}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {debouncedQuery.trim() && sections.length > 0 && (
                <div>
                  {sections.map((section) => (
                    <div key={section.type}>
                      <div className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2"
                        style={{ color: TYPE_COLORS[section.typeLabel] || '#94A3B8' }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: TYPE_COLORS[section.typeLabel] || '#94A3B8' }} />
                        {section.typeLabel}
                      </div>
                      {section.results.map((result, i) => {
                        const globalIndex = allResults.findIndex((r) => r.id === result.id && r.type === result.type);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                              isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {highlightMatch(result.title, debouncedQuery)}
                              </p>
                              {result.subtitle && (
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{result.subtitle}</p>
                              )}
                            </div>
                            <ArrowRight size={14} variant="Linear" color="#CBD5E1" className="shrink-0" />
                          </button>
                        );
                      })}
                      {section.results.length >= 3 && (
                        <Link
                          href={getSeeAllUrl(section.type)}
                          onClick={() => { setPanelOpen(false); setSearchQuery(''); addRecent(searchQuery); }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#16A34A] hover:bg-slate-50 transition-colors"
                        >
                          See all {section.typeLabel} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {debouncedQuery.trim() && sections.length === 0 && (
                <div className="py-10 text-center px-4">
                  <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    <SearchNormal1 size={20} variant="Linear" color="#CBD5E1" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No results found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching by contact name, company, deal, project or task.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <Link
            href="/notifications"
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Notification size={20} variant="Linear" color="currentColor" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function getSeeAllUrl(type: string): string {
  const map: Record<string, string> = {
    contact: '/contacts',
    company: '/companies',
    lead: '/leads',
    deal: '/deals',
    project: '/projects',
    task: '/tasks',
    event: '/calendar',
    notification: '/notifications',
  };
  return map[type] || '/';
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ backgroundColor: '#FEF08A', color: '#0F172A' }}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}
