import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { fetchInspectors } from "../api";

export default function UsersTeams() {
  const [inspectors, setInspectors] = useState([]);

  useEffect(() => {
    fetchInspectors().then(setInspectors);
  }, []);

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4">
        <h3 className="font-semibold text-slate-100 mb-4">
          Inspection Team (PMU) <span className="text-slate-400 font-normal">({inspectors.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {inspectors.map((insp) => (
            <div key={insp.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">{insp.name}</p>
                <p className="text-xs text-slate-400 capitalize">{insp.role} · {insp.total_assigned} assigned</p>
              </div>
              <div className="ml-auto text-right shrink-0">
                <p className="text-xs text-emerald-400 font-medium">{insp.completed} done</p>
                <p className="text-xs text-amber-500">{insp.pending} pending</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
