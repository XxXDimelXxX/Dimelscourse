import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  Code2,
  LayoutDashboard,
  Users,
  DollarSign,
  BookOpen,
  LogOut,
  Home,
} from "lucide-react";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Проверка доступа админа
  if (!user || user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const navItems = [
    {
      path: "/admin",
      icon: LayoutDashboard,
      label: "Панель управления",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: "Пользователи",
    },
    {
      path: "/admin/payments",
      icon: DollarSign,
      label: "Платежи",
    },
    {
      path: "/admin/course",
      icon: BookOpen,
      label: "Курс",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/admin" className="flex items-center gap-2">
            <Code2 className="size-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500">Dimel's School</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">К платформе</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        active
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`size-5 ${active ? "text-purple-600" : "text-gray-500"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
