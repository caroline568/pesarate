import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function RequireAuth({ children }) {
  const { status } = useAuth(); const location = useLocation();
  if (status === "loading") return <div className="grid min-h-screen place-items-center bg-[#f6f8fb] text-slate-600"><p className="text-xs">Checking your session…</p></div>;
  if (status !== "signed-in") return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
