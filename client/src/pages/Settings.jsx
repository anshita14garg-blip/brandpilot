import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi } from "../api/endpoints.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.brand?.name || "",
    industry: user?.brand?.industry || "",
    tone: user?.brand?.tone || "Friendly",
    audience: user?.brand?.audience || "",
    keywords: (user?.brand?.keywords || []).join(", "),
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSaved(false);
    try {
      const d = await authApi.updateBrand({
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      });
      setUser(d.user);
      setSaved(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="h-title">Brand Settings</h1>
        <p className="text-sm text-slate-400">This is the brain of the agent — every AI prompt is built from this.</p>
      </div>

      <form onSubmit={save} className="card space-y-4">
        <ErrorMessage message={error} />
        {saved && <div className="rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-sm text-mint">Brand profile saved.</div>}

        <div><label className="label">Brand name</label><input className="input" name="name" value={form.name} onChange={onChange} /></div>
        <div><label className="label">Industry</label><input className="input" name="industry" value={form.industry} onChange={onChange} placeholder="Coffee D2C" /></div>
        <div>
          <label className="label">Brand tone</label>
          <select className="input" name="tone" value={form.tone} onChange={onChange}>
            {["Friendly", "Bold", "Professional", "Witty", "Luxury", "Playful"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div><label className="label">Target audience</label><input className="input" name="audience" value={form.audience} onChange={onChange} placeholder="Gen Z, 18-24, metro cities" /></div>
        <div><label className="label">Keywords (comma separated)</label><input className="input" name="keywords" value={form.keywords} onChange={onChange} /></div>

        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save brand profile"}</button>
      </form>
    </div>
  );
}
