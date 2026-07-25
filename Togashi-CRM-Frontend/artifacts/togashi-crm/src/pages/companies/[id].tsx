import { useGetCompany } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Buildings, Global, Location, Profile2User, ArrowLeft, Briefcase, Call, Sms } from 'iconsax-react';

export default function CompanyDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: company, isLoading } = useGetCompany(id, {
    query: {
      enabled: !!id,
      queryKey: ['company', id],
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading company...</div>;
  if (!company) return <div className="p-8 text-center text-slate-500">Company not found.</div>;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
        <Link href="/companies" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} variant="Linear" color="currentColor" /> Companies
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{company.name}</span>
      </div>

      <div className="bg-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <Buildings size={40} variant="Linear" color="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
              {company.industry && <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">{company.industry}</span>}
              {company.website && (
                <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                  <Global size={14} variant="Linear" color="currentColor" /> {company.website}
                </a>
              )}
              {company.location && <span className="flex items-center gap-1.5"><Location size={14} variant="Linear" color="currentColor"/> {company.location}</span>}
            </div>
          </div>
        </div>
        <button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Edit Company
        </button>
      </div>

      {/* Tabs and Content structure similar to Contact details but focusing on Company fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">About</h3>
            </div>
            <div className="p-5 space-y-4 text-sm">
              {company.phone && (
                <div className="flex items-center gap-3">
                  <Call className="text-slate-400 shrink-0" size={16} variant="Linear" color="currentColor" />
                  <span className="text-slate-900">{company.phone}</span>
                </div>
              )}
              {company.email && (
                <div className="flex items-center gap-3">
                  <Sms className="text-slate-400 shrink-0" size={16} variant="Linear" color="currentColor" />
                  <span className="text-slate-900">{company.email}</span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Size</div>
                    <div className="font-medium text-slate-900">{company.size || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Annual Rev</div>
                    <div className="font-medium text-[#15803D]">
                      {company.annualRevenue ? `$${(company.annualRevenue/1000000).toFixed(1)}M` : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden">
           <div className="flex border-b border-slate-200 px-2 shrink-0 bg-slate-50">
            <button className="px-4 py-3 text-sm font-medium text-[#16A34A] border-b-2 border-[#16A34A] bg-white">Contacts ({company.contacts?.length || 0})</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">Deals</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">Projects</button>
          </div>
          <div className="p-0">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {company.contacts?.map(contact => (
                    <tr key={contact.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        <Link href={`/contacts/${contact.id}`} className="hover:text-[#16A34A]">{contact.firstName} {contact.lastName}</Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{contact.jobTitle || '-'}</td>
                      <td className="px-6 py-3 text-slate-600">{contact.email}</td>
                    </tr>
                  ))}
                  {(!company.contacts || company.contacts.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No contacts associated with this company.</td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}
