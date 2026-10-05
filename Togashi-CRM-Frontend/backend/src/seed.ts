import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config';
import { SEED_ORGANIZATION_NAME } from './common/constants';

async function seed(): Promise<void> {
  const logger = new Logger('Seed');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(AppConfigService);

  if (config.isProduction) {
    const forceArg = process.argv.includes('--force-production');
    if (!forceArg) {
      logger.error('Refusing to seed production database. Use --force-production to override.');
      await app.close();
      process.exit(1);
    }
    logger.warn('Seeding production database — forced override');
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    logger.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    await app.close();
    process.exit(1);
  }

  logger.log('=== SEED (Phase 1 — Supabase placeholder) ===');
  logger.log(`Organization: ${SEED_ORGANIZATION_NAME}`);
  logger.log(`Admin email: ${adminEmail}`);
  logger.log('Database tables not yet created — seeding deferred to Phase 2.');
  logger.log('=== Seed completed (placeholder) ===');

  await app.close();
}

void seed();
