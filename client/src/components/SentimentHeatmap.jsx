const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function cellColor(cell) {
  if (!cell.count) return "bg-line/40";
  const avg = cell.score / cell.count;
  if (avg > 0.4) return "bg-mint/80";
  if (avg > 0) return "bg-mint/40";
  if (avg === 0) return "bg-amberx/40";
  if (avg > -0.5) return "bg-coral/50";
  return "bg-coral/90";
}

export default function SentimentHeatmap({ grid = [] }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[620px]">
        <div className="mb-1 flex gap-1 pl-10 text-[10px] text-slate-500">
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="w-5 text-center">{h % 3 === 0 ? h : ""}</span>
          ))}
        </div>
        {(grid.length ? grid : DAYS.map((d) => ({ day: d, hours: Array.from({ length: 24 }, () => ({ score: 0, count: 0 })) }))).map((row) => (
          <div key={row.day} className="mb-1 flex items-center gap-1">
            <span className="w-10 text-xs text-slate-500">{row.day}</span>
            {row.hours.map((cell, h) => (
              <div
                key={h}
                title={`${row.day} ${h}:00 — ${cell.count} messages`}
                className={`h-5 w-5 rounded ${cellColor(cell)}`}
              />
            ))}
          </div>
        ))}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-coral/90" /> negative</span>
          <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-amberx/40" /> neutral</span>
          <span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-mint/80" /> positive</span>
        </div>
      </div>
    </div>
  );
}
