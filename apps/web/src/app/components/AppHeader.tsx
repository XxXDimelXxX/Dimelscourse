import { Link, useLocation, useNavigate } from "react-router";
import {
  Code2,
  LogOut,
  BookOpen,
  ChevronLeft,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AppHeaderProps {
  /** Override the page title shown next to the logo (e.g. course title) */
  title?: string;
  /** Extra action buttons rendered on the right before logout */
  actions?: React.ReactNode;
}

export function AppHeader({ title, actions }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const path = location.pathname;

  const inAdmin = path.startsWith("/admin");
  const inCourse = path.startsWith("/course/") && !inAdmin;
  const inCourses = path === "/courses";
  const inDashboard = path === "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine back navigation
  const backTo = inAdmin
    ? "/dashboard"
    : inCourse
      ? user ? "/dashboard" : "/"
      : inCourses
        ? "/dashboard"
        : null;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: logo + optional back + title */}
        <div className="flex items-center gap-3 min-w-0">
          {backTo ? (
            <Link
              to={backTo}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
              aria-label="Назад"
            >
              <ChevronLeft className="size-5 text-gray-600" />
            </Link>
          ) : null}

          <Link
            to={inAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Code2 className={`size-7 ${inAdmin ? "text-purple-600" : "text-blue-600"}`} />
            {!title && (
              <span
                className={`text-xl font-bold bg-clip-text text-transparent hidden sm:inline ${
                  inAdmin
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600"
                }`}
              >
                Dimel's School
              </span>
            )}
          </Link>

          {title && (
            <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
          )}
        </div>

        {/* Right: nav links + actions + logout */}
        <div className="flex items-center gap-2">
          {/* Context-aware nav links */}
          {inDashboard && (
            <Link
              to="/courses"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Каталог</span>
            </Link>
          )}

          {inAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">К платформе</span>
            </Link>
          )}

          {/* Admin link on non-admin pages */}
          {isAdmin && !inAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              Админка
            </Link>
          )}

          {/* Page-specific actions */}
          {actions}

          {/* Logout */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              aria-label="Выйти"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
