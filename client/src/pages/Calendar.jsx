import useFetch from "../hooks/useFetch.js";
import { postApi } from "../api/endpoints.js";
import PostCard from "../components/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Calendar() {
  const { data, loading, error, refetch } = useFetch(() => postApi.list(), []);

  const remove = async (id) => {
    await postApi.remove(id);
    refetch();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const posts = data.posts || [];
  const groups = [
    ["Scheduled", posts.filter((p) => p.status === "scheduled")],
    ["Drafts", posts.filter((p) => p.status === "draft")],
    ["Published", posts.filter((p) => p.status === "published")],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="h-title">Content Scheduler</h1>
        <p className="text-sm text-slate-400">
          A cron job on the server auto-publishes scheduled posts every minute.
        </p>
      </div>

      {groups.map(([title, list]) => (
        <section key={title}>
          <h2 className="mb-3 font-display text-white">{title} <span className="text-slate-500">({list.length})</span></h2>
          {list.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing here yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => <PostCard key={p._id} post={p} onDelete={remove} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
