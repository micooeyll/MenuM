import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryService from "./category.service.js";
import { createCategorySchema } from "./category.validator.js";
import { updateCategorySchema } from "./category.validator.js";

export const createCategory = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const businessId = Number(req.user!.businessId);

    const data = createCategorySchema.parse(req.body);

    const category = await categoryService.createCategory(
        businessId,
        data
    );

    res.status(201).json({
        success: true,
        category,
    });
});

export const getCategories = asyncHandler(async (
    req: Request,
    res: Response
) => {

    console.log("REQ.USER:", req.user);

    const businessId = Number(req.user!.businessId);

    console.log("BUSINESS ID:", businessId);

    const categories = await categoryService.getCategories(businessId);

    res.status(200).json({
        success: true,
        categories,
    });
});

export const updateCategory = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const data = updateCategorySchema.parse(req.body);

    const category = await categoryService.updateCategory(id, data);

    res.status(200).json({
        success: true,
        category,
    });
});

export const deleteCategory = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    await categoryService.deleteCategory(id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
    });
});