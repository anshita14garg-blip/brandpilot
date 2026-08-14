import asyncHandler from "../utils/asyncHandler.js";
import Trend from "../models/Trend.js";

export const savedTrends = asyncHandler(async (req, res) => {
  const trends = await Trend.find({ user: req.user._id }).sort({ heatScore: -1 });
  res.json({ success: true, trends });
});
