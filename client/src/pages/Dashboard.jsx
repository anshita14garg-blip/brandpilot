import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, Send, MessageSquare, Flame, Sparkles } from "lucide-react";
import useFetch from "../hooks/useFetch.js";
import { analyticsApi, aiApi } from "../api/endpoints.js";
import StatCard from "../components/StatCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Dashboard() {
  const { data, loading, error } = useFetch(() => analyticsApi.overview(), []);
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const getPlan = async () => {
    setPlanLoading(true);
    setPlanError("");
    try {
      setPlan((await aiApi.strategy()).plan);
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const c = data.cards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-title">Command Center</h1>
        <p className="text-sm text-slate-400">Everything your AI manager did and what it wants to do next.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total reach" value={c.reach.toLocaleString()} icon={Eye} />
        <StatCard label="Total likes" value={c.likes.toLocaleString()} icon={Heart} accent="text-coral" />
        <StatCard label="Posts published" value={c.published} sub={`${c.scheduled} scheduled`} icon={Send} accent="text-mint" />
        <StatCard label="Avg virality" value={c.avgVirality} sub="AI predicted" icon={Flame} accent="text-amberx" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-white">This week's AI action plan</h2>
            <button onClick={getPlan} className="btn-primary" disabled={planLoading}>
              <Sparkles className="h-4 w-4" /> {planLoading ? "Thinking..." : "Generate plan"}
            </button>
          </div>

          <ErrorMessage message={planError} />

          {!plan && !planLoading && (
            <p className="mt-4 text-sm text-slate-400">
              Click generate — the agent reads your last 7 days of analytics and returns a day-by-day plan.
            </p>
          )}

          {plan && (
            <div className="mt-4 space-y-4">
              <p className="text-slate-200">{plan.summary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-mint">Wins</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-400">
                    {plan.wins?.map((x) => <li key={x}>• {x}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-coral">Problems</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-400">
                    {plan.problems?.map((x) => <li key={x}>• {x}</li>)}
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                {plan.actions?.map((a) => (
                  <div key={a.day + a.task} className="rounded-xl border border-line p-3">
                    <p className="text-sm text-white"><span className="text-brand">{a.day}</span> — {a.task}</p>
                    <p className="text-xs text-slate-500">{a.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display text-white">Inbox pressure</h2>
          <p className="mt-3 text-4xl font-display text-white">{c.pendingReplies}</p>
          <p className="text-sm text-slate-400">unanswered messages of {c.comments} total</p>
          <Link to="/app/inbox" className="btn-ghost mt-4 w-full">
            <MessageSquare className="h-4 w-4" /> Open Auto-Reply Inbox
          </Link>
          <Link to="/app/composer" className="btn-primary mt-2 w-full">
            <Sparkles className="h-4 w-4" /> Create a post
          </Link>
        </div>
      </div>
    </div>
  );
}
