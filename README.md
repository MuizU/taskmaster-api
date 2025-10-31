# Taskmaster API 🚀

Taskmaster is a RESTful API built with Node.js and Express to manage tasks (todos). It uses Prisma as the ORM with PostgreSQL as the backing database.

This README has been updated to reflect recent changes: Prisma integration and tests, Swagger API documentation (available at `/api-docs`), and security/performance middleware (`helmet`, `compression`, and `express-rate-limit`).

## ✨ Features

- Create, read, update, delete todos
- User <-> Todo relationship (todos optionally belong to a `User`)
- Prisma ORM for database access and migrations
- Swagger UI for API documentation at `/api-docs`
- Security & performance middleware: `helmet`, `compression`, and `express-rate-limit`

## 🛠 Prerequisites

- Node.js (LTS recommended)
- PostgreSQL (local or hosted)
- npm (or yarn)

## Quickstart

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/MuizU/taskmaster-api.git
cd taskmaster-api
npm install
```

2. Create a `.env` in the project root and set the following (example):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
```

3. Prisma setup (generate client + run migrations):

```bash
npx prisma generate
# For development: create and apply a migration interactively
npx prisma migrate dev --name init
```

4. Run the app:

```bash
# development (with nodemon)
npm run dev

# production
npm start
```

The API will be available at `http://localhost:3000` (or the port set in `PORT`).

## Swagger (API docs)

Interactive API documentation is available at:

```
GET /api-docs
```

The project uses `swagger-jsdoc` and `swagger-ui-express`. You can add documentation comments in route files under `src/routes/` to expand the OpenAPI spec used by Swagger.

## Security & Performance Middleware

This project now includes:

- `helmet` — sets secure HTTP headers
- `compression` — enables gzip compression for responses
- `express-rate-limit` — basic rate limiting (defaults to 100 requests per 15 minutes)

These are enabled in the Express app by default. Adjust their configuration in `src/app.js` if you need different limits or headers.

## Tests

Unit and integration tests are written with Jest and Supertest. There are tests that:

- Exercise the routers using mocked services (unit tests)
- Test Prisma integration (these talk to the database and require a configured `DATABASE_URL`)
- Validate the Swagger UI is served at `/api-docs`
- Verify the security and performance middleware (headers, gzip, and rate limiting)

Run the test suite with:

```bash
# run jest tests (configured for ESM)
npm run test:jest
```

Important notes for running Prisma tests:

- The Prisma integration tests hit a real database. Point `DATABASE_URL` in your `.env` to a test database (not your production DB).
- Run `npx prisma migrate deploy` or `npx prisma migrate dev` against that test DB before running tests so the schema is up-to-date.
- After tests, the test suite attempts to clean up rows it created, but be prepared to reset the test DB if needed.

## Environment variables

- `DATABASE_URL` — PostgreSQL connection string (required for Prisma tests and runtime)
- `PORT` — optional server port (default: 3000)

## New / Important Dependencies

- `@prisma/client`, `prisma` — Prisma ORM and client
- `swagger-jsdoc`, `swagger-ui-express` — Swagger/OpenAPI docs
- `helmet`, `compression`, `express-rate-limit` — security and performance

## Troubleshooting

- If tests that touch the database fail, ensure the `DATABASE_URL` is correct and migrations have been applied.
- If Swagger doesn't show new routes, add JSDoc-style comments to files matched by `src/swagger.js`'s `apis` globs and restart the server.

## Contributing

Feel free to open issues or PRs. For changes that affect DB schema, add a Prisma migration and update tests where needed.

---

If you'd like, I can also:

- Add an endpoint that exposes the raw OpenAPI JSON (`/api-docs.json`) so other tools can consume it programmatically
- Add a separate `npm test` script that runs only fast unit tests (non-database) and another for full integration tests

Tell me which you'd prefer and I can implement them.
