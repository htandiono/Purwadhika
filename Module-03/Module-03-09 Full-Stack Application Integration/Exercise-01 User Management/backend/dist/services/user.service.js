import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
export const getUsers = () => {
    return prisma.user.findMany({
        orderBy: { id: "asc" }
    });
};
export const getUserById = (id) => {
    return prisma.user.findUnique({
        where: { id }
    });
};
export const createUser = (data) => {
    return prisma.user.create({
        data
    });
};
export const updateUser = (id, data) => {
    return prisma.user.update({
        where: { id },
        data
    });
};
export const deleteUser = (id) => {
    return prisma.user.delete({
        where: { id }
    });
};
export const isDuplicateEmailError = (error) => {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
};
export const isRecordNotFoundError = (error) => {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
};
