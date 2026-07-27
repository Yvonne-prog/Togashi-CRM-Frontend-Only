import type { Permission } from './permissions';

export type RoleId =
  | 'ADMIN'
  | 'EXECUTIVE'
  | 'BUSINESS_DEVELOPMENT'
  | 'SALES'
  | 'PROJECT_MANAGER'
  | 'PROJECT_TEAM'
  | 'FINANCE'
  | 'CUSTOMER_SERVICE'
  | 'VIEWER';

export interface RoleDefinition {
  id: RoleId;
  label: string;
  description: string;
  permissions: Permission[];
}

export const ROLES: Record<RoleId, RoleDefinition> = {
  ADMIN: {
    id: 'ADMIN',
    label: 'Administrator',
    description: 'Full system access. Can manage users, roles, and all modules.',
    permissions: [
      'dashboard.view',

      'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.archive',
      'companies.view', 'companies.create', 'companies.edit', 'companies.archive',
      'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
      'deals.view', 'deals.create', 'deals.edit', 'deals.change_stage', 'deals.delete',
      'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.approve', 'quotations.download', 'quotations.delete',
      'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.record_payment', 'invoices.cancel', 'invoices.download',
      'receipts.view', 'receipts.create', 'receipts.void', 'receipts.download',
      'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete', 'tasks.delete',
      'calendar.view', 'calendar.create', 'calendar.edit', 'calendar.delete',
      'documents.view', 'documents.upload', 'documents.download', 'documents.edit', 'documents.delete',
      'communications.view', 'communications.send', 'communications.internal_note', 'communications.archive',
      'reports.view', 'reports.financial', 'reports.export',
      'users.view', 'users.create', 'users.edit', 'users.assign_roles', 'users.disable',
      'settings.view', 'settings.edit',
    ],
  },

  EXECUTIVE: {
    id: 'EXECUTIVE',
    label: 'CEO / Executive',
    description: 'Company-wide visibility. Can view all modules and approve records.',
    permissions: [
      'dashboard.view',

      'contacts.view',
      'companies.view',
      'leads.view',
      'deals.view',
      'quotations.view', 'quotations.approve', 'quotations.download',
      'invoices.view', 'invoices.approve', 'invoices.download',
      'receipts.view', 'receipts.download',
      'projects.view',
      'tasks.view',
      'calendar.view',
      'documents.view', 'documents.download',
      'communications.view', 'communications.send',
      'reports.view', 'reports.financial',
      'settings.view',
    ],
  },

  BUSINESS_DEVELOPMENT: {
    id: 'BUSINESS_DEVELOPMENT',
    label: 'Business Development',
    description: 'Focused on prospects, client relationships and opportunities.',
    permissions: [
      'dashboard.view',

      'contacts.view', 'contacts.create', 'contacts.edit',
      'companies.view', 'companies.create', 'companies.edit',
      'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
      'deals.view', 'deals.create', 'deals.edit', 'deals.change_stage',
      'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.download',
      'invoices.view',
      'projects.view',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.download',
      'communications.view', 'communications.send',
      'reports.view',
    ],
  },

  SALES: {
    id: 'SALES',
    label: 'Sales',
    description: 'Focused on leads and deals. Creates quotations and manages pipeline.',
    permissions: [
      'dashboard.view',

      'contacts.view',
      'companies.view',
      'leads.view', 'leads.create', 'leads.edit',
      'deals.view', 'deals.create', 'deals.edit', 'deals.change_stage',
      'quotations.view', 'quotations.create', 'quotations.download',
      'invoices.view',
      'projects.view',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.download',
      'communications.view', 'communications.send',
      'reports.view',
    ],
  },

  PROJECT_MANAGER: {
    id: 'PROJECT_MANAGER',
    label: 'Project Manager',
    description: 'Focused on project delivery, task management and team coordination.',
    permissions: [
      'dashboard.view',

      'contacts.view',
      'companies.view',
      'deals.view',
      'quotations.view',
      'invoices.view',
      'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete', 'tasks.delete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.download', 'documents.edit',
      'communications.view', 'communications.send',
      'reports.view',
    ],
  },

  PROJECT_TEAM: {
    id: 'PROJECT_TEAM',
    label: 'Project Team Member',
    description: 'Focused on assigned project work. Limited to own tasks and projects.',
    permissions: [
      'contacts.view',
      'companies.view',
      'projects.view',
      'tasks.view', 'tasks.edit', 'tasks.complete',
      'calendar.view',
      'documents.view', 'documents.upload', 'documents.download',
      'communications.view', 'communications.send',
    ],
  },

  FINANCE: {
    id: 'FINANCE',
    label: 'Finance',
    description: 'Focused on billing, payments and financial records.',
    permissions: [
      'dashboard.view',

      'contacts.view',
      'companies.view',
      'deals.view',
      'quotations.view',
      'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.record_payment', 'invoices.cancel', 'invoices.download',
      'receipts.view', 'receipts.create', 'receipts.void', 'receipts.download',
      'projects.view',
      'tasks.view',
      'calendar.view',
      'documents.view', 'documents.download',
      'communications.view',
      'reports.view', 'reports.financial', 'reports.export',
    ],
  },

  CUSTOMER_SERVICE: {
    id: 'CUSTOMER_SERVICE',
    label: 'Customer Service',
    description: 'Focused on communication and client support.',
    permissions: [
      'dashboard.view',

      'contacts.view',
      'companies.view',
      'projects.view',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create',
      'documents.view', 'documents.download',
      'communications.view', 'communications.send', 'communications.internal_note',
      'invoices.view',
    ],
  },

  VIEWER: {
    id: 'VIEWER',
    label: 'Viewer',
    description: 'Read-only access to assigned modules.',
    permissions: [
      'dashboard.view',
      'contacts.view',
      'companies.view',
      'projects.view',
      'tasks.view',
      'calendar.view',
      'documents.view',
      'communications.view',
    ],
  },
};

export function getRolePermissions(roleId: RoleId): Permission[] {
  return ROLES[roleId]?.permissions ?? [];
}

export const ROLE_LIST: RoleDefinition[] = Object.values(ROLES);
