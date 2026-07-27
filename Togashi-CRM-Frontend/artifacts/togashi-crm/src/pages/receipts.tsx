import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { receipts as mockReceipts } from '@/data/dashboardMockData';
import type { Receipt, ReceiptStatus, ReceiptPaymentMethod } from '@/data/dashboardMockData';
import {
  Add, SearchNormal1, Sort, More, ArrowLeft, ArrowDown2, DocumentText,
  Eye, Copy, Trash, Printer, Calendar,
  CloseCircle, Money, WalletAdd,
} from 'iconsax-react';

const STATUS_STYLES: Record<ReceiptStatus, string> = {
  'Issued': 'bg-emerald-50 text-emerald-700',
  'Voided': 'bg-red-50 text-red-500',
};

const CURRENCY_SYMBOLS: Record<string, string> = { 'UGX': 'UGX', 'USD': '$' };

const formatCurrency = (val: number, currency: string = 'UGX') => {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (currency === 'USD') return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)}`;
  return `${sym} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)}`;
};

const formatCurrencyShort = (val: number, currency: string = 'UGX') => {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (val >= 1000000) return `${sym} ${(val / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  return `${sym} ${val}`;
};

const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToWords(n: number): string {
  if (n === 0) return 'zero';
  function convertBelowThousand(x: number): string {
    const parts: string[] = [];
    const h = Math.floor(x / 100);
    if (h > 0) parts.push(units[h] + ' hundred');
    const r = x % 100;
    if (r > 0) {
      if (r < 10) parts.push(units[r]);
      else if (r < 20) parts.push(teens[r - 10]);
      else {
        const t = Math.floor(r / 10);
        parts.push(tens[t] + (r % 10 !== 0 ? '-' + units[r % 10] : ''));
      }
    }
    return parts.join(' ');
  }
  if (n < 1000) return convertBelowThousand(n);
  const segments: { value: number; label: string }[] = [
    { value: 1000000000, label: 'billion' },
    { value: 1000000, label: 'million' },
    { value: 1000, label: 'thousand' },
  ];
  const parts: string[] = [];
  for (const seg of segments) {
    if (n >= seg.value) {
      const count = Math.floor(n / seg.value);
      parts.push(convertBelowThousand(count) + ' ' + seg.label);
      n %= seg.value;
    }
  }
  if (n > 0) parts.push(convertBelowThousand(n));
  return parts.join(', ');
}

function amountToWords(amount: number, currency: string): string {
  const words = numberToWords(amount);
  const suffix = currency === 'USD' ? 'united states dollars only' : 'uganda shillings only';
  return words.charAt(0).toUpperCase() + words.slice(1) + ' ' + suffix + '.';
}

let nextRctSeq = 11;

function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const num = String(nextRctSeq++).padStart(3, '0');
  return `TGL-RCT-${year}-${num}`;
}

function emptyReceipt(): Receipt {
  return {
    id: '',
    number: generateReceiptNumber(),
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    billingAddress: '',
    amount: 0,
    currency: 'UGX',
    status: 'Issued',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paymentMethod: 'Bank Transfer',
    paymentReference: '',
    clientNote: '',
    internalNote: '',
    initials: '',
  };
}

