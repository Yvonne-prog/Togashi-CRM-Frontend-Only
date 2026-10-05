import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app-config.module';
import { appConfig, validateEnv } from './config/app.config';
import { SupabaseModule } from './supabase/supabase.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditModule } from './modules/audit/audit.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { LeadsModule } from './modules/leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate: validateEnv,
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
    }),
    AppConfigModule,
    SupabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    OrganizationsModule,
    ContactsModule,
    CompaniesModule,
    LeadsModule,
  ],
})
export class AppModule {}
