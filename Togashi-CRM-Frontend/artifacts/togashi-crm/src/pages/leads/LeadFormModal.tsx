import { useState, useEffect } from 'react';
import { CloseCircle, RefreshCircle } from 'iconsax-react';
import type { LeadItem, LeadStatus, LeadTemperature } from '@/hooks/useLeads';

export function LeadFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  title,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LeadItem>) => void;
  initial?: LeadItem;
  title: string;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [company, setCompany] = useState(initial?.company ?? '');
  const [source, setSource] = useState(initial?.source ?? '');
  const [interest, setInterest] = useState(initial?.interest ?? '');
  const [estimatedBudget, setEstimatedBudget] = useState(initial?.estimatedBudget?.toString() ?? '');
  const [currency, setCurrency] = useState(initial?.currency ?? '');
  const [status, setStatus] = useState<LeadStatus>((initial?.status as LeadStatus) ?? 'New');
  const [temperature, setTemperature] = useState<LeadTemperature | ''>((initial?.temperature as LeadTemperature | '') ?? '');
  const [expectedDecisionDate, setExpectedDecisionDate] = useState(initial?.expectedDecisionDate ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [nextAction, setNextAction] = useState(initial?.nextAction ?? '');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setEmail(initial?.email ?? '');
      setPhone(initial?.phone ?? '');
      setCompany(initial?.company ?? '');
      setSource(initial?.source ?? '');
      setInterest(initial?.interest ?? '');
      setEstimatedBudget(initial?.estimatedBudget?.toString() ?? '');
      setCurrency(initial?.currency ?? '');
      setStatus((initial?.status as LeadStatus) ?? 'New');
      setTemperature((initial?.temperature as LeadTemperature | '') ?? '');
      setExpectedDecisionDate(initial?.expectedDecisionDate ?? '');
      setNotes(initial?.notes ?? '');
      setNextAction(initial?.nextAction ?? '');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      source: source || undefined,
      interest: interest || undefined,
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
      currency: currency || undefined,
      status,
      temperature: temperature || undefined,
      expectedDecisionDate: expectedDecisionDate || undefined,
      notes: notes || undefined,
      nextAction: nextAction || undefined,
    });
  };

  const inputClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"><CloseCircle size={20} variant="Linear" color="currentColor" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Email *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Source</label>
              <input value={source} onChange={e => setSource(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Interest / Product</label>
              <input value={interest} onChange={e => setInterest(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Estimated Budget</label>
              <input type="number" min={0} value={estimatedBudget} onChange={e => setEstimatedBudget(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Currency</label>
              <input value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as LeadStatus)} className={inputClass}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Temperature</label>
              <select value={temperature} onChange={e => setTemperature(e.target.value as LeadTemperature | '')} className={inputClass}>
                <option value="">—</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Expected Decision Date</label>
            <input type="date" value={expectedDecisionDate} onChange={e => setExpectedDecisionDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Next Action</label>
            <input value={nextAction} onChange={e => setNextAction(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <><RefreshCircle className="animate-spin" size={16} /><span>Saving...</span></> : <span>Save</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}