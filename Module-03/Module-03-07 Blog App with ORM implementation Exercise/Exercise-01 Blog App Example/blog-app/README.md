# Blog App

A full-stack Blog App built with Express, Prisma, PostgreSQL, TypeScript, React, Vite, React Router DOM, Axios, JWT authentication, and bcrypt.

The project includes users, blog posts, likes, and comments, while keeping the main concept as a Blog App.

## Local URLs

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API base URL: http://localhost:3000/api

## Project Structure

```txt
blog-app/
  backend/
    src/
      app.ts
      server.ts
      config/
      controllers/
      middleware/
      routes/
      types/
      utils/
    prisma/
      schema.prisma
    .env
    .env.example
    package.json
    tsconfig.json

  frontend/
    src/
      main.tsx
      App.tsx
      api/
      components/
      context/
      pages/
      styles/
    .env
    .env.example
    package.json
    tsconfig.json
    vite.config.ts
```

## Database Setup

Create the PostgreSQL database manually before running Prisma migrations:

```sql
CREATE DATABASE blog;
```

The backend uses this connection string:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/blog?schema=public"
```

This matches:

- Host: `localhost`
- Port: `5432`
- Database: `blog`
- User: `postgres`
- Password: empty password

## Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend `.env`:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/blog?schema=public"
PORT=3000
JWT_SECRET="replace_this_with_a_secure_secret"
FRONTEND_URL="http://localhost:5173"
```

Useful backend scripts:

```bash
npm run dev
npm run build
npm start
npm run prisma:migrate
npm run prisma:generate
npm run prisma:studio
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend `.env`:

```env
VITE_API_URL="http://localhost:3000/api"
```

## How The Frontend Connects To The Backend

The frontend uses an Axios instance in `frontend/src/api/api.ts`.

- `VITE_API_URL` points Axios to `http://localhost:3000/api`.
- When a user logs in, the JWT token and user data are stored in `localStorage`.
- The Axios request interceptor reads `blogToken` from `localStorage`.
- Protected requests automatically send `Authorization: Bearer <token>`.
- Backend protected routes verify the token with `authMiddleware`.

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication Endpoints

### Register

`POST /api/auth/register`

Public route.

Request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}
```

Returns created user data without password.

### Login

`POST /api/auth/login`

Public route.

Request body:

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

Returns a JWT token and user data without password.

## User Endpoints

### Get Users

`GET /api/users`

Public route. Returns all users without passwords.

### Get User By ID

`GET /api/users/:id`

Public route. Returns one user without password.

### Update User

`PUT /api/users/:id`

Protected route. Only the authenticated owner can update their own profile.

Request body:

```json
{
  "name": "Ada Byron",
  "email": "ada.byron@example.com"
}
```

### Get Posts By User

`GET /api/users/:id/posts`

Public route. Returns posts from one user, newest first, with author data, like count, and comment count.

## Post Endpoints

### Get Posts

`GET /api/posts`

Public route. Returns all blog posts, newest first, with author data, like count, and comment count.

### Get Post By ID

`GET /api/posts/:id`

Public route. Returns post details with author, comments, comment authors, like count, comment count, and like user IDs for the detail page.

### Create Post

`POST /api/posts`

Protected route.

Request body:

```json
{
  "content": "Today I learned how Prisma relations work.",
  "imageUrl": "https://example.com/blog-image.jpg"
}
```

`imageUrl` is optional.

### Update Post

`PUT /api/posts/:id`

Protected route. Only the post author can update the post.

Request body:

```json
{
  "content": "Updated blog post content.",
  "imageUrl": "https://example.com/updated-image.jpg"
}
```

### Delete Post

`DELETE /api/posts/:id`

Protected route. Only the post author can delete the post. Related comments and likes are deleted safely by Prisma relation rules.

### Like Post

`POST /api/posts/:id/like`

Protected route. A user can like the same post only once.

### Unlike Post

`DELETE /api/posts/:id/like`

Protected route. Removes the authenticated user's like from the post.

### Add Comment To Post

`POST /api/posts/:id/comments`

Protected route.

Request body:

```json
{
  "content": "This post helped me understand the flow."
}
```

### Get Post Comments

`GET /api/posts/:id/comments`

Public route. Returns comments for a post, oldest first, including comment author data.

## Comment Endpoints

### Delete Comment

`DELETE /api/comments/:id`

Protected route. Only the comment owner can delete their own comment.

## Database Schema Explanation

### User

Stores registered users.

- `email` is unique.
- `password` stores the bcrypt hash.
- A user can have many posts, comments, and likes.
- API responses never return the password.

### Post

Stores blog posts.

- Each post belongs to one user through `authorId`.
- `imageUrl` is optional.
- Deleting a post cascades to its comments and likes.

### Comment

Stores comments on blog posts.

- Each comment belongs to one post.
- Each comment belongs to one user.
- Comments are deleted automatically when their post is deleted.

### Like

Stores post likes.

- Each like belongs to one post.
- Each like belongs to one user.
- `@@unique([postId, userId])` prevents one user from liking the same post more than once.
- Likes are deleted automatically when their post is deleted.

## Suggested Manual Test Flow

1. Register a new user.
2. Login with that user.
3. Create a blog post.
4. Open the post detail page.
5. Like the post.
6. Add a comment.
7. Edit the post.
8. Delete your own comment.
9. Delete your own post.

## Notes For Learning

- `backend/src/app.ts` configures Express, CORS, JSON parsing, and route mounting.
- `backend/src/server.ts` starts the API server.
- `backend/src/middleware/authMiddleware.ts` protects routes by verifying JWT tokens.
- `backend/src/controllers/*` contains the request logic.
- `frontend/src/context/AuthContext.tsx` keeps login state available across the React app.
- `frontend/src/components/ProtectedRoute.tsx` guards private pages.
- `frontend/src/api/*` keeps API calls reusable and separate from UI components.