export default function Receipts() {
  const { hasPermission } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState('newest');
  const [moreOpen, setMoreOpen] = useState<string | null>(null);
  const [detailReceipt, setDetailReceipt] = useState<Receipt | null>(null);
  const [formReceipt, setFormReceipt] = useState<Receipt | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<Receipt | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [voidConfirm, setVoidConfirm] = useState<{ id: string; reason: string } | null>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewReceipt) return;
    const hk = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPreviewReceipt(null); setPreviewLoading(false); } };
    document.addEventListener('keydown', hk);
    document.body.style.overflow = 'hidden';
    if (previewScrollRef.current) previewScrollRef.current.scrollTop = 0;
    return () => { document.removeEventListener('keydown', hk); document.body.style.overflow = ''; };
  }, [previewReceipt]);

  const stats = useMemo(() => {
    const valid = receipts.filter(r => r.status === 'Issued');
    const thisMonth = 'Jul'; // mock current month
    return {
      total: receipts.length,
      amountReceived: valid.reduce((s, r) => s + r.amount, 0),
      thisMonth: receipts.filter(r => r.issueDate.startsWith(thisMonth) && r.status === 'Issued').length,
      unlinked: receipts.filter(r => !r.relatedInvoiceId && r.status === 'Issued').length,
    };
  }, [receipts]);

  const filtered = useMemo(() => {
    const qs = search.toLowerCase();
    let result = receipts.filter(r => {
      const m = !qs || r.number.toLowerCase().includes(qs) || r.contactName.toLowerCase().includes(qs) || r.companyName.toLowerCase().includes(qs) || (r.relatedInvoiceNumber || '').toLowerCase().includes(qs) || r.paymentReference.toLowerCase().includes(qs) || r.paymentMethod.toLowerCase().includes(qs);
      return m && (statusFilter === 'All' || r.status === statusFilter);
    });
    const fns: Record<string, (a: Receipt, b: Receipt) => number> = {
      newest: (a, b) => new Date(b.issueDate + ', 2026').getTime() - new Date(a.issueDate + ', 2026').getTime(),
      oldest: (a, b) => new Date(a.issueDate + ', 2026').getTime() - new Date(b.issueDate + ', 2026').getTime(),
      'highest-amount': (a, b) => b.amount - a.amount,
      'lowest-amount': (a, b) => a.amount - b.amount,
    };
    return result.sort(fns[sortBy] || fns.newest);
  }, [receipts, search, statusFilter, sortBy]);

  function handleSaveForm() {
    if (!formReceipt) return;
    const isNew = !formReceipt.id;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updated: Receipt = { ...formReceipt, id: isNew ? `rct-${nextRctSeq - 1}` : formReceipt.id, lastUpdated: now };
    setReceipts(prev => isNew ? [updated, ...prev] : prev.map(r => r.id === updated.id ? updated : r));
    setFormReceipt(null);
  }

  function handleVoid() {
    if (!voidConfirm) return;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setReceipts(prev => prev.map(r => r.id === voidConfirm.id ? { ...r, status: 'Voided' as ReceiptStatus, lastUpdated: now, voidRecord: { voidedAt: now, reason: voidConfirm.reason } } : r));
    setVoidConfirm(null); setMoreOpen(null);
  }

  function handlePreview(rcp: Receipt) { setMoreOpen(null); setPreviewLoading(true); setPreviewReceipt(rcp); requestAnimationFrame(() => requestAnimationFrame(() => setPreviewLoading(false))); }
  function handlePrint() { window.print(); }
  function generateFileName(rcp: Receipt) { const c = rcp.companyName.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); return `${rcp.number}-${c}.pdf`; }

  function buildDocumentHTML(rcp: Receipt): string {
    const sym = CURRENCY_SYMBOLS[rcp.currency] || rcp.currency;
    const fmt = (v: number) => sym === '$' ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}` : `${sym} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}`;
    const words = amountToWords(rcp.amount, rcp.currency);
    const pmethod = rcp.paymentMethod === 'Other' && rcp.paymentMethodDescription ? `${rcp.paymentMethod} — ${rcp.paymentMethodDescription}` : rcp.paymentMethod;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${rcp.number}</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;line-height:1.5;padding:0}
@page{size:A4;margin:12mm}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}.hdr-l h1{font-size:24px;font-weight:700;color:#0f172a}.hdr-l h1 span{color:#16A34A}.hdr-l p{font-size:13px;color:#64748b;margin-top:2px}.hdr-r{text-align:right}.hdr-r h2{font-size:20px;font-weight:700;color:#1e293b;letter-spacing:.02em}.hdr-r .n{font-size:14px;font-weight:600;color:#0f172a;margin-top:6px}.hdr-r .d{font-size:12px;color:#64748b;margin-top:2px}.sec{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}.sec h3{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}.sec p{font-size:13px}.sec .nm{font-weight:600}.sec .st{color:#64748b;margin-top:4px}.amt{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px;margin-bottom:32px;text-align:center}.amt .val{font-size:28px;font-weight:700;color:#0f172a;margin-bottom:8px}.amt .words{font-size:13px;color:#475569;line-height:1.6;font-style:italic}.info{display:grid;grid-template-columns:1fr 1fr;gap:16px 40px;margin-bottom:40px}.info .row{display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding:8px 0}.info .row .l{font-size:12px;color:#94a3b8}.info .row .v{font-size:13px;color:#334155;font-weight:500}
.trms{border-top:2px solid #e2e8f0;padding-top:24px}.trms .ts{margin-bottom:20px}.trms .ts:last-child{margin-bottom:0}.trms h3{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}.trms p{font-size:13px;color:#334155;line-height:1.6}
.sigs{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:56px}.sigs .sg{border-top:1px solid #cbd5e1;padding-top:16px;text-align:center}.sigs .sg .who{font-size:14px;font-weight:600;color:#0f172a}.sigs .sg .org{font-size:11px;color:#94a3b8;margin-top:2px}.sigs .sg .dt{font-size:11px;color:#94a3b8;margin-top:16px}.ftr{margin-top:64px;text-align:center;font-size:11px;color:#94a3b8}@media print{body{padding:0;margin:0}}</style></head><body>
<div class="hdr"><div class="hdr-l"><h1>TOGASHI<span> TECHNOLOGIES</span></h1><p>Plot 24, Kampala Road, Kampala, Uganda</p><p>info@togashitech.com &middot; +256 700 000 000</p></div><div class="hdr-r"><h2>RECEIPT</h2><p class="n">${rcp.number}</p><p class="d">Issue Date: ${rcp.issueDate}</p><p class="d">Payment Date: ${rcp.paymentDate}</p></div></div>
<div class="sec"><div><h3>Received From</h3><p class="nm">${rcp.contactName}</p><p>${rcp.companyName}</p>${rcp.billingAddress ? `<p class="st">${rcp.billingAddress}</p>` : ''}<p class="st">${rcp.contactEmail}</p><p class="st">${rcp.contactPhone}</p></div><div><h3>Payment Details</h3><p>${pmethod}${rcp.paymentReference ? `<br/><span class="st">Ref: ${rcp.paymentReference}</span>` : ''}${rcp.relatedInvoiceNumber ? `<br/><span class="st">Invoice: ${rcp.relatedInvoiceNumber}</span>` : ''}</p></div></div>
<div class="amt"><p class="val">${fmt(rcp.amount)}</p><p class="words">${words}</p></div>
<div class="info"><div class="row"><span class="l">Currency</span><span class="v">${rcp.currency === 'UGX' ? 'Uganda Shillings (UGX)' : 'United States Dollars (USD)'}</span></div><div class="row"><span class="l">Payment Method</span><span class="v">${pmethod}</span></div>${rcp.paymentReference ? `<div class="row"><span class="l">Payment Reference</span><span class="v">${rcp.paymentReference}</span></div>` : ''}${rcp.relatedInvoiceNumber ? `<div class="row"><span class="l">Related Invoice</span><span class="v">${rcp.relatedInvoiceNumber}</span></div>` : ''}</div>
${rcp.clientNote ? `<div class="trms"><div class="ts"><h3>Note</h3><p>${rcp.clientNote}</p></div></div>` : ''}
<div class="sigs"><div class="sg"><p class="who">Auth. Signature</p><p class="org">Togashi Technologies</p><p class="dt">Date: ___________________</p></div><div class="sg"><p class="who">Client Acknowledgement</p><p class="org">${rcp.contactName}</p><p class="dt">Date: ___________________</p></div></div>
<div class="ftr">${rcp.number} &middot; Togashi Technologies &middot; Plot 24, Kampala Road, Kampala, Uganda</div>
</body></html>`;
  }

  function handleDownloadFile() {
    if (!previewReceipt) return;
    const html = buildDocumentHTML(previewReceipt);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = generateFileName(previewReceipt);
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function closePreview() { setPreviewReceipt(null); setPreviewLoading(false); }

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Receipts</h2><p className="text-slate-500 mt-0.5 text-sm">Record and manage client payment receipts.</p></div>
        {hasPermission('receipts.create') && (<button onClick={() => setFormReceipt(emptyReceipt())} className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"><Add size={18} variant="Linear" color="currentColor" /><span>New Receipt</span></button>)}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Receipts', i: DocumentText, v: stats.total, c: '#64748B' },
          { l: 'Amount Received', i: Money, v: formatCurrencyShort(stats.amountReceived), c: '#16A34A' },
          { l: 'Receipts This Month', i: Calendar, v: stats.thisMonth, c: '#3B82F6' },
          { l: 'Unlinked Receipts', i: CloseCircle, v: stats.unlinked, c: '#F59E0B' },
        ].map(({ l, i: Icon, v, c }) => (
          <div key={l} className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5"><Icon size={14} variant="Linear" color={c} /><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span></div>
            <p className="text-xl font-semibold text-slate-900 leading-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-4 py-3 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56"><SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" /><input type="text" placeholder="Search receipts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" /></div>
          <div className="relative"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ReceiptStatus | 'All')} className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"><option value="All">All</option><option value="Issued">Issued</option><option value="Voided">Voided</option></select><ArrowDown2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} variant="Linear" color="currentColor" /></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative"><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest-amount">Highest Amount</option><option value="lowest-amount">Lowest Amount</option></select><ArrowDown2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} variant="Linear" color="currentColor" /></div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Sort size={14} variant="Linear" color="currentColor" />Sort</button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] py-16 text-center">
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><DocumentText size={24} variant="Bulk" color="#CBD5E1" /></div>
          <h3 className="text-base font-medium text-slate-900">No receipts yet</h3><p className="text-xs text-slate-500 mt-1 mb-4">Create your first receipt to confirm a client payment.</p>
          {hasPermission('receipts.create') && (<button onClick={() => setFormReceipt(emptyReceipt())} className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors"><Add size={16} variant="Linear" color="currentColor" /><span>New Receipt</span></button>)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Receipt</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Invoice</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Payment Method</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Payment Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(rcp => (
                  <tr key={rcp.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailReceipt(rcp)}><div><p className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{rcp.number}</p><p className="text-[12px] text-slate-400">{rcp.issueDate}</p></div></td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailReceipt(rcp)}><div><p className="text-[13px] font-medium text-slate-900">{rcp.contactName}</p><p className="text-[12px] text-slate-400 truncate max-w-[140px]">{rcp.companyName}</p></div></td>
                    <td className="px-5 py-3 hidden lg:table-cell cursor-pointer" onClick={() => setDetailReceipt(rcp)}><p className="text-[12px] text-slate-600">{rcp.relatedInvoiceNumber || 'Unlinked'}</p></td>
                    <td className="px-5 py-3 text-right cursor-pointer" onClick={() => setDetailReceipt(rcp)}><span className="text-[13px] font-semibold text-slate-900">{formatCurrencyShort(rcp.amount, rcp.currency)}</span></td>
                    <td className="px-5 py-3 hidden md:table-cell cursor-pointer" onClick={() => setDetailReceipt(rcp)}><span className="text-[12px] text-slate-600">{rcp.paymentMethod}{rcp.paymentMethodDescription ? ` — ${rcp.paymentMethodDescription}` : ''}</span></td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailReceipt(rcp)}><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[rcp.status]}`}>{rcp.status}</span></td>
                    <td className="px-5 py-3 hidden xl:table-cell cursor-pointer" onClick={() => setDetailReceipt(rcp)}><span className="text-[12px] text-slate-500">{rcp.paymentDate}</span></td>
                    <td className="px-5 py-3 relative">
                      <button onClick={e => { e.stopPropagation(); setMoreOpen(moreOpen === rcp.id ? null : rcp.id); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><More size={15} variant="Linear" color="currentColor" /></button>
                      {moreOpen === rcp.id && (<><div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setMoreOpen(null); }} /><div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1 z-20" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setDetailReceipt(rcp); setMoreOpen(null); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50"><Eye size={14} variant="Linear" color="currentColor" />View</button>
                        <button onClick={() => handlePreview(rcp)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50"><Printer size={14} variant="Linear" color="currentColor" />Preview</button>
                        <button onClick={() => { setMoreOpen(null); setFormReceipt({ ...rcp, id: '', number: generateReceiptNumber(), status: 'Issued', issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), voidRecord: undefined }); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50"><Copy size={14} variant="Linear" color="currentColor" />Duplicate</button>
                        {rcp.status === 'Issued' && <button onClick={() => { setVoidConfirm({ id: rcp.id, reason: '' }); setMoreOpen(null); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50"><CloseCircle size={14} variant="Linear" color="currentColor" />Void Receipt</button>}
                      </div></>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {detailReceipt && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailReceipt(null)}><div className="absolute inset-0 bg-black/20" /><div className="relative w-full sm:max-w-lg bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10"><button onClick={() => setDetailReceipt(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[detailReceipt.status]}`}>{detailReceipt.status}</span></div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-sm font-semibold shrink-0">{detailReceipt.initials}</div><div><h2 className="text-lg font-semibold text-slate-900">{detailReceipt.number}</h2><p className="text-sm text-slate-500">{detailReceipt.companyName}</p></div></div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Amount</p><p className="text-base font-bold text-slate-900">{formatCurrency(detailReceipt.amount, detailReceipt.currency)}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Payment Method</p><p className="text-sm font-medium text-slate-700">{detailReceipt.paymentMethod}{detailReceipt.paymentMethodDescription ? ` — ${detailReceipt.paymentMethodDescription}` : ''}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Payment Date</p><div className="flex items-center gap-1.5 text-sm text-slate-700"><Calendar size={14} variant="Linear" color="#94A3B8" />{detailReceipt.paymentDate}</div></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Linked Invoice</p><p className="text-sm font-medium text-slate-700">{detailReceipt.relatedInvoiceNumber || 'Unlinked'}</p></div>
            </div>
            <div className="space-y-4">
              {detailReceipt.paymentReference && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Reference</p><p className="text-sm text-slate-700">{detailReceipt.paymentReference}</p></div>}
              <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Client Information</p><div className="space-y-1 text-sm"><p className="text-slate-900 font-medium">{detailReceipt.contactName}</p><p className="text-slate-500">{detailReceipt.companyName}</p><p className="text-slate-500">{detailReceipt.contactEmail}</p><p className="text-slate-500">{detailReceipt.contactPhone}</p></div></div>
              {detailReceipt.clientNote && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Client Note</p><p className="text-sm text-slate-600">{detailReceipt.clientNote}</p></div>}
              {detailReceipt.internalNote && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Internal Note</p><p className="text-sm text-slate-500">{detailReceipt.internalNote}</p></div>}
              {detailReceipt.voidRecord && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Void Information</p><p className="text-sm text-red-600">Voided on {detailReceipt.voidRecord.voidedAt}</p><p className="text-xs text-slate-500 mt-0.5">Reason: {detailReceipt.voidRecord.reason}</p></div>}
              <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p><div className="grid grid-cols-2 gap-2">
                <button onClick={() => handlePreview(detailReceipt)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"><Printer size={14} variant="Linear" color="#94A3B8" />Preview</button>
                <button onClick={() => { setDetailReceipt(null); handleDownloadFile(); if (previewReceipt) { setPreviewReceipt(detailReceipt); } }} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"><Copy size={14} variant="Linear" color="#94A3B8" />Duplicate</button>
                {detailReceipt.status === 'Issued' && <button onClick={() => { setVoidConfirm({ id: detailReceipt.id, reason: '' }); }} className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"><CloseCircle size={14} variant="Linear" color="currentColor" />Void This Receipt</button>}
              </div></div>
            </div>
          </div>
        </div></div>
      )}

      {/* New Receipt Form */}
      {formReceipt && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setFormReceipt(null)}><div className="absolute inset-0 bg-black/20" /><div className="relative w-full sm:max-w-xl bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10"><button onClick={() => setFormReceipt(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><h3 className="text-base font-semibold text-slate-900">{formReceipt.id ? 'Edit Receipt' : 'New Receipt'}</h3><div className="w-8" /></div>
          <div className="px-6 py-5 space-y-6">
            <section><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Receipt Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Receipt Number</label><input type="text" value={formReceipt.number} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Currency</label><select value={formReceipt.currency} onChange={e => setFormReceipt({ ...formReceipt, currency: e.target.value as 'UGX' | 'USD' })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"><option value="UGX">UGX</option><option value="USD">USD</option></select></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label><input type="text" value={formReceipt.issueDate} onChange={e => setFormReceipt({ ...formReceipt, issueDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Date</label><input type="text" value={formReceipt.paymentDate} onChange={e => setFormReceipt({ ...formReceipt, paymentDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Method</label><select value={formReceipt.paymentMethod} onChange={e => setFormReceipt({ ...formReceipt, paymentMethod: e.target.value as ReceiptPaymentMethod })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"><option value="Bank Transfer">Bank Transfer</option><option value="Mobile Money">Mobile Money</option><option value="Cash">Cash</option><option value="Cheque">Cheque</option><option value="Other">Other</option></select></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Reference</label><input type="text" value={formReceipt.paymentReference} onChange={e => setFormReceipt({ ...formReceipt, paymentReference: e.target.value })} placeholder="e.g. STB-TRF-001" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              {formReceipt.paymentMethod === 'Other' && <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Payment Method Description</label><input type="text" value={formReceipt.paymentMethodDescription || ''} onChange={e => setFormReceipt({ ...formReceipt, paymentMethodDescription: e.target.value })} placeholder="e.g. Payment Link" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>}
              <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Amount Received <span className="text-red-400">*</span></label><input type="number" value={formReceipt.amount || ''} onChange={e => setFormReceipt({ ...formReceipt, amount: Math.max(0, Number(e.target.value) || 0) })} min="1" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Related Invoice</label><input type="text" value={formReceipt.relatedInvoiceNumber || ''} onChange={e => { const v = e.target.value; setFormReceipt({ ...formReceipt, relatedInvoiceNumber: v || undefined, relatedInvoiceId: v ? formReceipt.relatedInvoiceId : undefined }); }} placeholder="TGL-INV-2026-001" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Client Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Contact Name</label><input type="text" value={formReceipt.contactName} onChange={e => setFormReceipt({ ...formReceipt, contactName: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Company</label><input type="text" value={formReceipt.companyName} onChange={e => setFormReceipt({ ...formReceipt, companyName: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Email</label><input type="email" value={formReceipt.contactEmail} onChange={e => setFormReceipt({ ...formReceipt, contactEmail: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Phone</label><input type="text" value={formReceipt.contactPhone} onChange={e => setFormReceipt({ ...formReceipt, contactPhone: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Billing Address</label><input type="text" value={formReceipt.billingAddress} onChange={e => setFormReceipt({ ...formReceipt, billingAddress: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notes</p>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Client Note</label><textarea value={formReceipt.clientNote} onChange={e => setFormReceipt({ ...formReceipt, clientNote: e.target.value })} rows={2} placeholder="Note for the client..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Internal Note</label><textarea value={formReceipt.internalNote} onChange={e => setFormReceipt({ ...formReceipt, internalNote: e.target.value })} rows={2} placeholder="Private note for your team..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
            </div></section>

            <div className="flex gap-3 pt-2 pb-4"><button onClick={() => setFormReceipt(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={handleSaveForm} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full text-sm font-semibold transition-colors">Save Receipt</button></div>
          </div>
        </div></div>
      )}

      {/* Void Confirmation */}
      {voidConfirm && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center" onClick={() => setVoidConfirm(null)}><div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full sm:max-w-md mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-semibold text-slate-900 mb-2">Void Receipt</h3><p className="text-sm text-slate-500 mb-1">This action will mark the receipt as voided. The receipt record will be kept for historical reference.</p>
          <div className="mt-3"><label className="block text-xs font-medium text-slate-500 mb-1">Reason for Voiding</label><textarea value={voidConfirm.reason} onChange={e => setVoidConfirm({ ...voidConfirm, reason: e.target.value })} rows={3} placeholder="Explain why this receipt is being voided..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
          <div className="flex gap-3 mt-5"><button onClick={() => setVoidConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={handleVoid} disabled={!voidConfirm.reason.trim()} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full text-sm font-semibold transition-colors">Void Receipt</button></div>
        </div></div>
      )}

      {/* Preview Modal */}
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print { html, body { width: 210mm; height: 297mm; background: white !important; overflow: visible !important; } body * { visibility: hidden; } #rct-preview-doc, #rct-preview-doc * { visibility: visible; } #rct-preview-doc { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; min-height: 297mm !important; max-width: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 12mm !important; margin: 0 !important; background: white !important; } #rct-preview-toolbar, #rct-preview-scroll { display: none !important; } }
      `}</style>
      {previewReceipt && (
        <div className="fixed inset-0 z-[70] flex flex-col" role="dialog" aria-label="Receipt preview" aria-modal="true"><div className="absolute inset-0 bg-black/50" onClick={closePreview} />
          <div id="rct-preview-toolbar" className="relative z-10 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0"><button onClick={closePreview} aria-label="Close preview" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors shrink-0"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><div className="min-w-0"><p className="text-sm font-semibold text-slate-900 truncate">{previewReceipt.number}</p><p className="text-xs text-slate-400 truncate">{previewReceipt.companyName}</p></div></div>
            <div className="flex items-center gap-2 shrink-0"><button onClick={handlePrint} aria-label="Print receipt" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"><Printer size={14} variant="Linear" color="currentColor" />Print</button><button onClick={handleDownloadFile} aria-label="Download PDF" disabled={previewLoading} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Printer size={14} variant="Linear" color="currentColor" />Download PDF</button></div>
          </div>
          <div id="rct-preview-scroll" ref={previewScrollRef} className="relative z-10 flex-1 overflow-y-auto bg-slate-200 p-6 lg:p-10"><div className="flex justify-center">
          {previewLoading ? (<div className="flex flex-col items-center justify-center py-24"><div className="h-8 w-8 border-2 border-slate-300 border-t-[#16A34A] rounded-full animate-spin mb-3" /><p className="text-sm text-slate-500">Preparing receipt preview...</p></div>
          ) : (
            <div id="rct-preview-doc" className="bg-white shadow-[0_2px_16px_rgba(15,23,42,0.10)] w-full max-w-[794px] p-10 lg:p-12" style={{ minHeight: 'calc(794px * 297 / 210)' }}>
              <div className="flex justify-between items-start mb-10"><div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">TOGASHI<span className="text-[#16A34A]"> TECHNOLOGIES</span></h1><p className="text-[13px] text-slate-500 mt-1">Plot 24, Kampala Road, Kampala, Uganda</p><p className="text-[13px] text-slate-500">info@togashitech.com · +256 700 000 000</p></div><div className="text-right shrink-0"><h2 className="text-xl font-bold text-slate-800 tracking-wide">RECEIPT</h2><p className="text-sm font-semibold text-slate-900 mt-1.5">{previewReceipt.number}</p><p className="text-xs text-slate-500 mt-1">Issue Date: {previewReceipt.issueDate}</p><p className="text-xs text-slate-500">Payment Date: {previewReceipt.paymentDate}</p></div></div>
              <div className="grid grid-cols-2 gap-10 mb-10"><div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Received From</h3><p className="text-sm font-semibold text-slate-900">{previewReceipt.contactName}</p><p className="text-sm text-slate-600">{previewReceipt.companyName}</p>{previewReceipt.billingAddress && <p className="text-sm text-slate-500 mt-1">{previewReceipt.billingAddress}</p>}<p className="text-sm text-slate-500 mt-1">{previewReceipt.contactEmail}</p><p className="text-sm text-slate-500">{previewReceipt.contactPhone}</p></div><div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h3><p className="text-sm text-slate-700">{previewReceipt.paymentMethod === 'Other' && previewReceipt.paymentMethodDescription ? `${previewReceipt.paymentMethod} — ${previewReceipt.paymentMethodDescription}` : previewReceipt.paymentMethod}{previewReceipt.paymentReference && <span className="block text-xs text-slate-500 mt-1">Ref: {previewReceipt.paymentReference}</span>}{previewReceipt.relatedInvoiceNumber && <span className="block text-xs text-slate-500 mt-1">Invoice: {previewReceipt.relatedInvoiceNumber}</span>}</p></div></div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-8"><p className="text-[28px] font-bold text-slate-900 mb-2">{formatCurrency(previewReceipt.amount, previewReceipt.currency)}</p><p className="text-[13px] text-slate-500 italic leading-relaxed">{amountToWords(previewReceipt.amount, previewReceipt.currency)}</p></div>
              <div className="mb-10 space-y-0"><div className="flex justify-between border-b border-slate-100 py-2 text-[13px]"><span className="text-slate-400">Currency</span><span className="font-medium text-slate-700">{previewReceipt.currency === 'UGX' ? 'Uganda Shillings (UGX)' : 'United States Dollars (USD)'}</span></div><div className="flex justify-between border-b border-slate-100 py-2 text-[13px]"><span className="text-slate-400">Payment Method</span><span className="font-medium text-slate-700">{previewReceipt.paymentMethod === 'Other' && previewReceipt.paymentMethodDescription ? `${previewReceipt.paymentMethod} — ${previewReceipt.paymentMethodDescription}` : previewReceipt.paymentMethod}</span></div>{previewReceipt.paymentReference && <div className="flex justify-between border-b border-slate-100 py-2 text-[13px]"><span className="text-slate-400">Payment Reference</span><span className="font-medium text-slate-700">{previewReceipt.paymentReference}</span></div>}{previewReceipt.relatedInvoiceNumber && <div className="flex justify-between border-b border-slate-100 py-2 text-[13px]"><span className="text-slate-400">Related Invoice</span><span className="font-medium text-slate-700">{previewReceipt.relatedInvoiceNumber}</span></div>}</div>
              {previewReceipt.clientNote && <div className="border-t-2 border-slate-200 pt-6 mb-10"><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Note</h3><p className="text-sm text-slate-700 leading-relaxed">{previewReceipt.clientNote}</p></div>}
              <div className="mt-14 grid grid-cols-2 gap-20 break-inside-avoid"><div><div className="border-t border-slate-300 pt-4"><p className="text-sm font-semibold text-slate-900 text-center">Auth. Signature</p><p className="text-[11px] text-slate-400 text-center mt-0.5">Togashi Technologies</p><p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p></div></div><div><div className="border-t border-slate-300 pt-4"><p className="text-sm font-semibold text-slate-900 text-center">Client Acknowledgement</p><p className="text-[11px] text-slate-400 text-center mt-0.5">{previewReceipt.contactName}</p><p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p></div></div></div>
              <div className="mt-16 text-center"><p className="text-[11px] text-slate-400">{previewReceipt.number} · Togashi Technologies · Plot 24, Kampala Road, Kampala, Uganda</p></div>
            </div>
          )}</div></div>
        </div>
      )}
    </div>
  );
}
