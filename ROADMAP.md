# BrandPilot AI — Complete Hackathon Roadmap

---

## 1. The Idea, USP and Why Judges Will Care

### The problem with existing tools
Every hackathon submission for this problem statement is a **caption generator**: a textbox, a Gemini call, some hashtags. Judges see 20 of them. A real brand's day-to-day work is not writing captions — it is *deciding what to post, when, with whom, and how to respond when it goes wrong*.

### BrandPilot AI
**An AI agent that runs a brand's social media the way a human marketing manager does — Learn → Plan → Act → Report.**

| Stage | What the agent does | Feature |
|---|---|---|
| **Learn** | Stores a Brand Brain (industry, tone, audience, keywords). Every prompt is built from it. | Brand Settings |
| **Plan** | Hunts trends and scores them on **Heat × Brand Fit** with a *closing window* (hours left). | AI Trend Hunter |
| **Act** | Writes 3 caption options, predicts virality **before** posting, rewrites weak parts, schedules, auto-publishes. | Composer + Virality + Scheduler |
| **Act** | Classifies every comment/DM (sentiment + intent + priority), drafts a reply, escalates brand-risk ones to a human. | Auto-Reply Inbox |
| **Act** | Ranks creators on niche fit, engagement quality and cost-efficiency — not follower count. | Collab Finder |
| **Report** | Sentiment heatmap (day × hour), Recharts analytics, and a **weekly AI action plan**. | Analytics + Dashboard |

### The 5 USPs (say these exact lines to judges)
1. **Pre-publish Virality Score** — we predict performance *before* posting, with a component breakdown (hook/emotion/clarity/shareability/CTA) and an AI-rewritten caption. Everyone else measures after.
2. **Trend Fit Score + Expiry Window** — a trend is useless if it doesn't fit your brand or is already dead. We score both and show hours remaining.
3. **Sentiment Heatmap (day × hour)** — tells a brand *when* its audience turns angry, so it can staff support and time posts. No competitor tool at hackathon level shows this.
4. **Human-in-the-loop safety** — the AI drafts, flags PR-risk messages (`escalate: true`), and a human approves. Judges love responsible AI.
5. **Zero-crash demo** — every AI call has a mock fallback. If the Wi-Fi or the API key dies on stage, the demo continues.

### Why it wins
It **completely** solves the statement (all 7 mandatory features), it is *agentic* (plan → act → report loop) rather than a single prompt, it is genuinely useful for a real small D2C brand, and two second-year students can build and explain every line of it.

---

## 2. End-to-End User Flow

```text
Landing page
   -> Register / Login (JWT)
   -> Brand Settings: name, industry, tone, audience, keywords   [the Brand Brain]
   -> Dashboard (Command Center)
        - KPI cards: reach, likes, published, avg virality
        - "Generate weekly action plan" -> AI reads 7 days of analytics -> day-by-day plan
   -> Trend Hunter: "Scan trends" -> 6 trends with Heat / Fit / hours-left / content idea
   -> AI Composer: topic + platform + goal
        -> 3 caption options (hook, hashtags, best time)
        -> pick one -> "Predict virality" -> score ring + breakdown + improved caption
        -> Save draft  OR  pick date/time -> Schedule
   -> Scheduler: Drafts / Scheduled / Published columns
        -> node-cron publishes due posts every minute and simulates first-hour metrics
   -> Auto-Reply Inbox: incoming comment/DM
        -> AI returns sentiment + intent + priority + draft reply + escalate flag
        -> user clicks "Approve & send"
        -> Sentiment heatmap updates
   -> Collab Finder: filter creators -> "AI match top 5" -> match score + reason + collab idea
   -> Analytics: followers area chart, reach vs engagement lines, sentiment pie, top posts bar
   -> Logout
```

---

## 3. UI / UX Design System

- **Theme:** dark "mission control" — background `#0B0F1A`, panels `#121829`, borders `#1F2740`.
- **Accents:** brand blue `#5B8CFF`, mint `#3DDC97` (positive), amber `#FFC857` (neutral), coral `#FF6B6B` (negative). Sentiment colours are reused everywhere, so the UI teaches itself.
- **Fonts:** Sora (display) + Inter (body).
- **Reusable classes** (in `client/src/index.css`): `.card`, `.btn-primary`, `.btn-ghost`, `.input`, `.label`, `.chip`, `.h-title`. Never repeat Tailwind soup in pages.
- **Responsive:** sidebar collapses to an overlay drawer under `lg`; every grid is `grid-cols-1 → sm:2 → lg:3/4`; tables scroll horizontally on mobile.
- **States:** every page handles loading (`<Loader/>`), error (`<ErrorMessage/>`) and empty states. Judges notice this.

