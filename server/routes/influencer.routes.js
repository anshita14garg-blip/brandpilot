import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { listInfluencers } from "../controllers/influencer.controller.js";

const router = Router();
router.get("/", protect, listInfluencers);
export default router;
