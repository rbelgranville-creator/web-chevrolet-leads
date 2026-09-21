# Plan Chevrolet — Captación de leads

Webapp rápida para captar leads de Plan Chevrolet, con panel admin.

## Requisitos

- Node.js 20+
- npm

**No hace falta MongoDB.** La base es **SQLite** (archivo local en `data/app.db`).

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
| `npm run scrape:plans` | Planes/fotos + upsert SQLite |
| `npm run seed:admin` | Crea/actualiza admin |

## Deploy (DigitalOcean App Platform)

Sin Docker (buildpack Node).  
Build: `npm run build` · Start: `npm start`.

**Nota:** SQLite vive en un archivo. En App Platform el filesystem puede ser efímero: para producción real conviene un volumen persistente o migrar después a una DB gestionada. Para desarrollo local, SQLite alcanza.

## Branding

Ver [`DESIGN.md`](./DESIGN.md) y [`AGENTS.md`](./AGENTS.md).
