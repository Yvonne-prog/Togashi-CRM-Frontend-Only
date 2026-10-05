export const PERMISSIONS = {
  'dashboard.view': 'View Dashboard',

  'contacts.view': 'View Contacts',
  'contacts.create': 'Add Contacts',
  'contacts.edit': 'Edit Contacts',
  'contacts.archive': 'Archive Contacts',
  'contacts.delete': 'Delete Contacts',
  'contacts.export': 'Export Contacts',

  'companies.view': 'View Companies',
  'companies.create': 'Add Companies',
  'companies.edit': 'Edit Companies',
  'companies.archive': 'Archive Companies',
  'companies.delete': 'Delete Companies',
  'companies.export': 'Export Companies',

  'leads.view': 'View Leads',
  'leads.create': 'Add Leads',
  'leads.edit': 'Edit Leads',
  'leads.change_stage': 'Change Lead Stage',
  'leads.delete': 'Delete Leads',
  'leads.export': 'Export Leads',

  'deals.view': 'View Deals',
  'deals.create': 'Add Deals',
  'deals.edit': 'Edit Deals',
  'deals.change_stage': 'Change Deal Stage',
  'deals.mark_won': 'Mark as Won',
  'deals.mark_lost': 'Mark as Lost',
  'deals.delete': 'Delete Deals',
  'deals.export': 'Export Deals',

  'quotations.view': 'View Quotations',
  'quotations.create': 'Create Quotations',
  'quotations.edit': 'Edit Quotations',
  'quotations.change_status': 'Change Quotation Status',
  'quotations.preview': 'Preview Quotations',
  'quotations.download': 'Download Quotations',
  'quotations.delete': 'Delete Quotations',
  'quotations.create_project': 'Create Project from Quotation',
  'quotations.create_invoice': 'Create Invoice from Quotation',

  'invoices.view': 'View Invoices',
  'invoices.create': 'Create Invoices',
  'invoices.edit': 'Edit Invoices',
  'invoices.record_payment': 'Record Payments',
  'invoices.cancel': 'Cancel Invoices',
  'invoices.preview': 'Preview Invoices',
  'invoices.download': 'Download Invoices',
  'invoices.send_reminder': 'Send Payment Reminders',
  'invoices.view_payment_history': 'View Payment History',
  'invoices.export': 'Export Invoices',

  'receipts.view': 'View Receipts',
  'receipts.create': 'Create Receipts',
  'receipts.preview': 'Preview Receipts',
  'receipts.download': 'Download Receipts',
  'receipts.void': 'Void Receipts',
  'receipts.export': 'Export Receipts',

  'projects.view': 'View Projects',
  'projects.create': 'Create Projects',
  'projects.edit': 'Edit Projects',
  'projects.change_status': 'Change Project Status',
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
  'documents.preview': 'Preview Documents',
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

  'users.view': 'View Users',
  'users.create': 'Add Users',
  'users.edit': 'Edit Users',
  'users.change_access': 'Change User Access',
  'users.disable': 'Disable Users',
  'users.remove_access': 'Remove User Access',

  'settings.view': 'View Settings',
  'settings.edit': 'Edit Settings',

  'financial.view_invoice_amounts': 'View Invoice Amounts',
  'financial.view_receipt_amounts': 'View Receipt Amounts',
  'financial.view_revenue': 'View Revenue',
  'financial.view_outstanding_balances': 'View Outstanding Balances',
  'financial.export': 'Export Financial Data',
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
  | 'settings'
  | 'financial';

export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];

export function getModulePermissions(module: ModulePermissionGroup): Permission[] {
  return ALL_PERMISSIONS.filter((p) => p.startsWith(`${module}.`));
}

export const MODULE_LABELS: Record<ModulePermissionGroup, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  companies: 'Companies',
  leads: 'Leads',
  deals: 'Deals',
  quotations: 'Quotations',
  invoices: 'Invoices',
  receipts: 'Receipts',
  projects: 'Projects',
  tasks: 'Tasks',
  calendar: 'Calendar',
  documents: 'Documents',
  communications: 'Communications',
  reports: 'Reports',
  users: 'User Access',
  settings: 'Settings',
  financial: 'Financial Information',
};

export interface ModulePermissionDef {
  key: string;
  label: string;
  help?: string;
}

