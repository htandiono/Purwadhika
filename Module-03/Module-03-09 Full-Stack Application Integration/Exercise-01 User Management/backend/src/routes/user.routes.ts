import { Router } from "express";
import { addUser, editUser, findUser, listUsers, removeUser } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get("/", listUsers);
userRouter.get("/:id", findUser);
userRouter.post("/", addUser);
userRouter.put("/:id", editUser);
userRouter.delete("/:id", removeUser);
