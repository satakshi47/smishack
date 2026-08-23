import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchProjects } from "../api";

const RISK_STYLES = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const filtered = projects.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    const matchesRisk = riskFilter === "all" || p.risk_level === riskFilter;
    return matchesQuery && matchesRisk;
  });

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="font-semibold text-slate-100">
            All Projects <span className="text-slate-400 font-normal">({filtered.length})</span>
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search project or city..."
                className="pl-9 pr-3 py-2 rounded-lg border border-white/10 bg-navy-800 text-slate-100 placeholder:text-slate-500 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-white/10 bg-navy-800 text-slate-100 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-white/10">
                <th className="py-2 pr-4 font-medium">Project</th>
                <th className="py-2 pr-4 font-medium">Location</th>
                <th className="py-2 pr-4 font-medium">Risk Score</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">CCTV</th>
                <th className="py-2 pr-4 font-medium">Last Inspected</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 60).map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2.5 pr-4 font-medium text-slate-200">{p.name}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{p.location}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${RISK_STYLES[p.risk_level]}`}>
                      {p.risk_score} · {p.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400 capitalize">{p.status}</td>
                  <td className="py-2.5 pr-4">
                    {p.cctv_online ? (
                      <span className="text-emerald-400 text-xs font-medium">Online</span>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Offline</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{p.days_since_last_inspection} days ago</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No projects match this search/filter.</p>
          )}
          {filtered.length > 60 && (
            <p className="text-center text-slate-400 text-xs py-3">
              Showing 60 of {filtered.length} — narrow your search to see more.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
