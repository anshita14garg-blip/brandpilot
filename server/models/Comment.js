import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  type: { type: String, enum: ["comment", "dm"], default: "comment" },
  author: { type: String, default: "anonymous" },
  message: { type: String, required: true },
  sentiment: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
  intent: { type: String, default: "general" },  // praise | complaint | question | lead | spam
  priority: { type: Number, default: 1 },        // 1 low - 5 urgent
  aiReply: { type: String, default: "" },
  replied: { type: Boolean, default: false },
  escalated: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
