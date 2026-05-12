import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { publicUserSelect } from "../utils/selects";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      sendError(res, 400, "Name, email, and password are required");
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();

    if (!trimmedName || !normalizedEmail || !String(password).trim()) {
      sendError(res, 400, "Name, email, and password cannot be empty");
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      sendError(res, 400, "Email is already registered");
      return;
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword
      },
      select: publicUserSelect
    });

    sendSuccess(res, 201, "Registration successful", user);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 400, "Email and password are required");
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      sendError(res, 401, "Invalid email or password");
      return;
    }

    const passwordMatches = await bcrypt.compare(String(password), user.password);

    if (!passwordMatches) {
      sendError(res, 401, "Invalid email or password");
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      sendError(res, 500, "JWT secret is not configured");
      return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "7d"
    });

    const { password: _password, ...userWithoutPassword } = user;

    sendSuccess(res, 200, "Login successful", {
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};
