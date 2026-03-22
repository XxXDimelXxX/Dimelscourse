import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, DollarSign, Calendar, Filter } from "lucide-react";

interface MockPayment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  type: "one-time" | "subscription";
  status: "success" | "pending" | "failed";
  date: string;
  paymentMethod: string;
  transactionId: string;
}

export function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "pending" | "failed">("all");

  // Mock данные оплат
  const payments: MockPayment[] = [
    {
      id: "1",
      userId: "1",
      userName: "Иван Петров",
      userEmail: "ivan@test.com",
      amount: 299,
      type: "one-time",
      status: "success",
      date: "2026-03-22 14:30",
      paymentMethod: "Visa •••• 4242",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3fX",
    },
    {
      id: "2",
      userId: "2",
      userName: "Мария Смирнова",
      userEmail: "maria@test.com",
      amount: 59,
      type: "subscription",
      status: "success",
      date: "2026-03-22 10:15",
      paymentMethod: "MasterCard •••• 5555",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3fY",
    },
    {
      id: "3",
      userId: "3",
      userName: "Алексей Козлов",
      userEmail: "alex@test.com",
      amount: 299,
      type: "one-time",
      status: "failed",
      date: "2026-03-21 18:45",
      paymentMethod: "Visa •••• 1234",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3fZ",
    },
    {
      id: "4",
      userId: "4",
      userName: "Ольга Новикова",
      userEmail: "olga@test.com",
      amount: 59,
      type: "subscription",
      status: "pending",
      date: "2026-03-21 16:20",
      paymentMethod: "Visa •••• 9876",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3gA",
    },
    {
      id: "5",
      userId: "5",
      userName: "Дмитрий Соколов",
      userEmail: "dmitry@test.com",
      amount: 299,
      type: "one-time",
      status: "success",
      date: "2026-03-20 12:00",
      paymentMethod: "MasterCard •••• 8888",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3gB",
    },
    {
      id: "6",
      userId: "2",
      userName: "Мария Смирнова",
      userEmail: "maria@test.com",
      amount: 59,
      type: "subscription",
      status: "success",
      date: "2026-02-22 10:15",
      paymentMethod: "MasterCard •••• 5555",
      transactionId: "ch_3MtwBw2eZvKYlo2C0mYjZ3gC",
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Платежи</h1>
        <p className="text-gray-600">
          История платежей и управление транзакциями
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {payments.length}
          </div>
          <div className="text-sm text-gray-600">Всего транзакций</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Успешные оплаты</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            ${pendingAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">В обработке</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {payments.filter((p) => p.status === "failed").length}
          </div>
          <div className="text-sm text-gray-600">Отклоненные</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по пользователю или ID транзакции..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Все статусы</option>
              <option value="success">Успешные</option>
              <option value="pending">В обработке</option>
              <option value="failed">Отклоненные</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Метод оплаты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID транзакции
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <DollarSign className="size-4" />
                      {payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {payment.type === "one-time" ? "Разовая" : "Подписка"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === "success" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        <CheckCircle className="size-4" />
                        Успешно
                      </span>
                    )}
                    {payment.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        <Clock className="size-4" />
                        В обработке
                      </span>
                    )}
                    {payment.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                        <XCircle className="size-4" />
                        Ошибка
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(payment.date).toLocaleString("ru-RU")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                      {payment.transactionId}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Платежи не найдены</p>
          </div>
        )}
      </div>

      {/* Webhook Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">
          Информация о webhooks
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Статусы платежей обновляются автоматически через webhooks от платежного
          провайдера. При успешной оплате пользователю автоматически выдается доступ
          к курсу.
        </p>
        <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Success webhook:</span>
            <span className="text-green-600 font-medium">→ Выдача доступа</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending webhook:</span>
            <span className="text-yellow-600 font-medium">
              → Ожидание подтверждения
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Failed webhook:</span>
            <span className="text-red-600 font-medium">→ Уведомление пользователю</span>
          </div>
        </div>
      </div>
    </div>
  );
}
