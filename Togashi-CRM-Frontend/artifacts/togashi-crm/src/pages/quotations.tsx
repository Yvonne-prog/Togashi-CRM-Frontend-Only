import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { quotations as mockQuotations, quotationStats } from '@/data/dashboardMockData';
import type { Quotation, QuotationStatus, QuotationLineItem } from '@/data/dashboardMockData';
import {
  Add, SearchNormal1, Sort, More, ArrowLeft, ArrowDown2, DocumentText,
  NoteAdd, Eye, Edit, Copy, Trash, TickCircle, CloseCircle, Send,
  Printer, Timer, Calendar,
} from 'iconsax-react';

const STATUS_STYLES: Record<QuotationStatus, string> = {
  'Draft': 'bg-slate-100 text-slate-600',
  'Sent': 'bg-blue-50 text-blue-700',
  'Accepted': 'bg-emerald-50 text-emerald-700',
  'Rejected': 'bg-red-50 text-red-600',
  'Expired': 'bg-orange-50 text-orange-600',
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

let nextQtnSeq = 10;

function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const num = String(nextQtnSeq++).padStart(3, '0');
  return `TGL-QTN-${year}-${num}`;
}

function emptyQuotation(): Quotation {
  return {
    id: '',
    number: generateQuotationNumber(),
    title: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    description: '',
    amount: 0,
    currency: 'UGX',
    status: 'Draft',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    validUntil: '',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lineItems: [],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 0,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '',
    quotationTerms: 'This quotation is valid for 30 days from the issue date. Prices are subject to change after the validity period. Any additional features requested beyond the scope will be quoted separately.',
    additionalConditions: '',
    initials: '',
  };
}

