# SketchHive — Deployment Guide

SketchHive is a Turborepo monorepo deployed as **three services**:

| Component        | Runtime            | Platform | Directory                       |
| ---------------- | ------------------ | -------- | ------------------------------- |
| Frontend         | Next.js (App Router) | Vercel  | `apps/sketch-hive-frontend`     |
| HTTP backend     | Express            | Railway  | `apps/http-backend`             |
| WebSocket backend| Node + `ws`        | Railway  | `apps/ws-backend`               |
| Database         | PostgreSQL         | Neon (existing) | `packages/db` (Prisma)   |

The database already exists on Neon and is fully migrated — **do not recreate it**.

---

## 1. Environment Variables

### Frontend (Vercel)

Both are `NEXT_PUBLIC_*` and are **inlined into the client bundle at build time** — they are public, never secrets. Point them at your Railway service URLs.

| Variable               | Example                                  | Notes                            |
| ---------------------- | ---------------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_HTTP_URL` | `https://sketchhive-http.up.railway.app` | HTTP backend base URL. **https** |
| `NEXT_PUBLIC_WS_URL`   | `wss://sketchhive-ws.up.railway.app`     | WS backend base URL. **wss**     |

### HTTP backend (Railway)

| Variable       | Required | Notes                                                             |
| -------------- | -------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | yes      | Neon connection string (keep `sslmode=verify-full`).              |
| `JWT_SECRET`   | yes      | Long random string. **Must be identical to the WS backend.**      |
| `FRONTEND_URL` | yes      | Your Vercel origin, e.g. `https://sketchhive.vercel.app` (CORS). Comma-separate for multiple. |
| `NODE_ENV`     | yes      | `production`.                                                     |
| `PORT`         | auto     | Injected by Railway. **Do not set manually.**                    |

### WebSocket backend (Railway)

| Variable       | Required | Notes                                                        |
| -------------- | -------- | ------------------------------------------------------------ |
| `DATABASE_URL` | yes      | Same value as the HTTP backend.                              |
| `JWT_SECRET`   | yes      | **Identical** to the HTTP backend's, or tokens won't verify. |
| `NODE_ENV`     | yes      | `production`.                                                |
| `PORT`         | auto     | Injected by Railway. **Do not set manually.**               |

`.env.example` files exist in each of `apps/sketch-hive-frontend`, `apps/http-backend`, `apps/ws-backend`, and `packages/db`.

---

## 2. Prisma / Database (Neon)

Deployment is **migration-based** (`prisma migrate deploy`). We never use `prisma db push`.

Run migrations from your machine (or CI) using the `@repo/db` package, which reads `DATABASE_URL` from `packages/db/.env`:

```bash
cd packages/db
cp .env.example .env        # then paste the real Neon DATABASE_URL
pnpm prisma migrate status  # verify what is applied
pnpm prisma migrate deploy  # apply any pending migrations (idempotent)
```

