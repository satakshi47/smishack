import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// NOTE: React.StrictMode intentionally removed. In dev mode it double-mounts
// every component, and react-leaflet's MapContainer binds a real Leaflet
// instance to the DOM node on mount — the double-mount left two Leaflet
// instances bound to the same container, which caused click/drag/zoom to
// misbehave. This is a well-known react-leaflet + StrictMode interaction.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
