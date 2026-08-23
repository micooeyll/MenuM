import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import businessRoutes from "./modules/business/business.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://menum-frontend.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "MenuM API is running 🚀",
    });
});

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menu", menuRoutes);

app.use(errorMiddleware);

export default app;