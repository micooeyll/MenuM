import { z } from "zod";

const currencies = [
  "TRY",
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "SAR",
  "AED",
] as const;

export const createBusinessSchema = z.object({
  name: z.string().min(2).max(100),

  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug yalnızca küçük harf, sayı ve - içerebilir."
    ),

  phone: z.string().optional(),

  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),

  currency: z.enum(currencies).default("TRY"),

  adminUsername: z.string().min(4).max(50),

  adminPassword: z.string().min(6),
});

export type CreateBusinessInput = z.infer<
  typeof createBusinessSchema
>;

export const updateBusinessSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),

    currency: z.enum([
        "TRY",
        "USD",
        "EUR",
        "GBP"
    ]).optional(),

    isActive: z.boolean().optional(),
    subscriptionStatus: z
        .enum(["TRIAL", "ACTIVE", "EXPIRED"])
        .optional(),
    trialEndsAt: z.coerce.date().optional(),
});

export type UpdateBusinessInput = z.infer<
  typeof updateBusinessSchema
>;