/**
 * Seeds a demo user + influencers + analytics + inbox so the dashboard is never empty.
 * Run:  npm run seed
 * Login: demo@brandpilot.ai / demo1234
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Analytics from "./models/Analytics.js";
import Influencer from "./models/Influencer.js";

dotenv.config();

const niches = ["fitness", "fashion", "tech", "food", "travel", "beauty", "gaming", "finance"];
const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"];

const influencers = Array.from({ length: 24 }, (_, i) => {
  const followers = 5000 + Math.round(Math.random() * 480000);
  const er = +(1 + Math.random() * 8).toFixed(2);
  return {
    name: `Creator ${i + 1}`,
    handle: `@creator_${i + 1}`,
    platform: ["instagram", "linkedin", "twitter"][i % 3],
    niche: niches[i % niches.length],
    followers,
    engagementRate: er,
    avgLikes: Math.round((followers * er) / 100),
    location: cities[i % cities.length],
    audienceAge: ["18-24", "25-34", "35-44"][i % 3],
    collabCost: Math.round(followers / 50) * 10,
    avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
  };
});

const sampleComments = [
  ["Absolutely love this product! Been using it for a month.", "positive", "praise", 1],
  ["My order still hasn't arrived. This is frustrating.", "negative", "complaint", 5],
  ["Do you ship to Kerala?", "neutral", "question", 3],
  ["Price is too high compared to competitors.", "negative", "complaint", 4],
  ["Interested in bulk order for my store, please DM.", "positive", "lead", 4],
  ["The packaging is so aesthetic 😍", "positive", "praise", 1],
  ["Is there a student discount?", "neutral", "question", 2],
  ["Worst customer service ever.", "negative", "complaint", 5],
];

async function run() {
  await connectDB();

  await Influencer.deleteMany({});
  await Influencer.insertMany(influencers);

  let user = await User.findOne({ email: "demo@brandpilot.ai" });
  if (!user) {
    user = await User.create({
      name: "Demo Brand",
      email: "demo@brandpilot.ai",
      password: "demo1234",
      brand: { name: "Brew&Co", industry: "Coffee D2C", tone: "Witty", audience: "Gen Z", keywords: ["coffee", "cold brew", "sustainable"] },
    });
  }

  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await Analytics.deleteMany({ user: user._id });

  const captions = [
    "Cold brew, colder takes. Which team are you on?",
    "We roasted 400kg this week. Here's what we learned.",
    "POV: your 4 PM slump never stood a chance.",
    "Sustainability isn't a label. It's our supply chain.",
    "Your barista called. She said try this at home.",
  ];
  await Post.insertMany(
    captions.map((c, i) => ({
      user: user._id, caption: c,
      hashtags: ["#coldbrew", "#coffeelover", "#d2c"],
      platform: "instagram", status: "published",
      publishedAt: new Date(Date.now() - i * 86400000),
      viralityScore: 60 + Math.round(Math.random() * 35),
      metrics: {
        likes: 200 + Math.round(Math.random() * 1500),
        comments: 10 + Math.round(Math.random() * 120),
        shares: 5 + Math.round(Math.random() * 60),
        reach: 2000 + Math.round(Math.random() * 20000),
      },
    }))
  );

  await Comment.insertMany(
    sampleComments.map(([message, sentiment, intent, priority], i) => ({
      user: user._id, message, sentiment, intent, priority,
      author: `follower_${i + 1}`,
      type: i % 3 === 0 ? "dm" : "comment",
      aiReply: "Thanks for reaching out! Our team is on it 💛",
      createdAt: new Date(Date.now() - Math.random() * 6 * 86400000),
    }))
  );

  const days = 14;
  const rows = [];
  let followers = 8200;
  for (let i = days; i >= 0; i--) {
    followers += Math.round(Math.random() * 120);
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    rows.push({
      user: user._id, date, followers,
      reach: 3000 + Math.round(Math.random() * 9000),
      engagement: 200 + Math.round(Math.random() * 900),
      positive: Math.round(Math.random() * 40),
      neutral: Math.round(Math.random() * 25),
      negative: Math.round(Math.random() * 12),
    });
  }
  await Analytics.insertMany(rows);

  console.log("Seed complete. Login with demo@brandpilot.ai / demo1234");
  await mongoose.connection.close();
}

run();
