import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema({
  name: String,
  handle: String,
  platform: { type: String, default: "instagram" },
  niche: String,
  followers: Number,
  engagementRate: Number,   // percent
  avgLikes: Number,
  location: String,
  audienceAge: String,
  collabCost: Number,       // INR
  avatar: String,
}, { timestamps: true });

export default mongoose.model("Influencer", influencerSchema);
