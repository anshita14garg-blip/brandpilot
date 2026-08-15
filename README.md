# BrandPilot AI — Autonomous AI Social Media Manager

> Not a caption generator. An AI marketing manager that plans, writes, schedules, replies, and reports.

MERN + Gemini · JavaScript only (no TypeScript)

## 🚀 Live Demo

| | |
|---|---|
| **Frontend** | [brandpilot-six.vercel.app](https://brandpilot-six.vercel.app) |
| **Backend API** | [brandpilot-cfy0.onrender.com](https://brandpilot-cfy0.onrender.com) |
| **Login** | `demo@brandpilot.ai` / `demo1234` (or click "Use demo credentials") |

> ⚠️ Backend is on Render's free tier — it may take ~50s to wake up on first request after inactivity.

## ✨ What's Inside

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

No Gemini key? Everything still works — every AI call falls back to realistic mock data (`server/services/mock.data.js`), so your demo can never crash on stage.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API (with mock-data fallback)
- **Auth:** JWT + bcrypt
- **Deployment:** Vercel (frontend) + Render (backend)

## ⚡ Quick Start (Local Development)

```bash
# 1. Backend
cd server
npm install
cp .env.example .env   # fill MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run seed            # demo data (demo@brandpilot.ai / demo1234)
npm run dev              # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

## 📦 Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=change_me_to_a_long_random_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
brandpilot-ai/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/
│       ├── context/
│       └── components/
└── server/          # Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── services/
```

## 🌐 Deployment Notes

This project is deployed as two separate services:

- **Backend (Render):** Root directory `server`, build command `npm install`, start command `npm start`. Environment variables set in Render dashboard. MongoDB Atlas network access set to allow all IPs (`0.0.0.0/0`) since Render doesn't use static IPs on the free tier.
- **Frontend (Vercel):** Root directory `client`, framework preset `Vite`. `VITE_API_URL` points to the Render backend URL (with `/api` suffix).
- **CORS:** Backend's `CLIENT_URL` env var must match the live Vercel domain exactly, or requests will be blocked.

## 📖 More

Full build guide, work split, and commit plan: [ROADMAP.md](./ROADMAP.md)

---

Built with ❤️
