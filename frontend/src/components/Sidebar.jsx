import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  X,
  ShieldCheck,
  LayoutGrid,
  FolderKanban,
  MapPin,
  Video,
  ClipboardCheck,
  BrainCircuit,
  Bell,
  FileBarChart,
  Users,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, path: "/" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Map Monitoring", icon: MapPin, path: "/map-monitoring" },
  { label: "CCTV Monitoring", icon: Video, path: "/cctv-monitoring" },
  { label: "Inspections", icon: ClipboardCheck, path: "/inspections" },
  { label: "AI Risk Analytics", icon: BrainCircuit, path: "/ai-risk-analytics" },
  { label: "Alerts", icon: Bell, path: "/alerts", badge: 12 },
  { label: "Reports", icon: FileBarChart, path: "/reports" },
  { label: "Users & Teams", icon: Users, path: "/users-teams" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

// isOpen + onClose control the sidebar on MOBILE only.
// On desktop (md and up) it always shows, ignoring these props.
export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("smis_auth");
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`w-64 shrink-0 bg-navy-950 text-slate-300 flex flex-col h-screen
          fixed md:sticky top-0 left-0 z-50 transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">SMIS</p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Smart Monitoring &amp; Inspection System
              </p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon, path, badge }) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"
                    : "hover:bg-navy-800 text-slate-300"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              {badge && (
                <span className="bg-red-500 text-white text-[11px] rounded-full px-1.5 py-0.5 leading-none">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-navy-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-800">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white leading-tight">Admin User</p>
              <p className="text-[11px] text-slate-400 leading-tight">Logout</p>
            </div>
            <ChevronDown className="w-4 h-4 ml-auto text-slate-400" />
          </button>
        </div>
      </aside>
    </>
  );
}
