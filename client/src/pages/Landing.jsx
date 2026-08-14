import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Users, MessageSquare, Flame, BarChart3, CalendarDays, ShieldCheck } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Caption + Hashtag Studio", text: "3 on-brand options per idea, with hooks, CTAs and best posting time." },
  { icon: TrendingUp, title: "AI Trend Hunter", text: "Live trend radar scored by heat AND fit with your brand, with a countdown window." },
  { icon: Users, title: "AI Collab Finder", text: "Ranks creators by niche fit, engagement quality and cost efficiency — not follower count." },
  { icon: MessageSquare, title: "AI Auto-Reply Inbox", text: "Classifies every comment/DM, drafts a reply and escalates brand-risk messages to you." },
  { icon: Flame, title: "Virality Predictor", text: "Scores a post BEFORE you publish and rewrites the weak parts." },
  { icon: BarChart3, title: "Sentiment Heatmap", text: "Day x hour heatmap showing exactly when your audience turns happy or angry." },
  { icon: CalendarDays, title: "Scheduler + Analytics", text: "Queue posts, auto-publish with cron, track reach, engagement and top performers." },
  { icon: ShieldCheck, title: "Human-in-the-loop", text: "The agent acts, you approve. Nothing risky ever goes out on its own." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-display text-xl text-white">Brand<span className="text-brand">Pilot</span> AI</span>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/register" className="btn-primary">Get started free</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center">
        <span className="chip">Not a caption generator. An AI marketing manager.</span>
        <h1 className="mt-6 font-display text-4xl leading-tight text-white md:text-6xl">
          Your brand's social media,<br className="hidden md:block" /> run by an <span className="text-brand">AI agent</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">
          BrandPilot studies your brand, hunts trends, writes and schedules posts, predicts virality,
          replies to your comments and DMs, and hands you a weekly action plan — every single day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary shadow-glow">Start free</Link>
          <Link to="/login" className="btn-ghost">Try the demo account</Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">demo@brandpilot.ai / demo1234</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card transition hover:border-brand/50">
              <Icon className="h-5 w-5 text-brand" />
              <h3 className="mt-3 font-display text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="card">
          <h2 className="h-title">How the agent works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["1. Learn", "You describe your brand once — industry, tone, audience, keywords."],
              ["2. Plan", "The agent hunts trends and builds a weekly content plan that fits your brand."],
              ["3. Act", "It writes, scores, schedules and publishes — and replies to your inbox."],
              ["4. Report", "It shows what worked, what hurt sentiment, and what to do next week."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-display text-brand">{t}</p>
                <p className="mt-1 text-sm text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-sm text-slate-500">
        Built with MERN + Gemini · BrandPilot AI
      </footer>
    </div>
  );
}
