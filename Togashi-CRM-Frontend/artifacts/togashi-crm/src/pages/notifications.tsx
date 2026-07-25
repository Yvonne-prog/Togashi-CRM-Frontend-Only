import { useState } from 'react';
import { useNotifications } from '@/data/notificationData';
import {
  TickCircle,
  ProfileAdd,
  MessageText,
  WalletMoney,
  Video,
  Flag,
} from 'iconsax-react';

const ICONS: Record<string, React.ComponentType<any>> = {
  'n-1': ProfileAdd,
  'n-2': MessageText,
  'n-3': WalletMoney,
  'n-4': Video,
  'n-5': Flag,
};

type Tab = 'all' | 'unread' | 'read';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [tab, setTab] = useState<Tab>('all');

  const filtered = notifications.filter((n) => {
    if (tab === 'unread') return !n.read;
    if (tab === 'read') return n.read;
    return true;
  });

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Notifications</h2>
          <p className="text-slate-500 mt-1">Stay updated on important activity across your CRM.</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-[#16A34A] hover:text-[#15803D] font-medium text-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <TickCircle size={16} variant="Linear" color="currentColor" />
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-[0_2px_8px_rgba(15,23,42,0.03)] w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <TickCircle size={28} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              {tab === 'unread' ? 'No unread notifications' : tab === 'read' ? 'No read notifications' : 'All caught up!'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {tab === 'all' ? 'You have no new notifications.' : 'Try changing your filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((n) => {
              const Icon = ICONS[n.id] || TickCircle;
              return (
                <button
                  key={n.id}
                  onClick={() => { if (!n.read) markAsRead(n.id); }}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50/60 transition-colors flex gap-4 ${
                    !n.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 p-1.5 rounded-full ${!n.read ? 'bg-white' : ''}`}>
                    <Icon size={18} variant="Linear" color={!n.read ? '#3B82F6' : '#94A3B8'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-slate-400 shrink-0 mt-0.5">{n.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.description}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] mt-2 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
