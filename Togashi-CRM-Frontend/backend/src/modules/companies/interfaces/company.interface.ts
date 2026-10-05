export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Company {
  id: string;
  organizationId: string;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  status: CompanyStatus;
  industry?: string;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface CompanySummary {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
}

export interface PaginatedCompanies {
  items: Company[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
  summary: CompanySummary;
}
