import { Router } from "express";
import { addUser, editUser, findUser, listUsers, removeUser } from "../controllers/user.controller.js";
export const userRouter = Router();
const asyncHandler = (handler) => {
    return (request, response, next) => {
        Promise.resolve(handler(request, response, next)).catch(next);
    };
};
userRouter.get("/", asyncHandler(listUsers));
userRouter.get("/:id", asyncHandler(findUser));
userRouter.post("/", asyncHandler(addUser));
userRouter.put("/:id", asyncHandler(editUser));
userRouter.delete("/:id", asyncHandler(removeUser));
