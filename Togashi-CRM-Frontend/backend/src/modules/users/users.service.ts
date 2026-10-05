import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COLLECTIONS } from '../../common/constants';
import { UserStatus } from '../../common/enums';

export interface User {
  uid: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailNormalized: string;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  roleCodes: string[];
  department?: string;
  jobTitle?: string;
  lastLoginAt?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  isDeleted: boolean;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabase: SupabaseService) {}

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async findByUid(uid: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.USERS)
      .select('*')
      .eq('uid', uid)
      .eq('isDeleted', false)
      .maybeSingle();

    if (error || !data) return null;
    return data as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = this.normalizeEmail(email);
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.USERS)
      .select('*')
      .eq('emailNormalized', normalized)
      .eq('isDeleted', false)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as User;
  }

  async create(data: {
    uid: string;
    organizationId: string;
    email: string;
    firstName: string;
    lastName: string;
    roleCodes?: string[];
    department?: string;
    jobTitle?: string;
    phone?: string;
    createdBy?: string;
  }): Promise<User> {
    const now = new Date().toISOString();

    const user: User = {
      uid: data.uid,
      organizationId: data.organizationId,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      emailNormalized: this.normalizeEmail(data.email),
      phone: data.phone,
      avatarUrl: undefined,
      status: UserStatus.ACTIVE,
      roleCodes: data.roleCodes ?? [],
      department: data.department,
      jobTitle: data.jobTitle,
      lastLoginAt: undefined,
      createdAt: now,
      createdBy: data.createdBy,
      updatedAt: now,
      updatedBy: data.createdBy,
      isDeleted: false,
    };

    const { error } = await this.supabase.client
      .from(COLLECTIONS.USERS)
      .insert({ ...user, uid: data.uid });

    if (error) throw error;

    this.logger.log(`User created: ${user.displayName} (${data.uid})`);
    return user;
  }

  async updateLastLogin(uid: string): Promise<void> {
    const now = new Date().toISOString();
    await this.supabase.client
      .from(COLLECTIONS.USERS)
      .update({ lastLoginAt: now, updatedAt: now })
      .eq('uid', uid);
  }

  async softDelete(uid: string, deletedBy?: string): Promise<void> {
    const now = new Date().toISOString();
    await this.supabase.client
      .from(COLLECTIONS.USERS)
      .update({
        isDeleted: true,
        deletedAt: now,
        deletedBy: deletedBy ?? null,
        updatedAt: now,
      })
      .eq('uid', uid);
  }
}
