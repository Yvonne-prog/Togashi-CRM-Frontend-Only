import { useGetLead } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Profile2User, Buildings, Sms, Call, Calendar, Flag, Refresh, DollarCircle } from 'iconsax-react';
import { format } from 'date-fns';

export default function LeadDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: lead, isLoading } = useGetLead(id, {
    query: {
      enabled: !!id,
      queryKey: ['lead', id],
    }
  });

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
          <button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
            Edit
          </button>
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2">
            <Refresh size={18} variant="Linear" color="currentColor" />
            Convert Lead
          </button>
        </div>
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
    </div>
  );
}
