import { useState, useEffect } from 'react';
import { useListCompanies, type Company } from '@workspace/api-client-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'wouter';
import {
  Add,
  SearchNormal1,
  Sms,
  Call,
  More,
  ArrowDown2,
  CloseCircle,
  RefreshCircle,
  Trash,
  Edit,
} from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  type ContactItem,
  type ContactSummary,
} from '@/hooks/useContacts';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  PROSPECT: 'bg-purple-50 text-purple-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  PROSPECT: 'Prospect',
  INACTIVE: 'Inactive',
};

function initials(first: string, last: string): string {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function ContactFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  title,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ContactItem>) => void;
  initial?: ContactItem;
  title: string;
  isSubmitting: boolean;
}) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? '');
  const [lastName, setLastName] = useState(initial?.lastName ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle ?? '');
  const [companyId, setCompanyId] = useState(initial?.companyId ?? '');
  const [companyName, setCompanyName] = useState(initial?.companyName ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'ACTIVE');

  const companiesQuery = useListCompanies({ limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const companies = (companiesQuery.data as unknown as { items?: Company[] })?.items ?? [];

  useEffect(() => {
    if (open) {
      setFirstName(initial?.firstName ?? '');
      setLastName(initial?.lastName ?? '');
      setEmail(initial?.email ?? '');
      setPhone(initial?.phone ?? '');
      setJobTitle(initial?.jobTitle ?? '');
      setCompanyId(initial?.companyId ?? '');
      setCompanyName(initial?.companyName ?? '');
      setStatus(initial?.status ?? 'ACTIVE');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleCompanyChange = (value: string) => {
    setCompanyId(value);
    const selected = companies.find((c) => c.id === value);
    setCompanyName(selected?.name ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      jobTitle: jobTitle || undefined,
      companyId: companyId || undefined,
      companyName: companyName || undefined,
      status: status as ContactItem['status'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"><CloseCircle size={20} variant="Linear" color="currentColor" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">First Name *</label>
              <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Last Name *</label>
              <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Company</label>
              <select
                value={companyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              >
                <option value="">No company</option>
                {companyId && !companies.some((c) => c.id === companyId) && (
                  <option value={companyId}>{companyName || 'Selected company'}</option>
                )}
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as ContactItem['status'])} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
              <option value="ACTIVE">Active</option>
              <option value="PROSPECT">Prospect</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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

export default function Contacts() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading, isError, error } = useContacts({
    limit: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const [showCreate, setShowCreate] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactItem | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const items = data?.items ?? [];
  const summary: ContactSummary = data?.summary ?? { total: 0, active: 0, prospects: 0, inactive: 0 };
  const totalPages = Math.max(1, Math.ceil(summary.total / perPage));

  const handleCreate = (formData: Partial<ContactItem>) => {
    createContact.mutate(formData, {
      onSuccess: () => {
        setShowCreate(false);
        toast({ title: 'Contact created', description: 'The contact has been added successfully.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to create contact', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleUpdate = (formData: Partial<ContactItem>) => {
    if (!editingContact) return;
    updateContact.mutate({ id: editingContact.id, data: formData }, {
      onSuccess: () => {
        setEditingContact(null);
        toast({ title: 'Contact updated', description: 'Changes saved successfully.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to update contact', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!deletingContact) return;
    deleteContact.mutate(deletingContact.id, {
      onSuccess: () => {
        setDeletingContact(null);
        toast({ title: 'Contact deleted', description: 'The contact has been archived.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to delete contact', description: err.message, variant: 'destructive' });
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Contacts</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage your client and prospect relationships.</p>
        </div>
        {hasPermission('contacts.create') && (
          <button onClick={() => setShowCreate(true)} className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
            <Add size={18} variant="Linear" color="currentColor" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Contacts', value: summary.total, color: 'bg-slate-500' },
          { label: 'Active Contacts', value: summary.active, color: 'bg-emerald-500' },
          { label: 'Prospects', value: summary.prospects, color: 'bg-purple-500' },
          { label: 'Inactive Contacts', value: summary.inactive, color: 'bg-slate-400' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${card.color} shrink-0`} />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">{isLoading ? '—' : card.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar + Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-slate-200 bg-slate-50 rounded-lg text-xs pl-3 pr-8 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="PROSPECT">Prospect</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <ArrowDown2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" variant="Linear" color="currentColor" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-6 py-20 text-center">
            <RefreshCircle className="mx-auto animate-spin text-[#16A34A] mb-4" size={28} variant="Linear" color="currentColor" />
            <p className="text-sm text-slate-500">Loading contacts...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <CloseCircle size={24} variant="Bulk" color="#DC2626" />
            </div>
            <h3 className="text-base font-medium text-slate-900">Failed to load contacts</h3>
            <p className="text-xs text-slate-500 mt-1">{error instanceof Error ? error.message : 'Could not connect to the server.'}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors group relative">
                      <td className="px-5 py-3.5">
                        <Link href={`/contacts/${contact.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                            {initials(contact.firstName, contact.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-[12px] text-slate-400 truncate">{contact.jobTitle || '—'}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] text-slate-700">{contact.companyName || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="space-y-0.5">
                          {contact.email && (
                            <div className="flex items-center gap-1.5">
                              <Sms size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor" />
                              <span className="text-[12px] text-slate-600 truncate max-w-[140px]">{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1.5">
                              <Call size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor" />
                              <span className="text-[12px] text-slate-500">{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[contact.status] ?? 'bg-slate-100 text-slate-500'}`}>
                          {STATUS_LABELS[contact.status] ?? contact.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === contact.id ? null : contact.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <More size={15} variant="Linear" color="currentColor" />
                          </button>
                          {actionMenuId === contact.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20" onMouseLeave={() => setActionMenuId(null)}>
                              <button onClick={() => { setActionMenuId(null); setEditingContact(contact); }} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Edit size={13} variant="Linear" color="currentColor" /> Edit
                              </button>
                              <button onClick={() => { setActionMenuId(null); setDeletingContact(contact); }} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash size={13} variant="Linear" color="currentColor" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Page {page} of {totalPages} · {summary.total} total
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <SearchNormal1 size={24} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-base font-medium text-slate-900">No contacts found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search || statusFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first contact.'}
            </p>
            {(search || statusFilter) ? (
              <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} className="mt-3 text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
                Clear all filters
              </button>
            ) : (
              hasPermission('contacts.create') && (
                <button onClick={() => setShowCreate(true)} className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-1.5">
                  <Add size={16} variant="Linear" color="currentColor" />
                  <span>Add Contact</span>
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <ContactFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        title="Add Contact"
        isSubmitting={createContact.isPending}
      />

      {/* Edit Modal */}
      <ContactFormModal
        open={!!editingContact}
        onClose={() => setEditingContact(null)}
        onSubmit={handleUpdate}
        initial={editingContact ?? undefined}
        title="Edit Contact"
        isSubmitting={updateContact.isPending}
      />

      {/* Delete Confirmation */}
      {!!deletingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeletingContact(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Contact</h3>
            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to delete <strong>{deletingContact.firstName} {deletingContact.lastName}</strong>? This action will archive the contact.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingContact(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteContact.isPending} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleteContact.isPending ? <><RefreshCircle className="animate-spin" size={16} /><span>Deleting...</span></> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
