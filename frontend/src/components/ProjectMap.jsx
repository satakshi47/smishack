// Fully offline SVG-based regional map — no external tile server, no map
// library, no network calls. Plots each project as a dot using a simple
// linear lat/long -> SVG-coordinate projection. Good enough for a rough
// regional visualization (Delhi-NCR + UP cities); not a precise geographic
// projection, so it should not be used for anything needing real accuracy.

const RISK_COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

// Bounding box that comfortably covers all seeded cities (Delhi, Ghaziabad,
// Noida, Lucknow, Kanpur) plus their +-0.15 degree jitter.
const LAT_MIN = 26.2;
const LAT_MAX = 28.95;
const LONG_MIN = 76.85;
const LONG_MAX = 81.25;

// Reference cities drawn as static labels so the scatter has real-world
// context, independent of whatever projects happen to be passed in.
const REFERENCE_CITIES = [
  { name: "Delhi", lat: 28.6139, long: 77.209 },
  { name: "Ghaziabad", lat: 28.6692, long: 77.4538 },
  { name: "Noida", lat: 28.5355, long: 77.391 },
  { name: "Lucknow", lat: 26.8467, long: 80.9462 },
  { name: "Kanpur", lat: 26.4499, long: 80.3319 },
];

const VB_W = 600;
const VB_H = 460;
const PAD = 40;

function project(lat, long) {
  const x = PAD + ((long - LONG_MIN) / (LONG_MAX - LONG_MIN)) * (VB_W - 2 * PAD);
  const y = PAD + (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (VB_H - 2 * PAD);
  return { x, y };
}

export default function ProjectMap({ projects, height = 420 }) {
  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5">
      <h3 className="font-semibold text-slate-100 mb-4">Project Location Map</h3>

      <div className="relative rounded-xl overflow-hidden bg-[#0b1220]" style={{ height: `${height}px` }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="smisGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1c2b47" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#smisGrid)" />
          <rect
            x={PAD - 10}
            y={PAD - 10}
            width={VB_W - 2 * (PAD - 10)}
            height={VB_H - 2 * (PAD - 10)}
            fill="none"
            stroke="#2a3752"
            strokeWidth="1.5"
            rx="14"
          />

          {/* Compass */}
          <g transform={`translate(${VB_W - 40}, 30)`}>
            <circle r="14" fill="#141b2d" stroke="#2a3752" />
            <text y="-4" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
              N
            </text>
            <path d="M0,-1 L3,4 L0,2 L-3,4 Z" fill="#94a3b8" />
          </g>

          {/* Reference city labels for geographic context */}
          {REFERENCE_CITIES.map((c) => {
            const { x, y } = project(c.lat, c.long);
            return (
              <g key={c.name}>
                <circle cx={x} cy={y} r="3" fill="#475569" />
                <text x={x + 7} y={y + 3} fontSize="10" fill="#64748b" fontWeight="500">
                  {c.name}
                </text>
              </g>
            );
          })}

          {/* Project markers */}
          {projects.map((p) => {
            const { x, y } = project(p.lat, p.long);
            return (
              <circle
                key={p.id}
                cx={x}
                cy={y}
                r="5"
                fill={RISK_COLORS[p.risk_level]}
                stroke="#0b1220"
                strokeWidth="1.5"
                opacity="0.9"
              >
                <title>
                  {p.ngo_name} — {p.location} (Risk: {p.risk_score})
                </title>
              </circle>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute top-3 right-3 bg-navy-900 rounded-lg shadow-md px-4 py-3 text-xs z-10">
          <p className="font-semibold text-slate-200 mb-2">Risk Level</p>
          <div className="space-y-1.5">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Risk
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Risk
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk
            </span>
          </div>
        </div>

        <p className="absolute bottom-2 left-3 text-[10px] text-slate-600">
          Offline schematic view — not to exact scale
        </p>
      </div>
    </div>
  );
}