export default function Quotations() {
  const { hasPermission } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'All'>('All');
  const [moreOpen, setMoreOpen] = useState<string | null>(null);
  const [detailQuotation, setDetailQuotation] = useState<Quotation | null>(null);
  const [formQuotation, setFormQuotation] = useState<Quotation | null>(null);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const previewDocRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewQuotation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewQuotation(null);
        setPreviewLoading(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTop = 0;
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewQuotation]);

  const stats = useMemo(() => {
    const total = quotations.length;
    const pendingApproval = quotations.filter(q => q.status === 'Sent').length;
    const accepted = quotations.filter(q => q.status === 'Accepted').length;
    const expired = quotations.filter(q => q.status === 'Expired').length;
    return { total, pendingApproval, accepted, expired };
  }, [quotations]);

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const qs = search.toLowerCase();
      const matchesSearch = !qs || q.number.toLowerCase().includes(qs) || q.contactName.toLowerCase().includes(qs) || q.companyName.toLowerCase().includes(qs) || q.title.toLowerCase().includes(qs);
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  function handleSaveForm() {
    if (!formQuotation) return;
    const isNew = !formQuotation.id;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const updated: Quotation = {
      ...formQuotation,
      id: isNew ? `qtn-${nextQtnSeq - 1}` : formQuotation.id,
      lastUpdated: now,
      amount: formQuotation.subtotal + (formQuotation.taxEnabled ? formQuotation.tax : 0),
    };

    setQuotations(prev => {
      if (isNew) return [updated, ...prev];
      return prev.map(q => q.id === updated.id ? updated : q);
    });

    setFormQuotation(null);
  }

  function handleDelete(id: string) {
    setQuotations(prev => prev.filter(q => q.id !== id));
    setDeleteConfirm(null);
    setMoreOpen(null);
    if (detailQuotation?.id === id) setDetailQuotation(null);
  }

  function handleStatusChange(id: string, status: QuotationStatus) {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : q));
    setMoreOpen(null);
  }

  function handleDuplicate(qtn: Quotation) {
    const dup: Quotation = {
      ...qtn,
      id: '',
      number: generateQuotationNumber(),
      status: 'Draft',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      relatedDealId: undefined,
      relatedDealTitle: undefined,
      relatedProjectId: undefined,
      relatedProjectName: undefined,
    };
    setFormQuotation(dup);
    setMoreOpen(null);
  }

  function handleDownloadPDF(qtn: Quotation) {
    setMoreOpen(null);
    setPreviewLoading(true);
    setPreviewQuotation(qtn);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPreviewLoading(false);
      });
    });
  }

  function handlePrint() {
    window.print();
  }

  function generateFileName(qtn: Quotation): string {
    const clientPart = qtn.companyName.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `${qtn.number}-${clientPart}.pdf`;
  }

  function buildDocumentHTML(qtn: Quotation): string {
    const sym = CURRENCY_SYMBOLS[qtn.currency] || qtn.currency;
    const fmt = (v: number) => sym === '$' ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}` : `${sym} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}`;
    const sub = qtn.lineItems.reduce((s, li) => s + li.lineTotal, 0);
    const disc = qtn.discountType === 'percentage' ? Math.round(sub * qtn.discount / 100) : qtn.discount;
    const afterDisc = sub - disc;
    const total = afterDisc + (qtn.taxEnabled ? qtn.tax : 0);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${qtn.number}</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; line-height: 1.5; padding: 0; }
  .page { padding: 0; }
  .hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .hdr-logo h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
  .hdr-logo h1 span { color: #16A34A; }
  .hdr-logo p { font-size: 13px; color: #64748b; margin-top: 2px; }
  .hdr-quote { text-align: right; }
  .hdr-quote h2 { font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: 0.02em; }
  .hdr-quote .num { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 6px; }
  .hdr-quote .dt { font-size: 12px; color: #64748b; margin-top: 2px; }
  .bill-to { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
  .bill-to h3, .meta h3 { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
  .bill-to p, .meta p { font-size: 13px; }
  .bill-to .name { font-weight: 600; }
  .bill-to .subtle { color: #64748b; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  th { text-align: left; padding: 0 4px 10px 4px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0; }
  th.r { text-align: right; }
  td { padding: 10px 4px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  td.r { text-align: right; }
  td.it { font-weight: 500; }
  td.dc { font-size: 12px; color: #64748b; }
  td.nw { white-space: nowrap; }
  td.bf { font-weight: 600; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-box { width: 256px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
  .totals-box .tr { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; }
  .totals-box .tr .l { color: #64748b; }
  .totals-box .tr .v { font-weight: 500; white-space: nowrap; }
  .totals-box .tr .nr { color: #dc2626; }
  .totals-box .grand { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; border-top: 2px solid #cbd5e1; padding-top: 12px; margin-top: 6px; }
  .terms { border-top: 2px solid #e2e8f0; padding-top: 24px; }
  .terms .sec { margin-bottom: 20px; }
  .terms .sec:last-child { margin-bottom: 0; }
  .terms h3 { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .terms p { font-size: 13px; color: #334155; line-height: 1.6; }
  .sigs { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 56px; }
  .sigs .sig { border-top: 1px solid #cbd5e1; padding-top: 16px; text-align: center; }
  .sigs .sig .who { font-size: 14px; font-weight: 600; color: #0f172a; }
  .sigs .sig .org { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .sigs .sig .dt { font-size: 11px; color: #94a3b8; margin-top: 16px; }
  .ftr { margin-top: 64px; text-align: center; font-size: 11px; color: #94a3b8; }
  @media print { body { padding: 0; margin: 0; } }
</style>
</head>
<body>
<div class="page">
<div class="hdr">
  <div class="hdr-logo">
    <h1>TOGASHI<span> TECHNOLOGIES</span></h1>
    <p>Plot 24, Kampala Road, Kampala, Uganda</p>
    <p>info@togashitech.com &middot; +256 700 000 000</p>
  </div>
  <div class="hdr-quote">
    <h2>QUOTATION</h2>
    <p class="num">${qtn.number}</p>
    <p class="dt">Issue Date: ${qtn.issueDate}</p>
    <p class="dt">Valid Until: ${qtn.validUntil}</p>
  </div>
</div>
<div class="bill-to">
  <div>
    <h3>Bill To</h3>
    <p class="name">${qtn.contactName}</p>
    <p>${qtn.companyName}</p>
    <p class="subtle">${qtn.contactEmail}</p>
    <p class="subtle">${qtn.contactPhone}</p>
  </div>
  <div class="meta">
    <h3>Project</h3>
    <p class="name">${qtn.title}</p>
    <p class="subtle">${qtn.description}</p>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:18%">Item</th><th>Description</th><th class="r" style="width:8%">Qty</th><th class="r" style="width:18%">Unit Price</th><th class="r" style="width:18%">Total</th>
    </tr>
  </thead>
  <tbody>
    ${qtn.lineItems.map(li => `
    <tr>
      <td class="it">${li.item}</td>
      <td class="dc">${li.description}</td>
      <td class="r">${li.quantity}</td>
      <td class="r nw">${fmt(li.unitPrice)}</td>
      <td class="r nw bf">${fmt(li.lineTotal)}</td>
    </tr>`).join('')}
  </tbody>
</table>
<div class="totals">
  <div class="totals-box">
    <div class="tr"><span class="l">Subtotal</span><span class="v">${fmt(sub)}</span></div>
    ${qtn.discount > 0 ? `<div class="tr"><span class="l">Discount${qtn.discountType === 'percentage' ? ` (${qtn.discount}%)` : ''}</span><span class="v nr">-${fmt(disc)}</span></div>` : ''}
    ${qtn.taxEnabled && qtn.tax > 0 ? `<div class="tr"><span class="l">Tax</span><span class="v">${fmt(qtn.tax)}</span></div>` : ''}
    <div class="grand"><span>Total</span><span>${fmt(total)}</span></div>
  </div>
</div>
<div class="terms">
  ${qtn.paymentTerms ? `<div class="sec"><h3>Payment Terms</h3><p>${qtn.paymentTerms}</p></div>` : ''}
  ${qtn.deliveryTimeline ? `<div class="sec"><h3>Delivery Timeline</h3><p>${qtn.deliveryTimeline}</p></div>` : ''}
  ${qtn.quotationTerms ? `<div class="sec"><h3>Terms &amp; Conditions</h3><p>${qtn.quotationTerms}</p></div>` : ''}
  ${qtn.additionalConditions ? `<div class="sec"><h3>Additional Conditions</h3><p>${qtn.additionalConditions}</p></div>` : ''}
</div>
<div class="sigs">
  <div class="sig">
    <p class="who">Auth. Signature</p>
    <p class="org">Togashi Technologies</p>
    <p class="dt">Date: ___________________</p>
  </div>
  <div class="sig">
    <p class="who">Client Signature</p>
    <p class="org">${qtn.contactName}</p>
    <p class="dt">Date: ___________________</p>
  </div>
</div>
<div class="ftr">
  ${qtn.number} &middot; Togashi Technologies &middot; Plot 24, Kampala Road, Kampala, Uganda
</div>
</div>
</body>
</html>`;
  }

  function handleDownloadFile() {
    if (!previewQuotation) return;
    const html = buildDocumentHTML(previewQuotation);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName(previewQuotation);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function closePreview() {
    setPreviewQuotation(null);
    setPreviewLoading(false);
  }

  function handleCreateProject(qtn: Quotation) {
    setMoreOpen(null);
    setDetailQuotation(null);
    window.location.href = '/projects?new=true&name=' + encodeURIComponent(qtn.title) + '&company=' + encodeURIComponent(qtn.companyName) + '&budget=' + qtn.amount + '&quotation=' + encodeURIComponent(qtn.number);
  }

  const actionsForStatus = (qtn: Quotation) => {
    const items: { label: string; icon: typeof Eye; action: () => void; danger?: boolean }[] = [
      { label: 'View', icon: Eye, action: () => { setDetailQuotation(qtn); setMoreOpen(null); } },
      { label: 'Download PDF', icon: Printer, action: () => handleDownloadPDF(qtn) },
      { label: 'Duplicate', icon: Copy, action: () => handleDuplicate(qtn) },
    ];

    if (qtn.status === 'Draft' || qtn.status === 'Sent') {
      items.splice(1, 0, { label: 'Edit', icon: Edit, action: () => { setFormQuotation(qtn); setMoreOpen(null); } });
    }

    if (qtn.status === 'Draft') {
      items.push({ label: 'Mark as Sent', icon: Send, action: () => handleStatusChange(qtn.id, 'Sent') });
      items.push({ label: 'Delete', icon: Trash, action: () => { setDeleteConfirm(qtn.id); setMoreOpen(null); }, danger: true });
    }
    if (qtn.status === 'Sent') {
      items.push({ label: 'Mark as Accepted', icon: TickCircle, action: () => handleStatusChange(qtn.id, 'Accepted') });
      items.push({ label: 'Mark as Rejected', icon: CloseCircle, action: () => handleStatusChange(qtn.id, 'Rejected') });
    }
    if (qtn.status === 'Accepted') {
      items.push({ label: 'Create Project', icon: NoteAdd, action: () => handleCreateProject(qtn) });
    }

    return items;
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Quotations</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Create, send and track client quotations.</p>
        </div>
        {hasPermission('quotations.create') && (<button
          onClick={() => setFormQuotation(emptyQuotation())}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
        >
          <Add size={18} variant="Linear" color="currentColor" /><span>New Quotation</span>
        </button>)}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Quotations', i: DocumentText, v: stats.total, c: '#64748B' },
          { l: 'Pending Approval', i: Timer, v: stats.pendingApproval, c: '#3B82F6' },
          { l: 'Accepted', i: TickCircle, v: stats.accepted, c: '#16A34A' },
          { l: 'Expired', i: CloseCircle, v: stats.expired, c: '#F59E0B' },
        ].map(({ l, i: Icon, v, c }) => (
          <div key={l} className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon size={14} variant="Linear" color={c} />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 leading-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-4 py-3 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" />
            <input
              type="text" placeholder="Search quotations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QuotationStatus | 'All')}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"
            >
              <option value="All">All</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
            <ArrowDown2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} variant="Linear" color="currentColor" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Sort size={14} variant="Linear" color="currentColor" />Sort
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] py-16 text-center">
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <DocumentText size={24} variant="Bulk" color="#CBD5E1" />
          </div>
          <h3 className="text-base font-medium text-slate-900">No quotations yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Create your first quotation to send a formal price offer to a client.</p>
          {hasPermission('quotations.create') && (<button
            onClick={() => setFormQuotation(emptyQuotation())}
            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors"
          >
            <Add size={16} variant="Linear" color="currentColor" /><span>New Quotation</span>
          </button>)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quotation</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Valid Until</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Last Updated</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((qtn) => (
                  <tr key={qtn.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <div>
                        <p className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{qtn.number}</p>
                        <p className="text-[12px] text-slate-400">{qtn.issueDate}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <div>
                        <p className="text-[13px] font-medium text-slate-900">{qtn.contactName}</p>
                        <p className="text-[12px] text-slate-400 truncate max-w-[140px]">{qtn.companyName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <p className="text-[12px] text-slate-600 truncate max-w-[200px]">{qtn.description}</p>
                    </td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <span className="text-[13px] font-semibold text-slate-900">{formatCurrencyShort(qtn.amount, qtn.currency)}</span>
                    </td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[qtn.status]}`}>{qtn.status}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <span className="text-[12px] text-slate-500">{qtn.validUntil}</span>
                    </td>
                    <td className="px-5 py-3 hidden xl:table-cell cursor-pointer" onClick={() => setDetailQuotation(qtn)}>
                      <span className="text-[12px] text-slate-500">{qtn.lastUpdated}</span>
                    </td>
                    <td className="px-5 py-3 relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMoreOpen(moreOpen === qtn.id ? null : qtn.id); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                      >
                        <More size={15} variant="Linear" color="currentColor" />
                      </button>
                      {moreOpen === qtn.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMoreOpen(null); }} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1 z-20" onClick={e => e.stopPropagation()}>
                            {actionsForStatus(qtn).map((a) => (
                              <button
                                key={a.label}
                                onClick={a.action}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                <a.icon size={14} variant="Linear" color="currentColor" />
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Slide-in Panel */}
      {detailQuotation && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailQuotation(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full sm:max-w-lg bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <button onClick={() => setDetailQuotation(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[detailQuotation.status]}`}>{detailQuotation.status}</span>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-sm font-semibold shrink-0">{detailQuotation.initials}</div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{detailQuotation.number}</h2>
                  <p className="text-sm text-slate-500">{detailQuotation.companyName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Amount</p>
                  <p className="text-base font-bold text-slate-900">{formatCurrency(detailQuotation.amount, detailQuotation.currency)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Title</p>
                  <p className="text-sm font-medium text-slate-700">{detailQuotation.title}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Issue Date</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700"><Calendar size={14} variant="Linear" color="#94A3B8" />{detailQuotation.issueDate}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Valid Until</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700"><Timer size={14} variant="Linear" color="#94A3B8" />{detailQuotation.validUntil}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Client Information</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-slate-900 font-medium">{detailQuotation.contactName}</p>
                    <p className="text-slate-500">{detailQuotation.contactEmail}</p>
                    <p className="text-slate-500">{detailQuotation.contactPhone}</p>
                  </div>
                </div>

                {detailQuotation.lineItems.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Line Items</p>
                    <div className="space-y-2">
                      {detailQuotation.lineItems.map((li) => (
                        <div key={li.id} className="flex justify-between items-start bg-slate-50 rounded-lg p-2.5">
                          <div>
                            <p className="text-[13px] font-medium text-slate-900">{li.item}</p>
                            <p className="text-[11px] text-slate-400">{li.description}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{li.quantity} x {formatCurrency(li.unitPrice, detailQuotation.currency)}</p>
                          </div>
                          <p className="text-[13px] font-semibold text-slate-900">{formatCurrency(li.lineTotal, detailQuotation.currency)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailQuotation.paymentTerms && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Terms</p>
                    <p className="text-sm text-slate-600">{detailQuotation.paymentTerms}</p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setDetailQuotation(null); setFormQuotation(detailQuotation); }} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"><Edit size={14} variant="Linear" color="#94A3B8" />Edit</button>
                    <button onClick={() => handleDownloadPDF(detailQuotation)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"><Printer size={14} variant="Linear" color="#94A3B8" />Download PDF</button>
                    {detailQuotation.status === 'Draft' && <button onClick={() => handleStatusChange(detailQuotation.id, 'Sent')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-blue-600 hover:bg-blue-50 transition-colors"><Send size={14} variant="Linear" color="currentColor" />Mark as Sent</button>}
                    {detailQuotation.status === 'Sent' && <button onClick={() => handleStatusChange(detailQuotation.id, 'Accepted')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors"><TickCircle size={14} variant="Linear" color="currentColor" />Accept</button>}
                    {detailQuotation.status === 'Sent' && <button onClick={() => handleStatusChange(detailQuotation.id, 'Rejected')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-red-600 hover:bg-red-50 transition-colors"><CloseCircle size={14} variant="Linear" color="currentColor" />Reject</button>}
                    {detailQuotation.status === 'Accepted' && <button onClick={() => handleCreateProject(detailQuotation)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"><NoteAdd size={14} variant="Linear" color="#94A3B8" />Create Project</button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Quotation Form Panel */}
      {formQuotation && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setFormQuotation(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full sm:max-w-xl bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <button onClick={() => setFormQuotation(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <h3 className="text-base font-semibold text-slate-900">{formQuotation.id ? 'Edit Quotation' : 'New Quotation'}</h3>
              <div className="w-8" />
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Quotation Information */}
              <section>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quotation Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Quotation Number</label>
                    <input type="text" value={formQuotation.number} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Currency</label>
                    <select value={formQuotation.currency} onChange={(e) => setFormQuotation({ ...formQuotation, currency: e.target.value as 'UGX' | 'USD' })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                      <option value="UGX">UGX</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Quotation Title <span className="text-red-400">*</span></label>
                    <input type="text" value={formQuotation.title} onChange={(e) => setFormQuotation({ ...formQuotation, title: e.target.value })} placeholder="e.g. Katrina Fashion Website Development" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label>
                    <input type="text" value={formQuotation.issueDate} onChange={(e) => setFormQuotation({ ...formQuotation, issueDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Valid Until</label>
                    <input type="text" value={formQuotation.validUntil} onChange={(e) => setFormQuotation({ ...formQuotation, validUntil: e.target.value })} placeholder="e.g. Aug 15, 2026" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>
              </section>

              {/* Client Information */}
              <section className="border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Client Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Contact Name</label>
                    <input type="text" value={formQuotation.contactName} onChange={(e) => setFormQuotation({ ...formQuotation, contactName: e.target.value })} placeholder="Contact name" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                    <input type="text" value={formQuotation.companyName} onChange={(e) => setFormQuotation({ ...formQuotation, companyName: e.target.value })} placeholder="Company name" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                    <input type="email" value={formQuotation.contactEmail} onChange={(e) => setFormQuotation({ ...formQuotation, contactEmail: e.target.value })} placeholder="client@email.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                    <input type="text" value={formQuotation.contactPhone} onChange={(e) => setFormQuotation({ ...formQuotation, contactPhone: e.target.value })} placeholder="+256 ..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>
              </section>

              {/* Line Items */}
              <section className="border-t border-slate-100 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line Items</p>
                  <button
                    onClick={() => {
                      const newItem: QuotationLineItem = {
                        id: `li-${Date.now()}`,
                        item: '',
                        description: '',
                        quantity: 1,
                        unitPrice: 0,
                        lineTotal: 0,
                      };
                      setFormQuotation({ ...formQuotation, lineItems: [...formQuotation.lineItems, newItem] });
                    }}
                    className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] transition-colors flex items-center gap-1"
                  >
                    <Add size={14} variant="Linear" color="currentColor" />Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {formQuotation.lineItems.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No line items added yet. Click "Add Item" to begin.</p>
                  )}
                  {formQuotation.lineItems.map((li, idx) => (
                    <div key={li.id} className="bg-slate-50 rounded-lg p-3 space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text" value={li.item}
                            onChange={(e) => {
                              const items = [...formQuotation.lineItems];
                              items[idx] = { ...items[idx], item: e.target.value };
                              setFormQuotation({ ...formQuotation, lineItems: items });
                            }}
                            placeholder="Item or service" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const items = formQuotation.lineItems.filter((_, i) => i !== idx);
                            setFormQuotation({ ...formQuotation, lineItems: items });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash size={14} variant="Linear" color="currentColor" />
                        </button>
                      </div>
                      <input
                        type="text" value={li.description}
                        onChange={(e) => {
                          const items = [...formQuotation.lineItems];
                          items[idx] = { ...items[idx], description: e.target.value };
                          setFormQuotation({ ...formQuotation, lineItems: items });
                        }}
                        placeholder="Description" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <div className="flex gap-2">
                        <div className="w-20">
                          <label className="block text-[10px] text-slate-400 mb-0.5">Qty</label>
                          <input
                            type="number" value={li.quantity}
                            onChange={(e) => {
                              const qty = Number(e.target.value) || 0;
                              const items = [...formQuotation.lineItems];
                              items[idx] = { ...items[idx], quantity: qty, lineTotal: qty * items[idx].unitPrice };
                              setFormQuotation({ ...formQuotation, lineItems: items });
                            }}
                            min="1" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-400 mb-0.5">Unit Price</label>
                          <input
                            type="number" value={li.unitPrice}
                            onChange={(e) => {
                              const price = Number(e.target.value) || 0;
                              const items = [...formQuotation.lineItems];
                              items[idx] = { ...items[idx], unitPrice: price, lineTotal: items[idx].quantity * price };
                              setFormQuotation({ ...formQuotation, lineItems: items });
                            }}
                            min="0" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] text-slate-400 mb-0.5">Line Total</label>
                          <input type="text" readOnly value={formatCurrency(li.lineTotal, formQuotation.currency)} className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700 outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Totals */}
              <section className="border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Totals</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700">
                      {formatCurrency(formQuotation.lineItems.reduce((sum, li) => sum + li.lineTotal, 0), formQuotation.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-24">
                        <select
                          value={formQuotation.discountType}
                          onChange={(e) => setFormQuotation({ ...formQuotation, discountType: e.target.value as 'fixed' | 'percentage' })}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="percentage">%</option>
                        </select>
                      </div>
                      <input
                        type="number" value={formQuotation.discount || ''}
                        onChange={(e) => setFormQuotation({ ...formQuotation, discount: Number(e.target.value) || 0 })}
                        placeholder="Discount" className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -{formatCurrency(
                        formQuotation.discountType === 'percentage'
                          ? Math.round((formQuotation.lineItems.reduce((sum, li) => sum + li.lineTotal, 0) * formQuotation.discount) / 100)
                          : formQuotation.discount,
                        formQuotation.currency
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                      <input type="checkbox" checked={formQuotation.taxEnabled} onChange={(e) => setFormQuotation({ ...formQuotation, taxEnabled: e.target.checked })} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      Tax
                    </label>
                    {formQuotation.taxEnabled && (
                      <input
                        type="number" value={formQuotation.tax || ''}
                        onChange={(e) => setFormQuotation({ ...formQuotation, tax: Number(e.target.value) || 0 })}
                        placeholder="Tax amount" className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">Total</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(
                        (() => {
                          const sub = formQuotation.lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
                          const disc = formQuotation.discountType === 'percentage' ? Math.round(sub * formQuotation.discount / 100) : formQuotation.discount;
                          const afterDisc = sub - disc;
                          return afterDisc + (formQuotation.taxEnabled ? formQuotation.tax : 0);
                        })(),
                        formQuotation.currency
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {/* Notes and Terms */}
              <section className="border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notes & Terms</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Client Note</label>
                    <textarea value={formQuotation.clientNote} onChange={(e) => setFormQuotation({ ...formQuotation, clientNote: e.target.value })} rows={2} placeholder="Add a note for the client..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Payment Terms</label>
                    <textarea value={formQuotation.paymentTerms} onChange={(e) => setFormQuotation({ ...formQuotation, paymentTerms: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Delivery Timeline</label>
                    <input type="text" value={formQuotation.deliveryTimeline} onChange={(e) => setFormQuotation({ ...formQuotation, deliveryTimeline: e.target.value })} placeholder="e.g. 12 weeks from project kick-off" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Quotation Terms</label>
                    <textarea value={formQuotation.quotationTerms} onChange={(e) => setFormQuotation({ ...formQuotation, quotationTerms: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Additional Conditions</label>
                    <textarea value={formQuotation.additionalConditions} onChange={(e) => setFormQuotation({ ...formQuotation, additionalConditions: e.target.value })} rows={2} placeholder="Any additional conditions..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Status</p>
                <select value={formQuotation.status} onChange={(e) => setFormQuotation({ ...formQuotation, status: e.target.value as QuotationStatus })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Expired">Expired</option>
                </select>
              </section>

              {/* Save Button */}
              <div className="flex gap-3 pt-2 pb-4">
                <button onClick={() => setFormQuotation(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSaveForm} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full text-sm font-semibold transition-colors">Save Quotation</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Delete Quotation</h3>
            <p className="text-sm text-slate-500 mb-5">Are you sure you want to delete this quotation? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Preview Modal */}
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { width: 210mm; height: 297mm; background: white !important; overflow: visible !important; }
          body * { visibility: hidden; }
          #qtn-preview-doc, #qtn-preview-doc * { visibility: visible; }
          #qtn-preview-doc {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 12mm !important;
            margin: 0 !important;
            background: white !important;
          }
          #qtn-preview-toolbar, #qtn-preview-scroll { display: none !important; }
        }
      `}</style>
      {previewQuotation && (
        <div className="fixed inset-0 z-[70] flex flex-col" role="dialog" aria-label="Quotation preview" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={closePreview} />

          {/* Toolbar */}
          <div id="qtn-preview-toolbar" className="relative z-10 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={closePreview}
                aria-label="Close preview"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
              >
                <ArrowLeft size={18} variant="Linear" color="currentColor" />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{previewQuotation.number}</p>
                <p className="text-xs text-slate-400 truncate">{previewQuotation.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                aria-label="Print quotation"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <Printer size={14} variant="Linear" color="currentColor" />Print
              </button>
              <button
                onClick={handleDownloadFile}
                aria-label="Download PDF"
                disabled={previewLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer size={14} variant="Linear" color="currentColor" />Download PDF
              </button>
            </div>
          </div>

          {/* Scrollable Preview Area */}
          <div
            id="qtn-preview-scroll"
            ref={previewScrollRef}
            className="relative z-10 flex-1 overflow-y-auto bg-slate-200 p-6 lg:p-10"
          >
            <div className="flex justify-center">
              {previewLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="h-8 w-8 border-2 border-slate-300 border-t-[#16A34A] rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-500">Preparing quotation preview...</p>
                </div>
              ) : (
                <div
                  id="qtn-preview-doc"
                  ref={previewDocRef}
                  className="bg-white shadow-[0_2px_16px_rgba(15,23,42,0.10)] w-full max-w-[794px] p-10 lg:p-12 print:p-0 print:shadow-none print:max-w-none"
                  style={{ minHeight: 'calc(794px * 297 / 210)' }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TOGASHI<span className="text-[#16A34A]"> TECHNOLOGIES</span></h1>
                      <p className="text-[13px] text-slate-500 mt-1">Plot 24, Kampala Road, Kampala, Uganda</p>
                      <p className="text-[13px] text-slate-500">info@togashitech.com &middot; +256 700 000 000</p>
                    </div>
                    <div className="text-right shrink-0">
                      <h2 className="text-xl font-bold text-slate-800 tracking-wide">QUOTATION</h2>
                      <p className="text-sm font-semibold text-slate-900 mt-1.5">{previewQuotation.number}</p>
                      <p className="text-xs text-slate-500 mt-1">Issue Date: {previewQuotation.issueDate}</p>
                      <p className="text-xs text-slate-500">Valid Until: {previewQuotation.validUntil}</p>
                    </div>
                  </div>

                  {/* Bill To / Project */}
                  <div className="grid grid-cols-2 gap-10 mb-10">
                    <div>
                      <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
                      <p className="text-sm font-semibold text-slate-900">{previewQuotation.contactName}</p>
                      <p className="text-sm text-slate-600">{previewQuotation.companyName}</p>
                      <p className="text-sm text-slate-500 mt-1">{previewQuotation.contactEmail}</p>
                      <p className="text-sm text-slate-500">{previewQuotation.contactPhone}</p>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Project</h3>
                      <p className="text-sm font-semibold text-slate-900">{previewQuotation.title}</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{previewQuotation.description}</p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Item</th>
                          <th className="text-left pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                          <th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[8%]">Qty</th>
                          <th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Unit Price</th>
                          <th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewQuotation.lineItems.map((li) => (
                          <tr key={li.id} className="break-inside-avoid">
                            <td className="py-2.5 px-1 text-[13px] font-medium text-slate-900 align-top">{li.item}</td>
                            <td className="py-2.5 px-1 text-xs text-slate-500 align-top leading-relaxed">{li.description}</td>
                            <td className="py-2.5 px-1 text-[13px] text-slate-700 text-right align-top">{li.quantity}</td>
                            <td className="py-2.5 px-1 text-[13px] text-slate-700 text-right align-top whitespace-nowrap">{formatCurrency(li.unitPrice, previewQuotation.currency)}</td>
                            <td className="py-2.5 px-1 text-[13px] font-semibold text-slate-900 text-right align-top whitespace-nowrap">{formatCurrency(li.lineTotal, previewQuotation.currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-10">
                    <div className="w-64 space-y-1 border-t border-slate-100 pt-3">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium text-slate-700 whitespace-nowrap">{formatCurrency(previewQuotation.lineItems.reduce((s, li) => s + li.lineTotal, 0), previewQuotation.currency)}</span>
                      </div>
                      {previewQuotation.discount > 0 && (
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-500">Discount{previewQuotation.discountType === 'percentage' ? ` (${previewQuotation.discount}%)` : ''}</span>
                          <span className="font-medium text-red-600 whitespace-nowrap">
                            -{formatCurrency(
                              previewQuotation.discountType === 'percentage'
                                ? Math.round(previewQuotation.lineItems.reduce((s, li) => s + li.lineTotal, 0) * previewQuotation.discount / 100)
                                : previewQuotation.discount,
                              previewQuotation.currency
                            )}
                          </span>
                        </div>
                      )}
                      {previewQuotation.taxEnabled && previewQuotation.tax > 0 && (
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-500">Tax</span>
                          <span className="font-medium text-slate-700 whitespace-nowrap">{formatCurrency(previewQuotation.tax, previewQuotation.currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[15px] pt-3 mt-1 border-t-2 border-slate-300">
                        <span className="font-bold text-slate-800">Total</span>
                        <span className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(previewQuotation.amount, previewQuotation.currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="border-t-2 border-slate-200 pt-6 space-y-5">
                    {previewQuotation.paymentTerms && (
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Payment Terms</h3>
                        <p className="text-sm text-slate-700 leading-relaxed">{previewQuotation.paymentTerms}</p>
                      </div>
                    )}
                    {previewQuotation.deliveryTimeline && (
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Delivery Timeline</h3>
                        <p className="text-sm text-slate-700">{previewQuotation.deliveryTimeline}</p>
                      </div>
                    )}
                    {previewQuotation.quotationTerms && (
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Terms &amp; Conditions</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{previewQuotation.quotationTerms}</p>
                      </div>
                    )}
                    {previewQuotation.additionalConditions && (
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Additional Conditions</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{previewQuotation.additionalConditions}</p>
                      </div>
                    )}
                  </div>

                  {/* Signatures */}
                  <div className="mt-14 grid grid-cols-2 gap-20 break-inside-avoid">
                    <div>
                      <div className="border-t border-slate-300 pt-4">
                        <p className="text-sm font-semibold text-slate-900 text-center">Auth. Signature</p>
                        <p className="text-[11px] text-slate-400 text-center mt-0.5">Togashi Technologies</p>
                        <p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-slate-300 pt-4">
                        <p className="text-sm font-semibold text-slate-900 text-center">Client Signature</p>
                        <p className="text-[11px] text-slate-400 text-center mt-0.5">{previewQuotation.contactName}</p>
                        <p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-16 text-center">
                    <p className="text-[11px] text-slate-400">
                      {previewQuotation.number} &middot; Togashi Technologies &middot; Plot 24, Kampala Road, Kampala, Uganda
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
