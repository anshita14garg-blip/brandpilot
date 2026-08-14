import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { savedTrends } from "../controllers/trend.controller.js";

const router = Router();
router.get("/", protect, savedTrends);
export default router;
