import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api-client';

export interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  status: 'ACTIVE' | 'PROSPECT' | 'INACTIVE';
  ownerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSummary {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
}

export interface PaginatedContacts {
  items: ContactItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
  summary: ContactSummary;
}

export interface ListContactsParams {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: string;
  companyId?: string;
  sortBy?: string;
  sortDirection?: string;
}

export function useContacts(params: ListContactsParams): UseQueryResult<PaginatedContacts> {
  return useQuery<PaginatedContacts>({
    queryKey: ['contacts', params],
    queryFn: () => apiGet<PaginatedContacts>('/contacts', params as Record<string, string | number | undefined>),
    staleTime: 30_000,
  });
}

export function useContact(id: string): UseQueryResult<ContactItem> {
  return useQuery<ContactItem>({
    queryKey: ['contacts', id],
    queryFn: () => apiGet<ContactItem>(`/contacts/${id}`),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation<ContactItem, Error, Partial<ContactItem>>({
    mutationFn: (data) => apiPost<ContactItem>('/contacts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation<ContactItem, Error, { id: string; data: Partial<ContactItem> }>({
    mutationFn: ({ id, data }) => apiPatch<ContactItem>(`/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => apiDelete(`/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
