-- ============================================================================
-- TOGASHI CRM — Enterprise Database Schema
-- Supabase / PostgreSQL 15+
-- Phase 2 Migration
-- ============================================================================
-- Execute this entire file in the Supabase SQL Editor as a single transaction.
-- All tables include: UUID PKs, created_at / updated_at, proper FKs & indexes.
-- ============================================================================

begin;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- HELPER: auto-updating updated_at trigger
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 01  ORGANIZATIONS — top-level multi-tenant entity
-- ============================================================================
create table organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  legal_name    text,
  email         text,
  phone         text,
  logo_url      text,
  status        text not null default 'ACTIVE'
                  check (status in ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  timezone      text not null default 'Africa/Kampala',
  currency      text not null default 'UGX',
  country       text not null default 'UG',

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_organizations_updated_at
  before update on organizations
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 02  USERS — linked to Supabase Auth (auth.users.id)
-- ============================================================================
create table users (
  uid               uuid primary key references auth.users(id) on delete cascade,
  organization_id   uuid not null references organizations(id),

  first_name        text not null,
  last_name         text not null,
  display_name      text generated always as (first_name || ' ' || last_name) stored,
  email             text not null,
  email_normalized  text not null,
  phone             text,
  avatar_url        text,
  status            text not null default 'ACTIVE'
                      check (status in ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  job_title         text,
  department_id     uuid,
  last_login_at     timestamptz,

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create unique index idx_users_email_normalized on users (organization_id, email_normalized) where is_deleted = false;
create index idx_users_organization_id  on users (organization_id);
create index idx_users_status           on users (status) where is_deleted = false;
create index idx_users_department_id    on users (department_id);

create trigger trg_users_updated_at
  before update on users
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 03  ROLES — system-defined roles
-- ============================================================================
create table roles (
  code            text primary key,
  name            text not null,
  description     text,
  is_system_role  boolean not null default true,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_roles_updated_at
  before update on roles
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 04  PERMISSIONS — granular permission codes
-- ============================================================================
create table permissions (
  code         text primary key,
  name         text not null,
  description  text,
  module       text not null,

  created_at   timestamptz not null default now()
);

create index idx_permissions_module on permissions (module);

-- ============================================================================
-- 05  ROLE_PERMISSIONS — M:N role ↔ permission
-- ============================================================================
create table role_permissions (
  role_code        text not null references roles(code) on delete cascade,
  permission_code  text not null references permissions(code) on delete cascade,

  created_at       timestamptz not null default now(),

  primary key (role_code, permission_code)
);

-- ============================================================================
-- 06  USER_ROLES — M:N user ↔ role
-- ============================================================================
create table user_roles (
  user_id     uuid not null references users(uid) on delete cascade,
  role_code   text not null references roles(code) on delete cascade,

  created_at  timestamptz not null default now(),

  primary key (user_id, role_code)
);

-- ============================================================================
-- 07  DEPARTMENTS
-- ============================================================================
create table departments (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  name              text not null,
  description       text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_departments_organization_id on departments (organization_id);

create trigger trg_departments_updated_at
  before update on departments
  for each row execute function update_updated_at_column();

alter table users
  add constraint fk_users_department
  foreign key (department_id) references departments(id)
  on delete set null;

-- ============================================================================
-- 08  COMPANIES — B2B accounts / organizations you sell to
-- ============================================================================
create table companies (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  name              text not null,
  legal_name        text,
  email             text,
  phone             text,
  website           text,
  address           text,
  city              text,
  country           text,
  status            text not null default 'ACTIVE'
                      check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
  industry          text,
  notes             text,

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create index idx_companies_organization_id on companies (organization_id);
create index idx_companies_status          on companies (status) where is_deleted = false;

create trigger trg_companies_updated_at
  before update on companies
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 09  CONTACTS — people at companies
-- ============================================================================
create table contacts (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null references organizations(id),

  company_id            uuid references companies(id) on delete set null,
  company_name          text,
  first_name            text not null,
  last_name             text not null,
  full_name             text generated always as (
                          coalesce(first_name, '') || ' ' || coalesce(last_name, '')
                        ) stored,
  full_name_normalized  text generated always as (
                          lower(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
                        ) stored,
  email                 text,
  email_normalized      text,
  phone                 text,
  job_title             text,
  status                text not null default 'ACTIVE'
                          check (status in ('ACTIVE', 'PROSPECT', 'INACTIVE')),
  owner_id              uuid references users(uid),
  owner_name            text,
  notes                 text,
  last_contacted_at     timestamptz,

  is_deleted            boolean not null default false,
  deleted_at            timestamptz,
  deleted_by            uuid references users(uid),

  created_at            timestamptz not null default now(),
  created_by            uuid references users(uid),
  updated_at            timestamptz not null default now(),
  updated_by            uuid references users(uid)
);

create index idx_contacts_organization_id  on contacts (organization_id);
create index idx_contacts_company_id       on contacts (company_id);
create index idx_contacts_status           on contacts (status) where is_deleted = false;
create index idx_contacts_owner_id         on contacts (owner_id);
create index idx_contacts_full_name_search on contacts using btree (full_name_normalized) where is_deleted = false;

create trigger trg_contacts_updated_at
  before update on contacts
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 10  LEADS — unqualified sales opportunities
-- ============================================================================
create table leads (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),

  contact_id          uuid references contacts(id) on delete set null,
  company_id          uuid references companies(id) on delete set null,
  title               text not null,
  description         text,
  source              text,
  stage               text not null default 'NEW'
                        check (stage in ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST')),
  priority            text not null default 'MEDIUM'
                        check (priority in ('LOW', 'MEDIUM', 'HIGH')),
  value               numeric(15,2) default 0,
  currency            text default 'UGX',
  owner_id            uuid references users(uid),
  owner_name          text,
  expected_close_date date,
  notes               text,

  converted_to_deal_id uuid,
  converted_at        timestamptz,

  is_deleted          boolean not null default false,
  deleted_at          timestamptz,
  deleted_by          uuid references users(uid),

  created_at          timestamptz not null default now(),
  created_by          uuid references users(uid),
  updated_at          timestamptz not null default now(),
  updated_by          uuid references users(uid)
);

create index idx_leads_organization_id on leads (organization_id);
create index idx_leads_contact_id      on leads (contact_id);
create index idx_leads_company_id      on leads (company_id);
create index idx_leads_owner_id        on leads (owner_id);
create index idx_leads_stage           on leads (stage) where is_deleted = false;

create trigger trg_leads_updated_at
  before update on leads
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 11  DEALS — qualified sales opportunities
-- ============================================================================
create table deals (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),

  lead_id             uuid references leads(id) on delete set null,
  contact_id          uuid not null references contacts(id),
  company_id          uuid not null references companies(id),
  title               text not null,
  description         text,
  stage               text not null default 'PROSPECTING'
                        check (stage in ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST')),
  priority            text not null default 'MEDIUM'
                        check (priority in ('LOW', 'MEDIUM', 'HIGH')),
  value               numeric(15,2) default 0,
  currency            text default 'UGX',
  probability         integer default 0 check (probability >= 0 and probability <= 100),
  owner_id            uuid references users(uid),
  owner_name          text,
  expected_close_date date,
  actual_close_date   date,
  notes               text,

  is_deleted          boolean not null default false,
  deleted_at          timestamptz,
  deleted_by          uuid references users(uid),

  created_at          timestamptz not null default now(),
  created_by          uuid references users(uid),
  updated_at          timestamptz not null default now(),
  updated_by          uuid references users(uid)
);

create index idx_deals_organization_id on deals (organization_id);
create index idx_deals_lead_id         on deals (lead_id);
create index idx_deals_contact_id      on deals (contact_id);
create index idx_deals_company_id      on deals (company_id);
create index idx_deals_owner_id        on deals (owner_id);
create index idx_deals_stage           on deals (stage) where is_deleted = false;

create trigger trg_deals_updated_at
  before update on deals
  for each row execute function update_updated_at_column();

-- link back leads.converted_to_deal_id
alter table leads
  add constraint fk_leads_converted_deal
  foreign key (converted_to_deal_id) references deals(id)
  on delete set null;

-- ============================================================================
-- 12  QUOTATIONS
-- ============================================================================
create table quotations (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  deal_id           uuid references deals(id) on delete set null,
  contact_id        uuid not null references contacts(id),
  company_id        uuid not null references companies(id),
  quotation_number  text not null,
  title             text,
  status            text not null default 'DRAFT'
                      check (status in ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
  subtotal          numeric(15,2) default 0,
  tax_rate          numeric(5,2) default 0,
  tax_amount        numeric(15,2) default 0,
  discount_amount   numeric(15,2) default 0,
  total             numeric(15,2) default 0,
  currency          text default 'UGX',
  notes             text,
  terms             text,
  valid_until       date,
  owner_id          uuid references users(uid),
  owner_name        text,

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create unique index idx_quotations_number on quotations (organization_id, quotation_number) where is_deleted = false;
create index idx_quotations_organization_id on quotations (organization_id);
create index idx_quotations_deal_id         on quotations (deal_id);
create index idx_quotations_contact_id      on quotations (contact_id);
create index idx_quotations_company_id      on quotations (company_id);
create index idx_quotations_owner_id        on quotations (owner_id);
create index idx_quotations_status          on quotations (status) where is_deleted = false;

create trigger trg_quotations_updated_at
  before update on quotations
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 13  QUOTATION_ITEMS — line items
-- ============================================================================
create table quotation_items (
  id            uuid primary key default gen_random_uuid(),
  quotation_id  uuid not null references quotations(id) on delete cascade,

  description   text not null,
  quantity      numeric(10,2) not null default 1,
  unit_price    numeric(15,2) not null default 0,
  total         numeric(15,2) generated always as (quantity * unit_price) stored,
  sort_order    integer not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_quotation_items_quotation_id on quotation_items (quotation_id);

create trigger trg_quotation_items_updated_at
  before update on quotation_items
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 14  INVOICES
-- ============================================================================
create table invoices (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  quotation_id      uuid references quotations(id) on delete set null,
  deal_id           uuid references deals(id) on delete set null,
  contact_id        uuid not null references contacts(id),
  company_id        uuid not null references companies(id),
  invoice_number    text not null,
  title             text,
  status            text not null default 'DRAFT'
                      check (status in ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED')),
  subtotal          numeric(15,2) default 0,
  tax_rate          numeric(5,2) default 0,
  tax_amount        numeric(15,2) default 0,
  discount_amount   numeric(15,2) default 0,
  total             numeric(15,2) default 0,
  amount_paid       numeric(15,2) default 0,
  balance_due       numeric(15,2) default 0,
  currency          text default 'UGX',
  notes             text,
  terms             text,
  due_date          date,
  paid_at           timestamptz,
  owner_id          uuid references users(uid),
  owner_name        text,

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create unique index idx_invoices_number on invoices (organization_id, invoice_number) where is_deleted = false;
create index idx_invoices_organization_id on invoices (organization_id);
create index idx_invoices_quotation_id    on invoices (quotation_id);
create index idx_invoices_deal_id         on invoices (deal_id);
create index idx_invoices_contact_id      on invoices (contact_id);
create index idx_invoices_company_id      on invoices (company_id);
create index idx_invoices_owner_id        on invoices (owner_id);
create index idx_invoices_status          on invoices (status) where is_deleted = false;
create index idx_invoices_due_date        on invoices (due_date) where status in ('SENT', 'PARTIALLY_PAID', 'OVERDUE');

create trigger trg_invoices_updated_at
  before update on invoices
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 15  INVOICE_ITEMS — line items
-- ============================================================================
create table invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references invoices(id) on delete cascade,

  description text not null,
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(15,2) not null default 0,
  total       numeric(15,2) generated always as (quantity * unit_price) stored,
  sort_order  integer not null default 0,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_invoice_items_invoice_id on invoice_items (invoice_id);

create trigger trg_invoice_items_updated_at
  before update on invoice_items
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 16  RECEIPTS — payment receipts
-- ============================================================================
create table receipts (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  invoice_id        uuid not null references invoices(id),
  receipt_number    text not null,
  amount            numeric(15,2) not null check (amount > 0),
  payment_method    text not null
                      check (payment_method in ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE', 'CREDIT_CARD', 'OTHER')),
  payment_reference text,
  notes             text,
  status            text not null default 'ACTIVE'
                      check (status in ('ACTIVE', 'VOIDED')),
  receipt_date      date not null default current_date,
  voided_reason     text,
  voided_at         timestamptz,
  voided_by         uuid references users(uid),

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create unique index idx_receipts_number on receipts (organization_id, receipt_number) where is_deleted = false;
create index idx_receipts_organization_id on receipts (organization_id);
create index idx_receipts_invoice_id      on receipts (invoice_id);

create trigger trg_receipts_updated_at
  before update on receipts
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 17  PROJECTS
-- ============================================================================
create table projects (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  deal_id           uuid references deals(id) on delete set null,
  quotation_id      uuid references quotations(id) on delete set null,
  name              text not null,
  description       text,
  status            text not null default 'PLANNING'
                      check (status in ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
  priority          text not null default 'MEDIUM'
                      check (priority in ('LOW', 'MEDIUM', 'HIGH')),
  start_date        date,
  end_date          date,
  actual_end_date   date,
  owner_id          uuid references users(uid),
  owner_name        text,
  budget            numeric(15,2) default 0,
  currency          text default 'UGX',

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create index idx_projects_organization_id on projects (organization_id);
create index idx_projects_deal_id         on projects (deal_id);
create index idx_projects_owner_id        on projects (owner_id);
create index idx_projects_status          on projects (status) where is_deleted = false;

create trigger trg_projects_updated_at
  before update on projects
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 18  PROJECT_MEMBERS — M:N project ↔ user
-- ============================================================================
create table project_members (
  project_id  uuid not null references projects(id) on delete cascade,
  user_id     uuid not null references users(uid) on delete cascade,
  role        text not null default 'MEMBER'
                check (role in ('MANAGER', 'MEMBER', 'OBSERVER')),

  created_at  timestamptz not null default now(),

  primary key (project_id, user_id)
);

-- ============================================================================
-- 19  TASKS
-- ============================================================================
create table tasks (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  project_id        uuid references projects(id) on delete set null,
  title             text not null,
  description       text,
  status            text not null default 'TODO'
                      check (status in ('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED')),
  priority          text not null default 'MEDIUM'
                      check (priority in ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  assignee_id       uuid references users(uid),
  assignee_name     text,
  due_date          date,
  completed_at      timestamptz,
  completed_by      uuid references users(uid),
  estimated_hours   numeric(8,2),
  actual_hours      numeric(8,2),

  is_deleted        boolean not null default false,
  deleted_at        timestamptz,
  deleted_by        uuid references users(uid),

  created_at        timestamptz not null default now(),
  created_by        uuid references users(uid),
  updated_at        timestamptz not null default now(),
  updated_by        uuid references users(uid)
);

create index idx_tasks_organization_id on tasks (organization_id);
create index idx_tasks_project_id      on tasks (project_id);
create index idx_tasks_assignee_id     on tasks (assignee_id);
create index idx_tasks_status          on tasks (status) where is_deleted = false;
create index idx_tasks_due_date        on tasks (due_date) where status in ('TODO', 'IN_PROGRESS', 'REVIEW');

create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 20  TASK_COMMENTS
-- ============================================================================
create table task_comments (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references tasks(id) on delete cascade,

  author_id   uuid not null references users(uid),
  author_name text,
  content     text not null,
  is_internal boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_task_comments_task_id on task_comments (task_id);

create trigger trg_task_comments_updated_at
  before update on task_comments
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 21  CALENDAR_EVENTS
-- ============================================================================
create table calendar_events (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),

  title               text not null,
  description         text,
  event_type          text not null default 'MEETING'
                        check (event_type in ('MEETING', 'CALL', 'TASK', 'REMINDER', 'OTHER')),
  start_at            timestamptz not null,
  end_at              timestamptz not null,
  is_all_day          boolean not null default false,
  location            text,
  status              text not null default 'SCHEDULED'
                        check (status in ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  owner_id            uuid references users(uid),

  related_entity_type text,
  related_entity_id   uuid,

  is_deleted          boolean not null default false,

  created_at          timestamptz not null default now(),
  created_by          uuid references users(uid),
  updated_at          timestamptz not null default now(),
  updated_by          uuid references users(uid),

  constraint chk_calendar_events_times check (end_at > start_at)
);

create index idx_calendar_events_organization_id on calendar_events (organization_id);
create index idx_calendar_events_owner_id        on calendar_events (owner_id);
create index idx_calendar_events_start_at        on calendar_events (start_at) where is_deleted = false;
create index idx_calendar_events_entity          on calendar_events (related_entity_type, related_entity_id);

create trigger trg_calendar_events_updated_at
  before update on calendar_events
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 22  NOTIFICATIONS
-- ============================================================================
create table notifications (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),

  user_id             uuid not null references users(uid) on delete cascade,
  title               text not null,
  message             text,
  type                text not null default 'INFO'
                        check (type in ('INFO', 'WARNING', 'SUCCESS', 'ERROR')),
  is_read             boolean not null default false,
  read_at             timestamptz,
  action_url          text,

  related_entity_type text,
  related_entity_id   uuid,

  created_at          timestamptz not null default now()
);

create index idx_notifications_user_id         on notifications (user_id, is_read, created_at desc);
create index idx_notifications_organization_id on notifications (organization_id);

-- ============================================================================
-- 23  DOCUMENTS
-- ============================================================================
create table documents (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),

  name                text not null,
  description         text,
  file_url            text not null,
  file_size_bytes     bigint,
  mime_type           text,
  storage_path        text,
  folder              text,
  status              text not null default 'ACTIVE'
                        check (status in ('ACTIVE', 'ARCHIVED')),
  owner_id            uuid references users(uid),
  owner_name          text,

  related_entity_type text,
  related_entity_id   uuid,

  is_deleted          boolean not null default false,
  deleted_at          timestamptz,
  deleted_by          uuid references users(uid),

  created_at          timestamptz not null default now(),
  created_by          uuid references users(uid),
  updated_at          timestamptz not null default now(),
  updated_by          uuid references users(uid)
);

create index idx_documents_organization_id on documents (organization_id);
create index idx_documents_owner_id        on documents (owner_id);
create index idx_documents_entity          on documents (related_entity_type, related_entity_id);

create trigger trg_documents_updated_at
  before update on documents
  for each row execute function update_updated_at_column();

-- ============================================================================
-- 24  ACTIVITY_LOGS — audit trail
-- ============================================================================
create table activity_logs (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),

  actor_user_id     uuid not null references users(uid),
  actor_email       text,
  action            text not null
                      check (action in ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT')),
  resource_type     text not null,
  resource_id       uuid,
  changes           jsonb,
  metadata          jsonb,
  ip_address        text,
  user_agent        text,

  created_at        timestamptz not null default now()
);

create index idx_activity_logs_organization_id on activity_logs (organization_id);
create index idx_activity_logs_actor           on activity_logs (actor_user_id);
create index idx_activity_logs_resource        on activity_logs (resource_type, resource_id);
create index idx_activity_logs_created_at      on activity_logs (created_at desc);

-- ============================================================================
-- SEED DATA: roles and permissions
-- ============================================================================

-- Roles
insert into roles (code, name, description, is_system_role) values
  ('ADMIN',               'Administrator',        'Full system access. Can manage users, roles, and all modules.', true),
  ('EXECUTIVE',           'CEO / Executive',      'Company-wide visibility. Can view all modules and approve records.', true),
  ('BUSINESS_DEVELOPMENT','Business Development', 'Focused on prospects, client relationships and opportunities.', true),
  ('SALES',               'Sales',                'Focused on leads and deals. Creates quotations and manages pipeline.', true),
  ('PROJECT_MANAGER',     'Project Manager',      'Focused on project delivery, task management and team coordination.', true),
  ('PROJECT_TEAM',        'Project Team Member',  'Focused on assigned project work. Limited to own tasks and projects.', true),
  ('FINANCE',             'Finance',              'Focused on billing, payments and financial records.', true),
  ('CUSTOMER_SERVICE',    'Customer Service',     'Focused on communication and client support.', true),
  ('VIEWER',              'Viewer',               'Read-only access to assigned modules.', true);

-- Permissions — seeded from the frontend PERMISSIONS constant
insert into permissions (code, name, module) values
  ('dashboard.view', 'View Dashboard', 'dashboard'),

  ('contacts.view',    'View Contacts',    'contacts'),
  ('contacts.create',  'Add Contacts',     'contacts'),
  ('contacts.edit',    'Edit Contacts',    'contacts'),
  ('contacts.archive', 'Archive Contacts', 'contacts'),
  ('contacts.delete',  'Delete Contacts',  'contacts'),
  ('contacts.export',  'Export Contacts',  'contacts'),

  ('companies.view',    'View Companies',    'companies'),
  ('companies.create',  'Add Companies',     'companies'),
  ('companies.edit',    'Edit Companies',    'companies'),
  ('companies.archive', 'Archive Companies', 'companies'),
  ('companies.delete',  'Delete Companies',  'companies'),
  ('companies.export',  'Export Companies',  'companies'),

  ('leads.view',         'View Leads',         'leads'),
  ('leads.create',       'Add Leads',          'leads'),
  ('leads.edit',         'Edit Leads',         'leads'),
  ('leads.change_stage', 'Change Lead Stage',  'leads'),
  ('leads.delete',       'Delete Leads',       'leads'),
  ('leads.export',       'Export Leads',       'leads'),

  ('deals.view',         'View Deals',          'deals'),
  ('deals.create',       'Add Deals',           'deals'),
  ('deals.edit',         'Edit Deals',          'deals'),
  ('deals.change_stage', 'Change Deal Stage',   'deals'),
  ('deals.mark_won',     'Mark Deal as Won',    'deals'),
  ('deals.mark_lost',    'Mark Deal as Lost',   'deals'),
  ('deals.delete',       'Delete Deals',        'deals'),
  ('deals.export',       'Export Deals',        'deals'),

  ('quotations.view',           'View Quotations',               'quotations'),
  ('quotations.create',         'Create Quotations',             'quotations'),
  ('quotations.edit',           'Edit Quotations',               'quotations'),
  ('quotations.change_status',  'Change Quotation Status',       'quotations'),
  ('quotations.preview',        'Preview Quotations',            'quotations'),
  ('quotations.download',       'Download Quotations',           'quotations'),
  ('quotations.delete',         'Delete Quotations',             'quotations'),
  ('quotations.create_project', 'Create Project from Quotation', 'quotations'),
  ('quotations.create_invoice', 'Create Invoice from Quotation', 'quotations'),

  ('invoices.view',                'View Invoices',               'invoices'),
  ('invoices.create',              'Create Invoices',             'invoices'),
  ('invoices.edit',                'Edit Invoices',               'invoices'),
  ('invoices.record_payment',      'Record Payments',             'invoices'),
  ('invoices.cancel',              'Cancel Invoices',             'invoices'),
  ('invoices.preview',             'Preview Invoices',            'invoices'),
  ('invoices.download',            'Download Invoices',           'invoices'),
  ('invoices.send_reminder',       'Send Payment Reminders',      'invoices'),
  ('invoices.view_payment_history','View Payment History',        'invoices'),
  ('invoices.export',              'Export Invoices',             'invoices'),

  ('receipts.view',     'View Receipts',     'receipts'),
  ('receipts.create',   'Create Receipts',   'receipts'),
  ('receipts.preview',  'Preview Receipts',  'receipts'),
  ('receipts.download', 'Download Receipts', 'receipts'),
  ('receipts.void',     'Void Receipts',     'receipts'),
  ('receipts.export',   'Export Receipts',   'receipts'),

  ('projects.view',          'View Projects',          'projects'),
  ('projects.create',        'Create Projects',        'projects'),
  ('projects.edit',          'Edit Projects',          'projects'),
  ('projects.change_status', 'Change Project Status',  'projects'),
  ('projects.delete',        'Delete Projects',        'projects'),

  ('tasks.view',     'View Tasks',      'tasks'),
  ('tasks.create',   'Create Tasks',    'tasks'),
  ('tasks.edit',     'Edit Tasks',      'tasks'),
  ('tasks.complete', 'Complete Tasks',  'tasks'),
  ('tasks.delete',   'Delete Tasks',    'tasks'),

  ('calendar.view',   'View Calendar',   'calendar'),
  ('calendar.create', 'Create Events',   'calendar'),
  ('calendar.edit',   'Edit Events',     'calendar'),
  ('calendar.delete', 'Delete Events',   'calendar'),

  ('documents.view',     'View Documents',      'documents'),
  ('documents.upload',   'Upload Documents',    'documents'),
  ('documents.preview',  'Preview Documents',   'documents'),
  ('documents.download', 'Download Documents',  'documents'),
  ('documents.edit',     'Edit Documents',      'documents'),
  ('documents.delete',   'Delete Documents',    'documents'),

  ('communications.view',          'View Communications',          'communications'),
  ('communications.send',          'Send Messages',                'communications'),
  ('communications.internal_note', 'Add Internal Notes',           'communications'),
  ('communications.archive',       'Archive Conversations',        'communications'),

  ('reports.view',      'View Reports',           'reports'),
  ('reports.financial', 'View Financial Reports', 'reports'),
  ('reports.export',    'Export Reports',         'reports'),

  ('users.view',          'View Users',            'users'),
  ('users.create',        'Add Users',             'users'),
  ('users.edit',          'Edit Users',            'users'),
  ('users.change_access', 'Change User Access',    'users'),
  ('users.disable',       'Disable Users',         'users'),
  ('users.remove_access', 'Remove User Access',    'users'),

  ('settings.view', 'View Settings', 'settings'),
  ('settings.edit', 'Edit Settings', 'settings'),

  ('financial.view_invoice_amounts',       'View Invoice Amounts',        'financial'),
  ('financial.view_receipt_amounts',       'View Receipt Amounts',        'financial'),
  ('financial.view_revenue',               'View Revenue',                'financial'),
  ('financial.view_outstanding_balances', 'View Outstanding Balances',   'financial'),
  ('financial.export',                     'Export Financial Data',       'financial');

-- ============================================================================
-- Role-to-Permission mappings
-- ============================================================================

-- ADMIN — all permissions
insert into role_permissions (role_code, permission_code)
select 'ADMIN', code from permissions;

-- EXECUTIVE
insert into role_permissions (role_code, permission_code) values
  ('EXECUTIVE', 'dashboard.view'),
  ('EXECUTIVE', 'contacts.view'),
  ('EXECUTIVE', 'companies.view'),
  ('EXECUTIVE', 'leads.view'),
  ('EXECUTIVE', 'deals.view'),
  ('EXECUTIVE', 'quotations.view'),
  ('EXECUTIVE', 'quotations.preview'),
  ('EXECUTIVE', 'quotations.download'),
  ('EXECUTIVE', 'invoices.view'),
  ('EXECUTIVE', 'invoices.preview'),
  ('EXECUTIVE', 'invoices.download'),
  ('EXECUTIVE', 'receipts.view'),
  ('EXECUTIVE', 'receipts.download'),
  ('EXECUTIVE', 'projects.view'),
  ('EXECUTIVE', 'tasks.view'),
  ('EXECUTIVE', 'calendar.view'),
  ('EXECUTIVE', 'documents.view'),
  ('EXECUTIVE', 'documents.download'),
  ('EXECUTIVE', 'communications.view'),
  ('EXECUTIVE', 'communications.send'),
  ('EXECUTIVE', 'reports.view'),
  ('EXECUTIVE', 'reports.financial'),
  ('EXECUTIVE', 'financial.view_invoice_amounts'),
  ('EXECUTIVE', 'financial.view_receipt_amounts'),
  ('EXECUTIVE', 'financial.view_revenue'),
  ('EXECUTIVE', 'financial.view_outstanding_balances'),
  ('EXECUTIVE', 'settings.view');

-- BUSINESS_DEVELOPMENT
insert into role_permissions (role_code, permission_code) values
  ('BUSINESS_DEVELOPMENT', 'dashboard.view'),
  ('BUSINESS_DEVELOPMENT', 'contacts.view'),
  ('BUSINESS_DEVELOPMENT', 'contacts.create'),
  ('BUSINESS_DEVELOPMENT', 'contacts.edit'),
  ('BUSINESS_DEVELOPMENT', 'companies.view'),
  ('BUSINESS_DEVELOPMENT', 'companies.create'),
  ('BUSINESS_DEVELOPMENT', 'companies.edit'),
  ('BUSINESS_DEVELOPMENT', 'leads.view'),
  ('BUSINESS_DEVELOPMENT', 'leads.create'),
  ('BUSINESS_DEVELOPMENT', 'leads.edit'),
  ('BUSINESS_DEVELOPMENT', 'leads.change_stage'),
  ('BUSINESS_DEVELOPMENT', 'leads.delete'),
  ('BUSINESS_DEVELOPMENT', 'deals.view'),
  ('BUSINESS_DEVELOPMENT', 'deals.create'),
  ('BUSINESS_DEVELOPMENT', 'deals.edit'),
  ('BUSINESS_DEVELOPMENT', 'deals.change_stage'),
  ('BUSINESS_DEVELOPMENT', 'quotations.view'),
  ('BUSINESS_DEVELOPMENT', 'quotations.create'),
  ('BUSINESS_DEVELOPMENT', 'quotations.edit'),
  ('BUSINESS_DEVELOPMENT', 'quotations.download'),
  ('BUSINESS_DEVELOPMENT', 'invoices.view'),
  ('BUSINESS_DEVELOPMENT', 'projects.view'),
  ('BUSINESS_DEVELOPMENT', 'tasks.view'),
  ('BUSINESS_DEVELOPMENT', 'tasks.create'),
  ('BUSINESS_DEVELOPMENT', 'tasks.edit'),
  ('BUSINESS_DEVELOPMENT', 'tasks.complete'),
  ('BUSINESS_DEVELOPMENT', 'calendar.view'),
  ('BUSINESS_DEVELOPMENT', 'calendar.create'),
  ('BUSINESS_DEVELOPMENT', 'calendar.edit'),
  ('BUSINESS_DEVELOPMENT', 'documents.view'),
  ('BUSINESS_DEVELOPMENT', 'documents.upload'),
  ('BUSINESS_DEVELOPMENT', 'documents.download'),
  ('BUSINESS_DEVELOPMENT', 'communications.view'),
  ('BUSINESS_DEVELOPMENT', 'communications.send'),
  ('BUSINESS_DEVELOPMENT', 'reports.view');

-- SALES
insert into role_permissions (role_code, permission_code) values
  ('SALES', 'dashboard.view'),
  ('SALES', 'contacts.view'),
  ('SALES', 'companies.view'),
  ('SALES', 'leads.view'),
  ('SALES', 'leads.create'),
  ('SALES', 'leads.edit'),
  ('SALES', 'deals.view'),
  ('SALES', 'deals.create'),
  ('SALES', 'deals.edit'),
  ('SALES', 'deals.change_stage'),
  ('SALES', 'quotations.view'),
  ('SALES', 'quotations.create'),
  ('SALES', 'quotations.download'),
  ('SALES', 'invoices.view'),
  ('SALES', 'projects.view'),
  ('SALES', 'tasks.view'),
  ('SALES', 'tasks.create'),
  ('SALES', 'tasks.edit'),
  ('SALES', 'tasks.complete'),
  ('SALES', 'calendar.view'),
  ('SALES', 'calendar.create'),
  ('SALES', 'calendar.edit'),
  ('SALES', 'documents.view'),
  ('SALES', 'documents.upload'),
  ('SALES', 'documents.download'),
  ('SALES', 'communications.view'),
  ('SALES', 'communications.send'),
  ('SALES', 'reports.view');

-- PROJECT_MANAGER
insert into role_permissions (role_code, permission_code) values
  ('PROJECT_MANAGER', 'dashboard.view'),
  ('PROJECT_MANAGER', 'contacts.view'),
  ('PROJECT_MANAGER', 'companies.view'),
  ('PROJECT_MANAGER', 'deals.view'),
  ('PROJECT_MANAGER', 'quotations.view'),
  ('PROJECT_MANAGER', 'invoices.view'),
  ('PROJECT_MANAGER', 'projects.view'),
  ('PROJECT_MANAGER', 'projects.create'),
  ('PROJECT_MANAGER', 'projects.edit'),
  ('PROJECT_MANAGER', 'projects.change_status'),
  ('PROJECT_MANAGER', 'projects.delete'),
  ('PROJECT_MANAGER', 'tasks.view'),
  ('PROJECT_MANAGER', 'tasks.create'),
  ('PROJECT_MANAGER', 'tasks.edit'),
  ('PROJECT_MANAGER', 'tasks.complete'),
  ('PROJECT_MANAGER', 'tasks.delete'),
  ('PROJECT_MANAGER', 'calendar.view'),
  ('PROJECT_MANAGER', 'calendar.create'),
  ('PROJECT_MANAGER', 'calendar.edit'),
  ('PROJECT_MANAGER', 'documents.view'),
  ('PROJECT_MANAGER', 'documents.upload'),
  ('PROJECT_MANAGER', 'documents.download'),
  ('PROJECT_MANAGER', 'documents.edit'),
  ('PROJECT_MANAGER', 'communications.view'),
  ('PROJECT_MANAGER', 'communications.send'),
  ('PROJECT_MANAGER', 'reports.view');

-- PROJECT_TEAM
insert into role_permissions (role_code, permission_code) values
  ('PROJECT_TEAM', 'contacts.view'),
  ('PROJECT_TEAM', 'companies.view'),
  ('PROJECT_TEAM', 'projects.view'),
  ('PROJECT_TEAM', 'tasks.view'),
  ('PROJECT_TEAM', 'tasks.edit'),
  ('PROJECT_TEAM', 'tasks.complete'),
  ('PROJECT_TEAM', 'calendar.view'),
  ('PROJECT_TEAM', 'documents.view'),
  ('PROJECT_TEAM', 'documents.upload'),
  ('PROJECT_TEAM', 'documents.download'),
  ('PROJECT_TEAM', 'communications.view'),
  ('PROJECT_TEAM', 'communications.send');

-- FINANCE
insert into role_permissions (role_code, permission_code) values
  ('FINANCE', 'dashboard.view'),
  ('FINANCE', 'contacts.view'),
  ('FINANCE', 'companies.view'),
  ('FINANCE', 'deals.view'),
  ('FINANCE', 'quotations.view'),
  ('FINANCE', 'invoices.view'),
  ('FINANCE', 'invoices.create'),
  ('FINANCE', 'invoices.edit'),
  ('FINANCE', 'invoices.record_payment'),
  ('FINANCE', 'invoices.cancel'),
  ('FINANCE', 'invoices.preview'),
  ('FINANCE', 'invoices.download'),
  ('FINANCE', 'invoices.view_payment_history'),
  ('FINANCE', 'receipts.view'),
  ('FINANCE', 'receipts.create'),
  ('FINANCE', 'receipts.preview'),
  ('FINANCE', 'receipts.download'),
  ('FINANCE', 'receipts.void'),
  ('FINANCE', 'projects.view'),
  ('FINANCE', 'tasks.view'),
  ('FINANCE', 'calendar.view'),
  ('FINANCE', 'documents.view'),
  ('FINANCE', 'documents.download'),
  ('FINANCE', 'communications.view'),
  ('FINANCE', 'reports.view'),
  ('FINANCE', 'reports.financial'),
  ('FINANCE', 'reports.export'),
  ('FINANCE', 'financial.view_invoice_amounts'),
  ('FINANCE', 'financial.view_receipt_amounts'),
  ('FINANCE', 'financial.view_revenue'),
  ('FINANCE', 'financial.view_outstanding_balances'),
  ('FINANCE', 'financial.export');

-- CUSTOMER_SERVICE
insert into role_permissions (role_code, permission_code) values
  ('CUSTOMER_SERVICE', 'dashboard.view'),
  ('CUSTOMER_SERVICE', 'contacts.view'),
  ('CUSTOMER_SERVICE', 'companies.view'),
  ('CUSTOMER_SERVICE', 'projects.view'),
  ('CUSTOMER_SERVICE', 'tasks.view'),
  ('CUSTOMER_SERVICE', 'tasks.create'),
  ('CUSTOMER_SERVICE', 'tasks.edit'),
  ('CUSTOMER_SERVICE', 'tasks.complete'),
  ('CUSTOMER_SERVICE', 'calendar.view'),
  ('CUSTOMER_SERVICE', 'calendar.create'),
  ('CUSTOMER_SERVICE', 'documents.view'),
  ('CUSTOMER_SERVICE', 'documents.download'),
  ('CUSTOMER_SERVICE', 'communications.view'),
  ('CUSTOMER_SERVICE', 'communications.send'),
  ('CUSTOMER_SERVICE', 'communications.internal_note'),
  ('CUSTOMER_SERVICE', 'invoices.view');

-- VIEWER
insert into role_permissions (role_code, permission_code) values
  ('VIEWER', 'dashboard.view'),
  ('VIEWER', 'contacts.view'),
  ('VIEWER', 'companies.view'),
  ('VIEWER', 'projects.view'),
  ('VIEWER', 'tasks.view'),
  ('VIEWER', 'calendar.view'),
  ('VIEWER', 'documents.view'),
  ('VIEWER', 'communications.view');

commit;
