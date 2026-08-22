import prisma from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import type {
    CreateProductInput,
    UpdateProductInput,
} from "./product.validator.js";

import cloudinary from "../../config/cloudinary.js";
import { Readable } from "stream";

export async function createProduct(
    categoryId: number,
    data: CreateProductInput
) {

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }
    return await prisma.product.create({
        data: {
            name: data.name,
            price: data.price,

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),

            ...(data.imagePublicId !== undefined && {
                imagePublicId: data.imagePublicId,
            }),

            categoryId,
            businessId: category.businessId,
        },
    });
}

export async function getProductById(id: number) {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    return product;
}

export async function updateProduct(
    id: number,
    data: UpdateProductInput
) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    return await prisma.product.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && {
                description: data.description,
            }),
            ...(data.price !== undefined && {
                price: data.price,
            }),
            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),
            ...(data.imagePublicId !== undefined && {
                imagePublicId: data.imagePublicId,
            }),
            ...(data.isVisible !== undefined && {
                isVisible: data.isVisible,
            }),
        },
    });
}

export async function deleteProduct(id: number) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    await prisma.product.delete({
        where: { id },
    });

    return;
}

export async function uploadProductImage(
    id: number,
    file: Express.Multer.File
) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "menum/products",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        Readable.from(file.buffer).pipe(stream);
    });

    return await prisma.product.update({
        where: { id },
        data: {
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
        },
    });
}

export async function getProducts(user: any) {
    return await prisma.product.findMany({
        where: {
            businessId: user.businessId,
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}