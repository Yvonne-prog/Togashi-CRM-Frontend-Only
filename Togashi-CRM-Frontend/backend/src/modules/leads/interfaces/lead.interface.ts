export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface LeadRow {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string | null;
  interest: string | null;
  estimated_budget: number | null;
  currency: string | null;
  status: string;
  score: number | null;
  temperature: string | null;
  owner_id: string | null;
  owner_name: string | null;
  expected_decision_date: string | null;
  notes: string | null;
  last_interaction_at: string | null;
  next_action: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Lead {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  interest?: string;
  estimatedBudget?: number;
  currency?: string;
  status: LeadStatus;
  score?: number;
  temperature?: LeadTemperature;
  ownerId?: string;
  ownerName?: string;
  expectedDecisionDate?: string;
  notes?: string;
  lastInteractionAt?: string;
  nextAction?: string;
  createdAt: string;
  updatedAt: string;
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

export interface LeadListResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}
