# Product Management Dashboard Implementation Plan

## 1. Project Goal

Build a full-stack Product Management Dashboard from scratch using a monorepo structure:

- `server`: Express.js backend written in TypeScript.
- `client`: Vite React frontend written in TypeScript.
- PostgreSQL database managed locally through DBngin.
- Prisma ORM for database schema, migrations, and typed database access.
- REST API for product CRUD operations and local user authentication.
- Tailwind CSS for frontend styling.

The first version should support:

- Registering and logging in local users.
- Hashing user passwords before storage.
- Protecting product management routes behind authentication.
- Viewing products in a dashboard data table.
- Creating, editing, deleting, and changing product status.
- Keeping the architecture ready for future role-based access control such as `admin`, `manager`, and `viewer`.

---

## 2. Recommended Monorepo Structure

```txt
product-management-dashboard/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── api/
│       │   ├── http.ts
│       │   ├── authApi.ts
│       │   └── productsApi.ts
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AppLayout.tsx
│       │   │   ├── Header.tsx
│       │   │   └── Sidebar.tsx
│       │   ├── products/
│       │   │   ├── ProductTable.tsx
│       │   │   ├── ProductForm.tsx
│       │   │   ├── ProductModal.tsx
│       │   │   ├── ProductStatusBadge.tsx
│       │   │   └── DeleteProductDialog.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Select.tsx
│       │       ├── Modal.tsx
│       │       └── Alert.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useProducts.ts
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   └── NotFoundPage.tsx
│       ├── routes/
│       │   ├── AppRouter.tsx
│       │   └── ProtectedRoute.tsx
│       ├── types/
│       │   ├── auth.ts
│       │   └── product.ts
│       └── utils/
│           ├── currency.ts
│           └── validation.ts
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   └── env.ts
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── product.controller.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── error.middleware.ts
│       │   ├── notFound.middleware.ts
│       │   └── validate.middleware.ts
│       ├── prisma/
│       │   └── client.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── product.routes.ts
│       │   └── index.ts
│       ├── services/
│       │   ├── auth.service.ts
│       │   └── product.service.ts
│       ├── types/
│       │   ├── express.d.ts
│       │   └── response.ts
│       ├── utils/
│       │   ├── apiError.ts
│       │   ├── asyncHandler.ts
│       │   ├── jwt.ts
│       │   └── password.ts
│       └── validations/
│           ├── auth.validation.ts
│           └── product.validation.ts
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── plan.md
```

---

## 3. Root-Level Setup

Use npm workspaces to manage the frontend and backend from the repository root.

### Root `package.json`

```json
{
  "name": "product-management-dashboard",
  "private": true,
  "workspaces": ["server", "client"],
  "scripts": {
    "dev": "npm run dev --workspace server & npm run dev --workspace client",
    "dev:server": "npm run dev --workspace server",
    "dev:client": "npm run dev --workspace client",
    "build": "npm run build --workspace server && npm run build --workspace client",
    "lint": "npm run lint --workspace server && npm run lint --workspace client"
  }
}
```

### Root `.gitignore`

```txt
node_modules
dist
build
.env
.env.local
*.log
.DS_Store
server/prisma/migrations/*/migration_lock.toml
```

### Root `.env.example`

Keep a root-level example file that documents required backend and frontend environment variables.

```txt
# Server
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_management_dashboard?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
CLIENT_ORIGIN="http://localhost:5173"

# Client
VITE_API_URL="http://localhost:4000/api"
```

Each app can keep its own `.env` file:

- `server/.env` for backend secrets and database connection.
- `client/.env` for frontend public environment variables prefixed with `VITE_`.

---

## 4. Local PostgreSQL Setup With DBngin

PostgreSQL will run locally and be managed using DBngin.

### Steps

1. Open DBngin.
2. Create a new PostgreSQL server.
3. Recommended local settings:
   - Version: PostgreSQL 14, 15, or 16.
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
4. Start the PostgreSQL server in DBngin.
5. Create a database named:

