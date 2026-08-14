import { useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { aiApi, influencerApi } from "../api/endpoints.js";
import useFetch from "../hooks/useFetch.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Influencers() {
  const [filters, setFilters] = useState({ niche: "", minFollowers: 0 });
  const { data, loading, error, refetch } = useFetch(() => influencerApi.list(filters), []);
  const [matches, setMatches] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const runMatch = async () => {
    setAiLoading(true); setAiError("");
    try { setMatches((await aiApi.influencers(filters)).matches || []); }
    catch (err) { setAiError(err.message); } finally { setAiLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-title">AI Collaboration Finder</h1>
        <p className="text-sm text-slate-400">Ranked by niche fit, engagement quality and cost efficiency — not vanity followers.</p>
      </div>

      <div className="card flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="label">Niche</label>
          <input className="input" value={filters.niche} onChange={(e) => setFilters({ ...filters, niche: e.target.value })} placeholder="fitness, tech, food..." />
        </div>
        <div className="min-w-[180px] flex-1">
          <label className="label">Min followers</label>
          <input className="input" type="number" value={filters.minFollowers} onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })} />
        </div>
        <button onClick={refetch} className="btn-ghost"><Users className="h-4 w-4" /> Filter</button>
        <button onClick={runMatch} className="btn-primary" disabled={aiLoading}>
          <Sparkles className="h-4 w-4" /> {aiLoading ? "Matching..." : "AI match top 5"}
        </button>
      </div>

      <ErrorMessage message={error || aiError} />

      {matches.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-white">AI recommended collabs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => (
              <div key={m.handle} className="card border-brand/40">
                <div className="flex items-center gap-3">
                  <img src={m.profile?.avatar} alt={m.handle} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-display text-white">{m.handle}</p>
                    <p className="text-xs text-slate-500">{m.profile?.niche} · {m.profile?.location}</p>
                  </div>
                  <span className="ml-auto font-display text-mint">{m.matchScore}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{m.reason}</p>
                <p className="mt-2 text-xs text-brand">Idea: {m.collabIdea}</p>
                <p className="mt-2 text-xs text-slate-500">Expected reach ~{Number(m.expectedReach).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-white">Creator database</h2>
        {loading ? <Loader /> : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-3">Creator</th><th>Niche</th><th>Followers</th>
                  <th>Engagement</th><th>Location</th><th>Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {data?.influencers?.map((i) => (
                  <tr key={i._id} className="border-t border-line">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={i.avatar} alt={i.handle} className="h-8 w-8 rounded-full" />
                        <span>{i.handle}</span>
                      </div>
                    </td>
                    <td className="capitalize">{i.niche}</td>
                    <td>{i.followers.toLocaleString()}</td>
                    <td className={i.engagementRate > 4 ? "text-mint" : ""}>{i.engagementRate}%</td>
                    <td>{i.location}</td>
                    <td>{i.collabCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
