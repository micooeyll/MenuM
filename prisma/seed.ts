import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

async function main() {
    const passwordHash = await bcrypt.hash("123456", 10);

    const business = await prisma.business.upsert({
        where: {
            slug: "demo-restaurant",
        },
        update: {},
        create: {
            name: "Demo Restaurant",
            slug: "demo-restaurant",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            subscriptionStatus: "TRIAL",
            isActive: true,
        },
    });

    await prisma.user.upsert({
        where: {
            username: "superadmin",
        },
        update: {
            passwordHash,
        },
        create: {
            username: "superadmin",
            passwordHash,
            role: "SUPER_ADMIN",
        },
    });

    await prisma.user.upsert({
        where: {
            username: "admin",
        },
        update: {
            passwordHash,
            businessId: business.id,
        },
        create: {
            username: "admin",
            passwordHash,
            role: "ADMIN",
            businessId: business.id,
        },
    });

    console.log("✅ Seed completed!");
    console.log(`🏢 Business ID: ${business.id}`);
    console.log("👑 superadmin / 123456");
    console.log("👤 admin / 123456");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });