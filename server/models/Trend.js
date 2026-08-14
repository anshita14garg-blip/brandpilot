import mongoose from "mongoose";

const trendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: { type: String, required: true },
  platform: { type: String, default: "instagram" },
  category: { type: String, default: "general" },
  heatScore: { type: Number, default: 50 },      // 0-100 how hot
  fitScore: { type: Number, default: 50 },       // 0-100 fit with brand
  windowHours: { type: Number, default: 48 },    // time left to ride it
  contentIdea: { type: String, default: "" },
  why: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Trend", trendSchema);
