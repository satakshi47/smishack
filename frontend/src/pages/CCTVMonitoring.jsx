import { useEffect, useState } from "react";
import { Circle, VideoOff } from "lucide-react";
import { fetchProjects } from "../api";

// Free sample loop clips (Google's public test videos) — stand in for real ONVIF/RTSP
// CCTV feeds. In production these <video> tags would be replaced by an RTSP-to-WebRTC
// stream (e.g. via mediamtx / go2rtc) pointed at each project's camera.
const SAMPLE_CLIPS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
];

export default function CCTVMonitoring() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then((all) => {
      // Show a handful of projects as "camera feeds" — mix of online/offline
      setProjects(all.slice(0, 6));
    });
  }, []);

  return (
    <div className="px-4 sm:px-8 pb-10">
      <div className="flex items-center justify-between mt-4 mb-4">
        <p className="text-sm text-slate-400">
          Showing {projects.length} live camera feeds. Offline cameras are flagged automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p, idx) => (
          <div key={p.id} className="bg-navy-900 rounded-xl border border-white/10 shadow-sm overflow-hidden">
            <div className="relative bg-black aspect-video">
              {p.cctv_online ? (
                <video
                  className="w-full h-full object-cover"
                  src={SAMPLE_CLIPS[idx % SAMPLE_CLIPS.length]}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <VideoOff className="w-6 h-6" />
                  <p className="text-xs">Camera Offline</p>
                </div>
              )}
              <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                <Circle
                  className={`w-2 h-2 ${p.cctv_online ? "fill-red-500 text-red-500" : "fill-slate-400 text-slate-400"}`}
                />
                {p.cctv_online ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-200 truncate">{p.name}</p>
              <p className="text-xs text-slate-400">{p.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