```txt
product_management_dashboard
```

6. Configure the backend database connection in `server/.env`:

```txt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_management_dashboard?schema=public"
```

If DBngin uses a different port or password, update the connection string:

```txt
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:<PORT>/<DATABASE_NAME>?schema=public"
```

Example:

```txt
DATABASE_URL="postgresql://postgres:mysecret@localhost:5433/product_management_dashboard?schema=public"
```

### Verifying the Connection

After Prisma is installed and configured, verify the database connection with:

```bash
npx prisma db pull
```

For a new application, the more typical flow is:

```bash
npx prisma migrate dev --name init
```

---

## 5. Backend Architecture

## 5.1 Backend Responsibilities

The backend should handle:

- User registration and login.
- Password hashing and password comparison.
- JWT creation and authentication middleware.
- Product CRUD operations.
- Validation of request bodies and params.
- Consistent API response formatting.
- Centralized error handling.
- Prisma database access.

## 5.2 Backend Dependencies

Install backend dependencies:

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv @prisma/client bcrypt jsonwebtoken zod
npm install -D typescript ts-node-dev prisma @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken
```

Initialize TypeScript:

```bash
npx tsc --init
```

Initialize Prisma:

```bash
npx prisma init
```

Recommended backend scripts:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

## 5.3 Express App Setup

Use two entry files:

- `src/app.ts`: creates and configures the Express app.
- `src/server.ts`: starts the HTTP server.

`src/app.ts` should configure:

- `express.json()`
- CORS using `CLIENT_ORIGIN`
- API routes mounted under `/api`
- Not found middleware
- Error middleware

`src/server.ts` should:

- Load environment variables.
- Read `PORT`.
- Call `app.listen`.
- Log the local API URL.

## 5.4 Environment Configuration

Create `server/src/config/env.ts`:

- Load `dotenv`.
- Validate required variables.
- Export typed config values.

Required backend environment variables:

```txt
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_management_dashboard?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
CLIENT_ORIGIN="http://localhost:5173"
```

Use `zod` to validate environment configuration so the server fails fast when a required variable is missing.

---

## 6. Prisma Data Model

Create the schema in `server/prisma/schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductStatus {
  ACTIVE
  DRAFT
  OUT_OF_STOCK
  ARCHIVED
}

enum UserRole {
  USER
  ADMIN
  MANAGER
  VIEWER
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id        String        @id @default(uuid())
  name      String
  sku       String        @unique
  category  String
  price     Decimal       @db.Decimal(10, 2)
  stock     Int
  status    ProductStatus @default(ACTIVE)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([category])
  @@index([status])
}
```

### Model Notes

- `id`: UUID string for both users and products.
- `email`: unique login identifier.
- `password`: hashed password only. Never store plain text passwords.
- `role`: included now with a default single access level. Version 1 can treat every authenticated user the same, while the field allows later authorization rules.
- `sku`: unique product stock keeping unit.
- `price`: use `Decimal` instead of floating point to avoid money precision issues.
- `status`: enum for predictable product status handling.
- `createdAt` and `updatedAt`: useful for sorting, auditing, and future reporting.

Run the initial migration:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

Optional: open Prisma Studio to inspect the local database:

```bash
npx prisma studio
```

---

## 7. Backend API Design

## 7.1 API Base URL

```txt
http://localhost:4000/api
```

## 7.2 API Response Convention

Use a consistent response shape.

Success response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

List response:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than or equal to 0"
    }
  ]
}
```

## 7.3 Product Endpoints

