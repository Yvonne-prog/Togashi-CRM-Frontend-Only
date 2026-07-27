import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import {
  SearchNormal1, MessageText, Sms, Call, ArrowLeft, More,
  Paperclip2, EmojiHappy, Send, CloseSquare,
  Profile2User, Briefcase, TaskSquare, ReceiptText,
  DocumentText, Calendar, TickCircle, NoteAdd, Edit2,
} from 'iconsax-react';

const CHANNEL_ICONS: Record<string, { icon: typeof Sms; color: string }> = {
  Email: { icon: Sms, color: '#3B82F6' },
  WhatsApp: { icon: MessageText, color: '#16A34A' },
  Call: { icon: Call, color: '#8B5CF6' },
};

interface Message {
  id: string;
  type: 'incoming' | 'outgoing' | 'system';
  content: string;
  time: string;
  date: string;
  sender?: string;
  attachments?: { type: 'quotation' | 'invoice' | 'receipt' | 'file' | 'image'; label: string; ref: string }[];
}

interface Conversation {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  avatarBg: string;
  channel: 'Email' | 'WhatsApp' | 'Call';
  unread: number;
  lastPreview: string;
  lastTime: string;
  lastDate: string;
  online: boolean;
  messages: Message[];
  deal?: string;
  dealId?: string;
  project?: string;
  projectId?: string;
  quotation?: string;
  quotationId?: string;
  invoice?: string;
  invoiceId?: string;
  outstandingBalance?: number;
  paymentStatus?: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contactName: 'Grace Namugenyi',
    companyName: 'Katrina Fashion Finds',
    email: 'grace.nam@email.com',
    phone: '+256 774 500 600',
    avatarBg: '#8B5CF6',
    channel: 'Email',
    unread: 2,
    lastPreview: 'Please revise the quotation to include the e-commerce module with payment gateway integration.',
    lastTime: '10:42 AM',
    lastDate: 'Jul 27, 2026',
    online: true,
    deal: 'Katrina Fashion Website',
    dealId: 'dl-1',
    project: 'Katrina Fashion Website',
    projectId: 'pr-2',
    quotation: 'TGL-QTN-2026-001',
    quotationId: 'qtn-1',
    invoice: 'TGL-INV-2026-001',
    invoiceId: 'inv-1',
    outstandingBalance: 9000000,
    paymentStatus: 'Paid',
    messages: [
      { id: 'm1', type: 'incoming', content: 'Hi Alex, can you please revise the quotation to include the e-commerce module with payment gateway integration? We discussed this during our last meeting.', time: '09:15 AM', date: 'Jul 27, 2026', sender: 'Grace Namugenyi' },
      { id: 'm2', type: 'outgoing', content: 'Good morning Grace! Absolutely, I\'ll update the quotation today. The e-commerce module with payment gateway will be added at UGX 5,000,000. I\'ll have the revised version to you by 2 PM.', time: '09:30 AM', date: 'Jul 27, 2026', sender: 'Alex Mugisha' },
      { id: 'm3', type: 'system', content: 'Quotation TGL-QTN-2026-001 was accepted', time: '09:35 AM', date: 'Jul 27, 2026' },
      { id: 'm4', type: 'incoming', content: 'Perfect, thank you Alex! Looking forward to seeing the updated proposal.', time: '09:45 AM', date: 'Jul 27, 2026', sender: 'Grace Namugenyi' },
      { id: 'm5', type: 'outgoing', content: 'Here\'s the revised quotation with the e-commerce module included. Total now stands at UGX 23,000,000.', time: '10:15 AM', date: 'Jul 27, 2026', sender: 'Alex Mugisha', attachments: [{ type: 'quotation', label: 'TGL-QTN-2026-001 v2.pdf', ref: 'qtn-1' }] },
      { id: 'm6', type: 'incoming', content: 'This looks great! Please go ahead. We\'re excited to get started.', time: '10:42 AM', date: 'Jul 27, 2026', sender: 'Grace Namugenyi' },
      { id: 'm7', type: 'system', content: 'Invoice TGL-INV-2026-001 was paid', time: '10:50 AM', date: 'Jul 27, 2026' },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Esther Auma',
    companyName: 'Standard Chartered Uganda',
    email: 'esther.a@email.com',
    phone: '+256 785 500 900',
    avatarBg: '#3B82F6',
    channel: 'Email',
    unread: 0,
    lastPreview: 'Invoice received. Our finance team will process the payment by end of week.',
    lastTime: 'Yesterday',
    lastDate: 'Jul 26, 2026',
    online: false,
    deal: 'StanChart Digital Platform',
    dealId: 'dl-7',
    project: 'StanChart Digital Platform',
    projectId: 'pr-6',
    quotation: 'TGL-QTN-2026-003',
    quotationId: 'qtn-3',
    invoice: 'TGL-INV-2026-007',
    invoiceId: 'inv-7',
    outstandingBalance: 0,
    paymentStatus: 'Paid',
    messages: [
      { id: 'm8', type: 'outgoing', content: 'Hi Esther, I\'ve attached the final invoice for the StanChart Digital Platform project. Please review and let me know if you have any questions.', time: '2:00 PM', date: 'Jul 26, 2026', sender: 'Alex Mugisha', attachments: [{ type: 'invoice', label: 'TGL-INV-2026-007.pdf', ref: 'inv-7' }] },
      { id: 'm9', type: 'incoming', content: 'Thank you Alex. Invoice received. Our finance team will process the payment by end of week.', time: '3:30 PM', date: 'Jul 26, 2026', sender: 'Esther Auma' },
      { id: 'm10', type: 'outgoing', content: 'Wonderful, thank you Esther. It\'s been a pleasure working with Standard Chartered on this project.', time: '3:45 PM', date: 'Jul 26, 2026', sender: 'Alex Mugisha' },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'John Mukasa',
    companyName: 'Sparkles Salon Uganda',
    email: 'john.mukasa@email.com',
    phone: '+256 701 200 300',
    avatarBg: '#F59E0B',
    channel: 'WhatsApp',
    unread: 1,
    lastPreview: 'Can we schedule the website deployment for next Tuesday?',
    lastTime: '09:30 AM',
    lastDate: 'Jul 27, 2026',
    online: true,
    deal: 'Sparkles Salon Website',
    dealId: 'dl-3',
    project: 'Sparkles Salon Website',
    projectId: 'pr-4',
    quotation: 'TGL-QTN-2026-002',
    quotationId: 'qtn-2',
    invoice: 'TGL-INV-2026-003',
    invoiceId: 'inv-3',
    outstandingBalance: 4250000,
    paymentStatus: 'Outstanding',
    messages: [
      { id: 'm11', type: 'incoming', content: 'Hi Sarah, can we schedule the website deployment for next Tuesday? Our staff training is happening on Monday.', time: '09:15 AM', date: 'Jul 27, 2026', sender: 'John Mukasa' },
      { id: 'm12', type: 'outgoing', content: 'Good morning John! Tuesday works perfectly. I\'ll block 10 AM - 12 PM for the deployment window. The booking system integration is ready to go live.', time: '09:20 AM', date: 'Jul 27, 2026', sender: 'Sarah Birungi' },
      { id: 'm13', type: 'incoming', content: 'Great! Also, can you confirm the deposit invoice has been sent? I want to make sure we settle before deployment.', time: '09:30 AM', date: 'Jul 27, 2026', sender: 'John Mukasa' },
    ],
  },
  {
    id: 'conv-4',
    contactName: 'Sarah Achieng',
    companyName: 'Amira Interiors',
    email: 'sarah.achieng@email.com',
    phone: '+256 772 100 200',
    avatarBg: '#16A34A',
    channel: 'WhatsApp',
    unread: 0,
    lastPreview: 'The virtual walkthrough preview looks incredible! When can we do a live demo?',
    lastTime: 'Jul 25',
    lastDate: 'Jul 25, 2026',
    online: false,
    deal: 'Amira Interiors Phase Two',
    dealId: 'dl-4',
    project: 'Amira Interiors Phase II',
    projectId: 'pr-3',
    quotation: 'TGL-QTN-2026-004',
    quotationId: 'qtn-4',
    invoice: 'TGL-INV-2026-004',
    invoiceId: 'inv-4',
    outstandingBalance: 8000000,
    paymentStatus: 'Partially Paid',
    messages: [
      { id: 'm14', type: 'outgoing', content: 'Hi Sarah, I\'ve uploaded the latest virtual walkthrough preview for the Amira Interiors platform. The 3D rendering engine is looking fantastic.', time: '4:00 PM', date: 'Jul 25, 2026', sender: 'Alex Mugisha', attachments: [{ type: 'image', label: 'walkthrough_preview.png', ref: '' }] },
      { id: 'm15', type: 'incoming', content: 'The virtual walkthrough preview looks incredible! When can we do a live demo?', time: '5:15 PM', date: 'Jul 25, 2026', sender: 'Sarah Achieng' },
      { id: 'm16', type: 'outgoing', content: 'I can arrange a live demo for this Friday at 2 PM. Would that work for you and your team?', time: '5:30 PM', date: 'Jul 25, 2026', sender: 'Alex Mugisha' },
    ],
  },
  {
    id: 'conv-5',
    contactName: 'Peter Okot',
    companyName: 'Verax',
    email: 'peter.okot@email.com',
    phone: '+256 753 400 500',
    avatarBg: '#DC2626',
    channel: 'Email',
    unread: 3,
    lastPreview: 'URGENT: The mobile app is crashing on Android 14 devices. Please fix ASAP.',
    lastTime: '08:15 AM',
    lastDate: 'Jul 27, 2026',
    online: true,
    deal: 'Verax Mobile Extension',
    dealId: 'dl-16',
    project: 'Verax Mobile Application',
    projectId: 'pr-5',
    quotation: 'TGL-QTN-2026-005',
    quotationId: 'qtn-5',
    invoice: 'TGL-INV-2026-006',
    invoiceId: 'inv-6',
    outstandingBalance: 25000000,
    paymentStatus: 'Overdue',
    messages: [
      { id: 'm17', type: 'incoming', content: 'URGENT: The mobile app is crashing on Android 14 devices. Our users are reporting issues since the last update. Please fix ASAP.', time: '08:15 AM', date: 'Jul 27, 2026', sender: 'Peter Okot' },
      { id: 'm18', type: 'incoming', content: 'We have 200+ users affected. This is becoming a serious issue for our operations team.', time: '08:30 AM', date: 'Jul 27, 2026', sender: 'Peter Okot' },
      { id: 'm19', type: 'incoming', content: 'Please confirm you received this message. We need an ETA on the fix.', time: '09:00 AM', date: 'Jul 27, 2026', sender: 'Peter Okot' },
    ],
  },
  {
    id: 'conv-6',
    contactName: 'Maria Nalubega',
    companyName: 'Ellipse',
    email: 'maria.nalubega@email.com',
    phone: '+256 782 300 400',
    avatarBg: '#6366F1',
    channel: 'Email',
    unread: 0,
    lastPreview: 'The enterprise platform is stable. Can we discuss the next milestone?',
    lastTime: 'Jul 24',
    lastDate: 'Jul 24, 2026',
    online: false,
    deal: 'Ellipse Enterprise Partnership',
    dealId: 'dl-2',
    project: 'Ellipse Enterprise Platform',
    projectId: 'pr-1',
    quotation: 'TGL-QTN-2026-006',
    quotationId: 'qtn-6',
    invoice: 'TGL-INV-2026-002',
    invoiceId: 'inv-2',
    outstandingBalance: 12000000,
    paymentStatus: 'Partially Paid',
    messages: [
      { id: 'm20', type: 'incoming', content: 'Hi David, the enterprise platform is stable and our team is happy with the core module. Can we discuss the next milestone for the HR module?', time: '11:00 AM', date: 'Jul 24, 2026', sender: 'Maria Nalubega' },
      { id: 'm21', type: 'outgoing', content: 'Hello Maria, great to hear! Yes, let\'s schedule a milestone planning session. I suggest Wednesday at 3 PM to review the HR module scope and timeline.', time: '2:00 PM', date: 'Jul 24, 2026', sender: 'David Okello' },
      { id: 'm22', type: 'incoming', content: 'Wednesday at 3 PM works well. I\'ll also bring our HR director for the session.', time: '4:30 PM', date: 'Jul 24, 2026', sender: 'Maria Nalubega' },
      { id: 'm23', type: 'system', content: 'Payment of UGX 25,000,000 received for Invoice TGL-INV-2026-002', time: '4:45 PM', date: 'Jul 24, 2026' },
    ],
  },
  {
    id: 'conv-7',
    contactName: 'David Ssempijja',
    companyName: 'Uganda Breweries',
    email: 'david.ssemp@email.com',
    phone: '+256 702 600 700',
    avatarBg: '#F97316',
    channel: 'Email',
    unread: 1,
    lastPreview: 'We received the procurement portal proposal. When can we start?',
    lastTime: 'Yesterday',
    lastDate: 'Jul 26, 2026',
    online: false,
    deal: '',
    dealId: '',
    project: '',
    projectId: '',
    quotation: '',
    quotationId: '',
    invoice: '',
    invoiceId: '',
    outstandingBalance: 0,
    paymentStatus: 'New Client',
    messages: [
      { id: 'm24', type: 'incoming', content: 'Hello Togashi team, we received the procurement portal proposal. Impressive work. When can we start?', time: '10:00 AM', date: 'Jul 26, 2026', sender: 'David Ssempijja' },
      { id: 'm25', type: 'outgoing', content: 'Good morning David! Thank you for the positive feedback. We can kick off as early as next Monday. I\'ll prepare the formal quotation and contract today.', time: '11:30 AM', date: 'Jul 26, 2026', sender: 'David Okello' },
    ],
  },
  {
    id: 'conv-8',
    contactName: 'Tom Otim',
    companyName: 'Gadget Arena',
    email: 'tom.otim@email.com',
    phone: '+256 791 200 300',
    avatarBg: '#64748B',
    channel: 'WhatsApp',
    unread: 0,
    lastPreview: 'Thanks for the demo. We need some time to review internally.',
    lastTime: 'Jul 22',
    lastDate: 'Jul 22, 2026',
    online: false,
    deal: '',
    dealId: '',
    project: '',
    projectId: '',
    quotation: '',
    quotationId: '',
    invoice: '',
    invoiceId: '',
    outstandingBalance: 0,
    paymentStatus: 'Prospect',
    messages: [
      { id: 'm26', type: 'outgoing', content: 'Hi Tom, thank you for attending the demo today. I\'ve sent the proposal as a follow-up. Let me know if you have any questions.', time: '3:00 PM', date: 'Jul 22, 2026', sender: 'Grace Nakato' },
      { id: 'm27', type: 'incoming', content: 'Thanks for the demo Grace. We need some time to review internally with our team. I\'ll get back to you by end of next week.', time: '4:15 PM', date: 'Jul 22, 2026', sender: 'Tom Otim' },
    ],
  },
];

type Tab = 'All' | 'Unread' | 'Email' | 'WhatsApp';

export default function Communications() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = selectedId ? MOCK_CONVERSATIONS.find((c) => c.id === selectedId) : null;

