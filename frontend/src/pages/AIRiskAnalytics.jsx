import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchProjects } from "../api";

export default function AIRiskAnalytics() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchProjects().then((all) => {
      setProjects(all);
      if (all.length) setSelectedId(all[0].id);
    });
  }, []);

  const selected = projects.find((p) => p.id === Number(selectedId));

  // Simulated anomaly-detection breakdown — in production these numbers come from
  // the AI/CCTV people-counting engine comparing reported attendance vs. camera counts.
  const breakdown = useMemo(() => {
    if (!selected) return [];
    const reportedAttendance = Math.floor(20 + (selected.risk_score / 100) * 15);
    const cctvCount = Math.max(2, reportedAttendance - Math.floor((selected.risk_score / 100) * 18));
    return [
      { metric: "Reported Attendance", value: reportedAttendance, fill: "#2563eb" },
      { metric: "CCTV People Count", value: cctvCount, fill: "#f59e0b" },
      { metric: "Past Complaints", value: selected.past_complaints, fill: "#ef4444" },
      { metric: "Days Since Inspection", value: selected.days_since_last_inspection, fill: "#94a3b8" },
    ];
  }, [selected]);

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h3 className="font-semibold text-slate-100">Risk Breakdown — Cross-Verification Engine</h3>
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-white/10 bg-navy-800 text-slate-100 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatBox label="Risk Score" value={selected.risk_score} accent="text-slate-100" />
              <StatBox
                label="Risk Level"
                value={selected.risk_level}
                accent={
                  selected.risk_level === "high"
                    ? "text-red-500"
                    : selected.risk_level === "medium"
                    ? "text-amber-500"
                    : "text-emerald-500"
                }
                capitalize
              />
              <StatBox label="CCTV Status" value={selected.cctv_online ? "Online" : "Offline"} accent={selected.cctv_online ? "text-emerald-500" : "text-red-500"} />
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" fontSize={12} tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <YAxis type="category" dataKey="metric" width={150} fontSize={12} tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{ background: "#152442", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Logic: when Reported Attendance is significantly higher than CCTV People Count,
              the anomaly engine raises the risk score — this is the core "don't just trust the
              report, verify it" signal from the architecture.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, accent, capitalize }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent} ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
