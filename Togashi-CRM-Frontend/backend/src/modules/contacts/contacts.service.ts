import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import {
  Contact,
  ContactRow,
  ContactStatus,
  ContactSummary,
  PaginatedContacts,
} from './interfaces/contact.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ListContactsQueryDto } from './dto/list-contacts-query.dto';
import { NotFoundException } from '../../common/exceptions';
import { COLLECTIONS } from '../../common/constants';

const MAX_PAGE = 100;

const SORT_COLUMN_MAP: Record<string, string> = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  fullName: 'full_name',
  status: 'status',
  companyName: 'company_name',
};

function safeErrorInfo(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== 'object') {
    return { raw: String(error) };
  }
  const e = error as Record<string, unknown>;
  return {
    name: e['name'],
    message: e['message'],
    code: e['code'],
    details: e['details'],
    hint: e['hint'],
    stack: typeof e['stack'] === 'string' ? (e['stack'] as string).split('\n').slice(0, 5).join('\n') : undefined,
  };
}

function toContact(row: ContactRow): Contact {
  return {
    id: row.id,
    organizationId: row.organization_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name ?? `${row.first_name} ${row.last_name}`,
    fullNameNormalized: row.full_name_normalized ?? `${row.first_name} ${row.last_name}`.toLowerCase(),
    email: row.email ?? undefined,
    emailNormalized: row.email_normalized ?? undefined,
    phone: row.phone ?? undefined,
    jobTitle: row.job_title ?? undefined,
    companyId: row.company_id ?? undefined,
    companyName: row.company_name ?? undefined,
    status: row.status as ContactStatus,
    ownerId: row.owner_id ?? undefined,
    ownerName: row.owner_name ?? undefined,
    notes: row.notes ?? undefined,
    lastContactedAt: row.last_contacted_at ?? undefined,
    createdAt: row.created_at,
    createdBy: row.created_by ?? undefined,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? undefined,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at ?? undefined,
    deletedBy: row.deleted_by ?? undefined,
  };
}

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(
    user: AuthenticatedUser,
    query: ListContactsQueryDto,
  ): Promise<PaginatedContacts> {
    const orgId = user.organizationId;
    const limit = Math.min(query.limit ?? 20, MAX_PAGE);
    const sortBy = SORT_COLUMN_MAP[query.sortBy ?? 'createdAt'] ?? 'created_at';
    const dir = (query.sortDirection ?? query.sortOrder ?? 'desc') === 'asc' ? 'asc' : 'desc';

    this.logger.log(`ContactsService.list — begin (orgId=${orgId}, sortBy=${sortBy}, dir=${dir}, limit=${limit})`);

    try {
      let q = this.supabase.client
        .from(COLLECTIONS.CONTACTS)
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .eq('is_deleted', false)
        .order(sortBy, { ascending: dir === 'asc' })
        .limit(limit);

      if (query.status) {
        q = q.eq('status', query.status);
      }

      if (query.companyId) {
        q = q.eq('company_id', query.companyId);
      }

      if (query.cursor) {
        q = q.gt('id', query.cursor);
      }

      if (query.search) {
        const term = `%${query.search}%`;
        q = q.or(
          `full_name.ilike.${term},email.ilike.${term},company_name.ilike.${term},phone.ilike.${term},job_title.ilike.${term}`,
        );
      }

      if (query.page && query.page > 1 && !query.cursor) {
        const offset = (query.page - 1) * limit;
        q = q.range(offset, offset + limit - 1);
      }

      const { data, error, count } = await q;

      if (error) {
        this.logger.error('ContactsService.list — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      const items = ((data ?? []) as ContactRow[]).map(toContact);

      const summary = await this.getSummary(orgId);

      this.logger.log(`ContactsService.list — success (total=${count}, returned=${items.length})`);

      return {
        items,
        nextCursor: items.length === limit ? items[items.length - 1]?.id ?? null : null,
        hasMore: items.length === limit,
        total: count ?? 0,
        summary,
      };
    } catch (err) {
      this.logger.error('ContactsService.list — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async findById(user: AuthenticatedUser, contactId: string): Promise<Contact> {
    this.logger.log(`ContactsService.findById — begin (id=${contactId})`);

    try {
      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.CONTACTS)
        .select('*')
        .eq('id', contactId)
        .eq('organization_id', user.organizationId)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error) {
        this.logger.error('ContactsService.findById — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      if (!data) {
        throw new NotFoundException('Contact');
      }

      return toContact(data as ContactRow);
    } catch (err) {
      this.logger.error('ContactsService.findById — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async create(user: AuthenticatedUser, dto: CreateContactDto): Promise<Contact> {
    this.logger.log(`ContactsService.create — begin (name="${dto.firstName} ${dto.lastName}")`);

    try {
      if (dto.companyId) {
        await this.assertCompanyInOrg(user.organizationId, dto.companyId);
      }

      const now = new Date().toISOString();
      const fullName = `${dto.firstName} ${dto.lastName}`.trim();

      const record: Record<string, unknown> = {
        organization_id: user.organizationId,
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email ?? null,
        email_normalized: dto.email ? dto.email.trim().toLowerCase() : null,
        phone: dto.phone ?? null,
        job_title: dto.jobTitle ?? null,
        company_id: dto.companyId ?? null,
        company_name: dto.companyName ?? null,
        status: (dto.status as ContactStatus) ?? 'ACTIVE',
        owner_id: user.uid,
        owner_name: user.displayName,
        notes: dto.notes ?? null,
        last_contacted_at: null,
        created_at: now,
        created_by: user.uid,
        updated_at: now,
        updated_by: user.uid,
        is_deleted: false,
      };

      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.CONTACTS)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('ContactsService.create — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      this.logger.log(`Contact created: ${fullName} (${data?.id})`);

      return toContact(data as ContactRow);
    } catch (err) {
      this.logger.error('ContactsService.create — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async update(user: AuthenticatedUser, contactId: string, dto: UpdateContactDto): Promise<Contact> {
    this.logger.log(`ContactsService.update — begin (id=${contactId})`);

    try {
      const existing = await this.findById(user, contactId);

      if (dto.companyId !== undefined && dto.companyId !== null) {
        await this.assertCompanyInOrg(user.organizationId, dto.companyId);
      }

      const now = new Date().toISOString();
      const updates: Record<string, unknown> = { updated_at: now, updated_by: user.uid };

      if (dto.firstName !== undefined || dto.lastName !== undefined) {
        const firstName = dto.firstName ?? existing.firstName;
        const lastName = dto.lastName ?? existing.lastName;
        updates.first_name = firstName;
        updates.last_name = lastName;
      }

      if (dto.email !== undefined) {
        updates.email = dto.email || null;
        updates.email_normalized = dto.email ? dto.email.trim().toLowerCase() : null;
      }

      if (dto.phone !== undefined) updates.phone = dto.phone || null;
      if (dto.jobTitle !== undefined) updates.job_title = dto.jobTitle || null;
      if (dto.companyId !== undefined) updates.company_id = dto.companyId || null;
      if (dto.companyName !== undefined) updates.company_name = dto.companyName || null;
      if (dto.status !== undefined) updates.status = dto.status;
      if (dto.notes !== undefined) updates.notes = dto.notes || null;

      const { error } = await this.supabase.client
        .from(COLLECTIONS.CONTACTS)
        .update(updates)
        .eq('id', contactId);

      if (error) {
        this.logger.error('ContactsService.update — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      return this.findById(user, contactId);
    } catch (err) {
      this.logger.error('ContactsService.update — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async softDelete(user: AuthenticatedUser, contactId: string): Promise<void> {
    this.logger.log(`ContactsService.softDelete — begin (id=${contactId})`);

    try {
      await this.findById(user, contactId);
      const now = new Date().toISOString();

      const { error } = await this.supabase.client
        .from(COLLECTIONS.CONTACTS)
        .update({
          is_deleted: true,
          deleted_at: now,
          deleted_by: user.uid,
          updated_at: now,
        })
        .eq('id', contactId);

      if (error) {
        this.logger.error('ContactsService.softDelete — Supabase returned error', safeErrorInfo(error));
        throw error;
      }
    } catch (err) {
      this.logger.error('ContactsService.softDelete — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  private async assertCompanyInOrg(organizationId: string, companyId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.COMPANIES)
      .select('id, name')
      .eq('id', companyId)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) {
      this.logger.error('ContactsService.assertCompanyInOrg — Supabase returned error', safeErrorInfo(error));
      throw error;
    }

    if (!data) {
      throw new NotFoundException('Company');
    }
  }

  private async getSummary(organizationId: string): Promise<ContactSummary> {
    const { count: activeCount } = await this.supabase.client
      .from(COLLECTIONS.CONTACTS)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'ACTIVE');

    const { count: prospectCount } = await this.supabase.client
      .from(COLLECTIONS.CONTACTS)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'PROSPECT');

    const { count: inactiveCount } = await this.supabase.client
      .from(COLLECTIONS.CONTACTS)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'INACTIVE');

    const active = activeCount ?? 0;
    const prospects = prospectCount ?? 0;
    const inactive = inactiveCount ?? 0;

    return {
      total: active + prospects + inactive,
      active,
      prospects,
      inactive,
    };
  }
}