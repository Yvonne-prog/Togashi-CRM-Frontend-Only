import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../src/modules/health/health.controller';
import { SupabaseService } from '../src/supabase/supabase.service';
import { AppConfigService } from '../src/config/app.config';
import { ConfigService } from '@nestjs/config';

describe('HealthController', () => {
  let controller: HealthController;
  let supabaseService: jest.Mocked<Partial<SupabaseService>>;
  let appConfigService: jest.Mocked<Partial<AppConfigService>>;

  beforeEach(async () => {
    supabaseService = {
      healthCheck: jest.fn(),
    };

    appConfigService = {
      nodeEnv: 'test',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: SupabaseService, useValue: supabaseService },
        { provide: AppConfigService, useValue: appConfigService },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return healthy when supabase is up', async () => {
    (supabaseService.healthCheck as jest.Mock).mockResolvedValue(true);

    const result = await controller.check();

    expect(result.status).toBe('healthy');
    expect(result.services.supabase).toBe('connected');
    expect(result.environment).toBe('test');
    expect(result.apiVersion).toBe('1.0.0');
  });

  it('should return degraded when supabase is down', async () => {
    (supabaseService.healthCheck as jest.Mock).mockResolvedValue(false);

    const result = await controller.check();

    expect(result.status).toBe('degraded');
    expect(result.services.supabase).toBe('unavailable');
  });
});
