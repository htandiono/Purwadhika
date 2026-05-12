import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import prisma from "../config/prisma";
import { formatPostWithCounts } from "../utils/formatters";
import { sendError, sendSuccess } from "../utils/response";
import { publicUserSelect } from "../utils/selects";

function normalizeOptionalImageUrl(imageUrl: unknown): string | null {
  if (imageUrl === undefined || imageUrl === null) {
    return null;
  }

  const trimmedImageUrl = String(imageUrl).trim();
  return trimmedImageUrl || null;
}

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const search = req.query.search as string | undefined;

    const whereClause: Prisma.PostWhereInput = {
      ...(req.user
        ? {
            OR: [{ isPublished: true }, { authorId: req.user.id }]
          }
        : { isPublished: true })
    };

    if (search) {
      whereClause.content = { contains: search, mode: "insensitive" };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: publicUserSelect },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    sendSuccess(
      res,
      200,
      "Posts retrieved successfully",
      posts.map(formatPostWithCounts)
    );
  } catch (error) {
    next(error);
  }
};

export const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: publicUserSelect },
        comments: {
          include: {
            author: { select: publicUserSelect }
          },
          orderBy: { createdAt: "asc" }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (!post.isPublished && req.user?.id !== post.authorId) {
      sendError(res, 404, "Post not found");
      return;
    }

    sendSuccess(res, 200, "Post retrieved successfully", formatPostWithCounts(post));
  } catch (error) {
    next(error);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const { content, imageUrl, isPublished } = req.body;
    const trimmedContent = content ? String(content).trim() : "";

    if (!trimmedContent) {
      sendError(res, 400, "Post content is required");
      return;
    }

    const post = await prisma.post.create({
      data: {
        content: trimmedContent,
        imageUrl: normalizeOptionalImageUrl(imageUrl),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        authorId: req.user.id
      },
      include: {
        author: { select: publicUserSelect },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    sendSuccess(res, 201, "Post created successfully", formatPostWithCounts(post));
  } catch (error) {
    next(error);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      sendError(res, 403, "You can only update your own posts");
      return;
    }

    const { content, imageUrl, isPublished } = req.body;
    const trimmedContent = content ? String(content).trim() : "";

    if (!trimmedContent) {
      sendError(res, 400, "Post content is required");
      return;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        content: trimmedContent,
        imageUrl: normalizeOptionalImageUrl(imageUrl),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) })
      },
      include: {
        author: { select: publicUserSelect },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    sendSuccess(res, 200, "Post updated successfully", formatPostWithCounts(post));
  } catch (error) {
    next(error);
  }
};

export const publishPost: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      sendError(res, 403, "You can only update your own posts");
      return;
    }

    const { isPublished } = req.body;

    if (isPublished === undefined) {
      sendError(res, 400, "isPublished status is required");
      return;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        isPublished: Boolean(isPublished)
      },
      include: {
        author: { select: publicUserSelect },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    sendSuccess(res, 200, "Post publish status updated successfully", formatPostWithCounts(post));
  } catch (error) {
    next(error);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      sendError(res, 403, "You can only delete your own posts");
      return;
    }

    await prisma.post.delete({
      where: { id }
    });

    sendSuccess(res, 200, "Post deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};

export const likePost: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (!post.isPublished && req.user?.id !== post.authorId) {
      sendError(res, 404, "Post not found");
      return;
    }

    try {
      await prisma.like.create({
        data: {
          postId: id,
          userId: req.user.id
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const likeCount = await prisma.like.count({
          where: { postId: id }
        });

        sendError(res, 400, `You already liked this post. Current like count: ${likeCount}`);
        return;
      }

      throw error;
    }

    const likeCount = await prisma.like.count({
      where: { postId: id }
    });

    sendSuccess(res, 200, "Post liked successfully", { likeCount });
  } catch (error) {
    next(error);
  }
};

export const unlikePost: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (!post.isPublished && req.user?.id !== post.authorId) {
      sendError(res, 404, "Post not found");
      return;
    }

    await prisma.like.deleteMany({
      where: {
        postId: id,
        userId: req.user.id
      }
    });

    const likeCount = await prisma.like.count({
      where: { postId: id }
    });

    sendSuccess(res, 200, "Post unliked successfully", { likeCount });
  } catch (error) {
    next(error);
  }
};

export const createPostComment: RequestHandler = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const { content } = req.body;
    const trimmedContent = content ? String(content).trim() : "";

    if (!trimmedContent) {
      sendError(res, 400, "Comment content is required");
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (!post.isPublished && req.user?.id !== post.authorId) {
      sendError(res, 404, "Post not found");
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        postId,
        authorId: req.user.id
      },
      include: {
        author: { select: publicUserSelect }
      }
    });

    sendSuccess(res, 201, "Comment added successfully", comment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments: RequestHandler = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      sendError(res, 400, "Invalid post ID");
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      sendError(res, 404, "Post not found");
      return;
    }

    if (!post.isPublished && req.user?.id !== post.authorId) {
      sendError(res, 404, "Post not found");
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: publicUserSelect }
      },
      orderBy: { createdAt: "asc" }
    });

    sendSuccess(res, 200, "Comments retrieved successfully", comments);
  } catch (error) {
    next(error);
  }
};
