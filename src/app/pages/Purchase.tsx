import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { mainCourse } from "../data/courseData";
import {
  Code2,
  Check,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
  Infinity,
} from "lucide-react";

type PaymentStatus = "idle" | "processing" | "success" | "failed";

export function Purchase() {
  const { user, grantAccess } = useAuth();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<"one-time" | "subscription">("one-time");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  // Mock payment processing
  const handlePayment = () => {
    setPaymentStatus("processing");

    // Симулируем обработку платежа (в реале это будет API вызов)
    setTimeout(() => {
      // 90% успех, 10% ошибка для демо
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setPaymentStatus("success");
        // Выдаем доступ к курсу
        grantAccess();

        // Через 2 секунды редирект в курс
        setTimeout(() => {
          navigate("/course/fullstack-web-dev");
        }, 2000);
      } else {
        setPaymentStatus("failed");
      }
    }, 2000);
  };

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code2 className="size-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Требуется авторизация
          </h2>
          <p className="text-gray-600 mb-6">
            Для покупки курса необходимо войти в систему или создать аккаунт
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Войти или зарегистрироваться
          </Link>
        </div>
      </div>
    );
  }

  // Если у пользователя уже есть доступ
  if (user.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            У вас уже есть доступ!
          </h2>
          <p className="text-gray-600 mb-6">
            Вы уже приобрели этот курс. Приступайте к обучению!
          </p>
          <Link
            to="/course/fullstack-web-dev"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Перейти к курсу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dimel's School
            </h1>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Payment Success */}
        {paymentStatus === "success" && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-1">
                  Оплата успешна!
                </h3>
                <p className="text-green-700">
                  Доступ к курсу открыт. Перенаправляем вас к обучению...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Failed */}
        {paymentStatus === "failed" && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <XCircle className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-1">
                  Ошибка оплаты
                </h3>
                <p className="text-red-700">
                  Не удалось обработать платеж. Пожалуйста, попробуйте снова или
                  свяжитесь с поддержкой.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Выберите способ оплаты
              </h1>
              <p className="text-gray-600">
                Получите полный доступ к курсу "{mainCourse.title}"
              </p>
            </div>

            {/* Payment Type Selector */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* One-time Purchase */}
              <button
                onClick={() => setPaymentType("one-time")}
                disabled={paymentStatus === "processing"}
                className={`p-6 border-2 rounded-xl text-left transition ${
                  paymentType === "one-time"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${
                  paymentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CreditCard className="size-6 text-blue-600" />
                  </div>
                  {paymentType === "one-time" && (
                    <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Разовая оплата
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${mainCourse.price}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Полный доступ к курсу навсегда
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Все модули и уроки
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Бессрочный доступ
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Сертификат по окончании
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Поддержка 24/7
                  </li>
                </ul>
              </button>

              {/* Subscription */}
              <button
                onClick={() => setPaymentType("subscription")}
                disabled={paymentStatus === "processing"}
                className={`p-6 border-2 rounded-xl text-left transition relative overflow-hidden ${
                  paymentType === "subscription"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${
                  paymentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ПОПУЛЯРНО
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Calendar className="size-6 text-purple-600" />
                  </div>
                  {paymentType === "subscription" && (
                    <div className="size-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Подписка
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-3xl font-bold text-purple-600">
                    ${mainCourse.subscriptionPrice}
                  </div>
                  <div className="text-gray-600">/месяц</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Гибкая оплата с доступом на период подписки
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Все модули и уроки
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Доступ пока активна подписка
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Сертификат по окончании
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    Отмена в любой момент
                  </li>
                </ul>
              </button>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Платежные данные
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер карты
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={paymentStatus === "processing"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Срок действия
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={paymentStatus === "processing"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={paymentStatus === "processing"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя владельца карты
                  </label>
                  <input
                    type="text"
                    placeholder="IVAN PETROV"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={paymentStatus === "processing"}
                  />
                </div>

                <button
                  onClick={handlePayment}
                  disabled={paymentStatus === "processing" || paymentStatus === "success"}
                  className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    paymentStatus === "processing" || paymentStatus === "success"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white"
                  }`}
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Обработка платежа...
                    </>
                  ) : paymentStatus === "success" ? (
                    <>
                      <CheckCircle2 className="size-5" />
                      Оплачено
                    </>
                  ) : (
                    <>
                      Оплатить $
                      {paymentType === "one-time"
                        ? mainCourse.price
                        : mainCourse.subscriptionPrice}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Нажимая "Оплатить", вы соглашаетесь с условиями использования и
                  политикой конфиденциальности
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Итого к оплате
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    {mainCourse.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {paymentType === "one-time"
                      ? "Разовая оплата"
                      : "Ежемесячная подписка"}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Цена курса:</span>
                    <span className="font-medium">
                      $
                      {paymentType === "one-time"
                        ? mainCourse.price
                        : mainCourse.subscriptionPrice}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Скидка:</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">Итого:</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        $
                        {paymentType === "one-time"
                          ? mainCourse.price
                          : mainCourse.subscriptionPrice}
                      </div>
                      {paymentType === "subscription" && (
                        <div className="text-sm text-gray-600">/месяц</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {paymentType === "one-time" ? "Бессрочный" : "Полный"} доступ
                    ко всем материалам
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Поддержка преподавателя</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Сертификат об окончании</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Доступ к сообществу студентов</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
