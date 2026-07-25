import { useGetProject } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Timer, Profile2User, DirectUp, TickCircle } from 'iconsax-react';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: project, isLoading } = useGetProject(id, {
    query: {
      enabled: !!id,
      queryKey: ['project', id],
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!project) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
        <Link href="/projects" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Projects
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{project.name}</span>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">{project.description}</p>
          </div>
          <span className="bg-[#1E293B] text-white px-3 py-1 rounded-md text-sm font-medium">
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm"><Timer size={16} variant="Linear" color="currentColor" /> Deadline</div>
            <div className="font-semibold text-slate-900">{project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : '-'}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm"><Profile2User size={16} variant="Linear" color="currentColor" /> Manager</div>
            <div className="font-semibold text-slate-900">{project.managerName || 'Unassigned'}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm"><DirectUp size={16} variant="Linear" color="currentColor" /> Budget</div>
            <div className="font-semibold text-[#15803D]">{project.budget ? `$${project.budget.toLocaleString()}` : '-'}</div>
          </div>
          <div>
             <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm"><TickCircle size={16} variant="Linear" color="currentColor" /> Completion</div>
             <div className="flex items-center gap-3">
               <span className="font-semibold text-slate-900">{project.progress || 0}%</span>
               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
