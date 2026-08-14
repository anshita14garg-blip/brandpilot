import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form);
      navigate("/app/settings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="h-title">Create your brand account</h1>
        <p className="mt-1 text-sm text-slate-400">Takes 20 seconds. No credit card.</p>

        <div className="mt-6 space-y-4">
          <ErrorMessage message={error} />
          <div>
            <label className="label">Name</label>
            <input className="input" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand">Login</Link>
        </p>
      </form>
    </div>
  );
}
