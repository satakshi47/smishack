import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { fetchStats, fetchProjects } from "../api";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats);
    fetchProjects().then(setProjects);
  }, []);

  const downloadCSV = () => {
    const rows = [
      ["Project", "Location", "Risk Score", "Risk Level", "CCTV Status"],
      ...projects.map((p) => [p.name, p.location, p.risk_score, p.risk_level, p.cctv_online ? "Online" : "Offline"]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smis_projects_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-100">Monthly Summary Report</h3>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ReportStat label="Total Projects" value={stats.totalProjects} />
            <ReportStat label="High Risk" value={stats.highRiskProjects} />
            <ReportStat label="Pending Inspections" value={stats.pendingInspections} />
            <ReportStat label="CCTV Offline" value={stats.cctvOffline} />
            <ReportStat label="Completed Today" value={stats.completedToday} />
          </div>
        )}
      </div>
    </div>
  );
}

function ReportStat({ label, value }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 text-center">
      <p className="text-xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}
