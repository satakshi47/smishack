import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const high = payload.find((p) => p.dataKey === "high")?.value;
  const medium = payload.find((p) => p.dataKey === "medium")?.value;
  const low = payload.find((p) => p.dataKey === "low")?.value;

  return (
    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold mb-1">
        {new Date(label).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="text-red-400">High Risk: {high}</p>
      <p className="text-amber-400">Medium Risk: {medium}</p>
      <p className="text-emerald-400">Low Risk: {low}</p>
    </div>
  );
}

export default function RiskLineChart({ data }) {
  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Risk Overview (This Month)</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            }
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="high" stroke="#ef4444" fill="#ef4444" fillOpacity={0.12} strokeWidth={2} />
          <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={2} />
          <Area type="monotone" dataKey="low" stroke="#10b981" fill="#10b981" fillOpacity={0.12} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 mt-2 text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk
        </span>
      </div>
    </div>
  );
}
