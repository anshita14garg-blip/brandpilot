import { useState } from "react";
import { Send, ShieldAlert, Sparkles } from "lucide-react";
import useFetch from "../hooks/useFetch.js";
import { inboxApi } from "../api/endpoints.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SentimentHeatmap from "../components/SentimentHeatmap.jsx";

const sentimentStyle = {
  positive: "text-mint border-mint/40",
  neutral: "text-amberx border-amberx/40",
  negative: "text-coral border-coral/40",
};

export default function Inbox() {
  const { data, loading, error, refetch } = useFetch(() => inboxApi.list(), []);
  const heat = useFetch(() => inboxApi.heatmap(), []);
  const [incoming, setIncoming] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const simulate = async () => {
    if (!incoming.trim()) return;
    setBusy(true); setErr("");
    try {
      await inboxApi.receive({ message: incoming });
      setIncoming("");
      refetch();
      heat.refetch();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const approve = async (item) => {
    try { await inboxApi.reply(item._id, { reply: item.aiReply }); refetch(); }
    catch (e) { setErr(e.message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-title">AI Auto-Reply Inbox</h1>
        <p className="text-sm text-slate-400">Every comment and DM classified, prioritised and answered — you just approve.</p>
      </div>

      <ErrorMessage message={error || err} />

      <div className="card">
        <label className="label">Simulate an incoming comment / DM</label>
        <div className="flex flex-wrap gap-2">
          <input className="input flex-1" value={incoming} onChange={(e) => setIncoming(e.target.value)} placeholder="My order hasn't arrived yet!" />
          <button onClick={simulate} className="btn-primary" disabled={busy}>
            <Sparkles className="h-4 w-4" /> {busy ? "Analysing..." : "Send to AI"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          In production this is a webhook from the Instagram/Meta Graph API. For the demo we simulate it.
        </p>
      </div>

      <div className="card">
        <h2 className="font-display text-white">Sentiment heatmap (day × hour)</h2>
        <p className="mb-4 text-sm text-slate-400">
          Positive {heat.data?.totals?.positive || 0} · Neutral {heat.data?.totals?.neutral || 0} · Negative {heat.data?.totals?.negative || 0}
        </p>
        {heat.loading ? <Loader /> : <SentimentHeatmap grid={heat.data?.grid} />}
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {data?.items?.map((item) => (
            <div key={item._id} className="card">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="chip">{item.type}</span>
                <span className={`chip capitalize ${sentimentStyle[item.sentiment]}`}>{item.sentiment}</span>
                <span className="chip capitalize">{item.intent}</span>
                <span className="chip">P{item.priority}</span>
                {item.escalated && (
                  <span className="chip border-coral/50 text-coral flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> needs human
                  </span>
                )}
                <span className="ml-auto text-slate-500">{item.author}</span>
              </div>

              <p className="mt-3 text-slate-200">{item.message}</p>

              <div className="mt-3 rounded-xl border border-line bg-ink p-3">
                <p className="text-xs text-brand">AI draft reply</p>
                <p className="mt-1 text-sm text-slate-300">{item.aiReply || "—"}</p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {item.replied ? (
                  <span className="text-xs text-mint">✓ Replied</span>
                ) : (
                  <button onClick={() => approve(item)} className="btn-primary text-sm">
                    <Send className="h-4 w-4" /> Approve & send
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
