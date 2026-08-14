import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { getInbox, receiveMessage, sendReply, sentimentHeatmap } from "../controllers/inbox.controller.js";

const router = Router();
router.use(protect);
router.route("/").get(getInbox).post(receiveMessage);
router.get("/heatmap", sentimentHeatmap);
router.put("/:id/reply", sendReply);
export default router;
