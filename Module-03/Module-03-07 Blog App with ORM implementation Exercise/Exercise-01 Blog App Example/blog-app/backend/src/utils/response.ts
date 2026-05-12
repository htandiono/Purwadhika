import { Response } from "express";

export function sendSuccess(
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {})
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string
): void {
  res.status(statusCode).json({
    success: false,
    message
  });
}
