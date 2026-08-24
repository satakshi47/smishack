import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail } from "lucide-react";

// Prototype-level login: checks against a fixed demo credential and stores a
// flag in localStorage. In production this would call a real auth endpoint
// (Supabase Auth / Express + JWT) — for the hackathon prototype we're keeping
// it frontend-only since no real user database is wired up yet.
const DEMO_EMAIL = "admin@smis.gov.in";
const DEMO_PASSWORD = "admin123";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem("smis_auth", "true");
      localStorage.setItem("smis_user_email", email);
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F4B] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-navy-900 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-100">Nirikshan Setu Login</h1>
          <p className="text-xs text-slate-400 text-center mt-1">
            Smart Monitoring &amp; Inspection System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smis.gov.in"
                className="w-full pl-9 pr-3 py-2.5 border border-white/10 bg-navy-800 text-slate-100 placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-white/10 bg-navy-800 text-slate-100 placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-5">
          Demo credentials — Email: {DEMO_EMAIL} · Password: {DEMO_PASSWORD}
        </p>
      </div>
    </div>
  );
}
