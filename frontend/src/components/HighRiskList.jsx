import { useNavigate } from "react-router-dom";

export default function HighRiskList({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">High Risk Projects</h3>
        <button
          onClick={() => navigate("/projects")}
          className="text-sm text-blue-400 font-medium hover:underline"
        >
          View All →
        </button>
      </div>
      <div className="space-y-4">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate("/projects")}
            className="w-full flex items-center gap-3 text-left hover:bg-white/5 rounded-lg p-1 -m-1"
          >
            <div className="w-10 h-10 rounded-lg bg-navy-800 shrink-0 overflow-hidden">
              <img
                src={`https://placehold.co/80x80?text=${encodeURIComponent(p.ngo_name.slice(0, 2))}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{p.ngo_name}</p>
              <p className="text-xs text-slate-400 truncate">{p.location}, India</p>
            </div>
            <span className="bg-red-500/15 text-red-400 text-xs font-semibold rounded-full px-2.5 py-1 shrink-0">
              {p.risk_score} High Risk
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}