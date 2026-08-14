import { useState } from "react";
import { TrendingUp, Clock, Sparkles } from "lucide-react";
import { aiApi } from "../api/endpoints.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Trends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  const hunt = async () => {
    setLoading(true); setError("");
    try {
      const d = await aiApi.trends();
      setTrends(d.trends || []);
      setSource(d.source);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-title">AI Trend Hunter</h1>
          <p className="text-sm text-slate-400">Trends scored by heat AND fit with your brand — with a closing window.</p>
        </div>
        <button onClick={hunt} className="btn-primary" disabled={loading}>
          <Sparkles className="h-4 w-4" /> {loading ? "Scanning..." : "Scan trends"}
        </button>
      </div>

      <ErrorMessage message={error} />
      {loading && <Loader label="Hunting trends..." />}
      {source && <p className="text-xs text-slate-500">source: {source}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trends.map((t) => (
          <div key={t._id || t.title} className="card">
            <div className="flex items-center justify-between">
              <span className="chip capitalize">{t.platform}</span>
              <span className="flex items-center gap-1 text-xs text-amberx">
                <Clock className="h-3.5 w-3.5" /> {t.windowHours}h left
              </span>
            </div>
            <h3 className="mt-3 font-display text-white">{t.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.contentIdea}</p>
            <p className="mt-2 text-xs text-slate-500">{t.why}</p>

            <div className="mt-4 space-y-2">
              <Bar label="Heat" value={t.heatScore} color="bg-coral" />
              <Bar label="Brand fit" value={t.fitScore} color="bg-mint" />
            </div>

            <p className="mt-3 flex items-center gap-1 text-xs text-brand">
              <TrendingUp className="h-3.5 w-3.5" /> Opportunity score {Math.round((t.heatScore + t.fitScore) / 2)}
            </p>
          </div>
        ))}
      </div>

      {!loading && trends.length === 0 && (
        <p className="text-sm text-slate-500">No trends yet — hit "Scan trends".</p>
      )}
    </div>
  );
}

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}</span></div>
      <div className="mt-1 h-1.5 rounded bg-line"><div className={`h-1.5 rounded ${color}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}
