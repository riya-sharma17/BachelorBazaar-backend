import { Router } from "express";
import userRoute from './user.routes'
import locationRoutes from "./location.routes";
import productRoutes from "./product.routes";

const router = Router();

router.use('/user', userRoute);
router.use("/locations", locationRoutes);
router.use("/products", productRoutes);

export default router;
