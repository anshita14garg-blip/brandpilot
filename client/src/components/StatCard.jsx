export default function StatCard({ label, value, sub, icon: Icon, accent = "text-brand" }) {
  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-1 font-display text-2xl text-white">{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </div>
      {Icon && <Icon className={`h-5 w-5 ${accent}`} />}
    </div>
  );
}
