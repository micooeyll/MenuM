import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
} from "./product.controller.js";

const router = Router();

router.post(
    "/:categoryId",
    authMiddleware,
    createProduct
);

router.get(
    "/",
    authMiddleware,
    getProducts
);

router.get(
    "/product/:id",
    authMiddleware,
    getProductById
);

router.put(
    "/:id",
    authMiddleware,
    updateProduct
);  

router.post(
    "/:id/image",
    authMiddleware,
    upload.single("image"),
    uploadProductImage
);

router.delete(
    "/:id",
    authMiddleware,
    deleteProduct
);

export default router;