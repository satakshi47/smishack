import { useEffect, useState } from "react";
import { LayoutGrid, ShieldAlert, ClipboardList, VideoOff, CheckCircle2 } from "lucide-react";
import {
  fetchStats,
  fetchProjects,
  fetchHighRiskProjects,
  fetchRiskDistribution,
  fetchRiskHistory,
  fetchRecentInspections,
  scheduleInspection,
  socket,
} from "../api";
import { DateChip } from "../components/Topbar";
import StatCard from "../components/StatCard";
import RiskLineChart from "../components/RiskLineChart";
import RiskDonutChart from "../components/RiskDonutChart";
import HighRiskList from "../components/HighRiskList";
import RecentInspectionsList from "../components/RecentInspectionsList";
import ProjectMap from "../components/ProjectMap";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [riskHistory, setRiskHistory] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [scheduling, setScheduling] = useState(false);

  const loadAll = async () => {
    const [s, p, hr, d, rh, ri] = await Promise.all([
      fetchStats(),
      fetchProjects(),
      fetchHighRiskProjects(4),
      fetchRiskDistribution(),
      fetchRiskHistory(),
      fetchRecentInspections(4),
    ]);
    setStats(s);
    setProjects(p);
    setHighRisk(hr);
    setDistribution(d);
    setRiskHistory(rh);
    setInspections(ri);
  };

  useEffect(() => {
    loadAll();

    // Live updates: when any client schedules or submits an inspection,
    // refresh the recent list + stats without a full reload.
    socket.on("new_inspection", (inspection) => {
      setInspections((prev) => [inspection, ...prev].slice(0, 4));
      fetchStats().then(setStats);
    });
    socket.on("inspection_updated", (inspection) => {
      setInspections((prev) =>
        prev.map((i) => (i.id === inspection.id ? inspection : i))
      );
      fetchStats().then(setStats);
    });

    return () => {
      socket.off("new_inspection");
      socket.off("inspection_updated");
    };
  }, []);

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      await scheduleInspection();
      // socket event will update the list; refresh stats as a fallback too
    } catch (e) {
      console.error("Failed to schedule inspection", e);
    } finally {
      setScheduling(false);
    }
  };

  if (!stats) {
    return <div className="p-8 text-slate-400 text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="flex justify-end -mt-2 mb-4">
        <DateChip />
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard
          icon={LayoutGrid}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
          label="Total Projects"
          value={stats.totalProjects}
          delta="↑ 12 this month"
          deltaColor="text-emerald-400"
        />
        <StatCard
          icon={ShieldAlert}
          iconBg="bg-red-500/10"
          iconColor="text-red-400"
          label="High Risk Projects"
          value={stats.highRiskProjects}
          delta="↑ 3 this week"
          deltaColor="text-red-500"
        />
        <StatCard
          icon={ClipboardList}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-400"
          label="Pending Inspections"
          value={stats.pendingInspections}
          delta="↑ 5 today"
          deltaColor="text-amber-400"
        />
        <StatCard
          icon={VideoOff}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
          label="CCTV Offline"
          value={stats.cctvOffline}
          delta="↓ 2 this week"
          deltaColor="text-emerald-400"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-400"
          label="Completed Today"
          value={stats.completedToday}
          delta="↑ 2 today"
          deltaColor="text-emerald-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-1">
          <RiskLineChart data={riskHistory} />
        </div>
        <RiskDonutChart distribution={distribution} />
        <HighRiskList projects={highRisk} />
      </div>

      {/* Map + Recent inspections row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ProjectMap projects={projects} />
        </div>
        <RecentInspectionsList
          inspections={inspections}
          onSchedule={handleSchedule}
          scheduling={scheduling}
        />
      </div>
    </div>
  );
}
