import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, XCircle, Mail, Calendar, TrendingUp } from "lucide-react";
import { getErrorMessage } from "../../lib/formatters";
import {
  fetchAdminUsers,
  toggleAdminUserAccess,
  type AdminUser,
} from "../../lib/lms-api";

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    void loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const nextUsers = await fetchAdminUsers();
      setUsers(nextUsers);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Не удалось загрузить пользователей"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, users],
  );

  const toggleUserAccess = async (userId: string, grant: boolean) => {
    try {
      setPendingUserId(userId);
      await toggleAdminUserAccess(userId, {
        grant,
        courseSlug: "fullstack-web-dev",
      });
      await loadUsers();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Не удалось обновить доступ"),
      );
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Пользователи
        </h1>
        <p className="text-gray-600">
          Управление пользователями и их доступом к курсу
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {users.length}
          </div>
          <div className="text-sm text-gray-600">Всего пользователей</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((item) => item.hasAccess).length}
          </div>
          <div className="text-sm text-gray-600">С доступом</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {users.filter((item) => !item.hasAccess).length}
          </div>
          <div className="text-sm text-gray-600">Без доступа</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {users.length
              ? Math.round(users.reduce((acc, item) => acc + item.progress, 0) / users.length)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Средний прогресс</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Доступ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прогресс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип подписки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последняя активность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="size-3" />
                          {item.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.hasAccess ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        <CheckCircle className="size-4" />
                        Активен
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        <XCircle className="size-4" />
                        Нет доступа
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{item.progress}%</span>
                          <span>
                            {item.completedLessons}/{item.totalLessons}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                      {item.progress > 0 && (
                        <TrendingUp className="size-4 text-green-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {item.subscriptionType === "one-time" && "Разовая"}
                      {item.subscriptionType === "subscription" && "Подписка"}
                      {item.subscriptionType === "none" && "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(item.joined).toLocaleDateString("ru-RU")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(item.lastActive).toLocaleDateString("ru-RU")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserAccess(item.id, !item.hasAccess)}
                      disabled={pendingUserId === item.id}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                        item.hasAccess
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {pendingUserId === item.id
                        ? "Сохраняем..."
                        : item.hasAccess
                          ? "Отозвать"
                          : "Выдать"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Пользователи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
