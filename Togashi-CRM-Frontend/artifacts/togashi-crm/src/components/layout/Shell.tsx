import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { HambergerMenu } from 'iconsax-react';

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isDashboard = location === '/';
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location]);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-[#F3F8F5] overflow-hidden">
      {!isMobile && <Sidebar mobileOpen={false} onMobileClose={() => {}} />}
      {isMobile && <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header bar */}
        {isMobile && (
          <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0 z-10">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <HambergerMenu size={22} variant="Linear" color="currentColor" />
            </button>
            <h1 className="font-semibold text-slate-900 text-lg truncate">
              TOGASHI<span className="text-[#16A34A]">CRM</span>
            </h1>
          </header>
        )}
        {!isMobile && isDashboard && <Topbar />}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
