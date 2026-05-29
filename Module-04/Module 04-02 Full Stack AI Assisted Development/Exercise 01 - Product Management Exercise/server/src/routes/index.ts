import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
