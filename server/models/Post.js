import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  platform: { type: String, enum: ["instagram", "linkedin", "twitter"], default: "instagram" },
  caption: { type: String, required: true },
  hashtags: { type: [String], default: [] },
  imageUrl: { type: String, default: "" },
  status: { type: String, enum: ["draft", "scheduled", "published"], default: "draft", index: true },
  scheduledAt: { type: Date },
  publishedAt: { type: Date },
  viralityScore: { type: Number, default: 0 },   // 0-100 from AI
  viralityReasons: { type: [String], default: [] },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
