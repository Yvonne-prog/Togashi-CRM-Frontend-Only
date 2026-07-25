import { useState, useMemo, useEffect, useRef } from 'react';
import { invoices as mockInvoices } from '@/data/dashboardMockData';
import type { Invoice, InvoiceStatus, InvoiceLineItem, PaymentMethod, InvoicePayment } from '@/data/dashboardMockData';
import {
  Add, SearchNormal1, Sort, More, ArrowLeft, ArrowDown2, DocumentText,
  Eye, Edit, Copy, Trash, TickCircle, Send, Printer, Timer, Calendar,
  Money, CloseCircle, NoteAdd, Sms, WalletAdd,
} from 'iconsax-react';

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  'Draft': 'bg-slate-100 text-slate-600',
  'Sent': 'bg-blue-50 text-blue-700',
  'Partially Paid': 'bg-orange-50 text-orange-700',
  'Paid': 'bg-emerald-50 text-emerald-700',
  'Overdue': 'bg-red-50 text-red-600',
  'Cancelled': 'bg-slate-100 text-slate-400',
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

let nextInvSeq = 11;

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const num = String(nextInvSeq++).padStart(3, '0');
  return `TGL-INV-${year}-${num}`;
}

function computeStatus(inv: Invoice): InvoiceStatus {
  if (inv.status === 'Draft' || inv.status === 'Cancelled') return inv.status;
  if (inv.balance <= 0) return 'Paid';
  const due = new Date(inv.dueDate + ', 2026');
  const now = new Date();
  if (inv.amountPaid > 0 && inv.balance > 0) return 'Partially Paid';
  if (due < now && inv.balance > 0) return 'Overdue';
  if (inv.amountPaid <= 0) return 'Sent';
  return inv.status;
}

