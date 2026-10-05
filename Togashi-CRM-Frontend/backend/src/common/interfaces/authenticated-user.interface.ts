export interface AuthenticatedUser {
  uid: string;
  email: string;
  organizationId: string;
  organizationName?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  jobTitle?: string;
  department?: string;
  roleCodes: string[];
  status: string;
  lastLoginAt?: string;
}
