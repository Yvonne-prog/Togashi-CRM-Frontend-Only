import type { RoleId } from './roles';

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  role: RoleId;
  status: 'Active' | 'Disabled' | 'Invited';
  initials: string;
  lastLogin: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'demo-admin-001',
    fullName: 'Togashi Administrator',
    email: 'admin@togashi.local',
    role: 'ADMIN',
    status: 'Active',
    initials: 'TA',
    lastLogin: 'Today, 08:15 AM',
  },
  {
    id: 'user-alex',
    fullName: 'Alex Mugisha',
    email: 'alex.mugisha@togashi.local',
    role: 'BUSINESS_DEVELOPMENT',
    status: 'Active',
    initials: 'AM',
    lastLogin: 'Today, 09:30 AM',
  },
  {
    id: 'user-sarah',
    fullName: 'Sarah Birungi',
    email: 'sarah.birungi@togashi.local',
    role: 'SALES',
    status: 'Active',
    initials: 'SB',
    lastLogin: 'Yesterday, 04:45 PM',
  },
  {
    id: 'user-david',
    fullName: 'David Okello',
    email: 'david.okello@togashi.local',
    role: 'PROJECT_MANAGER',
    status: 'Active',
    initials: 'DO',
    lastLogin: 'Today, 07:20 AM',
  },
  {
    id: 'user-grace',
    fullName: 'Grace Nakato',
    email: 'grace.nakato@togashi.local',
    role: 'FINANCE',
    status: 'Active',
    initials: 'GN',
    lastLogin: 'Yesterday, 03:10 PM',
  },
  {
    id: 'user-maria',
    fullName: 'Maria Nalubega',
    email: 'maria.nalubega@togashi.local',
    role: 'CUSTOMER_SERVICE',
    status: 'Active',
    initials: 'MN',
    lastLogin: 'Today, 10:00 AM',
  },
  {
    id: 'user-peter',
    fullName: 'Peter Okot',
    email: 'peter.okot@togashi.local',
    role: 'PROJECT_TEAM',
    status: 'Active',
    initials: 'PO',
    lastLogin: 'Jul 25, 11:30 AM',
  },
  {
    id: 'user-exec',
    fullName: 'Executive User',
    email: 'executive@togashi.local',
    role: 'EXECUTIVE',
    status: 'Active',
    initials: 'EU',
    lastLogin: 'Yesterday, 09:00 AM',
  },
  {
    id: 'user-viewer',
    fullName: 'Viewer User',
    email: 'viewer@togashi.local',
    role: 'VIEWER',
    status: 'Active',
    initials: 'VU',
    lastLogin: 'Jul 24, 02:15 PM',
  },
];

export function getUserByEmail(email: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
