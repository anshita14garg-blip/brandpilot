import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { overview, timeseries, topPosts } from "../controllers/analytics.controller.js";

const router = Router();
router.use(protect);
router.get("/overview", overview);
router.get("/timeseries", timeseries);
router.get("/top-posts", topPosts);
export default router;
