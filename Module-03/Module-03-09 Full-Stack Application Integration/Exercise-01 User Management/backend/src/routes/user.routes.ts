import { Router, type NextFunction, type Request, type RequestHandler, type Response } from "express";
import { addUser, editUser, findUser, listUsers, removeUser } from "../controllers/user.controller.js";

export const userRouter = Router();

type AsyncController = (request: Request, response: Response, next: NextFunction) => Promise<unknown> | unknown;

const asyncHandler = (handler: AsyncController): RequestHandler => {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
};

userRouter.get("/", asyncHandler(listUsers));
userRouter.get("/:id", asyncHandler(findUser));
userRouter.post("/", asyncHandler(addUser));
userRouter.put("/:id", asyncHandler(editUser));
userRouter.delete("/:id", asyncHandler(removeUser));
