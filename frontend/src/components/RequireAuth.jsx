import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const isAuthed = localStorage.getItem("smis_auth") === "true";
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
