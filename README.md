# Plan Chevrolet — Captación de leads

Webapp rápida para captar leads de Plan Chevrolet, con panel admin.

## Requisitos

- Node.js 20+
- npm

**No hace falta MongoDB.** La base es **SQLite** vía `@libsql/client` (archivo local en desarrollo; **Turso** en Vercel).

## Setup

```bash
npm install
cp .env.example .env.local
```

Editá `.env.local`:

```env
DATABASE_PATH=./data/app.db
AUTH_SECRET=genera-un-secreto-largo
NEXTAUTH_SECRET=genera-un-secreto-largo
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=cambia-esto
ADMIN_NAME=Admin
```

Creá el admin y cargá los planes:

```bash
npm run seed:admin
npm run scrape:plans
npm run dev
```

## Tests

```bash
npm test          # Vitest (unit + integración)
npm run test:e2e  # Playwright e2e
npm run test:all  # ambos
```

- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin (con el email/password del `.env.local`)

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` / `npm start` | Producción |
| `npm run scrape:plans` | Planes/fotos + upsert SQLite/Turso |
| `npm run seed:admin` | Crea/actualiza admin |

## Deploy (Vercel + Turso)

1. Creá una base en [Turso](https://turso.tech) y copiá `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
2. En Vercel, importá el repo GitHub `web-chevrolet-leads`.
3. Branch de producción: **`main`**. Previews: **`dev`** (y otras ramas).
4. Environment Variables (Production + Preview):

| Variable | Valor |
|----------|--------|
| `TURSO_DATABASE_URL` | URL de Turso |
| `TURSO_AUTH_TOKEN` | Token de Turso |
| `AUTH_SECRET` | Secreto largo (mismo que `NEXTAUTH_SECRET`) |
| `NEXTAUTH_SECRET` | Igual que `AUTH_SECRET` |
| `NEXTAUTH_URL` | URL del deployment (p.ej. `https://….vercel.app`) |

5. Tras el primer deploy, corré seed/scrape apuntando a Turso (con esas vars en el entorno) o insertá datos desde local con `TURSO_*` en `.env.local`.

Framework preset: Next.js. Build: `npm run build`.

## Branding

Ver [`DESIGN.md`](./DESIGN.md) y [`AGENTS.md`](./AGENTS.md).
