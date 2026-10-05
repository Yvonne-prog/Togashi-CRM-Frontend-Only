export const DEFAULT_ROLES = [
  'ADMIN',
  'EXECUTIVE',
  'BUSINESS_DEVELOPMENT',
  'SALES',
  'PROJECT_MANAGER',
  'PROJECT_TEAM',
  'FINANCE',
  'CUSTOMER_SERVICE',
  'VIEWER',
] as const;

export type RoleCode = (typeof DEFAULT_ROLES)[number];

export const SEED_ORGANIZATION_NAME = 'Togashi Technologies';

export const DEV_ORGANIZATION_ID = '00000000-0000-0000-0000-000000000001';
export const DEV_USER_UID = '3c56a82e-d087-4132-97c1-25593366ae48';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const COLLECTIONS = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  ROLE_PERMISSIONS: 'role_permissions',
  USER_ROLES: 'user_roles',
  DEPARTMENTS: 'departments',
  COMPANIES: 'companies',
  CONTACTS: 'contacts',
  LEADS: 'leads',
  DEALS: 'deals',
  QUOTATIONS: 'quotations',
  QUOTATION_ITEMS: 'quotation_items',
  INVOICES: 'invoices',
  INVOICE_ITEMS: 'invoice_items',
  RECEIPTS: 'receipts',
  PROJECTS: 'projects',
  PROJECT_MEMBERS: 'project_members',
  TASKS: 'tasks',
  TASK_COMMENTS: 'task_comments',
  CALENDAR_EVENTS: 'calendar_events',
  NOTIFICATIONS: 'notifications',
  DOCUMENTS: 'documents',
  ACTIVITY_LOGS: 'activity_logs',
} as const;