All product endpoints should require authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products` | Read all products |
| `GET` | `/api/products/:id` | Read a single product |
| `PATCH` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

### Create Product

`POST /api/products`

Request body:

```json
{
  "name": "Wireless Keyboard",
  "sku": "KB-001",
  "category": "Accessories",
  "price": 49.99,
  "stock": 120,
  "status": "ACTIVE"
}
```

Validation:

- `name`: required string, minimum 2 characters.
- `sku`: required string, unique.
- `category`: required string.
- `price`: required number, greater than or equal to 0.
- `stock`: required integer, greater than or equal to 0.
- `status`: optional enum, one of `ACTIVE`, `DRAFT`, `OUT_OF_STOCK`, `ARCHIVED`.

Behavior:

- Create the product through Prisma.
- Return HTTP `201`.
- If SKU already exists, return HTTP `409`.

### Read All Products

`GET /api/products`

Recommended query params:

```txt
?search=keyboard&category=Accessories&status=ACTIVE&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

Behavior:

- Return a paginated list.
- Support search by `name` and `sku`.
- Support filtering by `category` and `status`.
- Support sorting by safe known fields only.

### Read Single Product

`GET /api/products/:id`

Behavior:

- Return one product by ID.
- If not found, return HTTP `404`.

### Update Product

`PATCH /api/products/:id`

Request body can include any editable product fields:

```json
{
  "name": "Wireless Keyboard Pro",
  "price": 59.99,
  "stock": 80,
  "status": "ACTIVE"
}
```

Behavior:

- Validate only provided fields.
- Prevent duplicate SKU.
- Return the updated product.
- If not found, return HTTP `404`.

### Delete Product

`DELETE /api/products/:id`

Behavior:

- Delete the product by ID.
- Return HTTP `200` with a confirmation message or HTTP `204` with no body.
- If not found, return HTTP `404`.

## 7.4 Authentication Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a local user |
| `POST` | `/api/auth/login` | Log in and receive a token |
| `GET` | `/api/auth/me` | Get the current authenticated user |

### Register

`POST /api/auth/register`

Request body:

```json
{
  "email": "user@example.com",
  "name": "Product Manager",
  "password": "password123"
}
```

Behavior:

- Validate email, name, and password.
- Check whether the email already exists.
- Hash password with `bcrypt`.
- Store the user in PostgreSQL.
- Return user data without the password.
- Optionally return a JWT so the user is logged in immediately after registration.

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Behavior:

