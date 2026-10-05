import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { Company, CompanyStatus, CompanySummary, PaginatedCompanies } from './interfaces/company.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { NotFoundException } from '../../common/exceptions';
import { COLLECTIONS } from '../../common/constants';

const MAX_PAGE = 100;

const SORT_COLUMN_MAP: Record<string, string> = {
  name: 'name',
  industry: 'industry',
  city: 'city',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
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
    stack: typeof e['stack'] === 'string' ? e['stack'].split('\n').slice(0, 5).join('\n') : undefined,
  };
}

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(
    user: AuthenticatedUser,
    query: ListCompaniesQueryDto,
  ): Promise<PaginatedCompanies> {
    const orgId = user.organizationId;
    const limit = Math.min(query.limit ?? 20, MAX_PAGE);
    const sortBy = SORT_COLUMN_MAP[query.sortBy ?? 'createdAt'] ?? 'created_at';
    const dir = query.sortOrder === 'asc' ? 'asc' : 'desc';

    this.logger.log(`CompaniesService.list — begin (orgId=${orgId}, sortBy=${sortBy}, dir=${dir}, limit=${limit})`);

    try {
      let q = this.supabase.client
        .from(COLLECTIONS.COMPANIES)
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .eq('is_deleted', false)
        .order(sortBy, { ascending: dir === 'asc' })
        .limit(limit);

      if (query.status) {
        q = q.eq('status', query.status);
      }

      if (query.industry) {
        q = q.eq('industry', query.industry);
      }

      if (query.cursor) {
        q = q.gt('id', query.cursor);
      }

      if (query.search) {
        const term = `%${query.search}%`;
        q = q.or(`name.ilike.${term},industry.ilike.${term},city.ilike.${term},email.ilike.${term}`);
      }

      if (query.page && query.page > 1 && !query.cursor) {
        const offset = (query.page - 1) * limit;
        q = q.range(offset, offset + limit - 1);
      }

      console.log('[DEV] CompaniesService.list — running Supabase query', {
        operation: 'SELECT',
        table: COLLECTIONS.COMPANIES,
      });

      const { data, error, count } = await q;

      console.log('[DEV] CompaniesService.list — Supabase query result', {
        operation: 'SELECT',
        table: COLLECTIONS.COMPANIES,
        errorCode: error?.code ?? null,
        errorMessage: error?.message ?? null,
        errorDetails: error?.details ?? null,
        errorHint: error?.hint ?? null,
        rowCount: data?.length ?? null,
      });

      if (error) {
        this.logger.error('CompaniesService.list — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      const items = (data ?? []) as Company[];

      const summary = await this.getSummary(orgId);

      this.logger.log(`CompaniesService.list — success (total=${count}, returned=${items.length})`);

      return {
        items,
        nextCursor: items.length === limit ? items[items.length - 1]?.id ?? null : null,
        hasMore: items.length === limit,
        total: count ?? 0,
        summary,
      };
    } catch (err) {
      this.logger.error('CompaniesService.list — caught exception', safeErrorInfo(err));
      console.error('Companies list failed', {
        name: (err as Record<string, unknown>)?.name,
        message: (err as Record<string, unknown>)?.message,
        code: (err as Record<string, unknown>)?.code,
        details: (err as Record<string, unknown>)?.details,
        hint: (err as Record<string, unknown>)?.hint,
        stack: (err as Record<string, unknown>)?.stack,
      });
      throw err;
    }
  }

  async findById(user: AuthenticatedUser, companyId: string): Promise<Company> {
    this.logger.log(`CompaniesService.findById — begin (id=${companyId})`);

    try {
      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.COMPANIES)
        .select('*')
        .eq('id', companyId)
        .eq('organization_id', user.organizationId)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error) {
        this.logger.error('CompaniesService.findById — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      if (!data) {
        throw new NotFoundException('Company');
      }

      return data as Company;
    } catch (err) {
      this.logger.error('CompaniesService.findById — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async create(user: AuthenticatedUser, dto: CreateCompanyDto): Promise<Company> {
    this.logger.log(`CompaniesService.create — begin (name="${dto.name}")`);

    try {
      const now = new Date().toISOString();

      const record: Record<string, unknown> = {
        organization_id: user.organizationId,
        name: dto.name,
        status: (dto.status as CompanyStatus) ?? 'ACTIVE',
        is_deleted: false,
        created_at: now,
        created_by: user.uid,
        updated_at: now,
        updated_by: user.uid,
      };

      if (dto.legalName !== undefined) record.legal_name = dto.legalName || null;
      if (dto.industry !== undefined) record.industry = dto.industry || null;
      if (dto.website !== undefined) record.website = dto.website || null;
      if (dto.email !== undefined) record.email = dto.email || null;
      if (dto.phone !== undefined) record.phone = dto.phone || null;
      if (dto.address !== undefined) record.address = dto.address || null;
      if (dto.city !== undefined) record.city = dto.city || null;
      if (dto.country !== undefined) record.country = dto.country || null;
      if (dto.notes !== undefined) record.notes = dto.notes || null;

      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.COMPANIES)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('CompaniesService.create — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      this.logger.log(`Company created: ${dto.name} (${data?.id})`);

      return data as Company;
    } catch (err) {
      this.logger.error('CompaniesService.create — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async update(user: AuthenticatedUser, companyId: string, dto: UpdateCompanyDto): Promise<Company> {
    this.logger.log(`CompaniesService.update — begin (id=${companyId})`);

    try {
      await this.findById(user, companyId);
      const now = new Date().toISOString();

      const updates: Record<string, unknown> = { updated_at: now, updated_by: user.uid };

      if (dto.name !== undefined) updates.name = dto.name;
      if (dto.legalName !== undefined) updates.legal_name = dto.legalName || null;
      if (dto.industry !== undefined) updates.industry = dto.industry || null;
      if (dto.website !== undefined) updates.website = dto.website || null;
      if (dto.email !== undefined) updates.email = dto.email || null;
      if (dto.phone !== undefined) updates.phone = dto.phone || null;
      if (dto.address !== undefined) updates.address = dto.address || null;
      if (dto.city !== undefined) updates.city = dto.city || null;
      if (dto.country !== undefined) updates.country = dto.country || null;
      if (dto.status !== undefined) updates.status = dto.status;
      if (dto.notes !== undefined) updates.notes = dto.notes || null;

      const { error } = await this.supabase.client
        .from(COLLECTIONS.COMPANIES)
        .update(updates)
        .eq('id', companyId);

      if (error) {
        this.logger.error('CompaniesService.update — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      return this.findById(user, companyId);
    } catch (err) {
      this.logger.error('CompaniesService.update — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async softDelete(user: AuthenticatedUser, companyId: string): Promise<void> {
    this.logger.log(`CompaniesService.softDelete — begin (id=${companyId})`);

    try {
      await this.findById(user, companyId);
      const now = new Date().toISOString();

      const { error } = await this.supabase.client
        .from(COLLECTIONS.COMPANIES)
        .update({
          is_deleted: true,
          deleted_at: now,
          deleted_by: user.uid,
          updated_at: now,
        })
        .eq('id', companyId);

      if (error) {
        this.logger.error('CompaniesService.softDelete — Supabase returned error', safeErrorInfo(error));
        throw error;
      }
    } catch (err) {
      this.logger.error('CompaniesService.softDelete — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  private async getSummary(organizationId: string): Promise<CompanySummary> {
    const { count: activeCount } = await this.supabase.client
      .from(COLLECTIONS.COMPANIES)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'ACTIVE');

    const { count: inactiveCount } = await this.supabase.client
      .from(COLLECTIONS.COMPANIES)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'INACTIVE');

    const { count: archivedCount } = await this.supabase.client
      .from(COLLECTIONS.COMPANIES)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .eq('status', 'ARCHIVED');

    const active = activeCount ?? 0;
    const inactive = inactiveCount ?? 0;
    const archived = archivedCount ?? 0;

    return {
      total: active + inactive + archived,
      active,
      prospects: 0,
      inactive: inactive + archived,
    };
  }
}
