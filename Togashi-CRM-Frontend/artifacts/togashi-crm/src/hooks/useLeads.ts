import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api-client';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface LeadItem {
  id: string;
  organizationId?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  interest?: string | null;
  estimatedBudget?: number | null;
  currency?: string;
  status: string;
  score?: number;
  temperature?: string;
  ownerId?: string | null;
  ownerName?: string | null;
  expectedDecisionDate?: string | null;
  notes?: string | null;
  lastInteractionAt?: string | null;
  nextAction?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadListResponse {
  data: LeadItem[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadStatsByStatus {
  status: string;
  count: number;
}

export interface LeadStatsByTemperature {
  temperature: string;
  count: number;
}

export interface LeadStatsBySource {
  source: string;
  count: number;
}

export interface LeadStats {
  total: number;
  byStatus: LeadStatsByStatus[];
  byTemperature: LeadStatsByTemperature[];
  bySource: LeadStatsBySource[];
}

export interface LeadConvertResult {
  contactId?: string;
  companyId?: string;
  dealId?: string;
}

export interface LeadConvertInput {
  createContact?: boolean;
  createCompany?: boolean;
  createDeal?: boolean;
  dealTitle?: string;
  dealValue?: number;
  dealStage?: string;
}

export interface ListLeadsParams {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
  temperature?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useLeads(params: ListLeadsParams): UseQueryResult<LeadListResponse> {
  return useQuery<LeadListResponse>({
    queryKey: ['leads', params],
    queryFn: () => apiGet<LeadListResponse>('/leads', params as Record<string, string | number | undefined>),
    staleTime: 30_000,
  });
}

export function useLead(id: string): UseQueryResult<LeadItem> {
  return useQuery<LeadItem>({
    queryKey: ['leads', id],
    queryFn: () => apiGet<LeadItem>(`/leads/${id}`),
    enabled: !!id,
  });
}

export function useLeadStats(): UseQueryResult<LeadStats> {
  return useQuery<LeadStats>({
    queryKey: ['leads', 'stats'],
    queryFn: () => apiGet<LeadStats>('/leads/stats'),
    staleTime: 30_000,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation<LeadItem, Error, Partial<LeadItem>>({
    mutationFn: (data) => apiPost<LeadItem>('/leads', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation<LeadItem, Error, { id: string; data: Partial<LeadItem> }>({
    mutationFn: ({ id, data }) => apiPatch<LeadItem>(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => apiDelete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation<LeadConvertResult, Error, { id: string; data: Partial<LeadConvertInput> }>({
    mutationFn: ({ id, data }) => apiPost<LeadConvertResult>(`/leads/${id}/convert`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}