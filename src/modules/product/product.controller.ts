import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productService from "./product.service.js";
import {
    createProductSchema,
    updateProductSchema,
} from "./product.validator.js";

import upload from "../../middleware/upload.middleware.js";

export const createProduct = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const categoryId = Number(req.params.categoryId);

    const data = createProductSchema.parse(req.body);

    const product = await productService.createProduct(
        categoryId,
        data
    );

    res.status(201).json({
        success: true,
        product,
    });
    
});

export const getProducts = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const products = await productService.getProducts(req.user);

    res.status(200).json({
        success: true,
        products,
    });
});

export const getProductById = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const product = await productService.getProductById(id);

    res.status(200).json({
        success: true,
        product,
    });
});

export const updateProduct = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const data = updateProductSchema.parse(req.body);

    const product = await productService.updateProduct(id, data);

    res.status(200).json({
        success: true,
        product,
    });
});

export const deleteProduct = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    await productService.deleteProduct(id);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
});

export const uploadProductImage = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image is required.",
        });
    }

    const product = await productService.uploadProductImage(
        id,
        req.file
    );

    res.status(200).json({
        success: true,
        product,
    });
});