- Find user by email.
- Compare password using `bcrypt.compare`.
- Return JWT and safe user data if valid.
- Return HTTP `401` for invalid credentials.

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Product Manager",
      "role": "USER"
    }
  }
}
```

### Current User

`GET /api/auth/me`

Behavior:

- Requires `Authorization: Bearer <token>`.
- Returns the currently authenticated user.
- Never returns the password field.

---

## 8. Backend Implementation Details

## 8.1 Prisma Client

Create `server/src/prisma/client.ts`:

- Instantiate `PrismaClient`.
- Export a single shared client.
- In development, avoid creating too many Prisma clients during hot reload if needed.

## 8.2 Validation

Use `zod` schemas.

Product validation:

- `createProductSchema`
- `updateProductSchema`
- `productIdParamSchema`
- `productQuerySchema`

Auth validation:

- `registerSchema`
- `loginSchema`

Use a generic `validate` middleware:

- Validate `req.body`, `req.params`, and `req.query`.
- Return HTTP `400` for invalid input.
- Pass parsed data forward when possible.

## 8.3 Controllers

Controllers should only handle HTTP concerns:

- Read request data.
- Call services.
- Set response status.
- Return response body.

Example controller methods:

- `createProduct`
- `getProducts`
- `getProductById`
- `updateProduct`
- `deleteProduct`
- `register`
- `login`
- `getCurrentUser`

## 8.4 Services

Services should hold business logic and Prisma calls:

- Check duplicate SKUs.
- Normalize product status.
- Hash passwords.
- Compare passwords.
- Generate JWTs.
- Exclude sensitive user fields from responses.

This separation makes controllers easier to test and keeps database logic out of route handlers.

## 8.5 Authentication Middleware

`auth.middleware.ts` should:

- Read the `Authorization` header.
- Expect `Bearer <token>`.
- Verify the JWT using `JWT_SECRET`.
- Load the user from the database.
- Attach safe user data to `req.user`.
- Return HTTP `401` when the token is missing, invalid, or expired.

Create `types/express.d.ts` to extend Express request typing:

```ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}
```

## 8.6 Role-Ready Authorization

Version 1 can use a single access level:

- Any authenticated user can manage products.

Prepare for future role-based access:

- Keep `role` in the `User` model.
- Store the role in JWT payload.
- Create an optional `requireRole(...roles)` middleware later.
- Keep route declarations structured so authorization middleware can be added easily.

Future examples:

```txt
ADMIN: full access, user management, delete products
MANAGER: create and update products
VIEWER: read-only dashboard access
```

## 8.7 Error Handling

Create an `ApiError` utility with:

- `statusCode`
- `message`
- optional `errors`

Use `asyncHandler` to avoid repetitive `try/catch` blocks in controllers.

Central error middleware should handle:

- Validation errors.
- Prisma unique constraint errors.
- Prisma record not found errors.
- JWT errors.
- Unexpected server errors.

Recommended status codes:

- `200`: successful read, update, delete confirmation.
- `201`: successful creation.
- `400`: validation error.
- `401`: unauthenticated.
- `403`: authenticated but unauthorized, for future role handling.
- `404`: resource not found.
- `409`: unique conflict, such as duplicate SKU or email.
- `500`: unexpected server error.

---

## 9. Frontend Architecture

## 9.1 Frontend Responsibilities

The frontend should handle:

- Login and registration screens.
- Token storage.
- Authenticated routing.
- Product list fetching.
- Product table rendering.
- Product creation modal.
- Product editing form or modal.
- Product deletion confirmation.
- Product status display and updates.
- Loading, empty, and error states.

## 9.2 Frontend Dependencies

Create the Vite React app:

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

Install routing and optional form helpers:

```bash
npm install react-router-dom
```

Install Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Optional recommended dependencies:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Use `react-hook-form` and `zod` if the forms become complex. For a smaller first version, local component state is acceptable.

## 9.3 Tailwind CSS Setup

`client/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
```

`client/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Styling approach:

- Use a clean dashboard layout with a sidebar, header, and main content area.
- Use Tailwind utility classes directly in components.
- Extract repeated UI patterns into small reusable components.
- Keep colors, spacing, and typography consistent.
- Use visible focus states for accessibility.
- Include clear loading, empty, and error states.

## 9.4 Frontend Routes

Recommended routes:

| Path | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Login screen |
| `/register` | Public | Registration screen |
| `/` | Protected | Dashboard redirect or product dashboard |
| `/products` | Protected | Product management dashboard |
| `*` | Public | Not found page |

## 9.5 Authenticated App Flow

1. User opens the app.
2. App checks local token storage.
3. If token exists, call `/api/auth/me`.
4. If token is valid, load protected dashboard.
5. If token is missing or invalid, redirect to `/login`.
6. Login submits credentials to `/api/auth/login`.
7. Backend returns JWT and safe user data.
8. Frontend stores token and user state.
9. Authenticated API calls include:

```txt
Authorization: Bearer <token>
```

Token storage options:

- Simple first version: `localStorage`.
- More secure future version: HTTP-only cookie based auth.

## 9.6 API Client

Create `client/src/api/http.ts`:

- Read `VITE_API_URL`.
- Build a small wrapper around `fetch`.
- Attach authorization token when available.
- Parse JSON responses.
- Throw meaningful errors for non-2xx responses.

Example API modules:

- `authApi.register(payload)`
- `authApi.login(payload)`
- `authApi.me()`
- `productsApi.list(query)`
- `productsApi.getById(id)`
- `productsApi.create(payload)`
- `productsApi.update(id, payload)`
- `productsApi.remove(id)`

