# BrandPilot AI — Autonomous AI Social Media Manager

> Not a caption generator. An **AI marketing manager** that plans, writes, schedules, replies, and reports.

MERN + Gemini · JavaScript only (no TypeScript) · built for 2 second-year CSE students.

## Quick start (5 minutes)

```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # fill MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run seed                # demo data (demo@brandpilot.ai / demo1234)
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

No Gemini key? Everything still works — every AI call falls back to realistic mock data
(`server/services/mock.data.js`), so your demo can never crash on stage.

## What's inside

| Feature | Where |
|---|---|
| AI Caption + Hashtag generator | `POST /api/ai/caption` · `client/src/pages/Composer.jsx` |
| AI Virality predictor | `POST /api/ai/virality` · `ScoreRing.jsx` |
| AI Trend Hunter | `GET /api/ai/trends` · `pages/Trends.jsx` |
| AI Collaboration Finder | `GET /api/ai/influencers` · `pages/Influencers.jsx` |
| AI Auto-Reply Bot | `POST /api/inbox` · `pages/Inbox.jsx` |
| Sentiment Heatmap | `GET /api/inbox/heatmap` · `SentimentHeatmap.jsx` |
| Analytics Dashboard | `/api/analytics/*` · `pages/Analytics.jsx` (Recharts) |
| Post Scheduling | `node-cron` in `services/scheduler.service.js` |
| Weekly AI Strategy | `GET /api/ai/strategy` · `pages/Dashboard.jsx` |
| Auth (JWT) | `/api/auth/*` · `context/AuthContext.jsx` |

Full build guide, work split, commit plan, demo script and viva Q&A: **[ROADMAP.md](./ROADMAP.md)**
