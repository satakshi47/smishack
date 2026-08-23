import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

export default function RiskDonutChart({ distribution }) {
  if (!distribution) return null;
  const { total, high, medium, low } = distribution;
  const data = [
    { name: "High Risk", key: "high", value: high },
    { name: "Medium Risk", key: "medium", value: medium },
    { name: "Low Risk", key: "low", value: low },
  ];
  const pct = (n) => ((n / total) * 100).toFixed(1);

  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5">
      <h3 className="font-semibold text-slate-100 mb-4">Projects by Risk Level</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.key} fill={COLORS[d.key]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {data.map((d) => (
            <div key={d.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[d.key] }}
              />
              <div>
                <p className="text-slate-200 leading-tight">{d.name}</p>
                <p className="text-slate-400 text-xs leading-tight">
                  {d.value} ({pct(d.value)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
