import asyncHandler from "../utils/asyncHandler.js";
import { askGeminiSafe } from "../services/gemini.service.js";
import * as P from "../services/prompts.js";
import * as M from "../services/mock.data.js";
import Influencer from "../models/Influencer.js";
import Trend from "../models/Trend.js";
import Analytics from "../models/Analytics.js";

// POST /api/ai/caption
export const generateCaption = asyncHandler(async (req, res) => {
  const { topic = "our product", platform = "instagram", goal = "engagement" } = req.body;
  const out = await askGeminiSafe(
    P.captionPrompt(req.user.brand, topic, platform, goal),
    M.mockCaptions(topic)
  );
  res.json({ success: true, source: out.source, ...out.data });
});

// POST /api/ai/virality
export const scoreVirality = asyncHandler(async (req, res) => {
  const { caption, platform = "instagram" } = req.body;
  if (!caption) {
    res.status(400);
    throw new Error("caption is required");
  }
  const out = await askGeminiSafe(P.viralityPrompt(req.user.brand, caption, platform), M.mockVirality);
  res.json({ success: true, source: out.source, ...out.data });
});

// GET /api/ai/trends  (also caches into DB)
export const huntTrends = asyncHandler(async (req, res) => {
  const out = await askGeminiSafe(P.trendPrompt(req.user.brand), M.mockTrends);
  const trends = out.data.trends || [];
  await Trend.deleteMany({ user: req.user._id });
  const saved = await Trend.insertMany(trends.map((t) => ({ ...t, user: req.user._id })));
  res.json({ success: true, source: out.source, trends: saved });
});

// GET /api/ai/influencers  (AI ranking over DB candidates)
export const matchInfluencers = asyncHandler(async (req, res) => {
  const { niche, minFollowers = 0 } = req.query;
  const query = { followers: { $gte: Number(minFollowers) } };
  if (niche) query.niche = new RegExp(niche, "i");
  const candidates = await Influencer.find(query).limit(20).lean();

  const slim = candidates.map((c) => ({
    handle: c.handle, niche: c.niche, followers: c.followers,
    engagementRate: c.engagementRate, collabCost: c.collabCost, location: c.location,
  }));

  const out = await askGeminiSafe(P.influencerPrompt(req.user.brand, slim), M.mockMatches(slim));
  const byHandle = Object.fromEntries(candidates.map((c) => [c.handle, c]));
  const matches = (out.data.matches || []).map((m) => ({ ...m, profile: byHandle[m.handle] || null }));
  res.json({ success: true, source: out.source, matches });
});

// GET /api/ai/strategy  -> weekly AI marketing manager plan
export const weeklyStrategy = asyncHandler(async (req, res) => {
  const rows = await Analytics.find({ user: req.user._id }).sort({ date: -1 }).limit(7).lean();
  const stats = rows.reduce(
    (a, r) => ({
      reach: a.reach + r.reach, engagement: a.engagement + r.engagement,
      positive: a.positive + r.positive, negative: a.negative + r.negative,
    }),
    { reach: 0, engagement: 0, positive: 0, negative: 0 }
  );
  const out = await askGeminiSafe(P.strategyPrompt(req.user.brand, stats), M.mockStrategy);
  res.json({ success: true, source: out.source, stats, plan: out.data });
});
