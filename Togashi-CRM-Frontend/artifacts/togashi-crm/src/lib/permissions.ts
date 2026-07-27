export const PERMISSIONS = {
  'dashboard.view': 'View Dashboard',

  'contacts.view': 'View Contacts',
  'contacts.create': 'Create Contacts',
  'contacts.edit': 'Edit Contacts',
  'contacts.archive': 'Archive Contacts',

  'companies.view': 'View Companies',
  'companies.create': 'Create Companies',
  'companies.edit': 'Edit Companies',
  'companies.archive': 'Archive Companies',

  'leads.view': 'View Leads',
  'leads.create': 'Create Leads',
  'leads.edit': 'Edit Leads',
  'leads.delete': 'Delete Leads',

  'deals.view': 'View Deals',
  'deals.create': 'Create Deals',
  'deals.edit': 'Edit Deals',
  'deals.change_stage': 'Change Deal Stage',
  'deals.delete': 'Delete Deals',

  'quotations.view': 'View Quotations',
  'quotations.create': 'Create Quotations',
  'quotations.edit': 'Edit Quotations',
  'quotations.approve': 'Approve Quotations',
  'quotations.download': 'Download Quotations',
  'quotations.delete': 'Delete Quotations',

  'invoices.view': 'View Invoices',
  'invoices.create': 'Create Invoices',
  'invoices.edit': 'Edit Invoices',
  'invoices.record_payment': 'Record Payments',
  'invoices.cancel': 'Cancel Invoices',
  'invoices.download': 'Download Invoices',

  'receipts.view': 'View Receipts',
  'receipts.create': 'Create Receipts',
  'receipts.void': 'Void Receipts',
  'receipts.download': 'Download Receipts',

  'projects.view': 'View Projects',
  'projects.create': 'Create Projects',
  'projects.edit': 'Edit Projects',
  'projects.delete': 'Delete Projects',

  'tasks.view': 'View Tasks',
  'tasks.create': 'Create Tasks',
  'tasks.edit': 'Edit Tasks',
  'tasks.complete': 'Complete Tasks',
  'tasks.delete': 'Delete Tasks',

  'calendar.view': 'View Calendar',
  'calendar.create': 'Create Events',
  'calendar.edit': 'Edit Events',
  'calendar.delete': 'Delete Events',

  'documents.view': 'View Documents',
  'documents.upload': 'Upload Documents',
  'documents.download': 'Download Documents',
  'documents.edit': 'Edit Documents',
  'documents.delete': 'Delete Documents',

  'communications.view': 'View Communications',
  'communications.send': 'Send Messages',
  'communications.internal_note': 'Add Internal Notes',
  'communications.archive': 'Archive Conversations',

  'reports.view': 'View Reports',
  'reports.financial': 'View Financial Reports',
  'reports.export': 'Export Reports',

  'users.view': 'View Users & Roles',
  'users.create': 'Create Users',
  'users.edit': 'Edit Users',
  'users.assign_roles': 'Assign Roles',
  'users.disable': 'Disable Users',

  'settings.view': 'View Settings',
  'settings.edit': 'Edit Settings',
} as const;

export type Permission = keyof typeof PERMISSIONS;

export type ModulePermissionGroup =
  | 'dashboard'
  | 'contacts'
  | 'companies'
  | 'leads'
  | 'deals'
  | 'quotations'
  | 'invoices'
  | 'receipts'
  | 'projects'
  | 'tasks'
  | 'calendar'
  | 'documents'
  | 'communications'
  | 'reports'
  | 'users'
  | 'settings';

export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];

export function getModulePermissions(module: ModulePermissionGroup): Permission[] {
  return ALL_PERMISSIONS.filter((p) => p.startsWith(module));
}
