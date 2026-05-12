import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import prisma from "../config/prisma";
import { formatPostWithCounts } from "../utils/formatters";
import { sendError, sendSuccess } from "../utils/response";
import { publicUserSelect } from "../utils/selects";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: "desc" }
    });

    sendSuccess(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid user ID");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: publicUserSelect
    });

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    sendSuccess(res, 200, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid user ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    if (req.user.id !== id) {
      sendError(res, 403, "You can only update your own profile");
      return;
    }

    const { name, email } = req.body;
    const data: { name?: string; email?: string } = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();

      if (!trimmedName) {
        sendError(res, 400, "Name cannot be empty");
        return;
      }

      data.name = trimmedName;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      if (!normalizedEmail) {
        sendError(res, 400, "Email cannot be empty");
        return;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser && existingUser.id !== id) {
        sendError(res, 400, "Email is already used by another account");
        return;
      }

      data.email = normalizedEmail;
    }

    if (Object.keys(data).length === 0) {
      sendError(res, 400, "Please provide name or email to update");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect
    });

    sendSuccess(res, 200, "Profile updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid user ID");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: publicUserSelect
    });

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    const whereClause: Prisma.PostWhereInput = {
      authorId: id,
      ...(req.user?.id === id ? {} : { isPublished: true })
    };

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
      "User posts retrieved successfully",
      posts.map(formatPostWithCounts)
    );
  } catch (error) {
    next(error);
  }
};
