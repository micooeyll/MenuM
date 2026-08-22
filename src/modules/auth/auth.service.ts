import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { generateToken } from "../../utils/jwt.js";

type LoginInput = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("Invalid username or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid username or password.");
  }

  // JWT oluştur
  const token = generateToken({
    userId: user.id,
    role: user.role,
    businessId: user.businessId,
  });

  // Response döndür
  return {
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
}

import { AppError } from "../../errors/AppError.js";

export async function getMe(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            username: true,
            role: true,
            businessId: true,
            business: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    phone: true,
                    themeColor: true,
                    subscriptionStatus: true,
                    trialEndsAt: true,
                    isActive: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    return user;
}

export async function updateMe(
    userId: number,
    username?: string
) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (username && username !== user.username) {
        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (existingUser) {
            throw new AppError("Username already exists.", 409);
        }
    }

    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            ...(username !== undefined && {
                username,
            }),
        },
        select: {
            id: true,
            username: true,
            role: true,
            businessId: true,
        },
    });
}

export async function changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const validPassword = await bcrypt.compare(
        currentPassword,
        user.passwordHash
    );

    if (!validPassword) {
        throw new AppError("Current password is incorrect.", 401);
    }

    if (newPassword.length < 6) {
        throw new AppError(
            "New password must be at least 6 characters.",
            400
        );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            passwordHash,
        },
    });

    return {
        message: "Password changed successfully.",
    };
}