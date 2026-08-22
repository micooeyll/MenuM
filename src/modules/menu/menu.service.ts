import prisma from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";

export async function getPublicMenu(slug: string) {
    console.log("🔎 PUBLIC MENU SLUG:", slug);

    const business = await prisma.business.findUnique({
        where: {
            slug,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            themeColor: true,

            categories: {
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    name: true,

                    products: {
                        where: {
                            isVisible: true,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            },
        },
    });

    console.log("🏢 BUSINESS:", business);

    if (!business) {
        throw new AppError("Business not found.", 404);
    }

    return business;
}