# AGENTS.md — Webapp leads Plan Chevrolet

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Reglas de trabajo

1. **Siempre planificá antes de meter código.**
2. **Stack según el producto:** landing SEO + form leads + admin liviano.
3. **Usá npm** y librerías conocidas.
4. **Nunca hardcodees secretos** — solo `.env.local` / Environment Variables de Vercel (y tokens de Turso).
5. UI: skill `frontend-design` + Tailwind.
6. Docs: skill `context7`.
7. Branding: [`DESIGN.md`](./DESIGN.md) manda sobre preferencias genéricas.
8. **Para end-to-end (e2e) testing usá el MCP de Playwright** (`cursor-ide-browser`) y, para la suite automatizada del repo, `@playwright/test`.
9. **Para tests unitarios y de integración usá Vitest.**
10. **Nunca des por terminada una tarea de producto/código sin antes correr los tests completos** (`npm test` y e2e cuando aplique). **Excepción:** cambios solo de documentación (`AGENTS.md`, `README.md`, `DESIGN.md`, etc.) no requieren correr la suite.
11. **Si aprendés algo importante sobre el proyecto, actualizá `AGENTS.md`** para mejorar el trabajo continuo (stack real, pitfalls, convenciones, flujos).
12. **Cuando cambies el producto o la manera de instalarlo/colaborar, actualizá `README.md`** con esos cambios.

## Stack fijado

- **Next.js** (App Router) + TypeScript + Tailwind + **npm**
- **SQLite vía `@libsql/client`**: archivo local (`DATABASE_PATH`, default `./data/app.db`) en desarrollo; **Turso** (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`) en Vercel
- **Auth.js (NextAuth)** credentials para `/admin`
- Runtime **Node** (nunca Edge) en rutas/DB
- Auth de `/admin` vía `proxy.ts` (Next.js 16; antes `middleware.ts`) + `auth.config.ts` (sin DB)
- **Deploy:** **Vercel** (GitHub). Producción = `main`; previews = `dev` y demás ramas. Sin DigitalOcean App Platform.

## Secretos (`.env.local` / Vercel)

| Variable | Uso |
|----------|-----|
| `DATABASE_PATH` | Archivo SQLite local (default `./data/app.db`); se ignora si hay Turso |
| `TURSO_DATABASE_URL` | URL libsql de Turso (prod / preview) |
| `TURSO_AUTH_TOKEN` | Token de Turso |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Mismo valor; firman la sesión admin |
| `NEXTAUTH_URL` | `http://localhost:3000` en local; URL de Vercel en prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales para `npm run seed:admin` |
| `ADMIN_NAME` | Nombre visible del admin |

## Modelo de datos (SQLite)

| Tabla | Campos clave |
|-------|----------------|
| `plans` | slug, name, tagline, price_from, features_json, image_path, active, sort_order |
| `leads` | full_name, email, plan_slug, plan_name, created_at, source |
| `admins` | email, password_hash, name |

## Flujos

1. Lead: form → `POST /api/leads` → SQLite
2. Admin: `/admin/login` → Auth.js → `/admin`
3. Contenido: `npm run scrape:plans` → `public/plans/` + upsert SQLite

## Comandos

```bash
npm run dev
npm run seed:admin
npm run scrape:plans
npm run build
npm test                 # Vitest unit + integración
npm run test:e2e         # Playwright e2e
npm run test:all         # Vitest + Playwright
```

## Testing

| Tipo | Herramienta | Ubicación |
|------|-------------|-----------|
| Unitario / integración | Vitest | `tests/unit`, `tests/integration` |
| E2E | Playwright (+ MCP `cursor-ide-browser` en el agente) | `tests/e2e` |

Antes de cerrar una tarea de **producto/código**: correr `npm run test:all` (o al menos `npm test` + e2e del flujo tocado). Cambios solo de docs no requieren la suite.
