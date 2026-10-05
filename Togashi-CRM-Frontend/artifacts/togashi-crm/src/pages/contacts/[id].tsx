import { useState } from 'react';
import { useGetContact, type ContactDetail } from '@workspace/api-client-react';
import { useParams, Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateContact, useDeleteContact, type ContactItem } from '@/hooks/useContacts';
import { ContactFormModal } from '@/pages/contacts';
import { useToast } from '@/hooks/use-toast';
import { 
  Buildings, 
  Sms, 
  Call, 
  Location, 
  Calendar, 
  Briefcase,
  Edit2,
  ArrowLeft,
  Trash,
  RefreshCircle,
  Clipboard,
  Note1,
  Money,
} from 'iconsax-react';
import { format } from 'date-fns';

type TabKey = 'overview' | 'activity' | 'notes' | 'deals';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PROSPECT: 'bg-purple-100 text-purple-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  PROSPECT: 'Prospect',
  INACTIVE: 'Inactive',
};

function toContactItem(c: ContactDetail): ContactItem {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    fullName: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.phone ?? undefined,
    jobTitle: c.jobTitle ?? undefined,
    companyId: c.companyId ?? undefined,
    companyName: c.companyName ?? undefined,
    status: (c.status as ContactItem['status']) ?? 'ACTIVE',
    ownerName: c.assignedToName ?? undefined,
    notes: c.notes ?? undefined,
    createdAt: c.createdAt ?? '',
    updatedAt: c.updatedAt ?? '',
  };
}

export default function ContactDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, navigate] = useLocation();
  
  const { data: contact, isLoading } = useGetContact(id, {
    query: {
      enabled: !!id,
      queryKey: ['contact', id],
    }
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const handleEditSubmit = (data: Partial<ContactItem>) => {
    updateContact.mutate(
      { id, data },
      {
        onSuccess: () => {
          setShowEdit(false);
          queryClient.invalidateQueries({ queryKey: ['contact', id] });
          toast({ title: 'Contact updated', description: 'Changes saved successfully.' });
        },
        onError: (err) => {
          toast({ title: 'Failed to update contact', description: err.message, variant: 'destructive' });
        },
      },
    );
  };

  const handleDelete = () => {
    deleteContact.mutate(id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        queryClient.invalidateQueries({ queryKey: ['contact', id] });
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        toast({ title: 'Contact deleted', description: 'The contact has been archived.' });
        navigate('/contacts');
      },
      onError: (err) => {
        toast({ title: 'Failed to delete contact', description: err.message, variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading contact details...</div>;
  }

  if (!contact) {
    return <div className="p-8 text-center text-slate-500">Contact not found.</div>;
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'activity', label: 'Activity' },
    { key: 'notes', label: 'Notes' },
    { key: 'deals', label: 'Deals' },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 text-slate-500 text-sm mb-4">
        <Link href="/contacts" className="hover:text-slate-900 flex items-center gap-1 transition-colors shrink-0">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Contacts
        </Link>
        <span className="hidden sm:inline">/</span>
        <span className="text-slate-900 font-medium truncate">{contact.firstName} {contact.lastName}</span>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{contact.firstName} {contact.lastName}</h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-slate-500 text-sm min-w-0">
               {contact.jobTitle && <span className="flex items-center gap-1.5 shrink-0"><Briefcase size={16} variant="Linear" color="currentColor"/> <span className="truncate">{contact.jobTitle}</span></span>}
              {contact.companyName && (
                <>
                  <span className="hidden sm:inline shrink-0">•</span>
                  <span className="flex items-center gap-1.5 text-[#16A34A] font-medium shrink-0"><Buildings size={16} variant="Linear" color="currentColor"/> <span className="truncate">{contact.companyName}</span></span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button onClick={() => setShowEdit(true)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
             <Edit2 size={18} variant="Linear" color="currentColor" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <Trash size={18} variant="Linear" color="currentColor" />
            <span className="hidden sm:inline">Delete</span>
          </button>
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Log Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Col - About */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-semibold text-slate-900">Contact Information</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                 <Sms className="text-slate-400 mt-0.5 shrink-0" size={18} variant="Linear" color="currentColor" />
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 break-all">{contact.email}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Email</div>
                </div>
              </div>
              
              {contact.phone && (
                <div className="flex items-start gap-3 text-sm">
                   <Call className="text-slate-400 mt-0.5 shrink-0" size={18} variant="Linear" color="currentColor" />
                  <div>
                    <div className="font-medium text-slate-900">{contact.phone}</div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Direct Phone</div>
                  </div>
                </div>
              )}

              {contact.location && (
                <div className="flex items-start gap-3 text-sm">
                   <Location className="text-slate-400 mt-0.5 shrink-0" size={18} variant="Linear" color="currentColor" />
                  <div className="font-medium text-slate-900">{contact.location}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-semibold text-slate-900">Details</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[contact.status ?? ''] ?? 'bg-slate-100 text-slate-500'}`}>
                    {STATUS_LABELS[contact.status ?? ''] ?? contact.status ?? 'Active'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Last Contacted</div>
                  <div className="font-medium text-slate-900">
                    {contact.lastContactedAt ? format(new Date(contact.lastContactedAt), 'MMM d, yyyy') : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Tabs */}
        <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden flex flex-col min-h-[500px] sm:h-[600px]">
          <div className="flex overflow-x-auto border-b border-slate-100 px-2 shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                    : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-5">
                  <h4 className="font-semibold text-slate-900 mb-3">About {contact.firstName}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {contact.notes || "No notes available for this contact."}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-slate-900">Active Deals</h4>
                    <button className="text-[#16A34A] text-sm font-medium">Add Deal</button>
                  </div>
                  {contact.deals?.length ? (
                    <div className="space-y-3">
                      {contact.deals.map(deal => (
                        <div key={deal.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:border-[#16A34A] transition-colors cursor-pointer">
                          <div>
                            <div className="font-medium text-slate-900">{deal.title}</div>
                            <div className="text-xs text-slate-500">{deal.stage}</div>
                          </div>
                          <div className="font-bold text-[#15803D]">
                            ${deal.value.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-6 text-sm">No active deals.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Clipboard size={24} variant="Linear" color="#94A3B8" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">No activity yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">Activity history for this contact will appear here.</p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Note1 size={24} variant="Linear" color="#94A3B8" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">No notes yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">Add notes to keep track of important information about this contact.</p>
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Money size={24} variant="Linear" color="#94A3B8" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">No deals yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">Deals associated with this contact will be shown here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEditSubmit}
        initial={contact ? toContactItem(contact) : undefined}
        title="Edit Contact"
        isSubmitting={updateContact.isPending}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Contact</h3>
            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to delete <strong>{contact.firstName} {contact.lastName}</strong>? This action will archive the contact.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteContact.isPending} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleteContact.isPending ? <><RefreshCircle className="animate-spin" size={16} /><span>Deleting...</span></> : <span>Delete Contact</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
