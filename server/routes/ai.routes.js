import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { generateCaption, scoreVirality, huntTrends, matchInfluencers, weeklyStrategy } from "../controllers/ai.controller.js";

const router = Router();
router.use(protect);
router.post("/caption", generateCaption);
router.post("/virality", scoreVirality);
router.get("/trends", huntTrends);
router.get("/influencers", matchInfluencers);
router.get("/strategy", weeklyStrategy);
export default router;
