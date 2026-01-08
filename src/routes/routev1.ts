import { Router } from "express";
import userRoute from './user.routes'
import locationRoutes from "./location.routes";

const router = Router();

router.use('/user', userRoute);
router.use("/locations", locationRoutes);


export default router;