function emptyInvoice(): Invoice {
  return {
    id: '',
    number: generateInvoiceNumber(),
    title: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    billingAddress: '',
    description: '',
    total: 0,
    amountPaid: 0,
    balance: 0,
    currency: 'UGX',
    status: 'Draft',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dueDate: '',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lineItems: [],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 0,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: '',
    internalNote: '',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    payments: [],
    initials: '',
  };
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState('newest');
  const [moreOpen, setMoreOpen] = useState<string | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [formInvoice, setFormInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<{ inv: Invoice; amount: string; method: PaymentMethod; reference: string; notes: string } | null>(null);
  const [reminderForm, setReminderForm] = useState<{ inv: Invoice; message: string } | null>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewInvoice) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPreviewInvoice(null); setPreviewLoading(false); }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    if (previewScrollRef.current) previewScrollRef.current.scrollTop = 0;
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewInvoice]);

  const stats = useMemo(() => {
    const active = invoices.filter(i => i.status !== 'Cancelled');
    const totalInvoiced = active.reduce((s, i) => s + i.total, 0);
    const amountPaid = active.reduce((s, i) => s + i.amountPaid, 0);
    const amountDue = active.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').reduce((s, i) => s + i.balance, 0);
    const overdueAmount = active.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.balance, 0);
    return { totalInvoiced, amountPaid, amountDue, overdueAmount };
  }, [invoices]);

  const filtered = useMemo(() => {
    const qs = search.toLowerCase();
    let result = invoices.filter(i => {
      const m = !qs || i.number.toLowerCase().includes(qs) || i.contactName.toLowerCase().includes(qs) || i.companyName.toLowerCase().includes(qs) || i.title.toLowerCase().includes(qs) || (i.relatedQuotationNumber || '').toLowerCase().includes(qs);
      return m && (statusFilter === 'All' || i.status === statusFilter);
    });
    const sortFns: Record<string, (a: Invoice, b: Invoice) => number> = {
      newest: (a, b) => new Date(b.issueDate + ', 2026').getTime() - new Date(a.issueDate + ', 2026').getTime(),
      oldest: (a, b) => new Date(a.issueDate + ', 2026').getTime() - new Date(b.issueDate + ', 2026').getTime(),
      'due-date': (a, b) => { const da = new Date(a.dueDate + ', 2026').getTime(); const db = new Date(b.dueDate + ', 2026').getTime(); return da - db; },
      'highest-total': (a, b) => b.total - a.total,
      'lowest-total': (a, b) => a.total - b.total,
      'highest-balance': (a, b) => b.balance - a.balance,
      status: (a, b) => a.status.localeCompare(b.status),
    };
    return result.sort(sortFns[sortBy] || sortFns.newest);
  }, [invoices, search, statusFilter, sortBy]);

  function handleSaveForm() {
    if (!formInvoice) return;
    const isNew = !formInvoice.id;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const sub = formInvoice.lineItems.reduce((s, li) => s + li.lineTotal, 0);
    const disc = formInvoice.discountType === 'percentage' ? Math.round(sub * formInvoice.discount / 100) : formInvoice.discount;
    const total = sub - disc + (formInvoice.taxEnabled ? formInvoice.tax : 0);
    const updated: Invoice = {
      ...formInvoice,
      id: isNew ? `inv-${nextInvSeq - 1}` : formInvoice.id,
      lastUpdated: now,
      subtotal: sub,
      total,
      balance: total - formInvoice.amountPaid,
    };
    setInvoices(prev => isNew ? [updated, ...prev] : prev.map(i => i.id === updated.id ? updated : i));
    setFormInvoice(null);
  }

  function handleDelete(id: string) {
    setInvoices(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null); setMoreOpen(null);
    if (detailInvoice?.id === id) setDetailInvoice(null);
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    setInvoices(prev => prev.map(i => {
      if (i.id !== id) return i;
      const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return { ...i, status, lastUpdated: now };
    }));
    setMoreOpen(null);
  }

  function handleRecordPayment() {
    if (!paymentForm) return;
    const amount = Number(paymentForm.amount) || 0;
    if (amount <= 0) return;
    const id = paymentForm.inv.id;
    setInvoices(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newPaid = i.amountPaid + amount;
      const newBalance = Math.max(0, i.total - newPaid);
      const newPayment: InvoicePayment = {
        id: `pay-${Date.now()}`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount, method: paymentForm.method, reference: paymentForm.reference, notes: paymentForm.notes,
      };
      const updated = { ...i, amountPaid: newPaid, balance: newBalance, payments: [...i.payments, newPayment], lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } as Invoice;
      updated.status = computeStatus(updated);
      return updated;
    }));
    setPaymentForm(null);
  }

  function handleCreateFromQuotation(qtnId: string) {
    const qtn = (window as any).__quotations?.find((q: any) => q.id === qtnId);
    if (!qtn) return;
    const inv = emptyInvoice();
    inv.contactName = qtn.contactName; inv.contactEmail = qtn.contactEmail; inv.contactPhone = qtn.contactPhone;
    inv.companyName = qtn.companyName; inv.title = qtn.title; inv.currency = qtn.currency;
    inv.relatedQuotationId = qtn.id; inv.relatedQuotationNumber = qtn.number;
    inv.relatedDealId = qtn.relatedDealId; inv.relatedDealTitle = qtn.relatedDealTitle;
    inv.relatedProjectId = qtn.relatedProjectId; inv.relatedProjectName = qtn.relatedProjectName;
    inv.paymentTerms = qtn.paymentTerms; inv.clientNote = qtn.clientNote;
    inv.lineItems = qtn.lineItems.map((li: any) => ({ ...li, id: `ivli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }));
    inv.description = qtn.description;
    setFormInvoice(inv);
    setMoreOpen(null);
  }

  function handlePreview(qtn: Invoice) { setMoreOpen(null); setPreviewLoading(true); setPreviewInvoice(qtn); requestAnimationFrame(() => requestAnimationFrame(() => setPreviewLoading(false))); }
  function handlePrint() { window.print(); }
  function generateFileName(inv: Invoice) { const c = inv.companyName.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); return `${inv.number}-${c}.pdf`; }

  function buildDocumentHTML(inv: Invoice): string {
    const sym = CURRENCY_SYMBOLS[inv.currency] || inv.currency;
    const fmt = (v: number) => sym === '$' ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}` : `${sym} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}`;
    const sub = inv.lineItems.reduce((s, li) => s + li.lineTotal, 0);
    const disc = inv.discountType === 'percentage' ? Math.round(sub * inv.discount / 100) : inv.discount;
    const afterDisc = sub - disc;
    const total = afterDisc + (inv.taxEnabled ? inv.tax : 0);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${inv.number}</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;line-height:1.5;padding:0}
@page{size:A4;margin:12mm}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}.hdr-l h1{font-size:24px;font-weight:700;color:#0f172a}.hdr-l h1 span{color:#16A34A}.hdr-l p{font-size:13px;color:#64748b;margin-top:2px}.hdr-r{text-align:right}.hdr-r h2{font-size:20px;font-weight:700;color:#1e293b;letter-spacing:.02em}.hdr-r .n{font-size:14px;font-weight:600;color:#0f172a;margin-top:6px}.hdr-r .d{font-size:12px;color:#64748b;margin-top:2px}.sec{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}.sec h3,.ref h3{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}.sec p,.ref p{font-size:13px}.sec .nm{font-weight:600}.sec .st{color:#64748b;margin-top:4px}.ref{margin-bottom:32px}table{width:100%;border-collapse:collapse;margin-bottom:40px}th{text-align:left;padding:0 4px 10px 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #e2e8f0}th.r{text-align:right}td{padding:10px 4px;font-size:13px;border-bottom:1px solid #f1f5f9;vertical-align:top}td.r{text-align:right}td.it{font-weight:500}td.dc{font-size:12px;color:#64748b}td.nw{white-space:nowrap}td.bf{font-weight:600}
.tot{display:flex;justify-content:flex-end;margin-bottom:40px}.tot-b{width:280px;border-top:1px solid #f1f5f9;padding-top:12px}.tot-b .tr{display:flex;justify-content:space-between;font-size:13px;padding:2px 0}.tot-b .tr .l{color:#64748b}.tot-b .tr .v{font-weight:500;white-space:nowrap}.tot-b .tr .nr{color:#dc2626}.tot-b .grand{display:flex;justify-content:space-between;font-size:15px;font-weight:700;border-top:2px solid #cbd5e1;padding-top:12px;margin-top:6px}.trms{border-top:2px solid #e2e8f0;padding-top:24px}.trms .ts{margin-bottom:20px}.trms .ts:last-child{margin-bottom:0}.trms h3{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}.trms p{font-size:13px;color:#334155;line-height:1.6}.sigs{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:56px}.sigs .sg{border-top:1px solid #cbd5e1;padding-top:16px;text-align:center}.sigs .sg .who{font-size:14px;font-weight:600;color:#0f172a}.sigs .sg .org{font-size:11px;color:#94a3b8;margin-top:2px}.sigs .sg .dt{font-size:11px;color:#94a3b8;margin-top:16px}.ftr{margin-top:64px;text-align:center;font-size:11px;color:#94a3b8}@media print{body{padding:0;margin:0}}</style></head><body>
<div class="hdr"><div class="hdr-l"><h1>TOGASHI<span> TECHNOLOGIES</span></h1><p>Plot 24, Kampala Road, Kampala, Uganda</p><p>info@togashitech.com &middot; +256 700 000 000</p></div><div class="hdr-r"><h2>INVOICE</h2><p class="n">${inv.number}</p><p class="d">Issue Date: ${inv.issueDate}</p><p class="d">Due Date: ${inv.dueDate}</p>${inv.purchaseOrderNumber ? `<p class="d">PO Number: ${inv.purchaseOrderNumber}</p>` : ''}</div></div>
<div class="sec"><div><h3>Bill To</h3><p class="nm">${inv.contactName}</p><p>${inv.companyName}</p>${inv.billingAddress ? `<p class="st">${inv.billingAddress}</p>` : ''}<p class="st">${inv.contactEmail}</p><p class="st">${inv.contactPhone}</p></div><div><h3>Project</h3><p class="nm">${inv.title}</p><p class="st">${inv.description}</p></div></div>
${inv.relatedQuotationNumber ? `<div class="ref"><h3>Reference</h3><p>Quotation: ${inv.relatedQuotationNumber}</p>${inv.relatedProjectName ? `<p class="st">Project: ${inv.relatedProjectName}</p>` : ''}</div>` : ''}
<table><thead><tr><th style="width:18%">Item</th><th>Description</th><th class="r" style="width:8%">Qty</th><th class="r" style="width:18%">Unit Price</th><th class="r" style="width:18%">Total</th></tr></thead><tbody>${inv.lineItems.map(li => `<tr><td class="it">${li.item}</td><td class="dc">${li.description}</td><td class="r">${li.quantity}</td><td class="r nw">${fmt(li.unitPrice)}</td><td class="r nw bf">${fmt(li.lineTotal)}</td></tr>`).join('')}</tbody></table>
<div class="tot"><div class="tot-b"><div class="tr"><span class="l">Subtotal</span><span class="v">${fmt(sub)}</span></div>${inv.discount > 0 ? `<div class="tr"><span class="l">Discount${inv.discountType === 'percentage' ? ` (${inv.discount}%)` : ''}</span><span class="v nr">-${fmt(disc)}</span></div>` : ''}${inv.taxEnabled && inv.tax > 0 ? `<div class="tr"><span class="l">Tax</span><span class="v">${fmt(inv.tax)}</span></div>` : ''}<div class="grand"><span>Total</span><span>${fmt(total)}</span></div>${inv.amountPaid > 0 ? `<div class="tr" style="margin-top:8px"><span class="l">Amount Paid</span><span class="v">${fmt(inv.amountPaid)}</span></div><div class="tr" style="margin-top:2px"><span class="l" style="font-weight:600;color:#0f172a">Balance Due</span><span class="v" style="font-weight:600">${fmt(inv.balance)}</span></div>` : ''}</div></div>
<div class="trms">${inv.paymentTerms ? `<div class="ts"><h3>Payment Terms</h3><p>${inv.paymentTerms}</p></div>` : ''}${inv.paymentInstructions ? `<div class="ts"><h3>Payment Instructions</h3><p>${inv.paymentInstructions}</p></div>` : ''}${inv.clientNote ? `<div class="ts"><h3>Notes</h3><p>${inv.clientNote}</p></div>` : ''}${inv.additionalConditions ? `<div class="ts"><h3>Additional Conditions</h3><p>${inv.additionalConditions}</p></div>` : ''}</div>
<div class="sigs"><div class="sg"><p class="who">Auth. Signature</p><p class="org">Togashi Technologies</p><p class="dt">Date: ___________________</p></div><div class="sg"><p class="who">Client Signature</p><p class="org">${inv.contactName}</p><p class="dt">Date: ___________________</p></div></div>
<div class="ftr">${inv.number} &middot; Togashi Technologies &middot; Plot 24, Kampala Road, Kampala, Uganda</div>
</body></html>`;
  }

  function handleDownloadFile() {
    if (!previewInvoice) return;
    const html = buildDocumentHTML(previewInvoice);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = generateFileName(previewInvoice);
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function closePreview() { setPreviewInvoice(null); setPreviewLoading(false); }

  function actionsForInvoice(inv: Invoice) {
    const items: { label: string; icon: typeof Eye; action: () => void; danger?: boolean }[] = [
      { label: 'View', icon: Eye, action: () => { setDetailInvoice(inv); setMoreOpen(null); } },
      { label: 'Preview', icon: Printer, action: () => handlePreview(inv) },
      { label: 'Duplicate', icon: Copy, action: () => {
        setMoreOpen(null);
        const d = { ...inv, id: '', number: generateInvoiceNumber(), status: 'Draft' as InvoiceStatus, issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), payments: [], amountPaid: 0, balance: inv.total };
        setFormInvoice(d);
      }},
    ];
    if (inv.status === 'Draft' || inv.status === 'Sent') items.splice(1, 0, { label: 'Edit', icon: Edit, action: () => { setFormInvoice(inv); setMoreOpen(null); } });
    if (inv.status === 'Draft') { items.push({ label: 'Mark as Sent', icon: Send, action: () => handleStatusChange(inv.id, 'Sent') }); items.push({ label: 'Delete', icon: Trash, action: () => { setDeleteConfirm(inv.id); setMoreOpen(null); }, danger: true }); }
    if (inv.status === 'Sent' || inv.status === 'Partially Paid' || inv.status === 'Overdue') items.push({ label: 'Record Payment', icon: WalletAdd, action: () => { setPaymentForm({ inv, amount: String(inv.balance), method: 'Bank Transfer', reference: '', notes: '' }); setMoreOpen(null); } });
    if (inv.status === 'Sent' || inv.status === 'Partially Paid' || inv.status === 'Overdue') items.push({ label: 'Send Reminder', icon: Sms, action: () => { setReminderForm({ inv, message: `Dear ${inv.contactName},\n\nThis is a reminder that Invoice ${inv.number} for ${formatCurrency(inv.total, inv.currency)} is due on ${inv.dueDate}. The outstanding balance is ${formatCurrency(inv.balance, inv.currency)}.\n\nPlease arrange payment at your earliest convenience.\n\nThank you,\nTogashi Technologies` }); setMoreOpen(null); } });
    if (inv.status === 'Paid' || inv.status === 'Partially Paid') items.push({ label: 'Payment History', icon: Money, action: () => { setDetailInvoice(inv); setMoreOpen(null); } });
    if (inv.status === 'Sent' || inv.status === 'Partially Paid' || inv.status === 'Overdue') items.push({ label: 'Cancel', icon: CloseCircle, action: () => handleStatusChange(inv.id, 'Cancelled') });
    return items;
  }

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Invoices</h2><p className="text-slate-500 mt-0.5 text-sm">Create invoices and track client payments.</p></div>
        <button onClick={() => setFormInvoice(emptyInvoice())} className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"><Add size={18} variant="Linear" color="currentColor" /><span>New Invoice</span></button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Invoiced', i: DocumentText, v: formatCurrencyShort(stats.totalInvoiced), c: '#64748B' },
          { l: 'Amount Paid', i: TickCircle, v: formatCurrencyShort(stats.amountPaid), c: '#16A34A' },
          { l: 'Amount Due', i: Timer, v: formatCurrencyShort(stats.amountDue), c: '#3B82F6' },
          { l: 'Overdue Amount', i: CloseCircle, v: formatCurrencyShort(stats.overdueAmount), c: '#EF4444' },
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
          <div className="relative w-56"><SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" /><input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" /></div>
          <div className="relative"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value as InvoiceStatus | 'All')} className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"><option value="All">All</option><option value="Draft">Draft</option><option value="Sent">Sent</option><option value="Partially Paid">Partially Paid</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option><option value="Cancelled">Cancelled</option></select><ArrowDown2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} variant="Linear" color="currentColor" /></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative"><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="due-date">Due Date</option><option value="highest-total">Highest Total</option><option value="lowest-total">Lowest Total</option><option value="highest-balance">Highest Balance</option><option value="status">Status</option></select><ArrowDown2 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} variant="Linear" color="currentColor" /></div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"><Sort size={14} variant="Linear" color="currentColor" />Sort</button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] py-16 text-center">
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50"><DocumentText size={24} variant="Bulk" color="#CBD5E1" /></div>
          <h3 className="text-base font-medium text-slate-900">No invoices yet</h3><p className="text-xs text-slate-500 mt-1 mb-4">Create your first invoice to request payment from a client.</p>
          <button onClick={() => setFormInvoice(emptyInvoice())} className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors"><Add size={16} variant="Linear" color="currentColor" /><span>New Invoice</span></button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Invoice</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Description</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell text-right">Paid</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Balance</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Due Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(inv => {
                  const st = computeStatus(inv);
                  return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailInvoice(inv)}><div><p className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{inv.number}</p><p className="text-[12px] text-slate-400">{inv.issueDate}</p></div></td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailInvoice(inv)}><div><p className="text-[13px] font-medium text-slate-900">{inv.contactName}</p><p className="text-[12px] text-slate-400 truncate max-w-[140px]">{inv.companyName}</p></div></td>
                    <td className="px-5 py-3 hidden lg:table-cell cursor-pointer" onClick={() => setDetailInvoice(inv)}><p className="text-[12px] text-slate-600 truncate max-w-[200px]">{inv.description}</p></td>
                    <td className="px-5 py-3 text-right cursor-pointer" onClick={() => setDetailInvoice(inv)}><span className="text-[13px] font-semibold text-slate-900">{formatCurrencyShort(inv.total, inv.currency)}</span></td>
                    <td className="px-5 py-3 hidden md:table-cell text-right cursor-pointer" onClick={() => setDetailInvoice(inv)}><span className="text-[13px] font-medium text-emerald-700">{inv.amountPaid > 0 ? formatCurrencyShort(inv.amountPaid, inv.currency) : '—'}</span></td>
                    <td className="px-5 py-3 text-right cursor-pointer" onClick={() => setDetailInvoice(inv)}><span className={`text-[13px] font-semibold ${inv.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>{inv.balance > 0 ? formatCurrencyShort(inv.balance, inv.currency) : '—'}</span></td>
                    <td className="px-5 py-3 cursor-pointer" onClick={() => setDetailInvoice(inv)}><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[st]}`}>{st}</span></td>
                    <td className="px-5 py-3 hidden xl:table-cell cursor-pointer" onClick={() => setDetailInvoice(inv)}><span className="text-[12px] text-slate-500">{inv.dueDate}</span></td>
                    <td className="px-5 py-3 relative">
                      <button onClick={e => { e.stopPropagation(); setMoreOpen(moreOpen === inv.id ? null : inv.id); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><More size={15} variant="Linear" color="currentColor" /></button>
                      {moreOpen === inv.id && (<><div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setMoreOpen(null); }} /><div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1 z-20" onClick={e => e.stopPropagation()}>{actionsForInvoice(inv).map(a => (<button key={a.label} onClick={a.action} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50'}`}><a.icon size={14} variant="Linear" color="currentColor" />{a.label}</button>))}</div></>)}
                    </td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {detailInvoice && (() => { const st = computeStatus(detailInvoice); return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailInvoice(null)}><div className="absolute inset-0 bg-black/20" /><div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10"><button onClick={() => setDetailInvoice(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[st]}`}>{st}</span></div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-sm font-semibold shrink-0">{detailInvoice.initials}</div><div><h2 className="text-lg font-semibold text-slate-900">{detailInvoice.number}</h2><p className="text-sm text-slate-500">{detailInvoice.companyName}</p></div></div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total</p><p className="text-base font-bold text-slate-900">{formatCurrency(detailInvoice.total, detailInvoice.currency)}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Amount Paid</p><p className="text-base font-bold text-emerald-700">{formatCurrency(detailInvoice.amountPaid, detailInvoice.currency)}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Balance</p><p className={`text-base font-bold ${detailInvoice.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>{formatCurrency(detailInvoice.balance, detailInvoice.currency)}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Due Date</p><div className="flex items-center gap-1.5 text-sm text-slate-700"><Calendar size={14} variant="Linear" color="#94A3B8" />{detailInvoice.dueDate}</div></div>
            </div>
            <div className="space-y-4">
              {detailInvoice.relatedQuotationNumber && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Related Quotation</p><p className="text-sm text-slate-700">{detailInvoice.relatedQuotationNumber}</p></div>}
              {detailInvoice.relatedProjectName && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Related Project</p><p className="text-sm text-slate-700">{detailInvoice.relatedProjectName}</p></div>}
              {detailInvoice.payments.length > 0 && <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Payment History</p><div className="space-y-2">{(detailInvoice.payments).map(p => (<div key={p.id} className="bg-slate-50 rounded-lg p-2.5"><div className="flex justify-between"><span className="text-[13px] font-medium text-slate-900">{formatCurrency(p.amount, detailInvoice.currency)}</span><span className="text-[11px] text-slate-400">{p.date}</span></div><p className="text-[11px] text-slate-500 mt-0.5">{p.method}{p.reference ? ` · ${p.reference}` : ''}</p>{p.notes && <p className="text-[11px] text-slate-400 mt-0.5">{p.notes}</p>}</div>))}</div></div>}
              <div className="border-t border-slate-100 pt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p><div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setDetailInvoice(null); setFormInvoice(detailInvoice); }} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"><Edit size={14} variant="Linear" color="#94A3B8" />Edit</button>
                <button onClick={() => handlePreview(detailInvoice)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"><Printer size={14} variant="Linear" color="#94A3B8" />Preview</button>
                {(st === 'Sent' || st === 'Partially Paid' || st === 'Overdue') && <button onClick={() => { setPaymentForm({ inv: detailInvoice, amount: String(detailInvoice.balance), method: 'Bank Transfer', reference: '', notes: '' }); }} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-emerald-600 hover:bg-emerald-50"><WalletAdd size={14} variant="Linear" color="currentColor" />Record Payment</button>}
                {detailInvoice.status === 'Draft' && <button onClick={() => handleStatusChange(detailInvoice.id, 'Sent')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-blue-600 hover:bg-blue-50"><Send size={14} variant="Linear" color="currentColor" />Mark as Sent</button>}
                {(st === 'Sent' || st === 'Partially Paid' || st === 'Overdue') && <button onClick={() => handleStatusChange(detailInvoice.id, 'Cancelled')} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"><CloseCircle size={14} variant="Linear" color="#94A3B8" />Cancel</button>}
              </div></div>
            </div>
          </div>
        </div></div>
      );})()}

      {/* New/Edit Invoice Form */}
      {formInvoice && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setFormInvoice(null)}><div className="absolute inset-0 bg-black/20" /><div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10"><button onClick={() => setFormInvoice(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><h3 className="text-base font-semibold text-slate-900">{formInvoice.id ? 'Edit Invoice' : 'New Invoice'}</h3><div className="w-8" /></div>
          <div className="px-6 py-5 space-y-6">
            <section><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Invoice Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Invoice Number</label><input type="text" value={formInvoice.number} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Currency</label><select value={formInvoice.currency} onChange={e => setFormInvoice({ ...formInvoice, currency: e.target.value as 'UGX' | 'USD' })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"><option value="UGX">UGX</option><option value="USD">USD</option></select></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Invoice Title <span className="text-red-400">*</span></label><input type="text" value={formInvoice.title} onChange={e => setFormInvoice({ ...formInvoice, title: e.target.value })} placeholder="e.g. Katrina Fashion Website — Deposit" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label><input type="text" value={formInvoice.issueDate} onChange={e => setFormInvoice({ ...formInvoice, issueDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label><input type="text" value={formInvoice.dueDate} onChange={e => setFormInvoice({ ...formInvoice, dueDate: e.target.value })} placeholder="e.g. Aug 15, 2026" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Client Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Contact Name</label><input type="text" value={formInvoice.contactName} onChange={e => setFormInvoice({ ...formInvoice, contactName: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Company</label><input type="text" value={formInvoice.companyName} onChange={e => setFormInvoice({ ...formInvoice, companyName: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Email</label><input type="email" value={formInvoice.contactEmail} onChange={e => setFormInvoice({ ...formInvoice, contactEmail: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Phone</label><input type="text" value={formInvoice.contactPhone} onChange={e => setFormInvoice({ ...formInvoice, contactPhone: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Billing Address</label><input type="text" value={formInvoice.billingAddress} onChange={e => setFormInvoice({ ...formInvoice, billingAddress: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><div className="flex justify-between items-center mb-3"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line Items</p><button onClick={() => { const ni: InvoiceLineItem = { id: `ivli-${Date.now()}`, item: '', description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }; setFormInvoice({ ...formInvoice, lineItems: [...formInvoice.lineItems, ni] }); }} className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] transition-colors flex items-center gap-1"><Add size={14} variant="Linear" color="currentColor" />Add Item</button></div>
            <div className="space-y-2">{formInvoice.lineItems.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No line items added yet.</p>}
            {formInvoice.lineItems.map((li, idx) => (<div key={li.id} className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="flex gap-2"><div className="flex-1"><input type="text" value={li.item} onChange={e => { const items = [...formInvoice.lineItems]; items[idx] = { ...items[idx], item: e.target.value }; setFormInvoice({ ...formInvoice, lineItems: items }); }} placeholder="Item or service" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" /></div><button onClick={() => { setFormInvoice({ ...formInvoice, lineItems: formInvoice.lineItems.filter((_, i) => i !== idx) }); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash size={14} variant="Linear" color="currentColor" /></button></div>
              <input type="text" value={li.description} onChange={e => { const items = [...formInvoice.lineItems]; items[idx] = { ...items[idx], description: e.target.value }; setFormInvoice({ ...formInvoice, lineItems: items }); }} placeholder="Description" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" />
              <div className="flex gap-2">
                <div className="w-20"><label className="block text-[10px] text-slate-400 mb-0.5">Qty</label><input type="number" value={li.quantity} onChange={e => { const qty = Math.max(0, Number(e.target.value) || 0); const items = [...formInvoice.lineItems]; items[idx] = { ...items[idx], quantity: qty, lineTotal: qty * items[idx].unitPrice }; setFormInvoice({ ...formInvoice, lineItems: items }); }} min="0" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
                <div className="flex-1"><label className="block text-[10px] text-slate-400 mb-0.5">Unit Price</label><input type="number" value={li.unitPrice} onChange={e => { const price = Math.max(0, Number(e.target.value) || 0); const items = [...formInvoice.lineItems]; items[idx] = { ...items[idx], unitPrice: price, lineTotal: items[idx].quantity * price }; setFormInvoice({ ...formInvoice, lineItems: items }); }} min="0" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
                <div className="w-24"><label className="block text-[10px] text-slate-400 mb-0.5">Line Total</label><input type="text" readOnly value={formatCurrency(li.lineTotal, formInvoice.currency)} className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700 outline-none" /></div>
              </div>
            </div>))}</div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Totals</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium text-slate-700">{formatCurrency(formInvoice.lineItems.reduce((s, li) => s + li.lineTotal, 0), formInvoice.currency)}</span></div>
              <div className="flex items-center gap-2"><div className="flex-1 flex items-center gap-2"><div className="w-24"><select value={formInvoice.discountType} onChange={e => setFormInvoice({ ...formInvoice, discountType: e.target.value as 'fixed' | 'percentage' })} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none"><option value="fixed">Fixed</option><option value="percentage">%</option></select></div><input type="number" value={formInvoice.discount || ''} onChange={e => setFormInvoice({ ...formInvoice, discount: Number(e.target.value) || 0 })} placeholder="Discount" className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" /></div><span className="text-sm font-medium text-red-600">-{formatCurrency(formInvoice.discountType === 'percentage' ? Math.round(formInvoice.lineItems.reduce((s, li) => s + li.lineTotal, 0) * formInvoice.discount / 100) : formInvoice.discount, formInvoice.currency)}</span></div>
              <div className="flex items-center gap-2"><label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer"><input type="checkbox" checked={formInvoice.taxEnabled} onChange={e => setFormInvoice({ ...formInvoice, taxEnabled: e.target.checked })} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />Tax</label>{formInvoice.taxEnabled && <input type="number" value={formInvoice.tax || ''} onChange={e => setFormInvoice({ ...formInvoice, tax: Number(e.target.value) || 0 })} placeholder="Tax amount" className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" />}</div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100"><span className="font-semibold text-slate-700">Total</span><span className="font-bold text-slate-900">{formatCurrency((() => { const s = formInvoice.lineItems.reduce((sm, li) => sm + li.lineTotal, 0); const d = formInvoice.discountType === 'percentage' ? Math.round(s * formInvoice.discount / 100) : formInvoice.discount; return s - d + (formInvoice.taxEnabled ? formInvoice.tax : 0); })(), formInvoice.currency)}</span></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Terms & Notes</p>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Terms</label><textarea value={formInvoice.paymentTerms} onChange={e => setFormInvoice({ ...formInvoice, paymentTerms: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Client Note</label><textarea value={formInvoice.clientNote} onChange={e => setFormInvoice({ ...formInvoice, clientNote: e.target.value })} rows={2} placeholder="Note visible to the client..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Internal Note</label><textarea value={formInvoice.internalNote} onChange={e => setFormInvoice({ ...formInvoice, internalNote: e.target.value })} rows={2} placeholder="Private note for your team..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Instructions</label><textarea value={formInvoice.paymentInstructions} onChange={e => setFormInvoice({ ...formInvoice, paymentInstructions: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
            </div></section>

            <section className="border-t border-slate-100 pt-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Status</p><select value={formInvoice.status} onChange={e => setFormInvoice({ ...formInvoice, status: e.target.value as InvoiceStatus })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"><option value="Draft">Draft</option><option value="Sent">Sent</option></select></section>

            <div className="flex gap-3 pt-2 pb-4"><button onClick={() => setFormInvoice(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={handleSaveForm} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full text-sm font-semibold transition-colors">Save Invoice</button></div>
          </div>
        </div></div>
      )}

      {/* Record Payment Modal */}
      {paymentForm && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center" onClick={() => setPaymentForm(null)}><div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Record Payment</h3><p className="text-xs text-slate-500 mb-4">{paymentForm.inv.number} · Balance: {formatCurrency(paymentForm.inv.balance, paymentForm.inv.currency)}</p>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Amount Received</label><input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} min="1" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Payment Method</label><select value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value as PaymentMethod })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"><option value="Bank Transfer">Bank Transfer</option><option value="Mobile Money">Mobile Money</option><option value="Cash">Cash</option><option value="Cheque">Cheque</option><option value="Other">Other</option></select></div>
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Reference</label><input type="text" value={paymentForm.reference} onChange={e => setPaymentForm({ ...paymentForm, reference: e.target.value })} placeholder="e.g. STB-TRF-20260328-001" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" /></div>
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Notes</label><textarea value={paymentForm.notes} onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
          </div>
          <div className="flex gap-3 mt-5"><button onClick={() => setPaymentForm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={handleRecordPayment} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full text-sm font-semibold transition-colors">Record Payment</button></div>
        </div></div>
      )}

      {/* Send Reminder Modal */}
      {reminderForm && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center" onClick={() => setReminderForm(null)}><div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Send Reminder</h3><p className="text-xs text-slate-500 mb-4">{reminderForm.inv.number} · Due: {reminderForm.inv.dueDate}</p>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Message</label><textarea value={reminderForm.message} onChange={e => setReminderForm({ ...reminderForm, message: e.target.value })} rows={6} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" /></div>
          <div className="flex gap-3 mt-5"><button onClick={() => setReminderForm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={() => { setReminderForm(null); }} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-full text-sm font-semibold transition-colors">Send Reminder</button></div>
          <p className="text-[10px] text-slate-400 text-center mt-3">Frontend demonstration — no email will be sent.</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}><div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}><h3 className="text-base font-semibold text-slate-900 mb-2">Delete Invoice</h3><p className="text-sm text-slate-500 mb-5">Are you sure you want to delete this invoice? This cannot be undone.</p><div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button><button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors">Delete</button></div></div></div>
      )}

      {/* Preview Modal */}
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print { html, body { width: 210mm; height: 297mm; background: white !important; overflow: visible !important; } body * { visibility: hidden; } #inv-preview-doc, #inv-preview-doc * { visibility: visible; } #inv-preview-doc { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; min-height: 297mm !important; max-width: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 12mm !important; margin: 0 !important; background: white !important; } #inv-preview-toolbar, #inv-preview-scroll { display: none !important; } }
      `}</style>
      {previewInvoice && (
        <div className="fixed inset-0 z-[70] flex flex-col" role="dialog" aria-label="Invoice preview" aria-modal="true"><div className="absolute inset-0 bg-black/50" onClick={closePreview} />
          <div id="inv-preview-toolbar" className="relative z-10 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0"><button onClick={closePreview} aria-label="Close preview" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors shrink-0"><ArrowLeft size={18} variant="Linear" color="currentColor" /></button><div className="min-w-0"><p className="text-sm font-semibold text-slate-900 truncate">{previewInvoice.number}</p><p className="text-xs text-slate-400 truncate">{previewInvoice.companyName}</p></div></div>
            <div className="flex items-center gap-2 shrink-0"><button onClick={handlePrint} aria-label="Print invoice" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"><Printer size={14} variant="Linear" color="currentColor" />Print</button><button onClick={handleDownloadFile} aria-label="Download PDF" disabled={previewLoading} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Printer size={14} variant="Linear" color="currentColor" />Download PDF</button></div>
          </div>
          <div id="inv-preview-scroll" ref={previewScrollRef} className="relative z-10 flex-1 overflow-y-auto bg-slate-200 p-6 lg:p-10"><div className="flex justify-center">
          {previewLoading ? (<div className="flex flex-col items-center justify-center py-24"><div className="h-8 w-8 border-2 border-slate-300 border-t-[#16A34A] rounded-full animate-spin mb-3" /><p className="text-sm text-slate-500">Preparing invoice preview...</p></div>
          ) : (
            <div id="inv-preview-doc" className="bg-white shadow-[0_2px_16px_rgba(15,23,42,0.10)] w-full max-w-[794px] p-10 lg:p-12" style={{ minHeight: 'calc(794px * 297 / 210)' }}>
              <div className="flex justify-between items-start mb-10"><div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">TOGASHI<span className="text-[#16A34A]"> TECHNOLOGIES</span></h1><p className="text-[13px] text-slate-500 mt-1">Plot 24, Kampala Road, Kampala, Uganda</p><p className="text-[13px] text-slate-500">info@togashitech.com · +256 700 000 000</p></div><div className="text-right shrink-0"><h2 className="text-xl font-bold text-slate-800 tracking-wide">INVOICE</h2><p className="text-sm font-semibold text-slate-900 mt-1.5">{previewInvoice.number}</p><p className="text-xs text-slate-500 mt-1">Issue Date: {previewInvoice.issueDate}</p><p className="text-xs text-slate-500">Due Date: {previewInvoice.dueDate}</p>{previewInvoice.purchaseOrderNumber && <p className="text-xs text-slate-500">PO: {previewInvoice.purchaseOrderNumber}</p>}</div></div>
              <div className="grid grid-cols-2 gap-10 mb-10"><div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3><p className="text-sm font-semibold text-slate-900">{previewInvoice.contactName}</p><p className="text-sm text-slate-600">{previewInvoice.companyName}</p>{previewInvoice.billingAddress && <p className="text-sm text-slate-500 mt-1">{previewInvoice.billingAddress}</p>}<p className="text-sm text-slate-500 mt-1">{previewInvoice.contactEmail}</p><p className="text-sm text-slate-500">{previewInvoice.contactPhone}</p></div><div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Project</h3><p className="text-sm font-semibold text-slate-900">{previewInvoice.title}</p><p className="text-sm text-slate-500 mt-1 leading-relaxed">{previewInvoice.description}</p></div></div>
              {previewInvoice.relatedQuotationNumber && <div className="mb-8"><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Reference</h3><p className="text-sm text-slate-700">Quotation: {previewInvoice.relatedQuotationNumber}{previewInvoice.relatedProjectName ? ` · Project: ${previewInvoice.relatedProjectName}` : ''}</p></div>}
              <div className="mb-10"><table className="w-full"><thead><tr className="border-b-2 border-slate-200"><th className="text-left pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Item</th><th className="text-left pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description</th><th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[8%]">Qty</th><th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Unit Price</th><th className="text-right pb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[18%]">Total</th></tr></thead><tbody className="divide-y divide-slate-100">{previewInvoice.lineItems.map(li => (<tr key={li.id} className="break-inside-avoid"><td className="py-2.5 px-1 text-[13px] font-medium text-slate-900 align-top">{li.item}</td><td className="py-2.5 px-1 text-xs text-slate-500 align-top leading-relaxed">{li.description}</td><td className="py-2.5 px-1 text-[13px] text-slate-700 text-right align-top">{li.quantity}</td><td className="py-2.5 px-1 text-[13px] text-slate-700 text-right align-top whitespace-nowrap">{formatCurrency(li.unitPrice, previewInvoice.currency)}</td><td className="py-2.5 px-1 text-[13px] font-semibold text-slate-900 text-right align-top whitespace-nowrap">{formatCurrency(li.lineTotal, previewInvoice.currency)}</td></tr>))}</tbody></table></div>
              <div className="flex justify-end mb-10"><div className="w-72 space-y-1 border-t border-slate-100 pt-3">
                <div className="flex justify-between text-[13px]"><span className="text-slate-500">Subtotal</span><span className="font-medium text-slate-700 whitespace-nowrap">{formatCurrency(previewInvoice.lineItems.reduce((s, li) => s + li.lineTotal, 0), previewInvoice.currency)}</span></div>
                {previewInvoice.discount > 0 && <div className="flex justify-between text-[13px]"><span className="text-slate-500">Discount{previewInvoice.discountType === 'percentage' ? ` (${previewInvoice.discount}%)` : ''}</span><span className="font-medium text-red-600 whitespace-nowrap">-{formatCurrency(previewInvoice.discountType === 'percentage' ? Math.round(previewInvoice.lineItems.reduce((sm, li) => sm + li.lineTotal, 0) * previewInvoice.discount / 100) : previewInvoice.discount, previewInvoice.currency)}</span></div>}
                {previewInvoice.taxEnabled && previewInvoice.tax > 0 && <div className="flex justify-between text-[13px]"><span className="text-slate-500">Tax</span><span className="font-medium text-slate-700 whitespace-nowrap">{formatCurrency(previewInvoice.tax, previewInvoice.currency)}</span></div>}
                <div className="flex justify-between text-[15px] pt-3 mt-1 border-t-2 border-slate-300"><span className="font-bold text-slate-800">Total</span><span className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(previewInvoice.total, previewInvoice.currency)}</span></div>
                {previewInvoice.amountPaid > 0 && <><div className="flex justify-between text-[13px] mt-2"><span className="text-slate-500">Amount Paid</span><span className="font-medium text-emerald-700 whitespace-nowrap">{formatCurrency(previewInvoice.amountPaid, previewInvoice.currency)}</span></div><div className="flex justify-between text-[14px] font-semibold pt-1"><span className="text-slate-700">Balance Due</span><span className={`whitespace-nowrap ${previewInvoice.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>{formatCurrency(previewInvoice.balance, previewInvoice.currency)}</span></div></>}
              </div></div>
              <div className="border-t-2 border-slate-200 pt-6 space-y-5">
                {previewInvoice.paymentTerms && <div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Payment Terms</h3><p className="text-sm text-slate-700 leading-relaxed">{previewInvoice.paymentTerms}</p></div>}
                {previewInvoice.paymentInstructions && <div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Payment Instructions</h3><p className="text-sm text-slate-700 leading-relaxed">{previewInvoice.paymentInstructions}</p></div>}
                {previewInvoice.clientNote && <div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</h3><p className="text-sm text-slate-700 leading-relaxed">{previewInvoice.clientNote}</p></div>}
                {previewInvoice.additionalConditions && <div><h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Additional Conditions</h3><p className="text-sm text-slate-600 leading-relaxed">{previewInvoice.additionalConditions}</p></div>}
              </div>
              <div className="mt-14 grid grid-cols-2 gap-20 break-inside-avoid"><div><div className="border-t border-slate-300 pt-4"><p className="text-sm font-semibold text-slate-900 text-center">Auth. Signature</p><p className="text-[11px] text-slate-400 text-center mt-0.5">Togashi Technologies</p><p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p></div></div><div><div className="border-t border-slate-300 pt-4"><p className="text-sm font-semibold text-slate-900 text-center">Client Signature</p><p className="text-[11px] text-slate-400 text-center mt-0.5">{previewInvoice.contactName}</p><p className="text-[11px] text-slate-400 text-center mt-4">Date: ___________________</p></div></div></div>
              <div className="mt-16 text-center"><p className="text-[11px] text-slate-400">{previewInvoice.number} · Togashi Technologies · Plot 24, Kampala Road, Kampala, Uganda</p></div>
            </div>
          )}</div></div>
        </div>
      )}
    </div>
  );
}
