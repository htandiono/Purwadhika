import { Router } from 'express';
import { getUsers, getUserById, updateUser, getUserPosts } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticateToken, updateUser);
router.get('/:id/posts', getUserPosts);

export default router;
