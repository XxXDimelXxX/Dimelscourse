import { Link } from "react-router";
import { Users, DollarSign, BookOpen, TrendingUp, CheckCircle, XCircle } from "lucide-react";

export function AdminDashboard() {
  // Mock данные для админки
  const stats = {
    totalUsers: 142,
    activeSubscriptions: 89,
    totalRevenue: 15680,
    completionRate: 67,
  };

  const recentPayments = [
    { id: "1", user: "ivan@test.com", amount: 299, type: "one-time", status: "success", date: "2026-03-20" },
    { id: "2", user: "maria@test.com", amount: 59, type: "subscription", status: "success", date: "2026-03-20" },
    { id: "3", user: "alex@test.com", amount: 299, type: "one-time", status: "failed", date: "2026-03-19" },
    { id: "4", user: "olga@test.com", amount: 59, type: "subscription", status: "pending", date: "2026-03-19" },
  ];

  const recentUsers = [
    { id: "1", name: "Иван Петров", email: "ivan@test.com", hasAccess: true, progress: 45, joined: "2026-03-15" },
    { id: "2", name: "Мария Смирнова", email: "maria@test.com", hasAccess: true, progress: 78, joined: "2026-03-10" },
    { id: "3", name: "Алексей Козлов", email: "alex@test.com", hasAccess: false, progress: 0, joined: "2026-03-19" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Панель управления
        </h1>
        <p className="text-gray-600">
          Обзор ключевых метрик и активности платформы
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="size-6 text-blue-600" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalUsers}
          </div>
          <div className="text-sm text-gray-600">Всего пользователей</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.activeSubscriptions}
          </div>
          <div className="text-sm text-gray-600">Активных подписок</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="size-6 text-purple-600" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Общий доход</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BookOpen className="size-6 text-orange-600" />
            </div>
            <TrendingUp className="size-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Процент завершения</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Последние оплаты</h2>
            <Link
              to="/admin/payments"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Смотреть все
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{payment.user}</p>
                  <p className="text-sm text-gray-500">
                    {payment.type === "one-time" ? "Разовая оплата" : "Подписка"} •{" "}
                    {payment.date}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    ${payment.amount}
                  </span>
                  {payment.status === "success" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Успешно
                    </span>
                  )}
                  {payment.status === "failed" && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Ошибка
                    </span>
                  )}
                  {payment.status === "pending" && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      В обработке
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Новые пользователи</h2>
            <Link
              to="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Смотреть все
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {user.hasAccess ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {user.progress}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Нет доступа</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
