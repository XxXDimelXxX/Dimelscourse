import { useState } from "react";
import { Search, CheckCircle, XCircle, Mail, Calendar, TrendingUp } from "lucide-react";

interface MockUser {
  id: string;
  name: string;
  email: string;
  hasAccess: boolean;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  joined: string;
  lastActive: string;
  subscriptionType: "one-time" | "subscription" | "none";
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock данные пользователей
  const users: MockUser[] = [
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan@test.com",
      hasAccess: true,
      progress: 45,
      completedLessons: 7,
      totalLessons: 16,
      joined: "2026-03-15",
      lastActive: "2026-03-22",
      subscriptionType: "one-time",
    },
    {
      id: "2",
      name: "Мария Смирнова",
      email: "maria@test.com",
      hasAccess: true,
      progress: 78,
      completedLessons: 12,
      totalLessons: 16,
      joined: "2026-03-10",
      lastActive: "2026-03-21",
      subscriptionType: "subscription",
    },
    {
      id: "3",
      name: "Алексей Козлов",
      email: "alex@test.com",
      hasAccess: false,
      progress: 0,
      completedLessons: 0,
      totalLessons: 16,
      joined: "2026-03-19",
      lastActive: "2026-03-20",
      subscriptionType: "none",
    },
    {
      id: "4",
      name: "Ольга Новикова",
      email: "olga@test.com",
      hasAccess: true,
      progress: 25,
      completedLessons: 4,
      totalLessons: 16,
      joined: "2026-03-18",
      lastActive: "2026-03-22",
      subscriptionType: "subscription",
    },
    {
      id: "5",
      name: "Дмитрий Соколов",
      email: "dmitry@test.com",
      hasAccess: true,
      progress: 100,
      completedLessons: 16,
      totalLessons: 16,
      joined: "2026-02-01",
      lastActive: "2026-03-15",
      subscriptionType: "one-time",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserAccess = (userId: string) => {
    // В реальном приложении здесь будет API вызов
    console.log("Toggle access for user:", userId);
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {users.length}
          </div>
          <div className="text-sm text-gray-600">Всего пользователей</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.hasAccess).length}
          </div>
          <div className="text-sm text-gray-600">С доступом</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {users.filter((u) => !u.hasAccess).length}
          </div>
          <div className="text-sm text-gray-600">Без доступа</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(
              users.reduce((acc, u) => acc + u.progress, 0) / users.length
            )}
            %
          </div>
          <div className="text-sm text-gray-600">Средний прогресс</div>
        </div>
      </div>

      {/* Search */}
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

      {/* Users Table */}
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="size-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.hasAccess ? (
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
                          <span>{user.progress}%</span>
                          <span>
                            {user.completedLessons}/{user.totalLessons}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${user.progress}%` }}
                          />
                        </div>
                      </div>
                      {user.progress > 0 && (
                        <TrendingUp className="size-4 text-green-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {user.subscriptionType === "one-time" && "Разовая"}
                      {user.subscriptionType === "subscription" && "Подписка"}
                      {user.subscriptionType === "none" && "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(user.joined).toLocaleDateString("ru-RU")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(user.lastActive).toLocaleDateString("ru-RU")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserAccess(user.id)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                        user.hasAccess
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {user.hasAccess ? "Отозвать" : "Выдать"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Пользователи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
