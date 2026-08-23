import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import MapMonitoring from "./pages/MapMonitoring";
import CCTVMonitoring from "./pages/CCTVMonitoring";
import Inspections from "./pages/Inspections";
import AIRiskAnalytics from "./pages/AIRiskAnalytics";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import UsersTeams from "./pages/UsersTeams";
import Settings from "./pages/Settings";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-navy-950 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        {/* Mobile-only hamburger bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-navy-900 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
          <span className="font-semibold text-slate-100 text-sm">SMIS</span>
        </div>
        <Topbar />
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/map-monitoring" element={<MapMonitoring />} />
                  <Route path="/cctv-monitoring" element={<CCTVMonitoring />} />
                  <Route path="/inspections" element={<Inspections />} />
                  <Route path="/ai-risk-analytics" element={<AIRiskAnalytics />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users-teams" element={<UsersTeams />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AppLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