---

## 4. Folder Structure

```text
brandpilot-ai/
├── README.md
├── ROADMAP.md
├── render.yaml
├── server/
│   ├── index.js                     # express app + route mounting
│   ├── seed.js                      # demo user, influencers, posts, analytics
│   ├── config/db.js
│   ├── models/                      # User, Post, Comment, Trend, Influencer, Analytics
│   ├── controllers/                 # auth, ai, post, inbox, analytics, influencer, trend
│   ├── routes/                      # one router per resource
│   ├── middleware/                  # auth.middleware.js, error.middleware.js
│   ├── services/
│   │   ├── gemini.service.js        # the ONLY place that calls Gemini
│   │   ├── prompts.js               # every AI prompt, in one file
│   │   ├── mock.data.js             # fallbacks -> demo never breaks
│   │   └── scheduler.service.js     # node-cron auto-publisher
│   └── utils/                       # generateToken.js, asyncHandler.js
└── client/
    ├── index.html · vite.config.js · tailwind.config.js · vercel.json
    └── src/
        ├── main.jsx · App.jsx (React Router) · index.css
        ├── api/axios.js             # baseURL + JWT interceptor
        ├── api/endpoints.js         # every backend call, one object per resource
        ├── context/AuthContext.jsx
        ├── hooks/useFetch.js
        ├── layouts/DashboardLayout.jsx
        ├── components/              # Loader, ErrorMessage, StatCard, ScoreRing,
        │                            # SentimentHeatmap, PostCard, ProtectedRoute
        └── pages/                   # Landing, Login, Register, Dashboard, Composer,
                                     # Trends, Influencers, Inbox, Analytics,
                                     # Calendar, Settings
```

**Rule to state in viva:** routes only route, controllers only orchestrate, services own external I/O, models own data. That is why the code is small and testable.

---

## 5. Backend Architecture

```text
Request
  -> CORS + express.json()
  -> Router  (/api/<resource>)
  -> protect (JWT middleware)  -> req.user
  -> Controller (asyncHandler wraps -> no try/catch spam)
  -> Service (Gemini)  and/or  Model (MongoDB)
  -> res.json({ success:true, ... })
  -> errorHandler (single place, consistent { success:false, message })
```

### MongoDB Schemas

| Collection | Key fields |
|---|---|
| **User** | name, email (unique), password (bcrypt hash), `brand{ name, industry, tone, audience, keywords[] }` |
| **Post** | user(ref), platform, caption, hashtags[], status(draft/scheduled/published), scheduledAt, publishedAt, viralityScore, viralityReasons[], metrics{likes,comments,shares,reach} |
| **Comment** | user(ref), post(ref), type(comment/dm), author, message, sentiment, intent, priority(1-5), aiReply, replied, escalated |
| **Trend** | user(ref), title, platform, category, heatScore, fitScore, windowHours, contentIdea, why |
| **Influencer** | name, handle, platform, niche, followers, engagementRate, avgLikes, location, audienceAge, collabCost, avatar |
| **Analytics** | user(ref), date, followers, reach, engagement, positive, neutral, negative — unique index on (user, date) |

### REST API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | create account, returns JWT |
| POST | `/api/auth/login` | – | login, returns JWT |
| GET | `/api/auth/me` | ✔ | rehydrate session on refresh |
| PUT | `/api/auth/brand` | ✔ | update the Brand Brain |
| POST | `/api/ai/caption` | ✔ | 3 caption + hashtag options |
| POST | `/api/ai/virality` | ✔ | score 0-100 + breakdown + improved caption |
| GET | `/api/ai/trends` | ✔ | hunt trends, cache in DB |
| GET | `/api/ai/influencers` | ✔ | AI-ranked top 5 collabs |
| GET | `/api/ai/strategy` | ✔ | weekly action plan from analytics |
| GET/POST | `/api/posts` | ✔ | list / create (auto-scores virality) |
| PUT/DELETE | `/api/posts/:id` | ✔ | edit / delete |
| GET/POST | `/api/inbox` | ✔ | list / receive + classify a message |
| PUT | `/api/inbox/:id/reply` | ✔ | approve and send reply |
| GET | `/api/inbox/heatmap` | ✔ | day × hour sentiment grid |
| GET | `/api/analytics/overview` | ✔ | KPI cards (uses aggregation) |
| GET | `/api/analytics/timeseries` | ✔ | 14-day chart data |
| GET | `/api/analytics/top-posts` | ✔ | top 5 by reach |
| GET | `/api/influencers` | ✔ | filterable creator database |
| GET | `/api/trends` | ✔ | cached trends |

