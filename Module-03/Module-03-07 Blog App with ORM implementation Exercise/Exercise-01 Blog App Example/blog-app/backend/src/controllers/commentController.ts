import { RequestHandler } from "express";
import prisma from "../config/prisma";
import { sendError, sendSuccess } from "../utils/response";

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      sendError(res, 400, "Invalid comment ID");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Authentication is required");
      return;
    }

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      sendError(res, 404, "Comment not found");
      return;
    }

    if (comment.authorId !== req.user.id) {
      sendError(res, 403, "You can only delete your own comments");
      return;
    }

    await prisma.comment.delete({
      where: { id }
    });

    sendSuccess(res, 200, "Comment deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};
