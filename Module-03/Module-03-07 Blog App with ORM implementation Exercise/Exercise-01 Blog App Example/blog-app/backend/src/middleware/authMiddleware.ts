import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendError } from "../utils/response";
import { publicUserSelect } from "../utils/selects";

type AuthTokenPayload = JwtPayload & {
  userId?: number;
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, 401, "Authentication token is required");
      return;
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      sendError(res, 500, "JWT secret is not configured");
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;

    if (!decoded.userId) {
      sendError(res, 401, "Invalid authentication token");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
      select: publicUserSelect
    });

    if (!user) {
      sendError(res, 401, "Authenticated user no longer exists");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 401, "Invalid or expired authentication token");
  }
}

export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;

    if (!decoded.userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
      select: publicUserSelect
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
}
