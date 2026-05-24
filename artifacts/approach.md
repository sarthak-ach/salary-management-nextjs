# Approach Notes

This document captures the thinking behind the Salary Management solution. It is
intended as a lightweight review artifact alongside the implementation.

## Product Goal

Build a small but complete salary management application for HR-style workflows:

- Browse a seeded employee directory.
- Search, filter, sort, paginate, create, edit, and delete employees.
- View salary and headcount insights.
- Keep the web app, API, database schema, and validation rules aligned.

## Architecture

The project is organized as an npm workspace monorepo:

```text
salary-management-nextjs/
|-- apps/
|   |-- web/       Next.js frontend
|   |-- api/       Express API
|-- packages/
|   |-- shared/    Shared Zod schemas and inferred TypeScript types
|-- prisma/        Database schema, migrations, and seed script
|-- data/          Source name lists for generated seed data
```

Runtime flow:

```text
Browser
  -> Next.js web app
  -> Express API
  -> Prisma Client
  -> PostgreSQL / Neon
```

The shared package is the contract layer. The API uses shared Zod schemas to
validate incoming params, query strings, and request bodies. The web app imports
the corresponding TypeScript types so query construction and form payloads stay
close to the backend contract.

## Key Design Decisions

### Monorepo With Shared Schemas

The frontend and backend both depend on `@salary-management/shared` instead of
duplicating types. This reduces drift in a codebase where validation and UI form
state are tightly coupled.

Trade-off: the shared package must be built before production app builds. The
root and workspace `build` scripts handle this explicitly.

### Express API Instead of Next.js API Routes

The backend is a standalone Express service. This keeps the API deployable to a
service host such as Render while the Next.js frontend can be deployed separately
to Vercel.

Trade-off: local development uses two services instead of one, but the split
matches a common production deployment shape and keeps backend concerns isolated.

### Prisma and PostgreSQL

Prisma provides the database schema, migrations, typed queries, and seed flow.
The `Employee` model includes indexes for the most common filtering and
aggregation dimensions:

- `country`
- `jobTitle`
- `(country, jobTitle)`

This supports the directory filters and insight endpoints without over-indexing
the initial schema.

### Server-Side Pagination and Sorting

The employee table uses server-side pagination, filtering, and sorting. This is
more appropriate for a seeded data set of 10,000 employees than loading all
records into the browser.

The UI still feels responsive by using TanStack Query for caching and request
state, plus a debounced search input to avoid issuing a request for every
keystroke.

### Insights as API Aggregations

Salary and headcount insights are computed in the API. Database aggregations are
used for count, min, max, and average salary values. Salary band distribution is
computed in application code because the banding logic is easier to test and
adjust as a pure function.

## Data Model

The core `Employee` fields are:

- Identity and contact: `id`, `fullName`, `email`
- Role details: `jobTitle`, `department`, `employmentType`
- Location and pay: `country`, `salary`
- Lifecycle metadata: `startDate`, `createdAt`, `updatedAt`

`salary` is stored as a decimal in the database to avoid floating point storage
issues. Responses serialize database-specific values into JSON-friendly types
before returning them to the web app.

## Frontend Approach

The web app is built with Next.js, React, Tailwind CSS, Radix UI primitives, and
lucide-react icons.

The employee page focuses on repeated operational use:

- A dense table layout for scanning records.
- Search and filters near the table.
- Icon actions for edit and delete.
- Modal dialogs for create, update, and delete confirmation.
- Loading, empty, error, and background-fetching states.

The insights page summarizes trends without forcing users to inspect individual
records first.

## API Approach

The API is organized around routes, controllers, services, middleware, and small
library helpers:

- Routes define endpoint wiring.
- Controllers handle request/response mapping.
- Services contain business/data access logic.
- Middleware centralizes validation and error handling.
- Serialization helpers keep Prisma-specific values out of API responses.

This structure is intentionally simple. It gives the app clear boundaries without
adding more layers than the current scope needs.

## Testing Strategy

The test suite is split by workspace:

- API tests cover validation, aggregation helpers, services, and routes.
- Web tests cover formatting, API helpers, layout components, employee filters,
  the employee page, and landing cards.

The emphasis is on behavior that could regress during refactors:

- Query validation and defaults.
- CRUD service behavior.
- Aggregation math.
- UI state transitions around filtering, sorting, and table rendering.

## Performance Considerations

- Directory requests are paginated with a bounded `limit`.
- Search input is debounced before it affects the query.
- Employee count and list queries run concurrently.
- Insights summary queries run concurrently where possible.
- Database indexes support common filters and grouped insight lookups.
- TanStack Query avoids unnecessary refetch churn and gives the UI stable
  loading/fetching states.

Potential future optimization: if the employee table grows far beyond the seeded
data set, full-text search or trigram indexes would be better than a broad
case-insensitive `contains` search.

## Deployment Notes

The deployment scripts assume separate hosting for API and web:

- Render can build/start the API and run Prisma migrations.
- Vercel can build the web app from `apps/web`.
- The shared package is built before dependent production builds.
- `db:seed:if-empty` protects deployed databases from being wiped on restart.

This keeps first deployment convenient while avoiding destructive seed behavior
in production.

## AI Assistance Notes

AI assistance was used as a coding collaborator to help with implementation,
review, and documentation. Prompts were task-oriented, for example:

```text
Build a full-stack salary management app with a Next.js frontend, Express API,
Prisma/PostgreSQL data layer, shared validation schemas, seed data, CRUD
workflows, salary insights, tests, and deployment-ready scripts.
```

The approach was to keep generated suggestions grounded in the repository's
actual architecture, then verify behavior with focused tests and build scripts.

## Known Trade-offs and Future Work

- Authentication and authorization are out of scope for this version.
- Currency formatting is country-based, but the app does not model separate
  currency fields per employee.
- Search is intentionally simple; a production HR directory might need fuzzy
  matching, full-text search, or a dedicated search service.
- Audit history for salary changes is not modeled.
- Bulk import/export could be a useful next workflow for a salary management
  tool.

## Review Checklist

- The app has a clear frontend/API/database split.
- Runtime validation is shared with frontend TypeScript types.
- Seed data supports meaningful local exploration.
- CRUD and insight workflows are covered by tests.
- Deployment scripts account for migrations, shared package builds, and safe
  seed behavior.
