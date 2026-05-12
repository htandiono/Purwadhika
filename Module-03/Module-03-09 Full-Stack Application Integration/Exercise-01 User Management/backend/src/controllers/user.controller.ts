import type { Request, Response } from "express";
import { z } from "zod";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  isDuplicateEmailError,
  isRecordNotFoundError,
  updateUser
} from "../services/user.service.js";
import { userSchema } from "../validations/user.validation.js";

const idSchema = z.coerce.number().int().positive();

const sendValidationError = (response: Response, error: z.ZodError) => {
  return response.status(400).json({
    message: "Validation failed",
    errors: error.flatten().fieldErrors
  });
};

const parseId = (request: Request, response: Response) => {
  const result = idSchema.safeParse(request.params.id);

  if (!result.success) {
    response.status(400).json({
      message: "Invalid user id"
    });
    return null;
  }

  return result.data;
};

export const listUsers = async (_request: Request, response: Response) => {
  const users = await getUsers();
  return response.json(users);
};

export const findUser = async (request: Request, response: Response) => {
  const id = parseId(request, response);
  if (!id) return;

  const user = await getUserById(id);

  if (!user) {
    return response.status(404).json({
      message: "User not found"
    });
  }

  return response.json(user);
};

export const addUser = async (request: Request, response: Response) => {
  const result = userSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result.error);
  }

  try {
    const user = await createUser(result.data);
    return response.status(201).json(user);
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return response.status(409).json({
        message: "Email is already registered"
      });
    }

    throw error;
  }
};

export const editUser = async (request: Request, response: Response) => {
  const id = parseId(request, response);
  if (!id) return;

  const result = userSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result.error);
  }

  try {
    const user = await updateUser(id, result.data);
    return response.json(user);
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return response.status(409).json({
        message: "Email is already registered"
      });
    }

    if (isRecordNotFoundError(error)) {
      return response.status(404).json({
        message: "User not found"
      });
    }

    throw error;
  }
};

export const removeUser = async (request: Request, response: Response) => {
  const id = parseId(request, response);
  if (!id) return;

  try {
    await deleteUser(id);
    return response.status(204).send();
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return response.status(404).json({
        message: "User not found"
      });
    }

    throw error;
  }
};
