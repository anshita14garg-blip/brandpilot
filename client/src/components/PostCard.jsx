import { Trash2, CalendarClock, Flame } from "lucide-react";

const statusColor = {
  draft: "text-slate-400",
  scheduled: "text-amberx",
  published: "text-mint",
};

export default function PostCard({ post, onDelete }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between text-xs">
        <span className="chip capitalize">{post.platform}</span>
        <span className={`capitalize ${statusColor[post.status]}`}>{post.status}</span>
      </div>
      <p className="mt-3 text-sm text-slate-200">{post.caption}</p>
      <p className="mt-2 text-xs text-brand-soft">{(post.hashtags || []).join(" ")}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-amberx" /> {post.viralityScore}</span>
        {post.scheduledAt && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" /> {new Date(post.scheduledAt).toLocaleString()}
          </span>
        )}
        {onDelete && (
          <button onClick={() => onDelete(post._id)} className="text-coral hover:opacity-80">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
