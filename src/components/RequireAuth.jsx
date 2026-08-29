import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Gates the workspace behind sign-in: the landing page is public, but every
 * route inside AppShell requires an account, per the product decision that
 * saved conversions/alerts should always be tied to a signed-in user.
 */
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-paper">
        <div className="flex items-center gap-3 text-sm text-paper/50">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
          Checking your session…
        </div>
      </div>
    );
  }

  if (status !== "signed-in") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
