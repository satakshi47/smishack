// seed.js — generates realistic mock data so the dashboard isn't empty on day one.
// Swap this out for real Postgres queries later; the shape of the data stays the same.

const CITIES = [
  { name: "Delhi", lat: 28.6139, long: 77.2090 },
  { name: "Lucknow", lat: 26.8467, long: 80.9462 },
  { name: "Ghaziabad", lat: 28.6692, long: 77.4538 },
  { name: "Kanpur", lat: 26.4499, long: 80.3319 },
  { name: "Noida", lat: 28.5355, long: 77.3910 },
];

const NGO_NAMES = [
  "ABC Education NGO", "Udaan Foundation", "Seva Kendra", "Nayi Disha Society",
  "Roshni Welfare Trust", "Asha Kiran NGO", "Vikas Sewa Samiti", "Ummeed Foundation",
  "Pragati Care Society", "Sankalp Welfare NGO",
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function riskLevelFromScore(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function jitterCoord(base, spread = 0.15) {
  return base + randomBetween(-spread, spread);
}

export function generateProjects(count = 250) {
  const projects = [];
  for (let i = 1; i <= count; i++) {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const score = Math.floor(randomBetween(5, 95));
    const ngoName = NGO_NAMES[Math.floor(Math.random() * NGO_NAMES.length)];
    projects.push({
      id: i,
      name: `${ngoName} - Project ${i}`,
      ngo_name: ngoName,
      location: city.name,
      lat: jitterCoord(city.lat),
      long: jitterCoord(city.long),
      risk_score: score,
      risk_level: riskLevelFromScore(score),
      status: Math.random() > 0.15 ? "active" : "inactive",
      cctv_online: Math.random() > 0.08,
      days_since_last_inspection: Math.floor(randomBetween(0, 90)),
      past_complaints: Math.floor(randomBetween(0, 6)),
    });
  }
  return projects;
}

export function generateInspectors(count = 12) {
  const inspectors = [];
  for (let i = 1; i <= count; i++) {
    inspectors.push({
      id: i,
      name: `Inspector ${i}`,
      role: "pmu",
      available: true,
    });
  }
  return inspectors;
}

const STATUSES = ["completed", "in_progress", "scheduled"];

export function generateInspections(projects, inspectors, count = 40) {
  const inspections = [];
  const now = Date.now();
  for (let i = 1; i <= count; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    const inspector = inspectors[Math.floor(Math.random() * inspectors.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const scheduledDate = new Date(now - randomBetween(0, 6) * 86400000);
    inspections.push({
      id: i,
      project_id: project.id,
      project_name: project.name,
      location: project.location,
      inspector_id: inspector.id,
      inspector_name: inspector.name,
      status,
      scheduled_date: scheduledDate.toISOString(),
      evidence_url: status === "completed" ? "https://placehold.co/200x200?text=Evidence" : null,
      geo_lat: status === "completed" ? project.lat : null,
      geo_long: status === "completed" ? project.long : null,
      submitted_at: status === "completed" ? scheduledDate.toISOString() : null,
    });
  }
  // newest first
  return inspections.sort((a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date));
}

// 30 days of risk-count history for the line chart
export function generateRiskHistory(days = 30) {
  const history = [];
  const now = new Date();
  let high = 10, medium = 28, low = 205;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    high = Math.max(2, high + Math.round(randomBetween(-2, 2)));
    medium = Math.max(5, medium + Math.round(randomBetween(-3, 3)));
    low = Math.max(100, low + Math.round(randomBetween(-4, 4)));
    history.push({
      date: date.toISOString().slice(0, 10),
      high,
      medium,
      low,
    });
  }
  return history;
}
