import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    getCategories
);

router.post(
    "/",
    authMiddleware,
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    deleteCategory
);

export default router;