## 9.7 Product Types

Create `client/src/types/product.ts`:

```ts
export type ProductStatus = "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormValues = {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};
```

Note: Prisma may serialize `Decimal` values as strings. The frontend should format price values intentionally.

## 9.8 Dashboard Layout

The dashboard should include:

- Sidebar with app name and navigation.
- Header with current user name and logout button.
- Main content area for product management.
- Product summary cards or compact stats, optional for version 1.
- Product table as the main working surface.

Suggested product page sections:

- Page title: `Products`
- Primary action: `Add Product`
- Filters:
  - search input
  - category filter
  - status filter
- Product table
- Pagination controls

## 9.9 Product Table

Columns:

- Product name
- SKU
- Category
- Price
- Stock
- Status
- Actions

Row actions:

- Edit
- Delete

Table states:

- Loading state while fetching products.
- Empty state when no products exist.
- Empty search state when filters return no matches.
- Error state when API call fails.

## 9.10 Add Product Modal

Fields:

- `name`
- `sku`
- `category`
- `price`
- `stock`
- `status`

Behavior:

- Open from the `Add Product` button.
- Validate required fields before submit.
- Submit to `POST /api/products`.
- Close modal on success.
- Refresh product list after success.
- Show backend validation errors when present.

## 9.11 Edit Product Form or Modal

Use the same `ProductForm` component as Add Product.

Behavior:

- Open from table row `Edit` action.
- Pre-fill existing product values.
- Submit to `PATCH /api/products/:id`.
- Close modal on success.
- Refresh product list after success.

## 9.12 Delete Product Capability

Use a confirmation dialog.

Behavior:

- Open from table row `Delete` action.
- Show product name or SKU in the confirmation message.
- Submit to `DELETE /api/products/:id`.
- Refresh product list after success.
- Show an error if deletion fails.

## 9.13 Product Status Handling

Recommended statuses:

- `ACTIVE`: visible and available.
- `DRAFT`: product record is incomplete or not ready.
- `OUT_OF_STOCK`: product has no available inventory.
- `ARCHIVED`: product is no longer actively managed.

Frontend status display:

- Use a `ProductStatusBadge` component.
- Map each status to a readable label and color.

Example:

```ts
const statusLabels = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  OUT_OF_STOCK: "Out of Stock",
  ARCHIVED: "Archived"
};
```

Status behavior:

- Allow manual status selection in add/edit forms.
- Optionally auto-suggest `OUT_OF_STOCK` when stock is `0`.
- Do not silently override user-selected status unless the product rules require it.

---

## 10. Step-by-Step Build Roadmap

## Phase 1: Initialize the Monorepo

1. Create the project root folder.
2. Create `server` and `client` folders.
3. Create root `package.json` with workspaces.
4. Add root `.gitignore`.
5. Add root `.env.example`.
6. Add a root `README.md` with setup and run instructions.

Commands:

```bash
mkdir product-management-dashboard
cd product-management-dashboard
npm init -y
mkdir server client
```

Then edit root `package.json` to enable workspaces.

## Phase 2: Create the Express TypeScript Server

1. Initialize `server/package.json`.
2. Install Express and backend dependencies.
3. Install TypeScript and type packages.
4. Configure `tsconfig.json`.
5. Create `src/app.ts`.
6. Create `src/server.ts`.
7. Add a health check route:

```txt
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is running"
}
```

Commands:

```bash
cd server
npm init -y
npm install express cors dotenv
npm install -D typescript ts-node-dev @types/node @types/express @types/cors
npx tsc --init
```

## Phase 3: Configure Local PostgreSQL With DBngin

1. Open DBngin.
2. Start a local PostgreSQL server.
3. Create the `product_management_dashboard` database.
4. Confirm the host, port, username, and password.
5. Add `server/.env`.

Example `server/.env`:

