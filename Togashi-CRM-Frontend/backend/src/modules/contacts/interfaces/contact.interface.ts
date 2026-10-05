export type ContactStatus = 'ACTIVE' | 'PROSPECT' | 'INACTIVE';

export interface ContactRow {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  full_name_normalized: string;
  email: string | null;
  email_normalized: string | null;
  phone: string | null;
  job_title: string | null;
  company_id: string | null;
  company_name: string | null;
  status: string;
  owner_id: string | null;
  owner_name: string | null;
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Contact {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  fullNameNormalized: string;
  email?: string;
  emailNormalized?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  status: ContactStatus;
  ownerId?: string;
  ownerName?: string;
  notes?: string;
  lastContactedAt?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ContactSummary {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
}

export interface PaginatedContacts {
  items: Contact[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
  summary: ContactSummary;
}