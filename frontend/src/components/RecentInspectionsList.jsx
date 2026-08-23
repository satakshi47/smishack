import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const STATUS_STYLES = {
  completed: "text-emerald-400",
  in_progress: "text-amber-400",
  scheduled: "text-blue-400",
};

const STATUS_LABELS = {
  completed: "Completed",
  in_progress: "In Progress",
  scheduled: "Scheduled",
};

export default function RecentInspectionsList({ inspections, onSchedule, scheduling }) {
  const navigate = useNavigate();

  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Recent Inspections</h3>
        <button
          onClick={() => navigate("/inspections")}
          className="text-sm text-blue-400 font-medium hover:underline"
        >
          View All →
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {inspections.map((i) => (
          <button
            key={i.id}
            onClick={() => navigate("/inspections")}
            className="w-full flex items-center gap-3 text-left hover:bg-white/5 rounded-lg p-1 -m-1"
          >
            <div className="w-10 h-10 rounded-lg bg-navy-800 shrink-0 overflow-hidden">
              <img
                src={`https://placehold.co/80x80?text=${encodeURIComponent(i.project_name.slice(0, 2))}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{i.project_name}</p>
              <p className="text-xs text-slate-400 truncate">{i.location}, India</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xs font-semibold ${STATUS_STYLES[i.status]}`}>
                {STATUS_LABELS[i.status]}
              </p>
              <p className="text-[11px] text-slate-400">
                {new Date(i.scheduled_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onSchedule}
        disabled={scheduling}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        {scheduling ? "Assigning..." : "Schedule New Inspection"}
      </button>
    </div>
  );
}