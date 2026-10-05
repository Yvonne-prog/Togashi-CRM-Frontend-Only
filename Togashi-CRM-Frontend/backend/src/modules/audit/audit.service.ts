import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COLLECTIONS } from '../../common/constants';
import { AuditAction } from '../../common/enums';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

export interface AuditLog {
  id: string;
  organizationId: string;
  actorUserId: string;
  actorEmail: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly supabase: SupabaseService) {}

  async log(entry: {
    actor: AuthenticatedUser;
    action: AuditAction;
    resourceType: string;
    resourceId?: string;
    changes?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const filteredChanges = entry.changes
      ? this.sanitizeChanges(entry.changes)
      : undefined;

    const log: AuditLog = {
      id,
      organizationId: entry.actor.organizationId,
      actorUserId: entry.actor.uid,
      actorEmail: entry.actor.email,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      changes: filteredChanges,
      metadata: entry.metadata,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: now,
    };

    await this.supabase.client
      .from(COLLECTIONS.ACTIVITY_LOGS)
      .insert(log);
  }

  private sanitizeChanges(changes: Record<string, unknown>): Record<string, unknown> {
    const sensitive = ['password', 'token', 'secret', 'key', 'privateKey', 'private'];
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(changes)) {
      if (sensitive.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
