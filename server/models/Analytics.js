import mongoose from "mongoose";

// One document per user per day (used by charts + heatmap)
const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  date: { type: Date, required: true },
  followers: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  engagement: { type: Number, default: 0 },
  positive: { type: Number, default: 0 },
  neutral: { type: Number, default: 0 },
  negative: { type: Number, default: 0 },
}, { timestamps: true });

analyticsSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Analytics", analyticsSchema);
