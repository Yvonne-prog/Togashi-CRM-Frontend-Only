# Togashi CRM — Frontend Workspace

This package contains only the CRM frontend and the files needed to preserve its future backend API contract.

## Included

- React + TypeScript + Vite frontend
- Tailwind CSS and UI components
- Generated React Query API client
- OpenAPI specification for the future backend

## Removed

- Express API server
- PostgreSQL and Drizzle database package
- Seed scripts
- Backend validation package
- Replit runtime configuration and plugins

## Run locally

1. Install pnpm if necessary:
   `npm install -g pnpm`
2. From this folder, run:
   `pnpm install`
3. Start the frontend:
   `pnpm dev`
4. Open:
   `http://localhost:5173`

The current screens still use the generated API client. Until mock data is added, API-dependent screens may show loading or connection errors when no backend is running. Keep `lib/api-spec/openapi.yaml` and `lib/api-client-react`; they are the contract that will help the future backend integrate without rebuilding the frontend.
