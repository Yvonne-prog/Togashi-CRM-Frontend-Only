import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SupabaseService } from '../../supabase/supabase.service';
import { AppConfigService } from '../../config/app.config';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly appConfig: AppConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    const supabaseOk = await this.supabase.healthCheck();

    return {
      status: supabaseOk ? 'healthy' : 'degraded',
      services: {
        supabase: supabaseOk ? 'connected' : 'unavailable',
      },
      timestamp: new Date().toISOString(),
      environment: this.appConfig.nodeEnv,
      apiVersion: '1.0.0',
    };
  }
}
