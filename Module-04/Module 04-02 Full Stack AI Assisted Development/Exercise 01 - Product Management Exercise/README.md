# Product Management Dashboard

Full-stack Product Management Dashboard built with Express, TypeScript, Prisma, PostgreSQL, Vite, React, and Tailwind CSS.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL running locally through DBngin

## Local Setup

1. Start PostgreSQL in DBngin.
2. Create a database named `product_management_dashboard`.
3. Copy the environment values from `.env.example` into:
   - `server/.env`
   - `client/.env`
4. Update `DATABASE_URL` if your DBngin port, username, or password differs.
5. Install dependencies:

```bash
npm install
```

6. Run Prisma migration:

```bash
npm run prisma:migrate --workspace server
```

7. Start the backend and frontend:

```bash
npm run dev
```

Expected URLs:

- Backend API: `http://localhost:4000/api`
- Frontend: `http://localhost:5173`

## Main Scripts

```bash
npm run dev
npm run dev:server
npm run dev:client
npm run build
npm run typecheck
```

