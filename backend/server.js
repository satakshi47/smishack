import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import {
  generateProjects,
  generateInspectors,
  generateInspections,
  generateRiskHistory,
} from "./seed.js";

// ---------- In-memory "database" ----------
// Swap these for real Postgres/Firebase queries when you have time.
// The API shape below is what your frontend depends on, so keep it stable.
const projects = generateProjects(250);
const inspectors = generateInspectors(12);
let inspections = generateInspections(projects, inspectors, 40);
const riskHistory = generateRiskHistory(30);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Dashboard client connected:", socket.id);
});

// ---------- Helpers ----------
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// ---------- Routes ----------

// GET /api/stats -> the 5 stat cards
app.get("/api/stats", (req, res) => {
  res.json({
    totalProjects: projects.length,
    highRiskProjects: projects.filter((p) => p.risk_level === "high").length,
    pendingInspections: inspections.filter((i) => i.status !== "completed").length,
    cctvOffline: projects.filter((p) => !p.cctv_online).length,
    completedToday: inspections.filter((i) => i.status === "completed" && isToday(i.submitted_at)).length,
  });
});

// GET /api/projects -> all projects (for map)
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// GET /api/projects/high-risk -> top N by risk_score
app.get("/api/projects/high-risk", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const topRisk = [...projects]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, limit);
  res.json(topRisk);
});

// GET /api/projects/risk-distribution -> for donut chart
app.get("/api/projects/risk-distribution", (req, res) => {
  const high = projects.filter((p) => p.risk_level === "high").length;
  const medium = projects.filter((p) => p.risk_level === "medium").length;
  const low = projects.filter((p) => p.risk_level === "low").length;
  res.json({ total: projects.length, high, medium, low });
});

// GET /api/risk-history -> for line chart
app.get("/api/risk-history", (req, res) => {
  res.json(riskHistory);
});

// GET /api/inspections/recent -> last N inspections
app.get("/api/inspections/recent", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  res.json(inspections.slice(0, limit));
});

// GET /api/inspections -> all inspections (used by mobile app to fetch assignment)
app.get("/api/inspections", (req, res) => {
  const { inspector_id, status } = req.query;
  let result = inspections;
  if (inspector_id) result = result.filter((i) => i.inspector_id === parseInt(inspector_id));
  if (status) result = result.filter((i) => i.status === status);
  res.json(result);
});

// POST /api/inspections/schedule -> the "Schedule New Inspection" button
// Picks a project (weighted toward higher risk) + an available inspector,
// creates a new "scheduled" inspection, and pushes it live to the dashboard.
app.post("/api/inspections/schedule", (req, res) => {
  // weighted random: higher risk_score = more likely to be picked
  const weighted = projects.flatMap((p) => Array(Math.max(1, Math.floor(p.risk_score / 10))).fill(p));
  const project = weighted[Math.floor(Math.random() * weighted.length)];
  const inspector = inspectors[Math.floor(Math.random() * inspectors.length)];

  const newInspection = {
    id: inspections.length + 1,
    project_id: project.id,
    project_name: project.name,
    location: project.location,
    inspector_id: inspector.id,
    inspector_name: inspector.name,
    status: "scheduled",
    scheduled_date: new Date().toISOString(),
    evidence_url: null,
    geo_lat: null,
    geo_long: null,
    submitted_at: null,
  };

  inspections = [newInspection, ...inspections];
  io.emit("new_inspection", newInspection);

  res.status(201).json(newInspection);
});

// POST /api/inspections/:id/submit -> mobile app submits evidence here
app.post("/api/inspections/:id/submit", (req, res) => {
  const id = parseInt(req.params.id);
  const { evidence_url, geo_lat, geo_long } = req.body;

  const idx = inspections.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Inspection not found" });

  inspections[idx] = {
    ...inspections[idx],
    status: "completed",
    evidence_url: evidence_url || "https://placehold.co/200x200?text=Evidence",
    geo_lat,
    geo_long,
    submitted_at: new Date().toISOString(),
  };

  io.emit("inspection_updated", inspections[idx]);
  res.json(inspections[idx]);
});

// GET /api/inspectors -> all inspectors (for Users & Teams page)
app.get("/api/inspectors", (req, res) => {
  const inspectorLoad = inspectors.map((insp) => {
    const assigned = inspections.filter((i) => i.inspector_id === insp.id);
    return {
      ...insp,
      total_assigned: assigned.length,
      completed: assigned.filter((i) => i.status === "completed").length,
      pending: assigned.filter((i) => i.status !== "completed").length,
    };
  });
  res.json(inspectorLoad);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Nirikshan Setu backend running on http://localhost:${PORT}`);
});
