import prisma from "../../config/prisma.js";

export async function getSuperAdminDashboardStats() {
    const [
        businesses,
        activeBusinesses,
        trialBusinesses,
        expiredBusinesses,
    ] = await Promise.all([
        prisma.business.count(),

        prisma.business.count({
            where: {
                isActive: true,
            },
        }),

        prisma.business.count({
            where: {
                subscriptionStatus: "TRIAL",
            },
        }),

        prisma.business.count({
            where: {
                subscriptionStatus: "EXPIRED",
            },
        }),
    ]);

    return {
        businesses,
        activeBusinesses,
        trialBusinesses,
        expiredBusinesses,
    };
}

export async function getAdminDashboardStats(
    businessId: number
) {
    const [
        categories,
        products,
    ] = await Promise.all([
        prisma.category.count({
            where: {
                businessId,
            },
        }),

        prisma.product.count({
            where: {
                businessId,
            },
        }),
    ]);

    const productsPerCategory =
        categories > 0
            ? Number((products / categories).toFixed(1))
            : 0;

    return {
        categories,
        products,
        productsPerCategory,
        totalMenuItems: products,
    };
}