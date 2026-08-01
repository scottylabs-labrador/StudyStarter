# CMU Study

Find and manage CMU study groups.

## Development

- `npm run dev` starts the local Next.js app.
- `npm run build` creates a production build.
- `npx tsc --noEmit` runs TypeScript validation.
- `GET /api/v1/health` verifies the Hono API boundary.
- `GET /api/v1/groups` returns groups ordered by start time; pass `courseCode` to filter by course.
- PostgreSQL is configured through `DATABASE_URL`; use `npm run db:generate` to create a migration after changing the Prisma schema.

## Project Structure

- `src/app` contains Next.js routes and route layouts.
- `src/features/groups` contains study-group components, hooks, services, filters, and constants.
- `src/features/profile` contains profile components, hooks, services, and profile-specific types.
- `src/components` contains shared layout, provider, and UI components.
- `src/helpers` contains external integration helpers such as calendar/date utilities.
- `src/server/api` contains the Hono API application and route composition.
- `src/styles` contains global and component-level CSS.
