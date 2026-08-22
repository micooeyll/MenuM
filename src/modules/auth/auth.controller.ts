import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";
import { updateMeSchema, changePasswordSchema } from "./auth.validator.js";

export const login = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const { username, password } = req.body;

    const result = await authService.login({
        username,
        password,
    });

    res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: result.message,
        token: result.token,
        user: result.user,
    });
});

export const logout = asyncHandler(async (
    req: Request,
    res: Response
) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    res.status(200).json({
        success: true,
        message: "Logout successful.",
    });
});


export const getMe = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.userId;

    const user = await authService.getMe(userId);

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateMe = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.userId;

    const data = updateMeSchema.parse(req.body);

    const user = await authService.updateMe(
        userId,
        data.username
    );

    res.status(200).json({
        success: true,
        user,
    });
});

export const changePassword = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.userId;

    const data = changePasswordSchema.parse(req.body);

    const result = await authService.changePassword(
        userId,
        data.currentPassword,
        data.newPassword
    );

    res.status(200).json({
        success: true,
        ...result,
    });
});