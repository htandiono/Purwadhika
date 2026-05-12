import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { sendError, sendSuccess } from "./utils/response";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  sendSuccess(res, 200, "Blog App API is running");
});

app.get("/api", (req, res) => {
  sendSuccess(res, 200, "Blog App API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use((req, res) => {
  sendError(res, 404, "Route not found");
});

app.use(errorMiddleware);

export default app;
