import cors from "cors";
import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import { prisma } from "./prisma.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = new Set([frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "User Management API"
  });
});

app.use("/users", userRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Internal server error"
  });
};

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