The Prisma **client** is generated automatically during each backend build (`@repo/db`'s build runs `prisma generate && tsc -b`), so nothing else is required at deploy time.

> The current Neon database already has all migrations applied. On the first deploy you only need to re-run `migrate deploy` if you add new migrations.

---

## 3. Railway — Backend Deployment

Deploy the HTTP and WS backends as **two separate Railway services** from the same repository.

For **each** service:

1. **New Project → Deploy from GitHub repo** (or add a second service to an existing project).
2. **Settings → Root Directory:** `/` (the monorepo root — the pnpm workspace lives here).
3. **Settings → Config-as-code path:**
   - HTTP service → `apps/http-backend/railway.toml`
   - WS service → `apps/ws-backend/railway.toml`
   These files pin the build (`pnpm turbo run build --filter=<service>`) and start (`pnpm --filter <service> start`) commands, so Nixpacks builds only that service and its internal dependencies (`@repo/db`, `@repo/backend-common`, `@repo/zod-validation`).
4. **Variables:** add the variables from the tables above (Railway sets `PORT` for you).
5. Deploy. Railway generates a public URL per service — copy both; you'll need them for the frontend env vars.
6. On the **WS** service, use its generated domain with `wss://` on the client (Railway terminates TLS at the edge; the process itself listens with plain `ws`, which is correct).

**Health check:** the HTTP backend exposes `GET /health` → `{"status":"ok"}`.

---

## 4. Vercel — Frontend Deployment

1. **New Project → import the repo.**
2. **Root Directory:** `apps/sketch-hive-frontend`.
   Vercel auto-detects Next.js and the pnpm workspace; it installs at the workspace root and transpiles the internal `@repo/ui` / `@repo/chat-ui` / `@repo/icons` packages (configured via `transpilePackages` in `next.config.ts`).
3. **Environment Variables:** add `NEXT_PUBLIC_HTTP_URL` and `NEXT_PUBLIC_WS_URL` (the Railway URLs, `https://` / `wss://`).
4. Deploy.
5. Copy the resulting Vercel URL and set it as `FRONTEND_URL` on the **HTTP backend** service in Railway, then redeploy that backend so CORS allows the frontend origin.

---

## 5. First Deployment — End-to-End Order

1. **Neon:** already provisioned. Run `pnpm prisma migrate deploy` from `packages/db` (idempotent).
2. **Railway HTTP backend:** deploy with `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, and a placeholder `FRONTEND_URL`. Note its URL.
3. **Railway WS backend:** deploy with the **same** `DATABASE_URL` and `JWT_SECRET`, `NODE_ENV=production`. Note its URL.
4. **Vercel frontend:** deploy with `NEXT_PUBLIC_HTTP_URL` (HTTP URL, https) and `NEXT_PUBLIC_WS_URL` (WS URL, wss). Note its URL.
5. **Back to Railway HTTP backend:** set `FRONTEND_URL` to the Vercel URL and redeploy.
6. Smoke test: sign up → sign in → create room → draw → open the same room in a second browser and confirm live sync + chat.

---

## 6. Future Deployment Workflow

- **Code changes:** push to the tracked branch. Vercel and Railway auto-build from the repo (each builds only what it needs via Turbo filters).
- **Schema changes:** create a migration locally (`cd packages/db && pnpm prisma migrate dev --name <change>`), commit it, then run `pnpm prisma migrate deploy` against production before/with the backend deploy.
- **Env var changes:** update in the Vercel/Railway dashboards. `NEXT_PUBLIC_*` changes require a **frontend rebuild** to take effect (they're build-time inlined).

---

## 7. Troubleshooting

| Symptom | Likely cause / fix |
| ------- | ------------------ |
| Frontend calls go to `localhost:3001` / `localhost:8080` in prod | `NEXT_PUBLIC_HTTP_URL` / `NEXT_PUBLIC_WS_URL` not set at **build** time on Vercel. Set them and redeploy. |
| CORS error in browser console | `FRONTEND_URL` on the HTTP backend doesn't match the Vercel origin exactly (scheme + host). Update and redeploy the backend. |
| WebSocket fails / "insecure" on an https page | Client must use `wss://` (not `ws://`). Fix `NEXT_PUBLIC_WS_URL`. |
| Backend exits immediately with "JWT_SECRET … required in production" | `JWT_SECRET` not set on that Railway service. Set it (identically on both backends). |
| Backend throws "DATABASE_URL is not set" | `DATABASE_URL` missing from the service variables. |
| Sign-in works but the socket rejects the token (closes immediately) | `JWT_SECRET` differs between the HTTP and WS services. Make them identical and redeploy both. |
| `Cannot find module '.../dist/index.js'` at start | The build didn't emit. Ensure no stale `tsconfig.tsbuildinfo` is committed (they are gitignored) and that the Railway build ran `turbo run build`. Redeploy with a cleared build cache. |
| Prisma "table does not exist" / drift | Run `pnpm prisma migrate deploy` from `packages/db` against the production `DATABASE_URL`. |
| TLS/cert error connecting to Neon | Keep `sslmode=verify-full&channel_binding=require` in `DATABASE_URL`; the runtime configures `ssl.rejectUnauthorized: true` to match. |

---

## 8. Local Development

```bash
pnpm install
# packages/db/.env      -> DATABASE_URL (Neon)
# apps/*/.env(.local)   -> copy from each .env.example (optional; sensible dev defaults exist)
pnpm dev
```

Without any env vars, the frontend falls back to `http://localhost:3001` / `ws://localhost:8080`, the backends bind `3001` / `8080`, and `JWT_SECRET` uses an insecure dev fallback (a warning is logged). These fallbacks are **development-only** — production requires the variables above.