```txt
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_management_dashboard?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
CLIENT_ORIGIN="http://localhost:5173"
```

## Phase 4: Set Up Prisma

1. Install Prisma dependencies.
2. Run `npx prisma init`.
3. Configure `schema.prisma`.
4. Define `User`, `Product`, `ProductStatus`, and `UserRole`.
5. Run the first migration.
6. Generate Prisma Client.
7. Create `src/prisma/client.ts`.

Commands:

```bash
cd server
npm install @prisma/client
npm install -D prisma
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

## Phase 5: Build Backend Foundation

1. Add `config/env.ts`.
2. Add `utils/apiError.ts`.
3. Add `utils/asyncHandler.ts`.
4. Add `middleware/error.middleware.ts`.
5. Add `middleware/notFound.middleware.ts`.
6. Add `middleware/validate.middleware.ts`.
7. Add route registration in `routes/index.ts`.
8. Mount routes in `app.ts` under `/api`.

Test the health check:

```bash
npm run dev
```

Then open:

```txt
http://localhost:4000/api/health
```

## Phase 6: Build Product CRUD API

1. Create product validation schemas.
2. Create product service methods:
   - `createProduct`
   - `getProducts`
   - `getProductById`
   - `updateProduct`
   - `deleteProduct`
3. Create product controller methods.
4. Create product routes.
5. Add duplicate SKU handling.
6. Add pagination, search, status filtering, and category filtering.
7. Add API tests through Postman, Insomnia, curl, or an automated test runner.

Product route file:

```txt
server/src/routes/product.routes.ts
```

Routes:

```txt
POST   /products
GET    /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id
```

## Phase 7: Add Authentication

1. Install auth dependencies:

```bash
cd server
npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

2. Create password utilities:
   - `hashPassword`
   - `comparePassword`
3. Create JWT utilities:
   - `signAccessToken`
   - `verifyAccessToken`
4. Create auth validation schemas.
5. Create auth service:
   - `register`
   - `login`
   - `getCurrentUser`
6. Create auth controller.
7. Create auth routes.
8. Create `auth.middleware.ts`.
9. Protect product routes with auth middleware.
10. Verify that product routes reject unauthenticated requests.

Auth routes:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Phase 8: Create the Vite React Frontend

1. Create the Vite app.
2. Install dependencies.
3. Configure Tailwind.
4. Set up routing.
5. Create the base dashboard layout.
6. Create login and registration pages.
7. Create protected route handling.

Commands:

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Client `.env`:

```txt
VITE_API_URL="http://localhost:4000/api"
```

## Phase 9: Build Frontend Auth Flow

1. Create `AuthContext`.
2. Store token and user state.
3. Implement login API call.
4. Implement registration API call.
5. Implement `/api/auth/me` session restore.
6. Add logout behavior.
7. Redirect unauthenticated users to `/login`.
8. Redirect authenticated users away from `/login` and `/register`.

Minimum auth state:

```ts
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
```

## Phase 10: Build Product Dashboard UI

1. Create `DashboardPage`.
2. Create `ProductTable`.
3. Create `ProductStatusBadge`.
4. Create `ProductForm`.
5. Create `ProductModal`.
6. Create `DeleteProductDialog`.
7. Fetch products from the backend.
8. Add search and filters.
9. Add pagination if supported by the backend.
10. Format prices consistently.

Recommended first dashboard interaction flow:

1. Load `/products`.
2. Fetch products.
3. Display table.
4. Click `Add Product`.
5. Submit form.
6. Refresh list.
7. Click `Edit`.
8. Submit changes.
9. Refresh list.
10. Click `Delete`.
11. Confirm deletion.
12. Refresh list.

## Phase 11: Connect Frontend to Backend APIs

1. Create `http.ts` fetch wrapper.
2. Add auth token to protected requests.
3. Implement `authApi.ts`.
4. Implement `productsApi.ts`.
5. Replace mocked frontend data with API calls.
6. Handle backend validation errors in forms.
7. Show user-friendly error messages.
8. Test with the backend running locally.

