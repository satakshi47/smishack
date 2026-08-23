import { useState } from "react";

const TOGGLES = [
  { key: "emailAlerts", label: "Email alerts for high-risk projects", default: true },
  { key: "smsAlerts", label: "SMS alerts for CCTV offline", default: false },
  { key: "autoAssign", label: "Auto-assign random inspections weekly", default: true },
];

export default function Settings() {
  const [state, setState] = useState(
    Object.fromEntries(TOGGLES.map((t) => [t.key, t.default]))
  );

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 mt-4 max-w-xl">
        <h3 className="font-semibold text-slate-100 mb-4">Preferences</h3>
        <div className="space-y-4">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-center justify-between">
              <p className="text-sm text-slate-300">{t.label}</p>
              <button
                onClick={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  state[t.key] ? "bg-blue-600" : "bg-navy-800"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-navy-900 rounded-full shadow transition-transform ${
                    state[t.key] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
