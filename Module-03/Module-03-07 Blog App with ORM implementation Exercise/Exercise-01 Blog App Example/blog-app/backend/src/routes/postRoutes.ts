import { Router } from "express";
import {
  createPost,
  createPostComment,
  deletePost,
  getPostById,
  getPostComments,
  getPosts,
  likePost,
  unlikePost,
  updatePost,
  publishPost
} from "../controllers/postController";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", optionalAuthMiddleware, getPosts);
router.get("/:id", optionalAuthMiddleware, getPostById);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/publish", authMiddleware, publishPost);
router.post("/:id/like", authMiddleware, likePost);
router.delete("/:id/like", authMiddleware, unlikePost);
router.post("/:id/comments", authMiddleware, createPostComment);
router.get("/:id/comments", optionalAuthMiddleware, getPostComments);

export default router;
