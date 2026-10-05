# Togashi CRM Backend

Enterprise backend for Togashi CRM using NestJS 11 and Firebase.

## Prerequisites

- **Node.js** 20+ (LTS)
- **pnpm** 9+ (disk-efficient package manager)

### Why pnpm

pnpm uses a shared content-addressable dependency store, meaning identical packages are stored only once on disk. This saves significant space compared to npm or yarn when working across multiple projects.

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create three projects:
   - `togashi-crm-dev`
   - `togashi-crm-staging`
   - `togashi-crm-prod`

### 2. Enable Services

For each project, enable:
- **Authentication** (Email/Password provider)
- **Cloud Firestore** (in production mode)
- **Storage**

### 3. Generate Admin SDK Key

1. Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (do NOT commit)

### 4. Configure Environment

Copy `.env.example` to `.env` and fill in values from your Firebase service account key:

```env
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour\nprivate\nkey\n-----END PRIVATE KEY-----\n
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

SEED_ADMIN_EMAIL=admin@togashicrm.com
SEED_ADMIN_PASSWORD=your-secure-password

LOG_LEVEL=info
```

**Important:** When copying the private key, replace literal `\n` with `\\n` so it represents a single line. The application will convert it correctly.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run type checking
pnpm run typecheck

# Run linting
pnpm run lint

# Run tests
pnpm run test
```

## Seed Database

```bash
pnpm run seed
```

This creates:
- 10 system roles
- Togashi Technologies organization
- Super Admin user

The seed is idempotent — safe to run multiple times.

## Swagger

Once running, visit: `http://localhost:4000/api/docs`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/health | No | Health check |
| GET | /api/v1/auth/me | Yes | Current user profile |

## Security

### Firebase Security Rules

Firestore and Storage rules **deny all direct client access**. All data access flows through the NestJS backend using Firebase Admin SDK, which bypasses security rules.

Authorization is enforced in NestJS via:
- `FirebaseAuthGuard` (verifies Firebase ID tokens)
- Organization membership checks
- User status validation

### Environment Protection

- Development: `togashi-crm-dev`
- Staging: `togashi-crm-staging`
- Production: `togashi-crm-prod`

Never use the production Firebase project during development.

## Architecture

### Directory Structure

```
backend/
  src/
    app.module.ts          # Root module
    main.ts                # Bootstrap
    config/                # Configuration
    firebase/              # Firebase services (Admin, Firestore, Auth, Storage)
    common/                # Shared code
      constants/           # Application constants
      decorators/          # Custom decorators (@CurrentUser, @Public)
      dto/                 # Shared DTOs (pagination, sorting)
      enums/               # Status enums
      exceptions/          # HTTP exceptions
      filters/             # Exception filters
      guards/              # Auth guards
      interceptors/        # Response envelope interceptor
      interfaces/          # TypeScript interfaces
      pipes/               # Validation pipes
      utils/               # Utility functions
    modules/
      health/              # Health check
      auth/                # Authentication
      users/               # User profiles
      roles/               # System roles
      audit/               # Audit logging
      organizations/       # Organizations
  test/                    # Tests
```

### Data Model

Firestore collections:
- `organizations` — Company entities
- `users` — User profiles (doc ID = Firebase Auth UID)
- `roles` — System roles (doc ID = role code)
- `auditLogs` — Append-only audit trail
- `systemSettings` — System configuration

### Pagination

Cursor-based pagination using Firestore document snapshots. Default page size: 20, max: 100.

### Search

Normalized prefix-search fields for simple queries (e.g., `emailNormalized`, `nameNormalized`). For advanced search, integrate a dedicated search service.

### Reporting

Dashboard data is prepared via scheduled summary documents rather than reading complete collections on every request.

## Firestore Indexes

Initial `firestore.indexes.json` is empty. Firestore will prompt for indexes as queries are added. Add indexes using:

```bash
firebase deploy --only firestore:indexes
```

## Firestore Security Rules

Direct client access is denied. Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## Storage Rules

Direct client access is denied. Deploy rules:

```bash
firebase deploy --only storage:rules
```

## Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate coverage report
pnpm run test:coverage
```

Tests use mocked Firebase services. No Firebase Emulator Suite required.

## Scripts

| Script | Description |
|--------|-------------|
| dev | Start with hot-reload |
| build | Production build |
| start | Start built application |
| start:prod | Start production |
| typecheck | TypeScript type checking |
| lint | ESLint |
| test | Jest tests |
| test:watch | Jest watch mode |
| test:coverage | Coverage report |
| seed | Seed database |
| clean | Remove dist and coverage |

## Backup Planning

Use Firebase's built-in export:
```bash
gcloud firestore export gs://your-bucket/backups/$(date +%Y-%m-%d)
```

Schedule automated exports and store service account keys in a secrets manager.

## Scaling Strategy

- Firestore scales automatically
- NestJS is stateless — deploy multiple instances behind a load balancer
- Use Cloud Run or Cloud Functions for serverless deployment
- Cache frequent reads with Firestore's built-in caching

## Cost Control

- Monitor Firestore reads/writes
- Use summary documents for dashboards
- Limit page sizes
- Set budget alerts in GCP

## Low Disk Space Development

Check and clean these locations periodically:

```bash
# Check pnpm store size
pnpm store path
pnpm store status

# Clear unused packages from pnpm store
pnpm store prune

# Remove build artifacts
pnpm run clean

# Remove old node_modules caches
# In the workspace root:
rimraf node_modules
pnpm install

# Check temporary files
# Windows: %TEMP%
# macOS/Linux: /tmp
```

**Warning:** Deleting `node_modules` or pruning the pnpm store means dependencies will need to be downloaded again.

These generated folders can be safely deleted:
- `dist/`
- `coverage/`
- `.cache/`
