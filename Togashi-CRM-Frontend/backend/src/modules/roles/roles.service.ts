import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COLLECTIONS, DEFAULT_ROLES } from '../../common/constants';

export interface Role {
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

const ROLE_DEFINITIONS: Record<string, { name: string; description: string }> = {
  ADMIN: { name: 'Administrator', description: 'Full system access. Can manage users, roles, and all modules.' },
  EXECUTIVE: { name: 'CEO / Executive', description: 'Company-wide visibility. Can view all modules and approve records.' },
  BUSINESS_DEVELOPMENT: { name: 'Business Development', description: 'Focused on prospects, client relationships and opportunities.' },
  SALES: { name: 'Sales', description: 'Focused on leads and deals. Creates quotations and manages pipeline.' },
  PROJECT_MANAGER: { name: 'Project Manager', description: 'Focused on project delivery, task management and team coordination.' },
  PROJECT_TEAM: { name: 'Project Team Member', description: 'Focused on assigned project work. Limited to own tasks and projects.' },
  FINANCE: { name: 'Finance', description: 'Focused on billing, payments and financial records.' },
  CUSTOMER_SERVICE: { name: 'Customer Service', description: 'Focused on communication and client support.' },
  VIEWER: { name: 'Viewer', description: 'Read-only access to assigned modules.' },
};

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async seedRoles(): Promise<Role[]> {
    const now = new Date().toISOString();
    const results: Role[] = [];

    for (const code of DEFAULT_ROLES) {
      const def = ROLE_DEFINITIONS[code];
      if (!def) continue;

      const { data: existing } = await this.supabase.client
        .from(COLLECTIONS.ROLES)
        .select('*')
        .eq('code', code)
        .maybeSingle();

      if (existing) {
        const changes: Record<string, unknown> = {};
        if (existing.name !== def.name) changes.name = def.name;
        if (existing.description !== def.description) changes.description = def.description;

        if (Object.keys(changes).length > 0) {
          await this.supabase.client
            .from(COLLECTIONS.ROLES)
            .update({ ...changes, updatedAt: now })
            .eq('code', code);
          this.logger.log(`Role updated: ${code}`);
        }

        results.push(existing as Role);
      } else {
        const role: Role = {
          code,
          name: def.name,
          description: def.description,
          isSystemRole: true,
          createdAt: now,
          updatedAt: now,
        };

        await this.supabase.client
          .from(COLLECTIONS.ROLES)
          .insert(role)
          .eq('code', code);

        this.logger.log(`Role created: ${code}`);
        results.push(role);
      }
    }

    return results;
  }

  async findByCode(code: string): Promise<Role | null> {
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.ROLES)
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error || !data) return null;
    return data as Role;
  }

  async findAll(): Promise<Role[]> {
    const { data, error } = await this.supabase.client
      .from(COLLECTIONS.ROLES)
      .select('*');

    if (error) return [];
    return data as Role[];
  }
}
