import type { Permission } from './permissions';
import { ALL_PERMISSIONS } from './permissions';

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department?: string;
  accountType: 'ADMIN' | 'USER';
  status: 'Active' | 'Disabled' | 'Invited';
  initials: string;
  lastLogin: string;
  permissions: Permission[];
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'demo-admin-001',
    fullName: 'Togashi Administrator',
    email: 'admin@togashi.local',
    jobTitle: 'System Administrator',
    accountType: 'ADMIN',
    status: 'Active',
    initials: 'TA',
    lastLogin: 'Today, 08:15 AM',
    permissions: [...ALL_PERMISSIONS],
  },
  {
    id: 'user-grace',
    fullName: 'Grace Nakato',
    email: 'grace.nakato@togashi.local',
    jobTitle: 'Finance Officer',
    department: 'Finance',
    accountType: 'USER',
    status: 'Active',
    initials: 'GN',
    lastLogin: 'Yesterday, 03:10 PM',
    permissions: [
      'dashboard.view',
      'contacts.view',
      'companies.view',
      'quotations.view', 'quotations.preview', 'quotations.download',
      'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.record_payment', 'invoices.preview', 'invoices.download', 'invoices.view_payment_history',
      'receipts.view', 'receipts.create', 'receipts.preview', 'receipts.download',
      'reports.view', 'reports.financial',
      'financial.view_invoice_amounts', 'financial.view_receipt_amounts', 'financial.view_revenue', 'financial.view_outstanding_balances',
    ],
  },
  {
    id: 'user-sarah',
    fullName: 'Sarah Birungi',
    email: 'sarah.birungi@togashi.local',
    jobTitle: 'Business Developer',
    department: 'Sales',
    accountType: 'USER',
    status: 'Active',
    initials: 'SB',
    lastLogin: 'Yesterday, 04:45 PM',
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
  {
    id: 'user-david',
    fullName: 'David Okello',
    email: 'david.okello@togashi.local',
    jobTitle: 'Developer',
    department: 'Engineering',
    accountType: 'USER',
    status: 'Active',
    initials: 'DO',
    lastLogin: 'Today, 07:20 AM',
    permissions: [
      'dashboard.view',
      'projects.view',
      'tasks.view', 'tasks.edit', 'tasks.complete',
      'calendar.view',
      'documents.view', 'documents.upload', 'documents.preview', 'documents.download',
    ],
  },
  {
    id: 'user-maria',
    fullName: 'Maria Nalubega',
    email: 'maria.nalubega@togashi.local',
    jobTitle: 'Customer Service Lead',
    department: 'Support',
    accountType: 'USER',
    status: 'Active',
    initials: 'MN',
    lastLogin: 'Today, 10:00 AM',
    permissions: [
      'dashboard.view',
      'contacts.view', 'contacts.create', 'contacts.edit',
      'companies.view',
      'communications.view', 'communications.send', 'communications.internal_note', 'communications.archive',
      'documents.view', 'documents.upload', 'documents.preview', 'documents.download',
      'calendar.view', 'calendar.create',
    ],
  },
  {
    id: 'user-alex',
    fullName: 'Alex Mugisha',
    email: 'alex.mugisha@togashi.local',
    jobTitle: 'Sales Representative',
    department: 'Sales',
    accountType: 'USER',
    status: 'Active',
    initials: 'AM',
    lastLogin: 'Today, 09:30 AM',
    permissions: [
      'dashboard.view',
      'contacts.view', 'contacts.create',
      'companies.view',
      'leads.view', 'leads.create', 'leads.edit', 'leads.change_stage',
      'deals.view', 'deals.create', 'deals.edit', 'deals.change_stage',
      'quotations.view', 'quotations.create', 'quotations.preview',
      'tasks.view', 'tasks.create', 'tasks.complete',
      'calendar.view', 'calendar.create',
      'communications.view', 'communications.send',
    ],
  },
  {
    id: 'user-peter',
    fullName: 'Peter Okot',
    email: 'peter.okot@togashi.local',
    jobTitle: 'Project Coordinator',
    department: 'Operations',
    accountType: 'USER',
    status: 'Active',
    initials: 'PO',
    lastLogin: 'Jul 25, 11:30 AM',
    permissions: [
      'dashboard.view',
      'projects.view', 'projects.create', 'projects.edit', 'projects.change_status',
      'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.complete',
      'calendar.view', 'calendar.create', 'calendar.edit',
      'documents.view', 'documents.upload', 'documents.preview', 'documents.download', 'documents.edit',
      'communications.view', 'communications.send',
    ],
  },
  {
    id: 'user-exec',
    fullName: 'James Kato',
    email: 'james.kato@togashi.local',
    jobTitle: 'Chief Executive Officer',
    department: 'Executive',
    accountType: 'USER',
    status: 'Active',
    initials: 'JK',
    lastLogin: 'Yesterday, 09:00 AM',
    permissions: [
      'dashboard.view',
      'contacts.view',
      'companies.view',
      'leads.view',
      'deals.view',
      'quotations.view', 'quotations.preview',
      'invoices.view', 'invoices.preview',
      'receipts.view',
      'projects.view',
      'tasks.view',
      'calendar.view',
      'documents.view', 'documents.preview',
      'reports.view', 'reports.financial',
      'financial.view_revenue', 'financial.view_outstanding_balances',
    ],
  },
  {
    id: 'user-viewer',
    fullName: 'Patricia Auma',
    email: 'patricia.auma@togashi.local',
    jobTitle: 'External Auditor',
    department: 'External',
    accountType: 'USER',
    status: 'Invited',
    initials: 'PA',
    lastLogin: 'Never',
    permissions: [
      'dashboard.view',
      'invoices.view', 'invoices.preview', 'invoices.view_payment_history',
      'receipts.view', 'receipts.preview',
      'reports.view', 'reports.financial',
      'financial.view_invoice_amounts', 'financial.view_receipt_amounts',
    ],
  },
];

