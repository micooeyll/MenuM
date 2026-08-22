import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2).max(100),

    description: z.string().optional(),

    price: z.coerce.number().positive(),

    imageUrl: z.string().optional(),

    imagePublicId: z.string().optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    imageUrl: z.string().optional(),
    imagePublicId: z.string().optional(),
    isVisible: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;