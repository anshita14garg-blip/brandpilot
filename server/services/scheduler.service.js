import cron from "node-cron";
import Post from "../models/Post.js";

/**
 * Runs every minute. Any scheduled post whose time has passed gets "published".
 * In a real product this is where the Instagram/LinkedIn Graph API call goes.
 */
export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const due = await Post.find({ status: "scheduled", scheduledAt: { $lte: new Date() } });
      for (const post of due) {
        post.status = "published";
        post.publishedAt = new Date();
        // simulated first-hour metrics (mock, because no real social API in hackathon)
        post.metrics = {
          likes: Math.round(post.viralityScore * 3 + Math.random() * 80),
          comments: Math.round(post.viralityScore / 4 + Math.random() * 15),
          shares: Math.round(post.viralityScore / 6 + Math.random() * 10),
          reach: Math.round(post.viralityScore * 40 + Math.random() * 900),
        };
        await post.save();
        console.log(`[scheduler] published post ${post._id}`);
      }
    } catch (err) {
      console.error("[scheduler]", err.message);
    }
  });
  console.log("Scheduler started (every minute)");
}
