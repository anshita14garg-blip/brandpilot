export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
      {message}
    </div>
  );
}
