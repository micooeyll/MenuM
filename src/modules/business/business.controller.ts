import type { Request, Response } from "express";
import * as businessService from "./business.service.js";
import { createBusinessSchema, updateBusinessSchema } from "./business.validator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../errors/AppError.js";

export const createBusiness = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const data = createBusinessSchema.parse(req.body);

    const result = await businessService.createBusiness(data);

    res.status(201).json({
        success: true,
        data: result,
    });
});

export const getBusinesses = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const businesses = await businessService.getBusinesses();

    res.status(200).json({
        success: true,
        businesses,
    });
});

export const getBusinessById = asyncHandler(async (
    req: Request,
    res: Response
) => {
    console.log("Controller reached");
    console.log(req.params);
    const id = Number(req.params.id);

    console.log("ID:", id);
    console.log("TYPE:", typeof id);

    const business = await businessService.getBusinessById(id);

    console.log("Sending response...");
    res.status(200).json({
        success: true,
        business,
    });
});


export const updateBusiness = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const data = updateBusinessSchema.parse(req.body);

    const business = await businessService.updateBusiness(id, data);

    res.status(200).json({
        success: true,
        business,
    });
});

export const deleteBusiness = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const result = await businessService.deleteBusiness(id);

    res.status(200).json({
        success: true,
        ...result,
    });
});


export const getMyBusiness = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const businessId = req.user!.businessId;

    if (!businessId) {
        throw new AppError("Business not found.", 404);
    }

    const business =
        await businessService.getBusinessById(businessId);

    res.status(200).json({
        success: true,
        business,
    });
});

export const updateMyBusiness = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const businessId = req.user.businessId;

    if (!businessId) {
        throw new AppError("Business not assigned.", 403);
    }

    const data = updateBusinessSchema.parse(req.body);

    const business =
        await businessService.updateMyBusiness(
            businessId,
            data
        );

    res.status(200).json({
        success: true,
        business,
    });
});

export const getBusinessQr = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const result = await businessService.getBusinessQr(id);

    res.status(200).json({
        success: true,
        ...result,
    });
});

export const getMyBusinessQr = asyncHandler(async (
    req: Request,
    res: Response
) => {
    const businessId = req.user!.businessId;

    if (!businessId) {
        throw new AppError(
            "Business not assigned.",
            403
        );
    }

    const result =
        await businessService.getMyBusinessQr(
            businessId
        );

    res.status(200).json({
        success: true,
        ...result,
    });
});