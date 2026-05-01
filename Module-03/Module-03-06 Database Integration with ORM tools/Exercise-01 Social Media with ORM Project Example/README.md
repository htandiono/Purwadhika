# Social Media RESTful API

A complete RESTful API for a social media application built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## 🛠 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL

## 🚀 Setup Instructions for Examiner

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Database Configuration:**
   Create a `.env` file in the root directory. You can use the provided `.env.example` as a template.
   ```bash
   cp .env.example .env
   ```
   **Important:** Update the `DATABASE_URL` in your `.env` file to match your local PostgreSQL credentials. 

   Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public`

   *Note: If your postgres user does not have a password, omit the `:PASSWORD` part entirely (e.g., `postgresql://postgres@localhost:5432/socialmedia?schema=public`). Our Prisma client configuration dynamically adapts to whether a password is provided or not.*

3. **Run Database Migrations:**
   This will automatically create the `socialmedia` database and all required tables (`User`, `Post`, `Comment`, `Like`).
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   npx ts-node src/index.ts
   ```
   The server will start on `http://localhost:3000`.

---

## 📚 API Documentation

Base URL: `http://localhost:3000`

### Authentication

**1. Register a new user**
Create a new user account. Passwords are automatically hashed.
- **Method:** `POST /api/auth/register`
- **Example cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Hendrik Tandiono","email":"hendrik@example.com","password":"password123"}'
```

**2. Login**
Authenticate and receive a JWT token.
- **Method:** `POST /api/auth/login`
- **Example cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"hendrik@example.com","password":"password123"}'
```

---

### Users

**3. Get all users**
Fetch a list of all registered users (passwords excluded).
- **Method:** `GET /api/users`
- **Example cURL:**
```bash
curl -X GET http://localhost:3000/api/users
```

**4. Get a user by ID**
Fetch details of a specific user.
- **Method:** `GET /api/users/:id`

**5. Update user**
Update your own user profile. **Requires Authentication**.
- **Method:** `PUT /api/users/:id`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/users/USER_UUID_HERE \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"name":"Hendrik Tandiono (Updated)"}'
```

**6. Get user's posts**
Fetch all posts authored by a specific user.
- **Method:** `GET /api/users/:id/posts`

---

### Posts

**7. Get all posts**
Fetch a feed of all posts, including comments, authors, and like counts.
- **Method:** `GET /api/posts`

**8. Get a post by ID**
Fetch a specific post with its full comment tree and likes.
- **Method:** `GET /api/posts/:id`

**9. Create a post**
Create a new post. **Requires Authentication**.
- **Method:** `POST /api/posts`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Example cURL:**
```bash
curl -X POST http://localhost:3000/api/posts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"text":"Hello from Hendrik! This is my first post.","imageUrl":""}'
```

**10. Update a post**
Edit your own post. **Requires Authentication**.
- **Method:** `PUT /api/posts/:id`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/posts/POST_UUID_HERE \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"text":"Updated text for Hendrik'"'"'s post!"}'
```

---

### Interactions (Comments & Likes)

**11. Add a Comment**
Comment on a specific post. **Requires Authentication**.
- **Method:** `POST /api/posts/:id/comments`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Example cURL:**
```bash
curl -X POST http://localhost:3000/api/posts/POST_UUID_HERE/comments \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"text":"Great post, Hendrik!"}'
```

**12. Toggle a Like**
Like (or unlike if already liked) a post. **Requires Authentication**.
- **Method:** `POST /api/posts/:id/likes`
- **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
- **Example cURL:**
```bash
curl -X POST http://localhost:3000/api/posts/POST_UUID_HERE/likes \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```
