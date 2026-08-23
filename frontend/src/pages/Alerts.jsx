import { useEffect, useState } from "react";
import { AlertTriangle, VideoOff, ClipboardX } from "lucide-react";
import { fetchProjects } from "../api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchProjects().then((projects) => {
      const list = [];
      projects
        .filter((p) => p.risk_level === "high")
        .slice(0, 8)
        .forEach((p) =>
          list.push({
            type: "risk",
            icon: AlertTriangle,
            color: "text-red-500 bg-red-500/10",
            title: `High risk score (${p.risk_score}) — ${p.name}`,
            subtitle: p.location,
          })
        );
      projects
        .filter((p) => !p.cctv_online)
        .slice(0, 5)
        .forEach((p) =>
          list.push({
            type: "cctv",
            icon: VideoOff,
            color: "text-amber-500 bg-amber-500/10",
            title: `CCTV offline — ${p.name}`,
            subtitle: p.location,
          })
        );
      projects
        .filter((p) => p.days_since_last_inspection > 60)
        .slice(0, 5)
        .forEach((p) =>
          list.push({
            type: "overdue",
            icon: ClipboardX,
            color: "text-blue-500 bg-blue-500/10",
            title: `No inspection in ${p.days_since_last_inspection} days — ${p.name}`,
            subtitle: p.location,
          })
        );
      setAlerts(list);
    });
  }, []);

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4">
        <h3 className="font-semibold text-slate-100 mb-4">
          Active Alerts <span className="text-slate-400 font-normal">({alerts.length})</span>
        </h3>
        <div className="space-y-2">
          {alerts.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${a.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.subtitle}</p>
                </div>
              </div>
            );
          })}
          {alerts.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">Loading alerts...</p>
          )}
        </div>
      </div>
    </div>
  );
}
