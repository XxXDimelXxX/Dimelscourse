import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Users, DollarSign, BookOpen, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { getErrorMessage } from "../../lib/formatters";
import { fetchAdminOverview, type AdminOverviewResponse } from "../../lib/lms-api";

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const nextOverview = await fetchAdminOverview();
      setOverview(nextOverview);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Не удалось загрузить админ-панель"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stats = overview?.stats ?? {
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    completionRate: 0,
  };

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

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {errorMessage}
        </div>
      )}

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
          <div className="text-sm text-gray-600">Средний прогресс</div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="h-72 rounded-xl border border-gray-200 bg-white animate-pulse" />
          <div className="h-72 rounded-xl border border-gray-200 bg-white animate-pulse" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
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
              {overview?.recentPayments.length ? (
                overview.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{payment.user}</p>
                      <p className="text-sm text-gray-500">
                        {payment.type === "one-time" ? "Разовая оплата" : "Подписка"} •{" "}
                        {new Date(payment.date).toLocaleDateString("ru-RU")}
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
                ))
              ) : (
                <div className="text-sm text-gray-500">Оплат пока нет.</div>
              )}
            </div>
          </div>

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
              {overview?.recentUsers.length ? (
                overview.recentUsers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.hasAccess ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="size-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {item.progress}%
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
                ))
              ) : (
                <div className="text-sm text-gray-500">Пользователей пока нет.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
