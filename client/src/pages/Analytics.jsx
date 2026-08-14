import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import useFetch from "../hooks/useFetch.js";
import { analyticsApi } from "../api/endpoints.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const COLORS = ["#3DDC97", "#FFC857", "#FF6B6B"];

export default function Analytics() {
  const ts = useFetch(() => analyticsApi.timeseries(), []);
  const top = useFetch(() => analyticsApi.topPosts(), []);

  if (ts.loading || top.loading) return <Loader />;
  if (ts.error || top.error) return <ErrorMessage message={ts.error || top.error} />;

  const data = ts.data.data || [];
  const last = data[data.length - 1] || {};
  const pie = [
    { name: "Positive", value: data.reduce((a, d) => a + d.positive, 0) },
    { name: "Neutral", value: data.reduce((a, d) => a + d.neutral, 0) },
    { name: "Negative", value: data.reduce((a, d) => a + d.negative, 0) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-title">Analytics</h1>
        <p className="text-sm text-slate-400">14-day performance, sentiment split and top performers.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={`Followers growth (now ${last.followers || 0})`}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8CFF" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#5B8CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1F2740" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: "#121829", border: "1px solid #1F2740", borderRadius: 12 }} />
            <Area type="monotone" dataKey="followers" stroke="#5B8CFF" fill="url(#g1)" strokeWidth={2} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Reach vs engagement">
          <LineChart data={data}>
            <CartesianGrid stroke="#1F2740" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: "#121829", border: "1px solid #1F2740", borderRadius: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="reach" stroke="#3DDC97" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="engagement" stroke="#FFC857" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Sentiment split">
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {pie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#121829", border: "1px solid #1F2740", borderRadius: 12 }} />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Top posts by reach">
          <BarChart data={(top.data.posts || []).map((p, i) => ({ name: `Post ${i + 1}`, reach: p.metrics.reach, virality: p.viralityScore }))}>
            <CartesianGrid stroke="#1F2740" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: "#121829", border: "1px solid #1F2740", borderRadius: 12 }} />
            <Bar dataKey="reach" fill="#5B8CFF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      <div className="card">
        <h2 className="mb-3 font-display text-white">Top performing captions</h2>
        <div className="space-y-2">
          {(top.data.posts || []).map((p) => (
            <div key={p._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-3 text-sm">
              <span className="text-slate-300">{p.caption}</span>
              <span className="text-xs text-slate-500">
                {p.metrics.reach.toLocaleString()} reach · {p.metrics.likes} likes · virality {p.viralityScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <h2 className="mb-4 font-display text-white">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
