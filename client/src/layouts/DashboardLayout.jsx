import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, PenLine, TrendingUp, Users, MessageSquare,
  BarChart3, CalendarDays, Settings as Cog, LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/composer", label: "AI Composer", icon: PenLine },
  { to: "/app/trends", label: "Trend Hunter", icon: TrendingUp },
  { to: "/app/influencers", label: "Collab Finder", icon: Users },
  { to: "/app/inbox", label: "Auto-Reply Inbox", icon: MessageSquare },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/calendar", label: "Scheduler", icon: CalendarDays },
  { to: "/app/settings", label: "Brand Settings", icon: Cog },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-panel p-4 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg text-white">Brand<span className="text-brand">Pilot</span></span>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-brand/15 text-brand" : "text-slate-400 hover:bg-line/50 hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-line/50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/80 px-4 py-3 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-400">Managing</p>
            <p className="font-display text-white">{user?.brand?.name || "My Brand"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="chip">{user?.brand?.tone} tone</span>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-ink">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
