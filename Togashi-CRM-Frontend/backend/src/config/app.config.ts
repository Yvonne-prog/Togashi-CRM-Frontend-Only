import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, Min, validateSync } from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: string;

  @IsNumber()
  @Min(1)
  PORT: number;

  @IsString()
  API_PREFIX: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  FRONTEND_URL: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missing = errors.map((e) => e.property).join(', ');
    throw new Error(
      `Configuration validation failed. Missing or invalid variables: ${missing}. ` +
        'Check your .env file against .env.example.',
    );
  }

  return validated;
}

export function appConfig() {
  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: parseInt(process.env.PORT ?? '4000', 10),
    API_PREFIX: process.env.API_PREFIX ?? 'api',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  };
}

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.config.get<number>('PORT', 4000);
  }

  get apiPrefix(): string {
    return this.config.get<string>('API_PREFIX', 'api');
  }

  get frontendUrl(): string {
    return this.config.get<string>('FRONTEND_URL', 'http://localhost:5173');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isStaging(): boolean {
    return this.nodeEnv === 'staging';
  }
}
