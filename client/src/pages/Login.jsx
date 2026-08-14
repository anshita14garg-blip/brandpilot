import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const useDemo = () => setForm({ email: "demo@brandpilot.ai", password: "demo1234" });

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="h-title">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Log in to your AI marketing manager.</p>

        <div className="mt-6 space-y-4">
          <ErrorMessage message={error} />
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          <button type="button" onClick={useDemo} className="btn-ghost w-full">Use demo credentials</button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          New here? <Link to="/register" className="text-brand">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
