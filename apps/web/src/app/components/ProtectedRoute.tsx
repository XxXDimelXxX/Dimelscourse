import { Navigate, Outlet } from "react-router";
import { Code2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AuthLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Code2 className="size-10 text-blue-600 animate-pulse" />
        <p className="text-sm text-gray-400">Загрузка...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthLoader />;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthLoader />;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