  const filtered = MOCK_CONVERSATIONS.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      c.contactName.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.lastPreview.toLowerCase().includes(q);
    if (activeTab === 'Unread') return matchesSearch && c.unread > 0;
    if (activeTab === 'Email') return matchesSearch && c.channel === 'Email';
    if (activeTab === 'WhatsApp') return matchesSearch && c.channel === 'WhatsApp';
    return matchesSearch;
  });

  const counts = {
    All: MOCK_CONVERSATIONS.length,
    Unread: MOCK_CONVERSATIONS.filter((c) => c.unread > 0).length,
    Email: MOCK_CONVERSATIONS.filter((c) => c.channel === 'Email').length,
    WhatsApp: MOCK_CONVERSATIONS.filter((c) => c.channel === 'WhatsApp').length,
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv?.messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'All', label: 'All' },
    { key: 'Unread', label: 'Unread' },
    { key: 'Email', label: 'Email' },
    { key: 'WhatsApp', label: 'WhatsApp' },
  ];

  const formatDate = (dateStr: string) => {
    if (dateStr.includes('Jul 27')) return 'Today';
    if (dateStr.includes('Jul 26')) return 'Yesterday';
    return dateStr.replace('Jul ', 'July ').replace(', 2026', '');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 sm:-m-5 md:-m-6 bg-white">
      {/* LEFT PANEL - Inbox */}
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[340px] xl:w-[360px] border-r border-slate-200 flex-col shrink-0`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Communications</h2>
          <div className="relative">
            <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="px-4 pt-3 pb-2 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                activeTab === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <MessageText size={24} variant="Bulk" color="#CBD5E1" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">No conversations found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filtered.map((conv) => {
              const ChIcon = CHANNEL_ICONS[conv.channel].icon;
              const chColor = CHANNEL_ICONS[conv.channel].color;
              return (
                <div
                  key={conv.id}
                  onClick={() => { setSelectedId(conv.id); setShowDetails(false); }}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors relative ${
                    selectedId === conv.id ? 'bg-emerald-50/50' : ''
                  } ${conv.unread > 0 ? 'bg-slate-50/40' : ''}`}
                >
                  {conv.unread > 0 && !selectedId && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#16A34A] rounded-r-sm" />}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: conv.avatarBg }}>
                        {conv.contactName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-[13px] font-semibold truncate ${conv.unread > 0 && !selectedId ? 'text-slate-900' : 'text-slate-700'}`}>
                            {conv.contactName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{conv.companyName}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{conv.lastTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <ChIcon size={11} variant="Linear" color={chColor} />
                        <p className={`text-[12px] truncate ${conv.unread > 0 && !selectedId ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                          {conv.lastPreview}
                        </p>
                      </div>
                      {conv.unread > 0 && !selectedId && (
                        <div className="mt-1.5 flex justify-end">
                          <span className="px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold leading-none">
                            {conv.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CENTER PANEL - Conversation */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 bg-slate-50/30`}>
        {selectedConv ? (
          <>
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0">
              <button onClick={() => setSelectedId(null)} className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <div className="relative">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: selectedConv.avatarBg }}>
                  {selectedConv.contactName.split(' ').map((n) => n[0]).join('')}
                </div>
                {selectedConv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate">{selectedConv.contactName}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] text-slate-400 truncate">{selectedConv.companyName}</p>
                  <span className="text-[10px] text-slate-300">·</span>
                  {React.createElement(CHANNEL_ICONS[selectedConv.channel].icon as any, { size: 11, variant: 'Linear' as const, color: CHANNEL_ICONS[selectedConv.channel].color })}
                  <span className="text-[10px] text-slate-400">{selectedConv.channel}</span>
                  {selectedConv.online && <span className="text-[10px] text-emerald-600 font-medium">Online</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowDetails(!showDetails)} className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <More size={16} variant="Linear" color="currentColor" />
                </button>
                <button onClick={() => setShowDetails(!showDetails)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <Profile2User size={16} variant="Linear" color="currentColor" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {selectedConv.messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex items-center justify-center gap-3">
                      <div className="flex-1 h-px bg-slate-200" />
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50/30 px-3 py-1 rounded-full">
                        <TickCircle size={12} variant="Linear" color="#94A3B8" />
                        {msg.content}
                      </div>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  );
                }
                const isOutgoing = msg.type === 'outgoing';
                return (
                  <div key={msg.id} className={`flex gap-3 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: isOutgoing ? '#0F172A' : selectedConv.avatarBg }}>
                      {isOutgoing ? 'AM' : selectedConv.contactName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className={`max-w-[75%] ${isOutgoing ? 'items-end' : ''}`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                        isOutgoing
                          ? 'bg-[#16A34A] text-white rounded-tr-md'
                          : 'bg-white text-slate-700 rounded-tl-md border border-slate-100 shadow-sm'
                      }`}>
                        <p className="leading-relaxed">{msg.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((att, i) => (
                              <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                                isOutgoing ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-600'
                              }`}>
                                <DocumentText size={13} variant="Linear" color="currentColor" />
                                <span>{att.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] text-slate-400 mt-1 ${isOutgoing ? 'text-right' : ''}`}>{msg.time}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-end gap-2 shrink-0">
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                <Paperclip2 size={18} variant="Linear" color="currentColor" />
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a reply..."
                rows={1}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                <EmojiHappy size={18} variant="Linear" color="currentColor" />
              </button>
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="p-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} variant="Linear" color="currentColor" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <MessageText size={36} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No conversation selected</h3>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              Select a conversation from the inbox to view messages, reply to clients and keep communication organised.
            </p>
            <button className="mt-6 bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
              <Edit2 size={16} variant="Linear" color="currentColor" />
              Compose Message
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANEL - Client Details */}
      {selectedConv && showDetails && (
        <div className="hidden lg:flex w-[300px] xl:w-[320px] border-l border-slate-200 flex-col shrink-0 bg-white overflow-y-auto">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Details</h3>
              <button onClick={() => setShowDetails(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <CloseSquare size={14} variant="Linear" color="currentColor" />
              </button>
            </div>
          </div>

          <div className="px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: selectedConv.avatarBg }}>
                {selectedConv.contactName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{selectedConv.contactName}</p>
                <p className="text-xs text-slate-500">{selectedConv.companyName}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Sms size={13} variant="Linear" color="#94A3B8" />
                <span className="truncate">{selectedConv.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Call size={13} variant="Linear" color="#94A3B8" />
                <span>{selectedConv.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                {React.createElement(CHANNEL_ICONS[selectedConv.channel].icon as any, { size: 13, variant: 'Linear' as const, color: '#94A3B8' })}
                <span>{selectedConv.channel}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-b border-slate-50 space-y-3">
            {selectedConv.deal && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Deal</p>
                <Link href={`/deals/${selectedConv.dealId}`} className="text-xs font-medium text-slate-700 hover:text-[#16A34A] transition-colors">{selectedConv.deal}</Link>
              </div>
            )}
            {selectedConv.project && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Project</p>
                <Link href={`/projects/${selectedConv.projectId}`} className="text-xs font-medium text-slate-700 hover:text-[#16A34A] transition-colors">{selectedConv.project}</Link>
              </div>
            )}
            {selectedConv.quotation && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Latest Quotation</p>
                <Link href="/quotations" className="text-xs font-medium text-slate-700 hover:text-[#16A34A] transition-colors">{selectedConv.quotation}</Link>
              </div>
            )}
            {selectedConv.invoice && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Latest Invoice</p>
                <Link href="/invoices" className="text-xs font-medium text-slate-700 hover:text-[#16A34A] transition-colors">{selectedConv.invoice}</Link>
              </div>
            )}
            {selectedConv.outstandingBalance > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                <p className="text-xs font-semibold text-red-600">UGX {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(selectedConv.outstandingBalance)}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                selectedConv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                selectedConv.paymentStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-700' :
                selectedConv.paymentStatus === 'Overdue' ? 'bg-red-50 text-red-600' :
                'bg-slate-100 text-slate-600'
              }`}>{selectedConv.paymentStatus}</span>
            </div>
          </div>

          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-1.5">
              <Link href="/contacts" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <Profile2User size={13} variant="Linear" color="#94A3B8" />Contact
              </Link>
              {selectedConv.dealId && (
                <Link href={`/deals/${selectedConv.dealId}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Briefcase size={13} variant="Linear" color="#94A3B8" />Deal
                </Link>
              )}
              {selectedConv.projectId && (
                <Link href={`/projects/${selectedConv.projectId}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <TaskSquare size={13} variant="Linear" color="#94A3B8" />Project
                </Link>
              )}
              <Link href="/invoices" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <ReceiptText size={13} variant="Linear" color="#94A3B8" />Invoice
              </Link>
              <Link href="/quotations" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <DocumentText size={13} variant="Linear" color="#94A3B8" />Quotation
              </Link>
              <Link href="/calendar" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <Calendar size={13} variant="Linear" color="#94A3B8" />Meeting
              </Link>
              <Link href="/tasks" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <TickCircle size={13} variant="Linear" color="#94A3B8" />Task
              </Link>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors col-span-2">
                <NoteAdd size={13} variant="Linear" color="#94A3B8" />Add Internal Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Client Details Drawer */}
      {selectedConv && showDetails && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end" onClick={() => setShowDetails(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full sm:max-w-sm bg-white h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="text-sm font-semibold text-slate-900">Client Details</h3>
              <button onClick={() => setShowDetails(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <CloseSquare size={18} variant="Linear" color="currentColor" />
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: selectedConv.avatarBg }}>
                  {selectedConv.contactName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selectedConv.contactName}</p>
                  <p className="text-xs text-slate-500">{selectedConv.companyName}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-slate-600"><Sms size={13} variant="Linear" color="#94A3B8" /><span>{selectedConv.email}</span></div>
                <div className="flex items-center gap-2 text-slate-600"><Call size={13} variant="Linear" color="#94A3B8" /><span>{selectedConv.phone}</span></div>
              </div>
              {selectedConv.deal && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Deal</p>
                  <Link href={`/deals/${selectedConv.dealId}`} className="text-xs font-medium text-slate-700 hover:text-[#16A34A]">{selectedConv.deal}</Link>
                </div>
              )}
              {selectedConv.project && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Project</p>
                  <Link href={`/projects/${selectedConv.projectId}`} className="text-xs font-medium text-slate-700 hover:text-[#16A34A]">{selectedConv.project}</Link>
                </div>
              )}
              {selectedConv.outstandingBalance > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Balance</p>
                  <p className="text-xs font-semibold text-red-600">UGX {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(selectedConv.outstandingBalance)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
