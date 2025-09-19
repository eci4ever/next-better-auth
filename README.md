# Next.js + Better Auth + Prisma Eci Auth

A short, opinionated guide to get a **Next.js** app running with **Better Auth** (authentication), **Prisma** (ORM/database) and **shadcn/ui** for UI components. Designed to be simple and friendly.

---

## Frequick start (all steps)

```bash
# 1) create project
pnpm create next-app@latest my-app -- --typescript
cd my-app

# 2) install core deps
pnpm add better-auth @prisma/client
pnpm add -D @better-auth/cli prisma

# 3) init prisma
pnpm exec prisma init
# set DATABASE_URL in .env

# 4) generate Better Auth schema (Prisma):
npx @better-auth/cli generate --output prisma/schema.prisma

# 5) migrate
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate

# 6) shadcn/ui (UI)
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button

# 7) dev
pnpm dev
```

---

## Prerequisites

* Node.js (LTS, e.g. >= 18)
* pnpm installed globally (or use `npm`/`npx` equivalently)
* A database (Postgres recommended for production; SQLite works for local testing)

---

## 1) Create Next.js app (quick)

```bash
pnpm create next-app@latest my-app -- --typescript
cd my-app
```

Use the App Router if you prefer server components (recommended for modern Next.js projects).

---

## 2) Add Better Auth + Prisma

Install runtime packages and the Better Auth CLI and Prisma tooling:

```bash
pnpm add better-auth @prisma/client
pnpm add -D @better-auth/cli prisma
```

Why these? `better-auth` is the library; `@better-auth/cli` helps generate the DB schema and assets; `@prisma/client` is the runtime client and `prisma` provides the CLI/migrate tools.

---

## 3) Configure Prisma

Initialize Prisma and point it to your database:

```bash
pnpm exec prisma init
```

Edit `.env` and set your `DATABASE_URL`, for example:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Your `prisma/schema.prisma` will be updated/generated in the next step when you run the Better Auth generator.

---

## 4) Generate Better Auth schema for Prisma

Better Auth can generate the required schema for your chosen ORM (Prisma, Drizzle, Kysely, etc.). To auto-create the Prisma models run:

```bash
npx @better-auth/cli generate --output prisma/schema.prisma
```

This command will produce the `prisma/schema.prisma` entries needed for Better Auth (users, sessions, auth tables, etc.). If you already have a schema, inspect and merge carefully.

---

## 5) Apply migrations (Prisma)

Once `prisma/schema.prisma` contains the models, create and apply migrations (development):

```bash
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
pnpm exec prisma studio   # optional - view/edit data
```

If you prefer iterative development without migrations, `prisma db push` can be used for prototyping.

---

## 6) Create a Better Auth instance (`lib/auth.ts`)

Create a small file that initializes Better Auth and connects the Prisma adapter.

```ts
// lib/auth.ts
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // enable auth methods you need:
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }
  },
  // optional plugins, cookie config, etc.
});
```

> Put secrets in `.env` and never commit them.

---

## 7) Mount Better Auth handler in Next.js

Better Auth exposes helper functions for Next.js. For the **App Router** create a catch-all route handler at `/app/api/auth/[...all]/route.ts` (or project equivalent):

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

For the Pages router use the `toNodeHandler` helper and disable body parsing.

---

## 8) Client usage (minimal)

Create a client wrapper to call Better Auth from the frontend:

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

Use the client in components to sign-in, sign-up or fetch session state. Server components can use `auth.api.getSession({ headers })` to read the session server-side.

---

## 9) Install shadcn/ui (UI)

shadcn/ui speeds up building accessible UI components. Quick init:

```bash
pnpm dlx shadcn@latest init
# add components when needed, e.g.
pnpm dlx shadcn@latest add button
```

This will scaffold component files, add `cn` util and wire up any required styles (Tailwind must be configured). If you don't yet have Tailwind, follow the Tailwind setup for Next.js first.

---

## Frequently used commands

### Next.js (pnpm)

* `pnpm dev` — run dev server (localhost:3000)
* `pnpm build` — build for production
* `pnpm start` — start production server (after build)
* `pnpm lint` — run linters

### Prisma

* `pnpm exec prisma init` — initialize prisma
* `pnpm exec prisma migrate dev --name <name>` — generate and apply migrations
* `pnpm exec prisma migrate reset` — reset DB and reapply migrations
* `pnpm exec prisma db push` — push schema to DB without migrations (prototyping)
* `pnpm exec prisma generate` — generate Prisma client
* `pnpm exec prisma studio` — GUI to view/edit DB
* `pnpm exec prisma db pull` — introspect database into schema.prisma
* `pnpm exec prisma migrate deploy` — apply migrations in CI/production

### Better Auth

* `pnpm add better-auth` — install runtime
* `pnpm add -D @better-auth/cli` — install CLI
* `npx @better-auth/cli generate` — generate ORM schema (Prisma/Drizzle/Kysely)
* `npx @better-auth/cli migrate` — run the built-in migration (Kysely only)

### shadcn/ui

* `pnpm dlx shadcn@latest init` — initialise shadcn in project
* `pnpm dlx shadcn@latest add <component>` — add pre-built component to project

---

## Tips & gotchas

* Always store secrets in `.env` and use `process.env`.
* When you run `@better-auth/cli generate` inspect the Prisma schema it creates before applying migrations.
* `@better-auth/cli migrate` applies migrations automatically **only** for the Kysely adapter — for Prisma, use Prisma Migrate.
* For RSC (server components) use `auth.api.getSession({ headers })` instead of relying on middleware cookie checks for full validation.

---

## Recommended next steps

1. Read Better Auth docs and example repo for advanced features (2FA, passkeys, organizations).
2. Secure production environment variables and database access.
3. Write tests for authentication flows.

---
## License
MIT License. Free to use and modify.

---

