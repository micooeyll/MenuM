import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import businessRoutes from "./modules/business/business.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menu", menuRoutes);

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "API is running",
    });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});