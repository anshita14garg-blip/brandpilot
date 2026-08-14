import asyncHandler from "../utils/asyncHandler.js";
import Analytics from "../models/Analytics.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// GET /api/analytics/overview
export const overview = asyncHandler(async (req, res) => {
  const [posts, published, scheduled, comments, pending] = await Promise.all([
    Post.countDocuments({ user: req.user._id }),
    Post.countDocuments({ user: req.user._id, status: "published" }),
    Post.countDocuments({ user: req.user._id, status: "scheduled" }),
    Comment.countDocuments({ user: req.user._id }),
    Comment.countDocuments({ user: req.user._id, replied: false }),
  ]);

  const agg = await Post.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, reach: { $sum: "$metrics.reach" }, likes: { $sum: "$metrics.likes" }, avgVirality: { $avg: "$viralityScore" } } },
  ]);

  res.json({
    success: true,
    cards: {
      posts, published, scheduled, comments, pendingReplies: pending,
      reach: agg[0]?.reach || 0,
      likes: agg[0]?.likes || 0,
      avgVirality: Math.round(agg[0]?.avgVirality || 0),
    },
  });
});

// GET /api/analytics/timeseries
export const timeseries = asyncHandler(async (req, res) => {
  const rows = await Analytics.find({ user: req.user._id }).sort({ date: 1 }).lean();
  res.json({
    success: true,
    data: rows.map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      followers: r.followers, reach: r.reach, engagement: r.engagement,
      positive: r.positive, neutral: r.neutral, negative: r.negative,
    })),
  });
});

// GET /api/analytics/top-posts
export const topPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user._id, status: "published" })
    .sort({ "metrics.reach": -1 })
    .limit(5);
  res.json({ success: true, posts });
});
