import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useListCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '@workspace/api-client-react';
import type { Company, CompanyInput, CompanyUpdate } from '@workspace/api-client-react';
import { Link } from 'wouter';
import {
  Add, SearchNormal1, Buildings, Location,
  ArrowLeft, ArrowRight, More, ArrowDown2,
} from 'iconsax-react';
import CompanyFormDialog, { type CompanyFormData } from '@/components/companies/CompanyFormDialog';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const COMPANY_PAGE_KEY = '/api/companies';

function trimOrNull(s: string | null | undefined): string | null {
  if (!s) return null;
  const t = s.trim();
  return t.length > 0 ? t : null;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
  ARCHIVED: 'bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function locationLabel(city?: string | null, country?: string | null): string {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '—';
}

export default function Companies() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const perPage = 12;

  const { data, isLoading, isFetching } = useListCompanies({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    limit: perPage,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  const invalidateCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [COMPANY_PAGE_KEY] });
  }, [queryClient]);

  const handleCreate = useCallback(
    (formData: CompanyFormData) => {
      setCreateError(null);
      const input = {
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
      } as CompanyInput;
      createMutation.mutate(
        { data: input },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setCreateError(null);
            invalidateCompanies();
            toast({
              title: 'Company created successfully.',
              description: `"${formData.name.trim()}" has been added.`,
            });
          },
          onError: () => {
            setCreateError('Unable to create company. Please try again.');
          },
        },
      );
    },
    [createMutation, invalidateCompanies],
  );

  const handleEdit = useCallback(
    (formData: CompanyFormData) => {
      if (!editData) return;
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
        { id: editData.id, data: update },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditData(null);
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
    [editData, updateMutation, invalidateCompanies],
  );

  const handleDelete = useCallback(
    (companyId: string) => {
      if (!window.confirm('Are you sure you want to delete this company?')) return;
      deleteMutation.mutate(
        { id: companyId },
        {
          onSuccess: () => {
            invalidateCompanies();
          },
        },
      );
    },
    [deleteMutation, invalidateCompanies],
  );

  const items = (data as unknown as { items?: Company[] })?.items ?? [];
  const total = (data as unknown as { total?: number })?.total ?? 0;
  const summary = (data as unknown as {
    summary?: { total: number; active: number; prospects: number; inactive: number };
  })?.summary ?? { total: 0, active: 0, prospects: 0, inactive: 0 };

  const totalPages = Math.ceil(total / perPage);
  const sf = total === 0 ? 0 : (page - 1) * perPage + 1;
  const st = Math.min(page * perPage, total);

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Companies</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage accounts and organizations.</p>
        </div>
        {hasPermission('companies.create') && (
          <button
            onClick={() => { setEditData(null); setCreateError(null); setDialogOpen(true); }}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
          >
            <Add size={18} variant="Linear" color="currentColor" />
            <span>Add Company</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Companies', icon: Buildings, val: summary.total, dot: null },
          { label: 'Active Companies', icon: null, val: summary.active, dot: 'bg-emerald-500' },
          { label: 'Prospects', icon: null, val: summary.prospects, dot: 'bg-purple-500' },
          { label: 'Inactive Companies', icon: null, val: summary.inactive, dot: 'bg-slate-400' },
        ].map(({ label, icon: Icon, val, dot }) => (
          <div key={label} className="bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-1">
              {Icon ? (
                <Icon size={15} variant="Linear" color="#64748B" />
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
              )}
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">{val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} variant="Linear" color="currentColor" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                onFocus={() => setSelectOpen(true)}
                onBlur={() => setSelectOpen(false)}
                className="border border-slate-200 bg-slate-50 rounded-lg text-xs pl-3 pr-10 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <ArrowDown2
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none transition-transform duration-150 ${selectOpen ? 'rotate-180' : ''}`}
                variant="Linear"
                color="currentColor"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button onClick={() => setMoreOpen(!moreOpen)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <More size={14} variant="Linear" color="currentColor" />More
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onMouseLeave={() => setMoreOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Import</button>
                  <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Export</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {(isLoading || isFetching) && items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500">Loading companies...</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Industry</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">City</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((c: Company) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <Link href={`/companies/${c.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                            {getInitials(c.name)}
                          </div>
                          <span className="text-[14px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">
                            {c.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {c.industry || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Location size={12} className="text-slate-400 shrink-0" variant="Linear" color="currentColor" />
                          {locationLabel((c as unknown as Record<string, string>).city, (c as unknown as Record<string, string>).country)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-slate-600">{(c as unknown as Record<string, string>).city || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[c.status || 'ACTIVE'] || STATUS_STYLES.ACTIVE}`}>
                          {STATUS_LABEL[c.status || 'ACTIVE'] || c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const el = e.currentTarget;
                              const menu = el.nextElementSibling as HTMLElement | null;
                              if (menu) menu.classList.toggle('hidden');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <More size={15} variant="Linear" color="currentColor" />
                          </button>
                          <div className="hidden absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30">
                            <button
                              className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                              onClick={() => { setEditData(c); setEditError(null); setDialogOpen(true); }}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(c.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">{sf}–{st} of {total}</div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isMutating}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} variant="Linear" color="currentColor" />
                </button>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${p === page ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages || isMutating}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowRight size={14} variant="Linear" color="currentColor" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Buildings size={24} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-base font-medium text-slate-900">No companies found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search || statusFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first company.'}
            </p>
            {search || statusFilter ? (
              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
                className="mt-3 text-sm font-medium text-[#16A34A]"
              >
                Clear all filters
              </button>
            ) : (
              hasPermission('companies.create') && (
                <button
                  onClick={() => { setEditData(null); setCreateError(null); setDialogOpen(true); }}
                  className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-sm font-semibold inline-flex items-center gap-1.5"
                >
                  <Add size={16} variant="Linear" color="currentColor" />
                  <span>Add Company</span>
                </button>
              )
            )}
          </div>
        )}
      </div>

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          setCreateError(null);
          setEditError(null);
          if (!open) setEditData(null);
        }}
        onSubmit={editData ? handleEdit : handleCreate}
        initialData={editData as CompanyFormData | null}
        isSubmitting={editData ? updateMutation.isPending : createMutation.isPending}
        errorMessage={editData ? editError : createError}
      />
    </div>
  );
}
