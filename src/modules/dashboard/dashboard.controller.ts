import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../errors/AppError.js";

import {
    getSuperAdminDashboardStats,
    getAdminDashboardStats,
} from "./dashboard.service.js";

export const getStats = asyncHandler(
    async (req: Request, res: Response) => {

        // =====================================================
        // SUPER ADMIN
        // =====================================================

        if (req.user!.role === "SUPER_ADMIN") {

            const stats =
                await getSuperAdminDashboardStats();

            return res.status(200).json({
                success: true,
                role: "SUPER_ADMIN",
                stats,
            });
        }

        // =====================================================
        // BUSINESS ADMIN
        // =====================================================

        if (req.user!.role === "ADMIN") {

            const businessId =
                req.user!.businessId;

            if (!businessId) {
                throw new AppError(
                    "Business not assigned.",
                    403
                );
            }

            const stats =
                await getAdminDashboardStats(
                    businessId
                );

            return res.status(200).json({
                success: true,
                role: "ADMIN",
                stats,
            });
        }

        throw new AppError(
            "Unauthorized.",
            403
        );
    }
);