import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COLLECTIONS } from '../../common/constants';
import { OrganizationStatus } from '../../common/enums';

export interface Organization {
  id: string;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  status: OrganizationStatus;
  timezone: string;
  currency: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async findById(organizationId: string): Promise<Organization | null> {
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.ORGANIZATIONS)
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Organization;
  }

  async create(data: {
    id?: string;
    name: string;
    legalName?: string;
    email?: string;
    phone?: string;
    timezone?: string;
    currency?: string;
    country?: string;
    status?: OrganizationStatus;
  }): Promise<Organization> {
    const now = new Date().toISOString();

    const org: Organization = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      legalName: data.legalName,
      email: data.email,
      phone: data.phone,
      logoUrl: undefined,
      status: data.status ?? OrganizationStatus.ACTIVE,
      timezone: data.timezone ?? 'Africa/Kampala',
      currency: data.currency ?? 'UGX',
      country: data.country ?? 'UG',
      createdAt: now,
      updatedAt: now,
    };

    const { error } = await this.supabase.client
      .from(COLLECTIONS.ORGANIZATIONS)
      .insert(org);

    if (error) throw error;

    this.logger.log(`Organization created: ${org.name} (${org.id})`);
    return org;
  }

  async update(
    organizationId: string,
    data: Partial<Pick<Organization, 'name' | 'legalName' | 'email' | 'phone' | 'logoUrl' | 'status'>>,
  ): Promise<void> {
    const now = new Date().toISOString();
    await this.supabase.client
      .from(COLLECTIONS.ORGANIZATIONS)
      .update({ ...data, updatedAt: now })
      .eq('id', organizationId);
  }
}
