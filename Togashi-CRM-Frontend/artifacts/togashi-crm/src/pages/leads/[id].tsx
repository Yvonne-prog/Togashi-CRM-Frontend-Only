import { useState } from 'react';
import { useGetLead } from '@workspace/api-client-react';
import { useParams, Link, useLocation } from 'wouter';
import { ArrowLeft, Profile2User, Buildings, Sms, Call, Calendar, Flag, Refresh, DollarCircle, Trash, RefreshCircle } from 'iconsax-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateLead, useDeleteLead, useConvertLead, type LeadItem } from '@/hooks/useLeads';
import { LeadFormModal } from '@/pages/leads/LeadFormModal';

export default function LeadDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useGetLead(id, {
    query: {
      enabled: !!id,
      queryKey: ['lead', id],
    }
  });

  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const convertLead = useConvertLead();

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleUpdate = (formData: Partial<LeadItem>) => {
    if (!lead || !lead.id) return;
    updateLead.mutate({ id: lead.id, data: formData }, {
      onSuccess: () => {
        setShowEdit(false);
        queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
        queryClient.invalidateQueries({ queryKey: ['leads', 'stats'] });
        toast({ title: 'Lead updated', description: 'Changes saved successfully.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to update lead', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleDelete = () => {
    if (!lead || !lead.id) return;
    deleteLead.mutate(lead.id, {
      onSuccess: () => {
        setShowDelete(false);
        queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        toast({ title: 'Lead deleted', description: 'The lead has been archived.' });
        navigate('/leads');
      },
      onError: (err) => {
        toast({ title: 'Failed to delete lead', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleConvert = () => {
    if (!lead || !lead.id) return;
    convertLead.mutate(
      { id: lead.id, data: { createContact: true, createCompany: !!lead.company, createDeal: true } },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          if (result.contactId || result.companyId || result.dealId) {
            toast({ title: 'Lead converted', description: 'The lead has been converted successfully.' });
          } else {
            toast({ title: 'Lead conversion submitted', description: 'The conversion request was processed.' });
          }
        },
        onError: (err) => {
          toast({ title: 'Failed to convert lead', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-center text-slate-500">Lead not found.</div>;

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-12">
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <Link href="/leads" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Leads
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{lead.name}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold shrink-0">
            {lead.name[0]}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{lead.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 text-sm">
              {lead.company && <span className="flex items-center gap-1.5 font-medium"><Buildings size={14} variant="Linear" color="currentColor"/> {lead.company}</span>}
              {lead.email && <span className="flex items-center gap-1.5"><Sms size={14} variant="Linear" color="currentColor"/> {lead.email}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={() => setShowEdit(true)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
            Edit
          </button>
          <button onClick={handleConvert} disabled={convertLead.isPending} className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 disabled:opacity-60">
            {convertLead.isPending ? <RefreshCircle className="animate-spin" size={18} variant="Linear" color="currentColor" /> : <Refresh size={18} variant="Linear" color="currentColor" />}
            Convert Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
        <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
          <Trash size={16} variant="Linear" color="currentColor" /> Delete Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Lead Qualification</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</div>
                  <span className="px-2.5 py-1 rounded text-sm font-medium bg-slate-100 text-slate-800">{lead.status}</span>
               </div>
               <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Score</div>
                  <span className="text-lg font-bold text-slate-900">{lead.score || 0}/100</span>
               </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Temperature</div>
                  <span className="text-sm font-medium text-slate-900">{lead.temperature || 'Unknown'}</span>
                </div>
              </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <DollarCircle size={14} variant="Linear" color="currentColor"/> Estimated Budget
                </div>
                <div className="font-medium text-slate-900">
                  {lead.estimatedBudget ? `$${lead.estimatedBudget.toLocaleString()}` : 'Not provided'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <Flag size={14} variant="Linear" color="currentColor"/> Interest / Product
                </div>
                <div className="font-medium text-slate-900">{lead.interest || 'Not specified'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <Calendar size={14} variant="Linear" color="currentColor"/> Expected Decision
                </div>
                <div className="font-medium text-slate-900">
                  {lead.expectedDecisionDate ? format(new Date(lead.expectedDecisionDate), 'MMMM d, yyyy') : 'No timeline'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Contact Details</h3>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Sms className="text-slate-400 shrink-0" size={16} variant="Linear" color="currentColor" />
                <span className="text-slate-900 font-medium">{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Call className="text-slate-400 shrink-0" size={16} variant="Linear" color="currentColor" />
                  <span className="text-slate-900 font-medium">{lead.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Notes & Next Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              {lead.notes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Notes</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">
                    {lead.notes}
                  </p>
                </div>
              )}
              {lead.nextAction && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Next Action</h4>
                  <div className="text-sm font-medium text-[#15803D] flex items-start gap-2">
                     <span className="mt-0.5 text-[#16A34A]">→</span> {lead.nextAction}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <LeadFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
        initial={lead}
        title="Edit Lead"
        isSubmitting={updateLead.isPending}
      />

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Lead</h3>
            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to delete <strong>{lead.name}</strong>? This action will archive the lead.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLead.isPending} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleteLead.isPending ? <><RefreshCircle className="animate-spin" size={16} /><span>Deleting...</span></> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}