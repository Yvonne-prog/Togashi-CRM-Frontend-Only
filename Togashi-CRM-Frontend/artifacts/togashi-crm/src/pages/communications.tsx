import { useListConversations } from '@workspace/api-client-react';
import { SearchNormal1, Edit2, Call, Sms, MessageText, More } from 'iconsax-react';
import { format } from 'date-fns';

export default function Communications() {
  const { data } = useListConversations();

  return (
    <div className="flex h-[calc(100vh-64px)] -m-6 bg-white">
      {/* Sidebar List */}
      <div className="w-[360px] border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Inbox</h2>
            <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors">
              <Edit2 size={18} variant="Linear" color="currentColor" />
            </button>
          </div>
          <div className="relative">
            <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} variant="Linear" color="currentColor" />
            <input 
              type="text"
              placeholder="Search messages..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {data?.data.map((conv) => (
            <div key={conv.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors relative">
              {conv.unreadCount! > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16A34A]" />}
              <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold text-sm truncate pr-2 ${conv.unreadCount! > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                  {conv.contactName || conv.companyName || 'Unknown Contact'}
                </span>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'MMM d') : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                {conv.channel === 'Email' ? <Sms size={12} className="text-slate-400" variant="Linear" color="currentColor" /> :
                 conv.channel === 'WhatsApp' ? <MessageText size={12} className="text-green-500" variant="Linear" color="currentColor" /> :
                 <Call size={12} className="text-slate-400" variant="Linear" color="currentColor" />}
                <span className="text-xs font-medium text-slate-900 truncate">{conv.subject}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{conv.lastMessagePreview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Conversation Area - Empty State */}
      <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4">
          <MessageText size={32} variant="Linear" color="currentColor" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No message selected</h3>
        <p className="text-slate-500 max-w-sm">Choose a conversation from the list to view the thread and reply, or start a new message.</p>
        <button className="mt-6 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          New Message
        </button>
      </div>
    </div>
  );
}
