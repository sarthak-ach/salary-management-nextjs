# Salary Management

Monorepo for the HR salary management assessment: Next.js frontend, Express API, and shared types.

## Structure

```
salary-management-nextjs/
├── apps/
│   ├── web/          # Next.js 15 (App Router)
│   └── api/          # Express + TypeScript + Prisma
├── packages/
│   └── shared/       # Zod schemas and shared types
├── prisma/           # Schema, migrations, seed
└── data/             # Name files for seeding (upcoming)
```

## Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `DATABASE_URL` to point at your Postgres instance.

3. Generate Prisma client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. (Optional) Run seed:

   ```bash
   npm run db:seed
   ```

## Development

```bash
# API on http://localhost:3001
npm run dev:api

# Web on http://localhost:3000
npm run dev:web
```

## Health check

With the API running and Postgres connected:

```bash
curl http://localhost:3001/health
```

Expected response: `{"status":"ok","database":"connected"}`
