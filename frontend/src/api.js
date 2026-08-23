import axios from "axios";
import { io } from "socket.io-client";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const api = axios.create({ baseURL: API_BASE });

// Single shared socket connection for live dashboard updates
export const socket = io(API_BASE, { autoConnect: true });

export const fetchStats = () => api.get("/api/stats").then((r) => r.data);
export const fetchProjects = () => api.get("/api/projects").then((r) => r.data);
export const fetchHighRiskProjects = (limit = 4) =>
  api.get(`/api/projects/high-risk?limit=${limit}`).then((r) => r.data);
export const fetchRiskDistribution = () =>
  api.get("/api/projects/risk-distribution").then((r) => r.data);
export const fetchRiskHistory = () => api.get("/api/risk-history").then((r) => r.data);
export const fetchRecentInspections = (limit = 4) =>
  api.get(`/api/inspections/recent?limit=${limit}`).then((r) => r.data);
export const fetchAllInspections = () => api.get("/api/inspections").then((r) => r.data);
export const fetchInspectors = () => api.get("/api/inspectors").then((r) => r.data);
export const submitInspectionEvidence = (id, payload) =>
  api.post(`/api/inspections/${id}/submit`, payload).then((r) => r.data);
export const scheduleInspection = () =>
  api.post("/api/inspections/schedule").then((r) => r.data);
