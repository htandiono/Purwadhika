import { Router } from "express";
import { deleteComment } from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.delete("/:id", authMiddleware, deleteComment);

export default router;
