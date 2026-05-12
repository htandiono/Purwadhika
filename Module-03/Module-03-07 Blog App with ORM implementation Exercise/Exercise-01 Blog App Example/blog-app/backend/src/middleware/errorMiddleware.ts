import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const message =
    statusCode === 500 ? "Internal server error" : error.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message
  });
};
