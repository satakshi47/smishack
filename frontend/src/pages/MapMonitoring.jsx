import { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import ProjectMap from "../components/ProjectMap";

export default function MapMonitoring() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const high = projects.filter((p) => p.risk_level === "high").length;
  const medium = projects.filter((p) => p.risk_level === "medium").length;
  const low = projects.filter((p) => p.risk_level === "low").length;

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 mb-5">
        <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-4">
          <p className="text-xs text-slate-400">Total Projects on Map</p>
          <p className="text-xl font-bold text-slate-100">{projects.length}</p>
        </div>
        <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-4">
          <p className="text-xs text-slate-400">High Risk</p>
          <p className="text-xl font-bold text-red-500">{high}</p>
        </div>
        <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-4">
          <p className="text-xs text-slate-400">Medium Risk</p>
          <p className="text-xl font-bold text-amber-500">{medium}</p>
        </div>
        <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-4">
          <p className="text-xs text-slate-400">Low Risk</p>
          <p className="text-xl font-bold text-emerald-500">{low}</p>
        </div>
      </div>

      <ProjectMap projects={projects} height={640} />
    </div>
  );
}