## Phase 12: Test Main Workflows

Manual test checklist:

- User can register.
- Password is stored hashed in the database.
- User can log in.
- Invalid login returns an error.
- Authenticated user can access dashboard.
- Unauthenticated user cannot access dashboard.
- User can create a product.
- Duplicate SKU returns a clear error.
- User can view product list.
- User can search/filter products.
- User can view a single product if a detail screen is added.
- User can edit product fields.
- User can change product status.
- User can delete product.
- UI handles loading states.
- UI handles empty states.
- UI handles server errors.
- Refreshing the page keeps the session if token is valid.
- Logout clears local auth state.

Recommended API test examples:

```bash
curl http://localhost:4000/api/health
```

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"Product Manager","password":"password123"}'
```

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

```bash
curl -X GET http://localhost:4000/api/products \
  -H "Authorization: Bearer <TOKEN>"
```

## Phase 13: Run the Full Application Locally

Start PostgreSQL in DBngin first.

Run backend:

```bash
cd server
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

Expected local URLs:

```txt
Backend API: http://localhost:4000/api
Frontend:    http://localhost:5173
```

If using root workspace scripts:

```bash
npm run dev:server
npm run dev:client
```

Or run both from the root if the combined script is configured:

```bash
npm run dev
```

---

## 11. Suggested Development Order

Build in this order to reduce integration risk:

1. Monorepo setup.
2. Express health check.
3. DBngin PostgreSQL database.
4. Prisma schema and migration.
5. Product CRUD service without auth.
6. Product CRUD routes and validation.
7. Auth schema and password hashing.
8. Login/register endpoints.
9. JWT auth middleware.
10. Protect product routes.
11. Vite React setup.
12. Tailwind setup.
13. Login/register UI.
14. Auth context and protected routes.
15. Product table with API data.
16. Add product modal.
17. Edit product modal.
18. Delete confirmation.
19. Search/filter/pagination.
20. Final manual testing and README updates.

---

## 12. Practical Notes and Decisions

## 12.1 Use `PATCH` for Updates

Use `PATCH /api/products/:id` instead of `PUT` so clients can send partial updates.

## 12.2 Keep Passwords Out of Responses

Never return the user `password` field from any API response. Use a helper function to strip it from user objects.

## 12.3 Keep JWT Payload Small

Recommended JWT payload:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "USER"
}
```

Use the database as the source of truth for user details.

## 12.4 Validate on Both Sides

- Backend validation is mandatory.
- Frontend validation improves user experience.
- Backend validation remains the source of truth.

## 12.5 Handle Prisma Decimal Values Carefully

PostgreSQL decimal values may arrive in the frontend as strings. Format them with a currency utility:

```ts
export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value));
}
```

## 12.6 Plan for Future Access Control

Do not overbuild role permissions in version 1. Add the database field and JWT payload now, then introduce route-level authorization later.

Future middleware:

```ts
requireRole("ADMIN", "MANAGER")
```

Future route example:

```txt
DELETE /api/products/:id -> ADMIN only
PATCH  /api/products/:id -> ADMIN or MANAGER
GET    /api/products     -> ADMIN, MANAGER, or VIEWER
```

---

## 13. Definition of Done

The first complete version is done when:

- The monorepo has working `server` and `client` apps.
- PostgreSQL runs locally through DBngin.
- Prisma migrations create the expected tables and enums.
- Users can register and log in.
- Passwords are hashed in the database.
- Authenticated API requests work with JWT.
- Product CRUD endpoints are implemented and protected.
- The frontend has login and registration screens.
- The dashboard is protected from unauthenticated users.
- The product table displays real backend data.
- Users can add, edit, delete, and update product status from the UI.
- Main workflows have been tested locally.
- Setup instructions and environment variables are documented.

