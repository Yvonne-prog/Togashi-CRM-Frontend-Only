import { useGetContact } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { 
  Buildings, 
  Sms, 
  Call, 
  Location, 
  Calendar, 
  Briefcase,
  Edit2,
  ArrowLeft
} from 'iconsax-react';
import { format } from 'date-fns';

export default function ContactDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: contact, isLoading } = useGetContact(id, {
    query: {
      enabled: !!id,
      queryKey: ['contact', id],
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading contact details...</div>;
  }

  if (!contact) {
    return <div className="p-8 text-center text-slate-500">Contact not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
        <Link href="/contacts" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Contacts
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{contact.firstName} {contact.lastName}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-2xl font-bold">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{contact.firstName} {contact.lastName}</h1>
            <div className="flex items-center gap-3 mt-2 text-slate-500">
               {contact.jobTitle && <span className="flex items-center gap-1.5"><Briefcase size={16} variant="Linear" color="currentColor"/> {contact.jobTitle}</span>}
              {contact.companyName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-[#16A34A] font-medium"><Buildings size={16} variant="Linear" color="currentColor"/> {contact.companyName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
             <Edit2 size={18} variant="Linear" color="currentColor" />
            <span>Edit</span>
          </button>
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Log Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col - About */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-semibold text-slate-900">Contact Information</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                 <Sms className="text-slate-400 mt-0.5 shrink-0" size={18} variant="Linear" color="currentColor" />
                <div>
                  <div className="font-medium text-slate-900">{contact.email}</div>
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
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="font-semibold text-slate-900">Details</h3>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${contact.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : contact.status === 'Prospect' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                    {contact.status || 'Active'}
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
        <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden flex flex-col h-[600px]">
          <div className="flex border-b border-slate-100 px-2 shrink-0">
            <button className="px-4 py-3 text-sm font-medium text-[#16A34A] border-b-2 border-[#16A34A]">Overview</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">Activity</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">Notes</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">Deals</button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
            {/* Overview Content */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
