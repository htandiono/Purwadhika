import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import type { UserInput } from "../validations/user.validation.js";

export const getUsers = () => {
  return prisma.user.findMany({
    orderBy: { id: "asc" }
  });
};

export const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const createUser = (data: UserInput) => {
  return prisma.user.create({
    data
  });
};

export const updateUser = (id: number, data: UserInput) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const deleteUser = (id: number) => {
  return prisma.user.delete({
    where: { id }
  });
};

export const isDuplicateEmailError = (error: unknown) => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
};

export const isRecordNotFoundError = (error: unknown) => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
};
