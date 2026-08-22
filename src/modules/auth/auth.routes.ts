import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
    login,
    logout,
    getMe,
    updateMe,
    changePassword,
} from "./auth.controller.js";

const router = Router();

router.post(
    "/login",
    login
);

router.post(
    "/logout",
    logout
);

router.get(
    "/me",
    authMiddleware,
    getMe
);

router.put(
    "/me",
    authMiddleware,
    updateMe
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

export default router;