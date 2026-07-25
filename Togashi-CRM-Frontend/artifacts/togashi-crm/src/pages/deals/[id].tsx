import { useGetDeal } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Buildings, Profile2User, Calendar, DollarCircle, TaskSquare, Edit2, ArrowRight } from 'iconsax-react';
import { format } from 'date-fns';

const STAGES = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export default function DealDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: deal, isLoading } = useGetDeal(id, {
    query: {
      enabled: !!id,
      queryKey: ['deal', id],
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading deal...</div>;
  if (!deal) return <div className="p-8 text-center text-slate-500">Deal not found.</div>;

  const currentStageIndex = STAGES.indexOf(deal.stage);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
        <Link href="/deals" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Deals
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{deal.title}</span>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{deal.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
              <span className="text-[#15803D] font-bold text-xl flex items-center">
                ${deal.value.toLocaleString()}
              </span>
              {deal.companyName && (
                <>
                  <span className="text-slate-300">•</span>
                  <Link href={`/companies/${deal.companyId}`} className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                    <Buildings size={16} variant="Linear" color="currentColor"/> {deal.companyName}
                  </Link>
                </>
              )}
              {deal.contactName && (
                <>
                  <span className="text-slate-300">•</span>
                  <Link href={`/contacts/${deal.contactId}`} className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                    <Profile2User size={16} variant="Linear" color="currentColor"/> {deal.contactName}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <Edit2 size={18} variant="Linear" color="currentColor" /> Edit Deal
            </button>
            {deal.stage === 'Won' && (
               <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                 Create Project
               </button>
            )}
          </div>
        </div>

        {/* Pipeline Progress Bar */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center relative z-10">
            {STAGES.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isLost = stage === 'Lost' && isCurrent;
              const isWon = stage === 'Won' && isCurrent;
              
              let bgColor = isCompleted ? 'bg-[#16A34A] text-white border-[#16A34A]' : 'bg-white text-slate-400 border-slate-200';
              if (isLost) bgColor = 'bg-red-500 text-white border-red-500';
              if (isWon) bgColor = 'bg-[#15803D] text-white border-[#15803D]';

              return (
                <div key={stage} className="flex flex-col items-center gap-2 relative">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${bgColor}`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>{stage}</span>
                </div>
              );
            })}
          </div>
          {/* Connecting Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-0 -translate-y-1/2">
             <div 
               className={`h-full ${deal.stage === 'Lost' ? 'bg-red-500' : 'bg-[#16A34A]'} transition-all`} 
               style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
             ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
           <div className="bg-white rounded-2xl overflow-hidden">
             <div className="px-5 py-4 border-b border-slate-200">
               <h3 className="font-semibold text-slate-900">Deal Details</h3>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Expected Close</div>
                 <div className="font-medium text-slate-900 flex items-center gap-2">
                   <Calendar size={16} variant="Linear" color="currentColor" className="text-slate-400" />
                   {deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), 'MMMM d, yyyy') : 'Not set'}
                 </div>
               </div>
               <div>
                 <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Probability</div>
                 <div className="font-medium text-slate-900">{deal.probability || 0}%</div>
               </div>
               {deal.description && (
                 <div>
                   <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</div>
                   <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{deal.description}</p>
                 </div>
               )}
             </div>
           </div>
        </div>

        <div className="md:col-span-2">
           <div className="bg-white rounded-2xl overflow-hidden min-h-[400px]">
             <div className="flex border-b border-slate-200 px-2 bg-slate-50">
               <button className="px-4 py-3 text-sm font-medium text-[#16A34A] border-b-2 border-[#16A34A] bg-white">Tasks</button>
               <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">History</button>
             </div>
             
             <div className="p-0">
               {deal.tasks && deal.tasks.length > 0 ? (
                 <div className="divide-y divide-slate-100">
                   {deal.tasks.map(task => (
                     <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                       <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                         <span className={`font-medium ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                           {task.title}
                         </span>
                       </div>
                       <Link href={`/tasks/${task.id}`} className="text-sm text-[#16A34A] font-medium hover:underline">View</Link>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-slate-500">
                   <TaskSquare color="currentColor" className="mx-auto h-12 w-12 text-slate-300 mb-3" variant="Linear" />
                   <p>No tasks associated with this deal.</p>
                   <button className="mt-4 text-[#16A34A] font-medium hover:underline text-sm">Add a task</button>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