### Authentication (explain this in viva)
1. `register` → mongoose `pre("save")` hook hashes with bcrypt (10 rounds) → never store plaintext.
2. `login` → `bcrypt.compare` → `jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" })`.
3. Client stores the token in `localStorage`; an axios request interceptor adds `Authorization: Bearer <token>` to every call.
4. `protect` middleware verifies the token, loads the user (minus password) into `req.user`.
5. Every controller scopes queries by `req.user._id` — **user A can never read user B's data.** That is our data-isolation story.

---

## 6. Feature-by-Feature Implementation

### 6.1 AI Caption + Hashtag Generator
- **Frontend:** `Composer.jsx` — topic, platform, goal → `aiApi.caption()`. Renders 3 clickable option cards (hook, caption, hashtags, best time).
- **Backend:** `ai.controller.generateCaption` → `prompts.captionPrompt(brand, topic, platform, goal)` → `askGeminiSafe`.
- **Prompt logic:** brand line injected first, then hard rules (hook in first 6 words, 1 CTA, max 4 emoji) and a strict JSON return shape.
- **DB:** none until the user saves; then `POST /api/posts`.

### 6.2 AI Virality Predictor
- **Backend:** `viralityPrompt` asks for `score`, a 5-part `breakdown`, `reasons[]` and an `improvedCaption`.
- **Frontend:** `ScoreRing.jsx` — pure SVG circle (no chart library), green ≥75 / amber ≥50 / red below, plus per-factor bars and a one-click "Use AI-improved caption".
- **DB:** the score is stored on the Post at creation time so analytics can compare *predicted vs actual*.

### 6.3 AI Trend Hunter
- **Backend:** `huntTrends` → Gemini returns 6 trends → old trends for that user are deleted and new ones inserted (cache).
- **Scoring shown in UI:** Heat bar, Brand Fit bar, `windowHours` countdown, and Opportunity = `(heat + fit)/2`.
- **Viva point:** heat alone is a vanity metric; opportunity = heat × fit × time remaining.

### 6.4 AI Collaboration Finder
- **Backend:** query MongoDB with filters → send a slimmed candidate list into `influencerPrompt` → Gemini ranks top 5 with `matchScore`, `reason`, `collabIdea`, `expectedReach` → merged back with full profiles.
- **Why this is smart:** AI never invents influencers (no hallucinated handles) — it only *ranks real rows from our database*. Say this line; judges love it.

### 6.5 AI Auto-Reply Bot
- **Flow:** message arrives (`POST /api/inbox`; in production a Meta Graph webhook) → `replyPrompt` returns `{sentiment, intent, priority, reply, escalate}` → saved as a Comment → the UI sorts by priority so brand-risk items are on top → human clicks "Approve & send".
- **Safety:** `escalate: true` for legal/refund/abuse/PR risk shows a red "needs human" chip.

### 6.6 Sentiment Heatmap
- **Backend:** `sentimentHeatmap` builds a 7 × 24 grid; each cell holds `count` and a `score` (+1 positive, 0 neutral, −1 negative).
- **Frontend:** `SentimentHeatmap.jsx` colours cells by average sentiment with a tooltip. Pure CSS grid, no library.

### 6.7 Analytics Dashboard + Scheduling
- **Charts (Recharts):** Area (followers), Line (reach vs engagement), Pie (sentiment split), Bar (top posts).
- **Overview cards** use a MongoDB `aggregate` with `$sum`/`$avg` — mention aggregation pipelines in viva.
- **Scheduler:** `node-cron` `* * * * *` finds posts where `status:"scheduled"` and `scheduledAt <= now`, flips them to `published`, and fills simulated first-hour metrics (documented as mock because no real social API is available in a hackathon).

### 6.8 Authentication
Covered in section 5. Frontend guard = `ProtectedRoute` + `AuthContext`.

---

## 7. Step-by-Step Development Guide

