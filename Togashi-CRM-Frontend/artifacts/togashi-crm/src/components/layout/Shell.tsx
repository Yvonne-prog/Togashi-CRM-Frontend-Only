import { ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isDashboard = location === '/';
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-[#F3F8F5] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isDashboard && <Topbar />}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
