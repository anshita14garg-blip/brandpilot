// Pure-SVG circular score (no extra library) used for the Virality Score.
export default function ScoreRing({ score = 0, size = 110 }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const color = score >= 75 ? "#3DDC97" : score >= 50 ? "#FFC857" : "#FF6B6B";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#1F2740" strokeWidth="8" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="8" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="52%" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="Sora">{score}</text>
    </svg>
  );
}
