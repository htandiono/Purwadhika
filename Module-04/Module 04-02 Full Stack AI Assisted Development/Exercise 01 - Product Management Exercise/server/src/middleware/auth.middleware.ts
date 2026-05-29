import { RequestHandler } from "express";
import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate: RequestHandler = asyncHandler(async (req, _res, next) => {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required");
  }

  const token = authorization.replace("Bearer ", "").trim();
  const payload = verifyAccessToken(token);

  if (!payload.sub) {
    throw new ApiError(401, "Invalid authentication token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub }
  });

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  next();
});
