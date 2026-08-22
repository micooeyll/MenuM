import prisma from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "./category.validator.js";

export async function createCategory(
    businessId: number,
    data: CreateCategoryInput
) {
    const business = await prisma.business.findUnique({
        where: {
            id: businessId,
        },
    });

    if (!business) {
        throw new AppError("Business not found.", 404);
    }

    return await prisma.category.create({
        data: {
            name: data.name,
            businessId,
        },
    });
}

export async function getCategories(businessId: number) {
    const business = await prisma.business.findUnique({
        where: { id: businessId },
    });

    if (!business) {
        throw new AppError("Business not found.", 404);
    }

    return await prisma.category.findMany({
        where: {
            businessId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

export async function updateCategory(
    id: number,
    data: UpdateCategoryInput
) {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    return await prisma.category.update({
        where: { id },
        data: {
            name: data.name,
        },
    });
}

export async function deleteCategory(id: number) {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    await prisma.category.delete({
        where: { id },
    });
}