import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private _client: SupabaseClient | null = null;
  private _initError: string | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.getOrThrow<string>('supabase.url');
    const serviceRoleKey = this.config.getOrThrow<string>('supabase.serviceRoleKey');

    if (!url || !serviceRoleKey) {
      this._initError = 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check backend/.env.';
      this.logger.error(this._initError);
      return;
    }

    try {
      this._client = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      this.logger.log(`Supabase client initialized for ${new URL(url).hostname}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this._initError = `Failed to create Supabase client: ${message}`;
      this.logger.error(this._initError);
    }
  }

  get client(): SupabaseClient {
    if (!this._client) {
      throw new Error(
        this._initError
          ?? 'Supabase client not initialized — check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
      );
    }
    return this._client;
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this._client) return false;
      const { error } = await this._client.from('_health_check').select('*').limit(1).maybeSingle();
      return !error;
    } catch {
      return false;
    }
  }
}
