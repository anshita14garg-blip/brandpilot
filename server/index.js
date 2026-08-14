import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import inboxRoutes from "./routes/inbox.routes.js";
import influencerRoutes from "./routes/influencer.routes.js";
import trendRoutes from "./routes/trend.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { startScheduler } from "./services/scheduler.service.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "BrandPilot AI" }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/trends", trendRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  startScheduler();
});
