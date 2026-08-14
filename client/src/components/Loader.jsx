export default function Loader({ full = false, label = "Loading..." }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-400 ${full ? "min-h-screen" : "py-10"}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  );
}
