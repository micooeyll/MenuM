import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required.")
        .max(50, "Username is too long."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const updateMeSchema = z.object({
    username: z
        .string()
        .min(4)
        .max(50)
        .optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(100),
});

export type ChangePasswordInput = z.infer<
    typeof changePasswordSchema
>;