import asyncHandler from "../utils/asyncHandler.js";
import Influencer from "../models/Influencer.js";

export const listInfluencers = asyncHandler(async (req, res) => {
  const { niche, platform, minFollowers = 0, maxCost } = req.query;
  const q = { followers: { $gte: Number(minFollowers) } };
  if (niche) q.niche = new RegExp(niche, "i");
  if (platform) q.platform = platform;
  if (maxCost) q.collabCost = { $lte: Number(maxCost) };
  const influencers = await Influencer.find(q).sort({ engagementRate: -1 }).limit(50);
  res.json({ success: true, count: influencers.length, influencers });
});
