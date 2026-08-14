import asyncHandler from "../utils/asyncHandler.js";
import Post from "../models/Post.js";
import { askGeminiSafe } from "../services/gemini.service.js";
import * as P from "../services/prompts.js";
import * as M from "../services/mock.data.js";

// GET /api/posts?status=scheduled
export const getPosts = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const posts = await Post.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: posts.length, posts });
});

// POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  const { caption, hashtags = [], platform = "instagram", imageUrl = "", scheduledAt } = req.body;
  if (!caption) {
    res.status(400);
    throw new Error("caption is required");
  }
  const v = await askGeminiSafe(P.viralityPrompt(req.user.brand, caption, platform), M.mockVirality);

  const post = await Post.create({
    user: req.user._id,
    caption, hashtags, platform, imageUrl,
    scheduledAt: scheduledAt || undefined,
    status: scheduledAt ? "scheduled" : "draft",
    viralityScore: v.data.score ?? 0,
    viralityReasons: v.data.reasons ?? [],
  });
  res.status(201).json({ success: true, post });
});

// PUT /api/posts/:id
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  Object.assign(post, req.body);
  if (req.body.scheduledAt) post.status = "scheduled";
  await post.save();
  res.json({ success: true, post });
});

// DELETE /api/posts/:id
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json({ success: true, message: "Post deleted" });
});
