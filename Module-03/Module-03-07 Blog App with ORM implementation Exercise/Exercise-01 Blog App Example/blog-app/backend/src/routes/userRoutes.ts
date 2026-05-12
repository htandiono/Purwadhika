import { Router } from "express";
import {
  getUserById,
  getUserPosts,
  getUsers,
  updateUser
} from "../controllers/userController";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.get("/:id/posts", optionalAuthMiddleware, getUserPosts);

export default router;
