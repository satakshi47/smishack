import { Search, Bell, ChevronDown, User, Calendar } from "lucide-react";

export default function Topbar() {
    const email = localStorage.getItem("smis_user_email") || "admin@smis.gov.in";
  const displayName = email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-8 py-6 sticky top-0 z-20 bg-navy-950/90 backdrop-blur">
      <div>
        <h1 className="text-lg md:text-2xl font-bold text-white">
          Welcome back, Admin <span>👋</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Monitor NGO projects and inspections in real-time.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, inspections..."
            className="pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-navy-900 text-slate-100 placeholder:text-slate-500 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-navy-800">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            12
          </span>
        </button>

        <button className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-300" />
          </div>
         <div className="text-left">
  <p className="text-sm font-medium text-slate-100 leading-tight">{displayName}</p>
  <p className="text-[11px] text-slate-400 leading-tight">{email}</p>
</div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="hidden">{/* date chip lives in Dashboard header row */}</div>
    </header>
  );
}

export function DateChip() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 bg-navy-900">
      <Calendar className="w-4 h-4 text-slate-400" />
      {today}
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </button>
  );
}
