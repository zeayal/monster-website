import { Router } from "express";
import userRoutes from "./userRoutes";
import videoRoutes from "./videoRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/video", videoRoutes);

export default router;