export function getUserByEmail(email: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getAccessSummary(user: MockUser): string {
  if (user.accountType === 'ADMIN') return 'Full Access';
  const moduleKeys = ['contacts', 'companies', 'leads', 'deals', 'quotations', 'invoices', 'receipts', 'projects', 'tasks', 'calendar', 'documents', 'communications', 'reports'];
  const moduleCount = moduleKeys.filter((m) => user.permissions.some((p) => p.startsWith(`${m}.`))).length;
  if (moduleCount === 0) return 'No Access';
  const hasCreateOrEdit = moduleKeys.some((m) =>
    user.permissions.some((p) => p === `${m}.create` || p === `${m}.edit`),
  );
  if (!hasCreateOrEdit) return 'View Only';
  if (moduleCount >= 10) return 'Full Access';
  return `${moduleCount} Modules`;
}

export function getUserAccessDescription(user: MockUser): string {
  if (user.accountType === 'ADMIN') return 'Full system access — can manage users, permissions and all modules.';

  const descs: string[] = [];
  const modules: { key: string; label: string }[] = [
    { key: 'contacts', label: 'Contacts' },
    { key: 'companies', label: 'Companies' },
    { key: 'leads', label: 'Leads' },
    { key: 'deals', label: 'Deals' },
    { key: 'quotations', label: 'Quotations' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'receipts', label: 'Receipts' },
    { key: 'projects', label: 'Projects' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'documents', label: 'Documents' },
    { key: 'communications', label: 'Communications' },
    { key: 'reports', label: 'Reports' },
  ];

  for (const m of modules) {
    const modPerms = user.permissions.filter((p) => p.startsWith(`${m.key}.`));
    if (modPerms.length === 0) continue;

    const withoutView = modPerms.filter((p) => p !== `${m.key}.view`);
    if (withoutView.length === 0) {
      descs.push(`${m.label} — View only`);
      continue;
    }

    const actionLabels = withoutView
      .map((p) => p.split('.')[1]?.replace(/_/g, ' '))
      .filter(Boolean);
    const maxShow = 3;
    const shown = actionLabels.slice(0, maxShow);
    const rest = actionLabels.length > maxShow ? ` +${actionLabels.length - maxShow} more` : '';
    descs.push(`${m.label} — ${shown.join(', ')}${rest}`);
  }

  if (descs.length === 0) return 'No modules assigned.';

  return descs.join('\n');
}
