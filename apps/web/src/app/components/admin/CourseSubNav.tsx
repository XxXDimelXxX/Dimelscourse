import { Link, useLocation } from "react-router";
import { Settings, List, FileText } from "lucide-react";

interface CourseSubNavProps {
  slug: string;
}

export function CourseSubNav({ slug }: CourseSubNavProps) {
  const location = useLocation();

  const tabs = [
    {
      path: `/admin/courses/${slug}`,
      label: "Основное",
      icon: Settings,
      exact: true,
    },
    {
      path: `/admin/courses/${slug}/structure`,
      label: "Модули и уроки",
      icon: List,
    },
    {
      path: `/admin/courses/${slug}/resources`,
      label: "Ресурсы",
      icon: FileText,
    },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.path, tab.exact);

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              active
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
