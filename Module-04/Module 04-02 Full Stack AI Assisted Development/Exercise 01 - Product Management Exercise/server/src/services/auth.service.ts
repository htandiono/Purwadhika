import { ApiError } from "../utils/apiError";
import { signAccessToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { toSafeUser } from "../utils/safeUser";
import { prisma } from "../prisma/client";
import { LoginInput, RegisterInput } from "../validations/auth.validation";

export async function registerUser(payload: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const password = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      password
    }
  });

  const safeUser = toSafeUser(user);
  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return { user: safeUser, token };
}

export async function loginUser(payload: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = toSafeUser(user);
  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return { user: safeUser, token };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return toSafeUser(user);
}
