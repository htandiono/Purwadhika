import { Request, Response } from 'express';
import prisma from '../prisma';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
        comments: true,
        _count: { select: { likes: true } },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        comments: { include: { author: { select: { name: true } } } },
        likes: { include: { user: { select: { name: true } } } },
        _count: { select: { likes: true } },
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, imageUrl } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        text,
        imageUrl,
        authorId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { text, imageUrl } = req.body;
    const userId = req.user?.userId;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'You are not authorized to update this post' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { text, imageUrl },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const { text } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId,
        authorId,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      res.json({ message: 'Like removed' });
    } else {
      const newLike = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      res.status(201).json({ message: 'Post liked', like: newLike });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
