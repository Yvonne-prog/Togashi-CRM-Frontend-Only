import { useState, useCallback } from 'react';
import { useGetCompany, useUpdateCompany, useDeleteCompany } from '@workspace/api-client-react';
import type { CompanyUpdate } from '@workspace/api-client-react';
import { useParams, Link, useLocation } from 'wouter';
import { Buildings, Global, Location, ArrowLeft, Call, Sms } from 'iconsax-react';
import CompanyFormDialog, { type CompanyFormData } from '@/components/companies/CompanyFormDialog';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const COMPANY_PAGE_KEY = '/api/companies';

function trimOrNull(s: string | null | undefined): string | null {
  if (!s) return null;
  const t = s.trim();
  return t.length > 0 ? t : null;
}

export default function CompanyDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const { data: company, isLoading } = useGetCompany(id, {
    query: {
      enabled: !!id,
      queryKey: ['company', id],
    },
  });

  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  const invalidateCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [COMPANY_PAGE_KEY] });
    queryClient.invalidateQueries({ queryKey: ['company', id] });
  }, [queryClient, id]);

  const handleEdit = useCallback(
    (formData: CompanyFormData) => {
      if (!company) return;
      setEditError(null);
      const update = {
        name: formData.name.trim(),
        legalName: trimOrNull(formData.legalName),
        industry: trimOrNull(formData.industry),
        website: trimOrNull(formData.website),
        email: trimOrNull(formData.email),
        phone: trimOrNull(formData.phone),
        city: trimOrNull(formData.city),
        country: trimOrNull(formData.country),
        status: formData.status || 'ACTIVE',
        notes: trimOrNull(formData.notes),
      } as CompanyUpdate;
      updateMutation.mutate(
        { id: company.id, data: update },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditError(null);
            invalidateCompanies();
            toast({
              title: 'Company updated successfully.',
            });
          },
          onError: () => {
            setEditError('Unable to update company. Please try again.');
          },
        },
      );
    },
    [company, updateMutation, invalidateCompanies],
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          invalidateCompanies();
          navigate('/companies', { replace: true });
        },
      },
    );
  }, [id, deleteMutation, invalidateCompanies, navigate]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-pulse">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return <div className="p-8 text-center text-slate-500">Company not found.</div>;
  }

  const c = company as unknown as Record<string, string | number | null | undefined>;

  const extCity = c.city as string | undefined;
  const extCountry = c.country as string | undefined;
  const extLegalName = c.legalName as string | undefined;
  const extNotes = c.notes as string | undefined;

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
              {company.industry && (
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {company.industry}
                </span>
              )}
              {company.website && (
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Global size={14} variant="Linear" color="currentColor" /> {company.website}
                </a>
              )}
              {(extCity || extCountry) && (
                <span className="flex items-center gap-1.5">
                  <Location size={14} variant="Linear" color="currentColor" />
                  {[extCity, extCountry].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDialogOpen(true)}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            Edit Company
          </button>
          <button
            onClick={handleDelete}
            className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

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
              {(extLegalName || company.size || company.annualRevenue || extNotes) && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    {company.size && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Size</div>
                        <div className="font-medium text-slate-900">{company.size}</div>
                      </div>
                    )}
                    {company.annualRevenue != null && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Annual Rev</div>
                        <div className="font-medium text-[#15803D]">
                          {`$${(company.annualRevenue / 1000000).toFixed(1)}M`}
                        </div>
                      </div>
                    )}
                    {extLegalName && (
                      <div className="col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Legal Name</div>
                        <div className="font-medium text-slate-900">{extLegalName}</div>
                      </div>
                    )}
                    {extNotes && (
                      <div className="col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Notes</div>
                        <div className="text-sm text-slate-700">{extNotes}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden">
          <div className="flex border-b border-slate-200 px-2 shrink-0 bg-slate-50">
            <button className="px-4 py-3 text-sm font-medium text-[#16A34A] border-b-2 border-[#16A34A] bg-white">
              Contacts ({Array.isArray(company.contacts) ? company.contacts.length : 0})
            </button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">
              Deals
            </button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-2 border-transparent">
              Projects
            </button>
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
                {Array.isArray(company.contacts) &&
                  company.contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        <Link href={`/contacts/${contact.id}`} className="hover:text-[#16A34A]">
                          {contact.firstName} {contact.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{contact.jobTitle || '-'}</td>
                      <td className="px-6 py-3 text-slate-600">{contact.email}</td>
                    </tr>
                  ))}
                {(!company.contacts || !Array.isArray(company.contacts) || company.contacts.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No contacts associated with this company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditError(null);
        }}
        onSubmit={handleEdit}
        initialData={company as CompanyFormData | null}
        isSubmitting={updateMutation.isPending}
        errorMessage={editError}
      />
    </div>
  );
}
