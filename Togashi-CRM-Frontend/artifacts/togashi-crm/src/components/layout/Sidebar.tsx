import { Link, useLocation } from 'wouter';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLogout } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';
import {
  Category, Profile2User, Building, ProfileAdd, ReceiptItem,
  Note, TaskSquare, Task, Calendar, DocumentText, MessageText,
  Chart, Setting2, ArrowLeft2, ArrowRight2, Logout,
  ArrowDown2, User,
} from 'iconsax-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Category },
  { href: '/contacts', label: 'Contacts', icon: Profile2User },
  { href: '/companies', label: 'Companies', icon: Building },
  { href: '/leads', label: 'Leads', icon: ProfileAdd },
  { href: '/deals', label: 'Deals', icon: ReceiptItem },
  { href: '/quotations', label: 'Quotations', icon: Note },
  { href: '/projects', label: 'Projects', icon: TaskSquare },
  { href: '/tasks', label: 'Tasks', icon: Task },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/documents', label: 'Documents', icon: DocumentText },
  { href: '/communications', label: 'Communications', icon: MessageText },
  { href: '/reports', label: 'Reports', icon: Chart },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout.mutate(undefined, {
      onSuccess: () => { window.location.href = '/login'; }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <aside
      className={cn(
        "bg-[#0F172A] text-white flex flex-col transition-all duration-300 relative shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-center px-4 border-b border-[#1E293B] shrink-0">
        {!collapsed && (
          <div className="flex items-center font-bold text-xl tracking-tight">
            <span>TOGASHI</span>
            <span className="text-[#16A34A] ml-1">CRM</span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center font-bold text-[#16A34A] text-xl">T</div>
        )}
      </div>
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 z-50 h-7 w-7 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors shadow-md"
      >
        {collapsed ? <ArrowRight2 size={18} variant="Linear" color="currentColor" /> : <ArrowLeft2 size={18} variant="Linear" color="currentColor" />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative group",
                isActive
                  ? "bg-[#1E293B] text-[#16A34A]"
                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16A34A] rounded-r-sm" />
              )}
              <Icon size={20} variant="Linear" color="currentColor" className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile with Dropdown */}
      <div className="relative shrink-0 border-t border-[#1E293B]">
        {/* Profile trigger */}
        <button
          ref={triggerRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "w-full p-4 flex items-center transition-colors",
            collapsed ? "justify-center" : "justify-between",
            menuOpen ? "bg-[#1E293B]" : "hover:bg-[#1E293B]/70"
          )}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="h-10 w-10 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center text-sm font-bold text-[#16A34A] shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start truncate">
                <span className="text-sm font-medium text-white truncate">{user?.name || 'User'}</span>
                <span className="text-xs text-slate-400 truncate">{user?.role}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ArrowDown2
              size={16}
              variant="Linear"
              color="currentColor"
              className={cn(
                "text-slate-400 shrink-0 transition-transform duration-200",
                menuOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {/* Expanded-only logout for collapsed state */}
        {collapsed && (
          <button onClick={handleLogout}
            className="mt-0 w-full flex justify-center text-slate-400 hover:text-white p-2 rounded-xl hover:bg-[#1E293B] transition-colors mb-3"
            title="Logout">
            <Logout size={18} variant="Linear" color="currentColor" />
          </button>
        )}

        {/* Dropdown Menu */}
        {menuOpen && !collapsed && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] overflow-hidden transition-all duration-200 ease-out origin-bottom z-50"
          >
            <div className="py-1.5">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User size={17} variant="Linear" color="#64748B" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Setting2 size={17} variant="Linear" color="#64748B" />
                <span>Settings</span>
              </Link>
            </div>
            <div className="border-t border-slate-100" />
            <div className="py-1.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Logout size={17} variant="Linear" color="#DC2626" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