export const MODULE_PERMISSION_DEFS: Record<string, ModulePermissionDef[]> = {
  dashboard: [
    { key: 'dashboard.view', label: 'View Dashboard' },
  ],
  contacts: [
    { key: 'contacts.view', label: 'View' },
    { key: 'contacts.create', label: 'Add' },
    { key: 'contacts.edit', label: 'Edit' },
    { key: 'contacts.archive', label: 'Archive' },
    { key: 'contacts.delete', label: 'Delete' },
    { key: 'contacts.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  companies: [
    { key: 'companies.view', label: 'View' },
    { key: 'companies.create', label: 'Add' },
    { key: 'companies.edit', label: 'Edit' },
    { key: 'companies.archive', label: 'Archive' },
    { key: 'companies.delete', label: 'Delete' },
    { key: 'companies.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  leads: [
    { key: 'leads.view', label: 'View' },
    { key: 'leads.create', label: 'Add' },
    { key: 'leads.edit', label: 'Edit' },
    { key: 'leads.change_stage', label: 'Change Stage' },
    { key: 'leads.delete', label: 'Delete' },
    { key: 'leads.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  deals: [
    { key: 'deals.view', label: 'View' },
    { key: 'deals.create', label: 'Add' },
    { key: 'deals.edit', label: 'Edit' },
    { key: 'deals.change_stage', label: 'Change Stage' },
    { key: 'deals.mark_won', label: 'Mark as Won' },
    { key: 'deals.mark_lost', label: 'Mark as Lost' },
    { key: 'deals.delete', label: 'Delete' },
    { key: 'deals.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  quotations: [
    { key: 'quotations.view', label: 'View' },
    { key: 'quotations.create', label: 'Create' },
    { key: 'quotations.edit', label: 'Edit' },
    { key: 'quotations.change_status', label: 'Change Status' },
    { key: 'quotations.preview', label: 'Preview' },
    { key: 'quotations.download', label: 'Download' },
    { key: 'quotations.delete', label: 'Delete' },
    { key: 'quotations.create_project', label: 'Create Project' },
    { key: 'quotations.create_invoice', label: 'Create Invoice' },
  ],
  invoices: [
    { key: 'invoices.view', label: 'View' },
    { key: 'invoices.create', label: 'Create' },
    { key: 'invoices.edit', label: 'Edit' },
    { key: 'invoices.record_payment', label: 'Record Payments', help: 'Allows the user to add payments to invoices and update balances.' },
    { key: 'invoices.cancel', label: 'Cancel' },
    { key: 'invoices.preview', label: 'Preview' },
    { key: 'invoices.download', label: 'Download' },
    { key: 'invoices.send_reminder', label: 'Send Reminders' },
    { key: 'invoices.view_payment_history', label: 'View Payment History' },
    { key: 'invoices.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  receipts: [
    { key: 'receipts.view', label: 'View' },
    { key: 'receipts.create', label: 'Create' },
    { key: 'receipts.preview', label: 'Preview' },
    { key: 'receipts.download', label: 'Download' },
    { key: 'receipts.void', label: 'Void', help: 'Allows the user to invalidate a receipt while preserving the financial record.' },
    { key: 'receipts.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  projects: [
    { key: 'projects.view', label: 'View' },
    { key: 'projects.create', label: 'Create' },
    { key: 'projects.edit', label: 'Edit' },
    { key: 'projects.change_status', label: 'Change Status' },
    { key: 'projects.delete', label: 'Delete' },
  ],
  tasks: [
    { key: 'tasks.view', label: 'View' },
    { key: 'tasks.create', label: 'Create' },
    { key: 'tasks.edit', label: 'Edit' },
    { key: 'tasks.complete', label: 'Complete' },
    { key: 'tasks.delete', label: 'Delete' },
  ],
  calendar: [
    { key: 'calendar.view', label: 'View' },
    { key: 'calendar.create', label: 'Create Events' },
    { key: 'calendar.edit', label: 'Edit Events' },
    { key: 'calendar.delete', label: 'Delete Events' },
  ],
  documents: [
    { key: 'documents.view', label: 'View' },
    { key: 'documents.upload', label: 'Upload' },
    { key: 'documents.preview', label: 'Preview' },
    { key: 'documents.download', label: 'Download' },
    { key: 'documents.edit', label: 'Edit' },
    { key: 'documents.delete', label: 'Delete' },
  ],
  communications: [
    { key: 'communications.view', label: 'View' },
    { key: 'communications.send', label: 'Send Messages' },
    { key: 'communications.internal_note', label: 'Add Internal Notes' },
    { key: 'communications.archive', label: 'Archive Conversations' },
  ],
  reports: [
    { key: 'reports.view', label: 'View Reports' },
    { key: 'reports.financial', label: 'Financial Reports', help: 'Allows access to revenue, outstanding balances and other sensitive financial summaries.' },
    { key: 'reports.export', label: 'Export', help: 'Allows data to be downloaded outside the CRM.' },
  ],
  users: [
    { key: 'users.view', label: 'View' },
    { key: 'users.create', label: 'Add' },
    { key: 'users.edit', label: 'Edit' },
    { key: 'users.change_access', label: 'Change Access' },
    { key: 'users.disable', label: 'Disable' },
    { key: 'users.remove_access', label: 'Remove Access' },
  ],
  settings: [
    { key: 'settings.view', label: 'View' },
    { key: 'settings.edit', label: 'Edit' },
  ],
  financial: [
    { key: 'financial.view_invoice_amounts', label: 'View Invoice Amounts' },
    { key: 'financial.view_receipt_amounts', label: 'View Receipt Amounts' },
    { key: 'financial.view_revenue', label: 'View Revenue' },
    { key: 'financial.view_outstanding_balances', label: 'View Outstanding Balances' },
    { key: 'financial.export', label: 'Export Financial Data' },
  ],
};

export const ACCESS_PRESETS: Record<string, { label: string; description: string; permissions: Permission[] }> = {
  view_only: {
    label: 'View Only',
    description: 'View all modules without create, edit or delete access.',
    permissions: ALL_PERMISSIONS.filter((p) => p.endsWith('.view')),
  },
  sales_work: {
    label: 'Sales Work',
    description: 'Full access to leads, deals, quotations, contacts and companies.',
    permissions: [
      'dashboard.view',
      'contacts.view', 'contacts.create', 'contacts.edit',
      'companies.view', 'companies.create', 'companies.edit',
      'leads.view', 'leads.create', 'leads.edit', 'leads.change_stage',
      'deals.view', 'deals.create', 'deals.edit', 'deals.change_stage', 'deals.mark_won', 'deals.mark_lost',
      'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.preview', 'quotations.download',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.download',
      'communications.view', 'communications.send', 'communications.internal_note',
    ],
  },
  project_work: {
    label: 'Project Work',
    description: 'Projects, tasks, documents and calendar.',
    permissions: [
      'dashboard.view',
      'projects.view', 'projects.create', 'projects.edit', 'projects.change_status',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.preview', 'documents.download', 'documents.edit',
      'communications.view', 'communications.send',
    ],
  },
  financial_work: {
    label: 'Financial Work',
    description: 'Invoices, receipts, quotations and financial reports.',
    permissions: [
      'dashboard.view',
      'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.preview', 'quotations.download', 'quotations.create_invoice',
      'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.record_payment', 'invoices.preview', 'invoices.download', 'invoices.view_payment_history',
      'receipts.view', 'receipts.create', 'receipts.preview', 'receipts.download',
      'reports.view', 'reports.financial',
      'financial.view_invoice_amounts', 'financial.view_receipt_amounts', 'financial.view_revenue', 'financial.view_outstanding_balances',
    ],
  },
  customer_support: {
    label: 'Customer Support',
    description: 'Contacts, companies, communications and documents.',
    permissions: [
      'dashboard.view',
      'contacts.view', 'contacts.create', 'contacts.edit',
      'companies.view',
      'communications.view', 'communications.send', 'communications.internal_note', 'communications.archive',
      'documents.view', 'documents.upload', 'documents.preview', 'documents.download',
      'calendar.view', 'calendar.create',
    ],
  },
  full_operational: {
    label: 'Full Operational Access',
    description: 'Full access to all operational modules except user management.',
    permissions: ALL_PERMISSIONS.filter(
      (p) => !p.startsWith('users.') && !p.startsWith('settings.'),
    ),
  },
};
