import { useGetTask, useCompleteTask } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Calendar, Flag, Profile2User, Briefcase, DollarCircle, TickCircle, MessageText } from 'iconsax-react';
import { format } from 'date-fns';

export default function TaskDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: task, isLoading, refetch } = useGetTask(id, {
    query: {
      enabled: !!id,
      queryKey: ['task', id],
    }
  });
  
  const completeTask = useCompleteTask();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading task...</div>;
  if (!task) return <div className="p-8 text-center text-slate-500">Task not found.</div>;

  const isCompleted = task.status === 'Completed';

  const handleToggleStatus = () => {
    completeTask.mutate(
      { id },
      { onSuccess: () => refetch() }
    );
  };

  const getPriorityColor = (prio: string) => {
    switch(prio) {
      case 'Urgent': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-amber-100 text-amber-700';
      case 'Medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-2">
        <Link href="/tasks" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Tasks
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Task Detail</span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <button 
              onClick={handleToggleStatus}
              className={`mt-1 shrink-0 transition-colors ${isCompleted ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-slate-400'}`}
            >
              {isCompleted ? (
                <TickCircle size={32} variant="Linear" color="currentColor" />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-current" />
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {task.status}
                </span>
              </div>
              
              <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-950'}`}>
                {task.title}
              </h1>
              
              {task.description && (
                <p className="text-slate-600 mb-6 text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-slate-100">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Due Date</div>
                  <div className={`text-sm font-medium flex items-center gap-1.5 ${task.isOverdue && !isCompleted ? 'text-red-600' : 'text-slate-900'}`}>
                    <Calendar size={14} variant="Linear" color="currentColor" /> 
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Assignee</div>
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    <Profile2User size={14} variant="Linear" color="currentColor" className="text-slate-400" />
                    {task.assigneeName || 'Unassigned'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Records Links */}
        {(task.relatedDealTitle || task.relatedProjectName || task.relatedContactName) && (
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Related To</h4>
            <div className="flex flex-col gap-2">
              {task.relatedDealTitle && (
                <Link href={`/deals/${task.relatedDealId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#16A34A] transition-colors bg-white rounded-xl p-2 w-fit">
                  <DollarCircle size={16} variant="Linear" color="currentColor" className="text-[#16A34A]" /> {task.relatedDealTitle}
                </Link>
              )}
              {task.relatedProjectName && (
                <Link href={`/projects/${task.relatedProjectId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#16A34A] transition-colors bg-white rounded-xl p-2 w-fit">
                  <Briefcase size={16} variant="Linear" color="currentColor" className="text-[#0F172A]" /> {task.relatedProjectName}
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageText size={18} variant="Linear" color="currentColor" /> Discussion
          </h3>
          
          <div className="space-y-4 mb-6">
            {task.comments?.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  {comment.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-slate-900">{comment.authorName}</span>
                    <span className="text-xs text-slate-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                  <p className="text-sm text-slate-700">{comment.content}</p>
                </div>
              </div>
            ))}
            {(!task.comments || task.comments.length === 0) && (
              <div className="text-sm text-slate-500 italic">No comments yet.</div>
            )}
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-bold shrink-0">
              ME
            </div>
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
