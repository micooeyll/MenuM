import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import businessRoutes from "./modules/business/business.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://menum-frontend.vercel.app"
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to MenuM API 🚀",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/businesses", businessRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorMiddleware);

export default app;