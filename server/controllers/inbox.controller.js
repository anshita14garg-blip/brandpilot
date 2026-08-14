import asyncHandler from "../utils/asyncHandler.js";
import Comment from "../models/Comment.js";
import { askGeminiSafe } from "../services/gemini.service.js";
import * as P from "../services/prompts.js";
import * as M from "../services/mock.data.js";

// GET /api/inbox
export const getInbox = asyncHandler(async (req, res) => {
  const items = await Comment.find({ user: req.user._id }).sort({ priority: -1, createdAt: -1 });
  res.json({ success: true, count: items.length, items });
});

// POST /api/inbox  -> simulate an incoming comment/DM, AI classifies + drafts reply
export const receiveMessage = asyncHandler(async (req, res) => {
  const { message, author = "follower_" + Math.floor(Math.random() * 999), type = "comment" } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("message is required");
  }
  const out = await askGeminiSafe(P.replyPrompt(req.user.brand, message, type), M.mockReply);
  const d = out.data;

  const item = await Comment.create({
    user: req.user._id, message, author, type,
    sentiment: d.sentiment || "neutral",
    intent: d.intent || "general",
    priority: d.priority || 1,
    aiReply: d.reply || "",
    escalated: !!d.escalate,
  });
  res.status(201).json({ success: true, source: out.source, item });
});

// PUT /api/inbox/:id/reply  -> approve/send the reply (human-in-the-loop)
export const sendReply = asyncHandler(async (req, res) => {
  const item = await Comment.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) {
    res.status(404);
    throw new Error("Message not found");
  }
  if (req.body.reply) item.aiReply = req.body.reply;
  item.replied = true;
  await item.save();
  res.json({ success: true, item });
});

// GET /api/inbox/heatmap -> sentiment by day x hour
export const sentimentHeatmap = asyncHandler(async (req, res) => {
  const items = await Comment.find({ user: req.user._id }).lean();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const grid = days.map((d) => ({ day: d, hours: Array.from({ length: 24 }, () => ({ score: 0, count: 0 })) }));

  for (const c of items) {
    const dt = new Date(c.createdAt);
    const cell = grid[dt.getDay()].hours[dt.getHours()];
    cell.count += 1;
    cell.score += c.sentiment === "positive" ? 1 : c.sentiment === "negative" ? -1 : 0;
  }
  const totals = items.reduce(
    (a, c) => ({ ...a, [c.sentiment]: (a[c.sentiment] || 0) + 1 }),
    { positive: 0, neutral: 0, negative: 0 }
  );
  res.json({ success: true, grid, totals });
});
