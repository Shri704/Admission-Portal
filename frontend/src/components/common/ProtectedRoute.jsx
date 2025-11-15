import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader.jsx";
import useAuth from "../../hooks/useAuth.js";

/**
 * Protects routes based on authentication and role-based access.
 * - Shows loader while initializing authentication.
 * - Redirects unauthorized users to login or specified redirect path.
 */
export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/",
  fallback = "/student/login",
}) {
  const location = useLocation();
  const { isAuthenticated, user, initializing } = useAuth();

  // ================== Loading State ==================
  if (initializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-white/80">
        <Loader fullScreen label="Verifying Access..." />
      </div>
    );
  }

  // ================== Not Logged In ==================
  if (!isAuthenticated) {
    return <Navigate to={fallback} replace state={{ from: location }} />;
  }

  // ================== Role Restriction ==================
  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // ================== Access Granted ==================
  return (
    <div className="animate-fade-in">
      <Outlet />
    </div>
  );
}
