import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Current user retrieved successfully",
    data: user
  });
});
