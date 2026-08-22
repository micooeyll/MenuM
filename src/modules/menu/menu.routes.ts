import { Router } from "express";
import { getPublicMenu } from "./menu.controller.js";

const router = Router();

router.get("/:slug", getPublicMenu);

export default router;