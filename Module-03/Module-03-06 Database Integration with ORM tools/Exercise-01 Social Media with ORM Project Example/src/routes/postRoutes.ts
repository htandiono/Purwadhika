import { Router } from 'express';
import { getPosts, getPostById, createPost, updatePost, addComment, toggleLike } from '../controllers/postController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);

// Interactions
router.post('/:id/comments', authenticateToken, addComment);
router.post('/:id/likes', authenticateToken, toggleLike);

export default router;
