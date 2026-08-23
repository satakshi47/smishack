import { useEffect, useState } from "react";
import { Camera, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { fetchAllInspections, submitInspectionEvidence, scheduleInspection, socket } from "../api";

const STATUS_STYLES = {
  completed: "bg-emerald-500/10 text-emerald-400",
  in_progress: "bg-amber-500/10 text-amber-400",
  scheduled: "bg-blue-500/10 text-blue-400",
};

export default function Inspections() {
  const [inspections, setInspections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const load = () => fetchAllInspections().then(setInspections);

  useEffect(() => {
    load();
    socket.on("new_inspection", load);
    socket.on("inspection_updated", load);
    return () => {
      socket.off("new_inspection", load);
      socket.off("inspection_updated", load);
    };
  }, []);

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      await scheduleInspection();
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
        {/* List */}
        <div className="lg:col-span-2 bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-100">
              All Inspections <span className="text-slate-400 font-normal">({inspections.length})</span>
            </h3>
            <button
              onClick={handleSchedule}
              disabled={scheduling}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 rounded-lg"
            >
              {scheduling ? "Assigning..." : "+ Schedule Random Inspection"}
            </button>
          </div>

          <div className="overflow-y-auto max-h-[520px] space-y-2">
            {inspections.map((insp) => (
              <button
                key={insp.id}
                onClick={() => setSelected(insp)}
                className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                  selected?.id === insp.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{insp.project_name}</p>
                  <p className="text-xs text-slate-400">
                    {insp.location} · Inspector: {insp.inspector_name}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[insp.status]}`}
                >
                  {insp.status.replace("_", " ")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Evidence submission panel */}
        <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 h-fit">
          <h3 className="font-semibold text-slate-100 mb-1">Inspector Evidence Submission</h3>
          <p className="text-xs text-slate-400 mb-4">
            This is the inspector-side flow — GPS + photo evidence get hashed and sent to
            the verified backend endpoint.
          </p>
          {selected ? (
            <EvidenceForm
              key={selected.id}
              inspection={selected}
              onSubmitted={(updated) => {
                setSelected(updated);
                load();
              }}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center py-10">
              Select an inspection from the list to submit evidence.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceForm({ inspection, onSubmitted }) {
  const [photoName, setPhotoName] = useState(null);
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | done | error
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(inspection.status === "completed");

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("done");
      },
      () => setLocStatus("error"),
      { timeout: 8000 }
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const updated = await submitInspectionEvidence(inspection.id, {
        evidence_url: photoName
          ? `https://placehold.co/300x200?text=${encodeURIComponent(photoName)}`
          : undefined,
        geo_lat: location?.lat ?? inspection.geo_lat,
        geo_long: location?.lng ?? inspection.geo_long,
      });
      setDone(true);
      onSubmitted(updated);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
        <p className="text-sm font-medium text-slate-200">Evidence verified &amp; submitted</p>
        <p className="text-xs text-slate-400 mt-1">{inspection.project_name}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-1">Project</p>
        <p className="text-sm font-medium text-slate-200">{inspection.project_name}</p>
        <p className="text-xs text-slate-400">{inspection.location}</p>
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-1.5">Evidence Photo</p>
        <label className="flex items-center gap-2 border border-dashed border-white/20 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-white/5 text-sm text-slate-400">
          <Camera className="w-4 h-4" />
          {photoName || "Upload photo"}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-1.5">GPS Location (Geo-tag)</p>
        <button
          onClick={fetchLocation}
          className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 w-full"
        >
          {locStatus === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          {locStatus === "done" && location
            ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : locStatus === "error"
            ? "Location unavailable — try again"
            : "Fetch current GPS location"}
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg"
      >
        {submitting ? "Submitting..." : "Submit Evidence"}
      </button>
    </div>
  );
}
