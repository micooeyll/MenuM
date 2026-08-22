import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import type {
    CreateBusinessInput,
    UpdateBusinessInput,
} from "./business.validator.js";
import { AppError } from "../../errors/AppError.js";
import QRCode from "qrcode";

export async function getBusinesses() {
    return await prisma.business.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createBusiness(data: CreateBusinessInput) {
    const {
        name,
        slug,
        phone,
        themeColor,
        adminUsername,
        adminPassword,
    } = data;

    const existingBusiness = await prisma.business.findUnique({
        where: {
            slug,
        },
    });

    if (existingBusiness) {
        throw new AppError(
            "Business slug already exists.",
            409
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            username: adminUsername,
        },
    });

    if (existingUser) {
        throw new AppError(
            "Username already exists.",
            409
        );
    }

    const passwordHash = await bcrypt.hash(
        adminPassword,
        10
    );

    const result = await prisma.$transaction(async (tx) => {
        const business = await tx.business.create({
            data: {
                name,
                slug,
                phone: phone ?? null,
                themeColor,
                trialEndsAt: new Date(
                    Date.now() +
                        14 * 24 * 60 * 60 * 1000
                ),
            },
        });

        const admin = await tx.user.create({
            data: {
                username: adminUsername,
                passwordHash,
                role: "ADMIN",
                businessId: business.id,
            },
        });

        return {
            business,
            admin,
        };
    });

    return {
        business: result.business,

        admin: {
            id: result.admin.id,
            username: result.admin.username,
            role: result.admin.role,
        },
    };
}

export async function getBusinessById(id: number) {
    const business = await prisma.business.findUnique({
        where: {
            id,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    return business;
}

export async function updateBusiness(
    id: number,
    data: UpdateBusinessInput
) {
    const business = await prisma.business.findUnique({
        where: {
            id,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    return await prisma.business.update({
        where: {
            id,
        },

        data: {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.themeColor !== undefined && {
                themeColor: data.themeColor,
            }),

            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),

            ...(data.subscriptionStatus !== undefined && {
                subscriptionStatus:
                    data.subscriptionStatus,
            }),

            ...(data.trialEndsAt !== undefined && {
                trialEndsAt: data.trialEndsAt,
            }),
        },
    });
}

export async function deleteBusiness(id: number) {
    const business = await prisma.business.findUnique({
        where: {
            id,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.deleteMany({
            where: {
                businessId: id,
            },
        });

        await tx.business.delete({
            where: {
                id,
            },
        });
    });

    return {
        message: "Business deleted successfully.",
    };
}

export async function getBusinessForUser(user: {
    role: "ADMIN" | "SUPER_ADMIN";
    businessId?: number | null;
}) {
    if (user.role === "SUPER_ADMIN") {
        return await prisma.business.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    if (!user.businessId) {
        throw new AppError(
            "Business not assigned.",
            403
        );
    }

    const business = await prisma.business.findUnique({
        where: {
            id: user.businessId,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    return [business];
}

export async function updateMyBusiness(
    businessId: number,
    data: UpdateBusinessInput
) {
    const business = await prisma.business.findUnique({
        where: {
            id: businessId,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    return await prisma.business.update({
        where: {
            id: businessId,
        },

        data: {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.themeColor !== undefined && {
                themeColor: data.themeColor,
            }),

            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),
        },
    });
}

/* =========================================================
   QR
========================================================= */

export async function getBusinessQr(id: number) {
    const business = await prisma.business.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    const menuUrl =
        `http://localhost:3000/menu/${business.slug}`;

    const qrCode = await QRCode.toDataURL(
        menuUrl,
        {
            width: 500,
            margin: 2,
        }
    );

    return {
        business,
        menuUrl,
        qrCode,
    };
}

export async function getMyBusinessQr(
    businessId: number
) {
    const business = await prisma.business.findUnique({
        where: {
            id: businessId,
        },

        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
        },
    });

    if (!business) {
        throw new AppError(
            "Business not found.",
            404
        );
    }

    const menuUrl =
        `http://localhost:3000/menu/${business.slug}`;

    const qrCode = await QRCode.toDataURL(
        menuUrl,
        {
            width: 500,
            margin: 2,
        }
    );

    return {
        business,
        menuUrl,
        qrCode,
    };
}