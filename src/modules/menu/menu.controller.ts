import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as menuService from "./menu.service.js";

export const getPublicMenu = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const slug = req.params.slug;

    if (!slug || Array.isArray(slug)) {
        throw new Error("Invalid slug.");
    }

    const menu = await menuService.getPublicMenu(slug);

    res.status(200).json({
        success: true,
        ...menu,
    });
});