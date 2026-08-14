import { useState } from "react";
import { Sparkles, Flame, Save, CalendarClock } from "lucide-react";
import { aiApi, postApi } from "../api/endpoints.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import ScoreRing from "../components/ScoreRing.jsx";

export default function Composer() {
  const [form, setForm] = useState({ topic: "", platform: "instagram", goal: "engagement" });
  const [options, setOptions] = useState([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [virality, setVirality] = useState(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    if (!form.topic) return setError("Enter a topic first");
    setBusy("generate"); setError(""); setMessage("");
    try {
      const d = await aiApi.caption(form);
      setOptions(d.options || []);
      setSource(d.source);
    } catch (err) { setError(err.message); } finally { setBusy(""); }
  };

  const pick = (o) => {
    setCaption(o.caption);
    setHashtags((o.hashtags || []).join(" "));
    setVirality(null);
  };

  const score = async () => {
    if (!caption) return setError("Pick or write a caption first");
    setBusy("score"); setError("");
    try { setVirality(await aiApi.virality({ caption, platform: form.platform })); }
    catch (err) { setError(err.message); } finally { setBusy(""); }
  };

  const save = async (schedule) => {
    if (!caption) return setError("Caption is empty");
    setBusy("save"); setError("");
    try {
      await postApi.create({
        caption,
        hashtags: hashtags.split(/\s+/).filter(Boolean),
        platform: form.platform,
        scheduledAt: schedule ? scheduledAt : undefined,
      });
      setMessage(schedule ? "Post scheduled!" : "Saved as draft!");
    } catch (err) { setError(err.message); } finally { setBusy(""); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-title">AI Composer</h1>
        <p className="text-sm text-slate-400">Generate on-brand captions, predict virality, then schedule.</p>
      </div>

      <ErrorMessage message={error} />
      {message && <div className="rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-sm text-mint">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card space-y-4">
          <div>
            <label className="label">What is the post about?</label>
            <input className="input" name="topic" value={form.topic} onChange={onChange} placeholder="e.g. new cold brew launch" />
          </div>
          <div>
            <label className="label">Platform</label>
            <select className="input" name="platform" value={form.platform} onChange={onChange}>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter / X</option>
            </select>
          </div>
          <div>
            <label className="label">Campaign goal</label>
            <select className="input" name="goal" value={form.goal} onChange={onChange}>
              <option value="engagement">Engagement</option>
              <option value="sales">Sales</option>
              <option value="awareness">Awareness</option>
              <option value="community">Community</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full" disabled={busy === "generate"}>
            <Sparkles className="h-4 w-4" /> {busy === "generate" ? "Writing..." : "Generate 3 options"}
          </button>
          {source && <p className="text-xs text-slate-500">source: {source}</p>}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {options.length > 0 && (
            <div className="grid gap-3 md:grid-cols-3">
              {options.map((o, i) => (
                <button key={i} onClick={() => pick(o)} className="card text-left transition hover:border-brand">
                  <p className="text-xs text-brand">{o.hook}</p>
                  <p className="mt-2 text-sm text-slate-200">{o.caption}</p>
                  <p className="mt-2 text-xs text-brand-soft">{(o.hashtags || []).join(" ")}</p>
                  <p className="mt-2 text-xs text-slate-500">Best time: {o.bestTime}</p>
                </button>
              ))}
            </div>
          )}

          <div className="card space-y-4">
            <div>
              <label className="label">Final caption</label>
              <textarea className="input min-h-[120px]" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div>
              <label className="label">Hashtags</label>
              <input className="input" value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#coffee #coldbrew" />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={score} className="btn-ghost" disabled={busy === "score"}>
                <Flame className="h-4 w-4 text-amberx" /> {busy === "score" ? "Scoring..." : "Predict virality"}
              </button>
              <button onClick={() => save(false)} className="btn-ghost" disabled={busy === "save"}>
                <Save className="h-4 w-4" /> Save draft
              </button>
              <input type="datetime-local" className="input w-auto" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              <button onClick={() => save(true)} className="btn-primary" disabled={!scheduledAt || busy === "save"}>
                <CalendarClock className="h-4 w-4" /> Schedule
              </button>
            </div>
          </div>

          {virality && (
            <div className="card flex flex-col gap-5 md:flex-row md:items-center">
              <ScoreRing score={virality.score} />
              <div className="flex-1 space-y-3">
                {Object.entries(virality.breakdown || {}).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs text-slate-400"><span className="capitalize">{k}</span><span>{v}</span></div>
                    <div className="mt-1 h-1.5 rounded bg-line"><div className="h-1.5 rounded bg-brand" style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
                <ul className="text-xs text-slate-400">{virality.reasons?.map((r) => <li key={r}>• {r}</li>)}</ul>
                {virality.improvedCaption && (
                  <button onClick={() => setCaption(virality.improvedCaption)} className="btn-ghost text-xs">
                    Use AI-improved caption
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
