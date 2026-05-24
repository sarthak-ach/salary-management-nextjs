# Salary Management

Salary Management is a full-stack HR salary management app built as an npm
workspace monorepo. It includes a Next.js frontend, an Express API, a Prisma
data layer, and shared Zod schemas used by both applications.

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- UI: Radix UI primitives, lucide-react icons, class-variance-authority
- Data fetching: TanStack Query
- Backend: Express 5, TypeScript, Prisma Client
- Database: PostgreSQL, tested with Neon
- Validation: Zod shared across frontend and API
- Tooling: npm workspaces, Vitest, tsx, Prisma migrations

## Project Architecture

```text
salary-management-nextjs/
|-- apps/
|   |-- web/                 # Next.js app router frontend
|   |-- api/                 # Express API service
|-- packages/
|   |-- shared/              # Shared Zod schemas and TypeScript types
|-- prisma/
|   |-- schema.prisma        # Database schema
|   |-- migrations/          # Prisma migration history
|   |-- seed.ts              # Seed script for employee data
|-- data/                    # First and last name source files for seeding
|-- package.json             # Root workspace scripts
|-- tsconfig.base.json       # Shared TypeScript settings
```

The web app imports shared schemas and types from `@salary-management/shared`.
The API uses the same shared package for request validation and typed inputs.
The shared package is compiled before production builds so Node, Next.js, Render,
and Vercel resolve it from `packages/shared/dist`.

## Runtime Flow

```text
Browser
  -> Next.js web app
  -> Express API
  -> Prisma Client
  -> PostgreSQL / Neon
```

The frontend calls the API for employee records and salary insights. The API
validates request params and payloads with Zod, queries PostgreSQL through
Prisma, and returns serialized JSON responses.

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database, local or hosted

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Set `DATABASE_URL` in `.env` to your PostgreSQL or Neon connection string.

4. Generate Prisma Client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Seed sample employee data:

   ```bash
   npm run db:seed
   ```

The seed script clears existing employee rows and inserts 10,000 generated
employees.

## Development

Run the API:

```bash
npm run dev:api
```

Run the web app:

```bash
npm run dev:web
```

Default local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`

## Build

Build all workspaces:

```bash
npm run build
```

The root build:

1. Generates Prisma Client
2. Builds `@salary-management/shared`
3. Builds `@salary-management/api`
4. Builds `@salary-management/web`

Individual app builds also build the shared package first through `prebuild`
scripts, which keeps Vercel and Render single-workspace builds working.

## Database Scripts

```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run local development migrations
npm run db:deploy    # Apply migrations in production
npm run db:push      # Push schema without creating a migration
npm run db:seed      # Clear and reseed employees
```

## Deployment

### Render API

Recommended build command:

```bash
npm install --include=dev && npm run render:build
```

Start command:

```bash
npm run start -w @salary-management/api
```

Set `DATABASE_URL` in Render to your Neon or PostgreSQL connection string.
`render:build` builds the app, applies Prisma migrations with
`prisma migrate deploy`, and seeds employee data.

### Vercel Web

Use the web workspace as the Vercel project root if deploying only the frontend:

```text
apps/web
```

Build command:

```bash
npm run build
```

The web package has a `prebuild` script that builds `@salary-management/shared`
before `next build`.

## Health Check

With the API running and PostgreSQL connected:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{"status":"ok","database":"connected"}
```

## Testing

```bash
npm run test:api
npm run test:web
```
