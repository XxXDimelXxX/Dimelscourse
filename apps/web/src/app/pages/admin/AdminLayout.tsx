import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, DollarSign, BookOpen } from "lucide-react";
import { AppHeader } from "../../components/AppHeader";

export function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

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
      path: "/admin/courses",
      icon: BookOpen,
      label: "Курсы",
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
      <AppHeader />

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