1. **Setup** — `mkdir brandpilot-ai`, create `server/` and `client/`, `git init`.
2. **Backend base** — express + cors + dotenv + mongoose; `/api/health` must return `{ok:true}` before anything else.
3. **DB** — MongoDB Atlas free cluster → copy connection string into `.env` → confirm "MongoDB connected".
4. **Auth** — User model → register/login/me → test all three in Postman/Thunder Client.
5. **Middleware** — `protect` + `errorHandler` + `asyncHandler`.
6. **Gemini service** — `askGemini` + `askGeminiSafe` + `mock.data.js`. Test with the key removed to prove the fallback works.
7. **AI routes** — caption → virality → trends → influencers → strategy.
8. **Posts + scheduler** — CRUD, then cron.
9. **Inbox + heatmap.**
10. **Analytics + `seed.js`** — never demo an empty dashboard.
11. **Frontend base** — Vite + Tailwind + Router + axios interceptor + AuthContext.
12. **Auth pages + ProtectedRoute + DashboardLayout.**
13. **Pages in this order:** Dashboard → Composer → Trends → Influencers → Inbox → Analytics → Calendar → Settings.
14. **Landing page last** (it's the first thing judges see, so build it when you know the real features).
15. **Polish** — loading/error/empty states, mobile check at 375 px.
16. **Deploy** — Render (server) then Vercel (client).

---

## 8. Work Division (2 people, 5 days)

**Person A — "Backend & AI Engineer"**: Express setup, all models, auth + JWT, Gemini service + all prompts, mock fallbacks, posts + cron scheduler, inbox + heatmap aggregation, analytics aggregation, seed script, Render deployment.

**Person B — "Frontend & Product Engineer"**: Vite + Tailwind design system, axios layer, AuthContext + ProtectedRoute, DashboardLayout, all 11 pages, Recharts, ScoreRing + heatmap components, responsive pass, landing page, Vercel deployment, demo video + slides.

| Day | Person A | Person B | Milestone |
|---|---|---|---|
| 1 | Express + Mongo + User model + auth APIs | Vite + Tailwind + design system + Login/Register | Login works end-to-end |
| 2 | Gemini service + prompts + mocks + caption/virality APIs | DashboardLayout + Composer + ScoreRing | Generate + score a caption |
| 3 | Trends, Influencers, Inbox, heatmap APIs | Trends, Influencers, Inbox pages | 5 of 7 features done |
| 4 | Analytics aggregation + cron + seed | Analytics charts + Calendar + Settings | All features done |
| 5 (AM) | Render deploy + env vars + CORS | Vercel deploy + landing page | Live URLs |
| 5 (PM) | Both: bug bash, demo rehearsal ×3, README/slides | | Submission |

**Contract-first rule:** agree the JSON response shape *before* coding, so B can build against `mock.data.js` while A is still writing the endpoint. This is why the two of you never block each other.

---

## 9. GitHub Commit Plan

Branches: `main` (always deployable), `dev`, `feat/*`. PR from `feat/*` → `dev` → `main`.
Convention: `type(scope): message`.

```text
chore(repo): init monorepo with client and server
feat(server): express app, mongo connection, health route
feat(server): user model with bcrypt hashing
feat(server): jwt register/login/me endpoints
feat(server): protect + global error middleware
feat(client): vite + tailwind design system
feat(client): axios instance with jwt interceptor
feat(client): auth context, login and register pages
feat(server): gemini service with mock fallback
feat(server): caption + hashtag generation endpoint
feat(client): ai composer page
feat(server): virality prediction endpoint
feat(client): virality score ring and breakdown
feat(server): trend hunter with heat and fit scoring
feat(client): trend hunter page
feat(server): influencer db + ai collab ranking
feat(client): collab finder page with filters
feat(server): inbox classification and auto-reply
feat(server): sentiment heatmap aggregation
feat(client): auto-reply inbox and heatmap
feat(server): post crud + node-cron scheduler
feat(client): scheduler page
feat(server): analytics overview and timeseries
feat(client): recharts analytics dashboard
feat(server): weekly ai strategy endpoint
feat(client): landing page
feat(server): seed script with demo data
fix(client): mobile sidebar and responsive grids
docs(repo): readme + roadmap
chore(deploy): render and vercel config
```

---

## 10. Demo Strategy, Judge Q&A, Future Scope

### 4-minute demo script
1. **0:00–0:30** — Problem: "A small brand posts 5 times a week and gets 200 comments. They don't need a caption generator, they need a manager." Show the landing page.
2. **0:30–1:00** — Login with the demo account → Brand Settings. "This Brand Brain is injected into every prompt — that's why nothing sounds generic."
3. **1:00–1:40** — Trend Hunter → point at **Fit score** and **hours left**. "Heat alone is a trap."
4. **1:40–2:30** — Composer: generate → pick → **Predict virality** → show breakdown → "Use AI-improved caption" → Schedule for 1 minute later.
5. **2:30–3:00** — Scheduler page → wait for cron → the post flips to Published. Live proof of automation.
6. **3:00–3:40** — Inbox: type an angry message → AI marks it negative / complaint / **P5 / needs human** → heatmap updates. "AI drafts, human approves."
7. **3:40–4:00** — Dashboard → "Generate weekly action plan" → close with Analytics.

Backup: run the seeded account offline; mock fallback keeps every AI button working without internet.

### Expected judge questions
- **"How is this different from ChatGPT?"** ChatGPT gives text. We give a stateful agent: a persistent brand profile, a database of posts/comments/analytics, a scheduler that acts on time, and a feedback loop that turns yesterday's numbers into tomorrow's plan.
- **"Is the data real?"** Auth, storage, scheduling, sentiment and all AI reasoning are real. Social platform metrics are simulated because Meta's Graph API needs a business account and app review — the integration point is one function in `scheduler.service.js`, clearly marked.
- **"What if Gemini fails or the key runs out?"** Every AI call goes through `askGeminiSafe`, which returns realistic mock data and tags the response `source: "mock"`. The product degrades, it never crashes.
- **"How do you prevent AI hallucinating influencers?"** The model never invents creators; it only ranks rows we fetched from MongoDB, and we re-join by handle server-side.
- **"How is the virality score validated?"** Today it's an LLM rubric over hook/emotion/clarity/shareability/CTA, stored per post alongside actual reach — which gives us the labelled dataset needed to train a real regression model next.
- **"Security?"** bcrypt hashing, JWT with expiry, `protect` on every private route, every query scoped to `req.user._id`, secrets in environment variables, CORS locked to the client origin.
- **"Why no TypeScript/Redux?"** Scope discipline. Context + a `useFetch` hook cover our state needs; adding Redux would be complexity without benefit for a 2-person 5-day build.
- **"How would this scale?"** Move Gemini calls to a job queue, cache trends per industry instead of per user (one call serves many brands), add Redis for hot analytics, and shard the Comment collection by user.

### Future scope
Real Instagram/LinkedIn Graph API publishing · competitor tracking · AI image/reel generation · A/B testing two captions with auto-winner selection · multi-brand agency workspaces with roles · crisis alerts (Telegram/WhatsApp ping when negative sentiment spikes) · a trained virality model using our own predicted-vs-actual data · multilingual + regional-language captions.

---

## Appendix — Deployment

**Backend → Render:** New Web Service → root `server` → build `npm install` → start `npm start` → env vars `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`. Whitelist `0.0.0.0/0` in Atlas Network Access.

**Frontend → Vercel:** Import repo → root `client` → framework Vite → env var `VITE_API_URL=https://<your-render-app>.onrender.com/api`. `vercel.json` already rewrites all routes to `index.html` so React Router deep links work.

**After deploy:** set `CLIENT_URL` on Render to the Vercel URL and redeploy so CORS passes. Render free tier sleeps after 15 minutes — hit the API once before your demo.

## Appendix — Manual Test Checklist

| # | Test | Expected |
|---|---|---|
| 1 | Register with an existing email | 400 "Email already registered" |
| 2 | Login with wrong password | 401 "Invalid email or password" |
| 3 | Call `/api/posts` with no token | 401 "Not authorized, no token" |
| 4 | Generate caption with empty topic | Client blocks with an inline error |
| 5 | Score virality with no caption | 400 "caption is required" |
| 6 | Schedule a post 1 min ahead | Status flips to published within 60 s |
| 7 | Delete another user's post id | 404 "Post not found" (isolation proven) |
| 8 | Remove `GEMINI_API_KEY`, retry all AI buttons | All work, `source: "mock"` |
| 9 | Send an abusive DM to the inbox | priority 5 + escalated chip |
| 10 | Resize to 375 px | Sidebar drawer, no horizontal scroll |
