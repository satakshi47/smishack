# SMIS Prototype — Smart Monitoring & Inspection System

A working prototype: React dashboard (matches your Figma/screenshot layout) + Express
backend with live Socket.io updates + Leaflet map. Data is seeded in-memory so it
runs immediately with zero database setup — swap in Postgres later if you have time.

## Run it (2 terminals)

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Runs on **http://localhost:4000**. Seeds 250 projects, 12 inspectors, 40 inspections on boot.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173** — open this in your browser.

## What's real vs. what to build next

**Already working end-to-end:**
- Dashboard pulls live data from the backend (stat cards, charts, lists, map)
- "Schedule New Inspection" button calls a real risk-weighted assignment API,
  creates a real inspection record, and pushes it to the dashboard live via
  Socket.io (no page refresh needed)
- Map renders all 250 seeded projects as color-coded pins by risk level

**Still to build (see the step-by-step plan in chat):**
- Mobile app (Expo/React Native) — inspector view, camera + GPS capture,
  `POST /api/inspections/:id/submit` is already built and waiting for it
- CCTV Monitoring page — embed 1-2 looped sample video clips
- AI Risk Analytics page — show the risk_score breakdown as a visual
- Swap in-memory data (`backend/seed.js`) for Postgres if your team has time;
  the API routes and response shapes won't need to change

## Project structure
```
backend/
  server.js       — all API routes + Socket.io
  seed.js         — mock data generator (250 projects, inspectors, inspections)
frontend/
  src/
    api.js               — all backend calls in one place
    App.jsx              — layout shell (sidebar + topbar + dashboard)
    pages/Dashboard.jsx   — fetches data, wires live socket updates
    components/          — Sidebar, Topbar, StatCard, charts, lists, map
```

## Key API endpoints
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/stats` | 5 stat card numbers |
| GET | `/api/projects` | all projects (map) |
| GET | `/api/projects/high-risk?limit=4` | top risk projects |
| GET | `/api/projects/risk-distribution` | donut chart data |
| GET | `/api/risk-history` | 30-day line chart data |
| GET | `/api/inspections/recent?limit=4` | recent inspections list |
| POST | `/api/inspections/schedule` | random/weighted assignment — triggers live update |
| POST | `/api/inspections/:id/submit` | mobile app posts evidence here |
