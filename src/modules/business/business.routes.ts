import { Router } from "express";

import {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    getMyBusiness,
    updateMyBusiness,
    getBusinessQr,
    getMyBusinessQr,
} from "./business.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
    "/me",
    authMiddleware,
    requireRole("ADMIN"),
    getMyBusiness
);

router.put(
    "/me",
    authMiddleware,
    requireRole("ADMIN"),
    updateMyBusiness
);

router.get(
    "/me/qr",
    authMiddleware,
    requireRole("ADMIN"),
    getMyBusinessQr
);

/*
|--------------------------------------------------------------------------
| SUPER ADMIN
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    getBusinesses
);

router.post(
    "/",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    createBusiness
);

router.get(
    "/:id/qr",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    getBusinessQr
);

router.get(
    "/:id",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    getBusinessById
);

router.put(
    "/:id",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    updateBusiness
);

router.delete(
    "/:id",
    authMiddleware,
    requireRole("SUPER_ADMIN"),
    deleteBusiness
);

export default router;