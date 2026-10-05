import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import {
  Lead,
  LeadRow,
  LeadStatus,
  LeadTemperature,
  LeadStats,
  LeadListResponse,
  LeadConvertResult,
} from './interfaces/lead.interface';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { NotFoundException } from '../../common/exceptions';
import { COLLECTIONS } from '../../common/constants';

const MAX_PAGE = 100;

const SORT_COLUMN_MAP: Record<string, string> = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  name: 'name',
  email: 'email',
  status: 'status',
  score: 'score',
  company: 'company',
};

const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const LEAD_TEMPERATURES: LeadTemperature[] = ['Hot', 'Warm', 'Cold'];

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

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    source: row.source ?? undefined,
    interest: row.interest ?? undefined,
    estimatedBudget: row.estimated_budget ?? undefined,
    currency: row.currency ?? undefined,
    status: row.status as LeadStatus,
    score: row.score ?? undefined,
    temperature: (row.temperature as LeadTemperature) ?? undefined,
    ownerId: row.owner_id ?? undefined,
    ownerName: row.owner_name ?? undefined,
    expectedDecisionDate: row.expected_decision_date ?? undefined,
    notes: row.notes ?? undefined,
    lastInteractionAt: row.last_interaction_at ?? undefined,
    nextAction: row.next_action ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(user: AuthenticatedUser, query: ListLeadsQueryDto): Promise<LeadListResponse> {
    const orgId = user.organizationId;
    const limit = Math.min(query.limit ?? 25, MAX_PAGE);
    const page = query.page ?? 1;
    const sortBy = SORT_COLUMN_MAP[query.sortBy ?? 'createdAt'] ?? 'created_at';
    const dir = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const offset = (page - 1) * limit;

    this.logger.log(`LeadsService.list — begin (orgId=${orgId}, sortBy=${sortBy}, dir=${dir}, page=${page}, limit=${limit})`);

    try {
      let q = this.supabase.client
        .from(COLLECTIONS.LEADS)
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .eq('is_deleted', false)
        .order(sortBy, { ascending: dir === 'asc' })
        .range(offset, offset + limit - 1);

      if (query.status) {
        q = q.eq('status', query.status);
      }

      if (query.temperature) {
        q = q.eq('temperature', query.temperature);
      }

      if (query.assignedTo) {
        q = q.eq('owner_id', query.assignedTo);
      }

      if (query.search) {
        const term = `%${query.search}%`;
        q = q.or(`name.ilike.${term},email.ilike.${term},company.ilike.${term},source.ilike.${term}`);
      }

      const { data, error, count } = await q;

      if (error) {
        this.logger.error('LeadsService.list — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      const items = ((data ?? []) as LeadRow[]).map(toLead);

      this.logger.log(`LeadsService.list — success (total=${count}, returned=${items.length})`);

      return {
        data: items,
        total: count ?? 0,
        page,
        limit,
      };
    } catch (err) {
      this.logger.error('LeadsService.list — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async findById(user: AuthenticatedUser, leadId: string): Promise<Lead> {
    this.logger.log(`LeadsService.findById — begin (id=${leadId})`);

    try {
      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.LEADS)
        .select('*')
        .eq('id', leadId)
        .eq('organization_id', user.organizationId)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error) {
        this.logger.error('LeadsService.findById — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      if (!data) {
        throw new NotFoundException('Lead');
      }

      return toLead(data as LeadRow);
    } catch (err) {
      this.logger.error('LeadsService.findById — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async create(user: AuthenticatedUser, dto: CreateLeadDto): Promise<Lead> {
    this.logger.log(`LeadsService.create — begin (name="${dto.name}")`);

    try {
      const now = new Date().toISOString();
      const status = dto.status ?? 'New';

      const record: Record<string, unknown> = {
        organization_id: user.organizationId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        company: dto.company ?? null,
        source: dto.source ?? null,
        interest: dto.interest ?? null,
        estimated_budget: dto.estimatedBudget ?? null,
        currency: dto.currency ?? null,
        status,
        score: 0,
        temperature: dto.temperature ?? null,
        owner_id: dto.ownerId ?? user.uid,
        owner_name: user.displayName,
        expected_decision_date: dto.expectedDecisionDate ?? null,
        notes: dto.notes ?? null,
        last_interaction_at: null,
        next_action: dto.nextAction ?? null,
        created_at: now,
        created_by: user.uid,
        updated_at: now,
        updated_by: user.uid,
        is_deleted: false,
      };

      const { data, error } = await this.supabase.client
        .from(COLLECTIONS.LEADS)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('LeadsService.create — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      this.logger.log(`Lead created: ${dto.name} (${data?.id})`);

      return toLead(data as LeadRow);
    } catch (err) {
      this.logger.error('LeadsService.create — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async update(user: AuthenticatedUser, leadId: string, dto: UpdateLeadDto): Promise<Lead> {
    this.logger.log(`LeadsService.update — begin (id=${leadId})`);

    try {
      await this.findById(user, leadId);
      const now = new Date().toISOString();

      const updates: Record<string, unknown> = { updated_at: now, updated_by: user.uid };

      if (dto.name !== undefined) updates.name = dto.name;
      if (dto.email !== undefined) updates.email = dto.email;
      if (dto.phone !== undefined) updates.phone = dto.phone || null;
      if (dto.company !== undefined) updates.company = dto.company || null;
      if (dto.source !== undefined) updates.source = dto.source || null;
      if (dto.interest !== undefined) updates.interest = dto.interest || null;
      if (dto.estimatedBudget !== undefined) updates.estimated_budget = dto.estimatedBudget;
      if (dto.currency !== undefined) updates.currency = dto.currency || null;
      if (dto.status !== undefined) updates.status = dto.status;
      if (dto.temperature !== undefined) updates.temperature = dto.temperature || null;
      if (dto.ownerId !== undefined) updates.owner_id = dto.ownerId || null;
      if (dto.expectedDecisionDate !== undefined) updates.expected_decision_date = dto.expectedDecisionDate || null;
      if (dto.notes !== undefined) updates.notes = dto.notes || null;
      if (dto.nextAction !== undefined) updates.next_action = dto.nextAction || null;

      const { error } = await this.supabase.client
        .from(COLLECTIONS.LEADS)
        .update(updates)
        .eq('id', leadId)
        .eq('organization_id', user.organizationId);

      if (error) {
        this.logger.error('LeadsService.update — Supabase returned error', safeErrorInfo(error));
        throw error;
      }

      return this.findById(user, leadId);
    } catch (err) {
      this.logger.error('LeadsService.update — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async softDelete(user: AuthenticatedUser, leadId: string): Promise<void> {
    this.logger.log(`LeadsService.softDelete — begin (id=${leadId})`);

    try {
      await this.findById(user, leadId);
      const now = new Date().toISOString();

      const { error } = await this.supabase.client
        .from(COLLECTIONS.LEADS)
        .update({
          is_deleted: true,
          deleted_at: now,
          deleted_by: user.uid,
          updated_at: now,
        })
        .eq('id', leadId)
        .eq('organization_id', user.organizationId);

      if (error) {
        this.logger.error('LeadsService.softDelete — Supabase returned error', safeErrorInfo(error));
        throw error;
      }
    } catch (err) {
      this.logger.error('LeadsService.softDelete — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async convert(user: AuthenticatedUser, leadId: string, _dto: ConvertLeadDto): Promise<LeadConvertResult> {
    this.logger.log(`LeadsService.convert — begin (id=${leadId})`);

    try {
      await this.findById(user, leadId);

      this.logger.warn(
        'LeadsService.convert — full conversion (creating Contact/Company/Deal) is not available: ' +
        'a Deals backend module does not exist and creating cross-module records is outside the Leads module scope.',
      );

      return {} as LeadConvertResult;
    } catch (err) {
      this.logger.error('LeadsService.convert — caught exception', safeErrorInfo(err));
      throw err;
    }
  }

  async getStats(user: AuthenticatedUser): Promise<LeadStats> {
    const orgId = user.organizationId;
    this.logger.log(`LeadsService.getStats — begin (orgId=${orgId})`);

    try {
      const base = () =>
        this.supabase.client
          .from(COLLECTIONS.LEADS)
          .select('status, temperature, source', { count: 'exact' })
          .eq('organization_id', orgId)
          .eq('is_deleted', false);

      const { count: total, error: totalError } = await base();

      if (totalError) {
        this.logger.error('LeadsService.getStats — Supabase returned error', safeErrorInfo(totalError));
        throw totalError;
      }

      const byStatus: LeadStats['byStatus'] = [];
      for (const status of LEAD_STATUSES) {
        const { count } = await this.supabase.client
          .from(COLLECTIONS.LEADS)
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .eq('is_deleted', false)
          .eq('status', status);
        byStatus.push({ status, count: count ?? 0 });
      }

      const byTemperature: LeadStats['byTemperature'] = [];
      for (const temperature of LEAD_TEMPERATURES) {
        const { count } = await this.supabase.client
          .from(COLLECTIONS.LEADS)
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .eq('is_deleted', false)
          .eq('temperature', temperature);
        byTemperature.push({ temperature, count: count ?? 0 });
      }

      const bySource: LeadStats['bySource'] = [];
      const { data: sources } = await this.supabase.client
        .from(COLLECTIONS.LEADS)
        .select('source')
        .eq('organization_id', orgId)
        .eq('is_deleted', false);

      const sourceCounts = new Map<string, number>();
      for (const row of sources ?? []) {
        const source = (row as { source: string | null }).source ?? 'Other';
        sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
      }
      for (const [source, count] of sourceCounts.entries()) {
        bySource.push({ source, count });
      }

      return {
        total: total ?? 0,
        byStatus,
        byTemperature,
        bySource,
      };
    } catch (err) {
      this.logger.error('LeadsService.getStats — caught exception', safeErrorInfo(err));
      throw err;
    }
  }
}