import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  createCheckout,
  fetchDashboard,
  fetchPublishedCourses,
  processPaymentWebhook,
  type CourseCard,
} from "../lib/lms-api";
import {
  Code2,
  Check,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";

type PaymentStatus = "idle" | "processing" | "success" | "failed";

export function Purchase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseCard | null>(null);
  const [paymentType, setPaymentType] = useState<"one-time" | "subscription">("one-time");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [hasAccess, setHasAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const courses = await fetchPublishedCourses();
      const featuredCourse = courses[0] ?? null;
      setCourse(featuredCourse);

      if (user) {
        const dashboard = await fetchDashboard(user.id);
        setHasAccess(dashboard.courses.some((item) => item.courseSlug === featuredCourse?.slug));
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось загрузить страницу оплаты",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !course) {
      return;
    }

    try {
      setPaymentStatus("processing");
      setErrorMessage(null);

      const checkout = await createCheckout({
        userId: user.id,
        courseSlug: course.slug,
        paymentType,
        paymentMethodLabel:
          paymentType === "one-time" ? "Visa •••• 4242" : "MasterCard •••• 5555",
      });

      if (checkout.accessGranted) {
        setPaymentStatus("success");
        setHasAccess(true);
        window.setTimeout(() => {
          navigate(`/course/${course.slug}`);
        }, 1200);
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      const isSuccess = Math.random() > 0.1;

      const processed = await processPaymentWebhook({
        paymentId: checkout.id,
        status: isSuccess ? "success" : "failed",
        eventId: `demo_${Date.now()}`,
        failureReason: isSuccess ? undefined : "Провайдер не подтвердил оплату",
      });

      if (processed.status === "success") {
        setPaymentStatus("success");
        setHasAccess(true);
        window.setTimeout(() => {
          navigate(`/course/${course.slug}`);
        }, 1200);
      } else {
        setPaymentStatus("failed");
        setErrorMessage(processed.failureReason ?? "Не удалось обработать платеж");
      }
    } catch (error) {
      setPaymentStatus("failed");
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось обработать платеж",
      );
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-16 rounded-xl bg-white border border-gray-100 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[36rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
            <div className="h-[36rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md w-full text-center text-red-700">
          {errorMessage ?? "Курс не найден"}
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            У вас уже есть доступ
          </h2>
          <p className="text-gray-600 mb-6">
            Доступ к курсу уже активен. Можно сразу продолжать обучение.
          </p>
          <Link
            to={`/course/${course.slug}`}
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
        {paymentStatus === "success" && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-1">
                  Оплата успешна
                </h3>
                <p className="text-green-700">
                  Webhook подтвердил платеж и доступ к курсу уже открыт.
                </p>
              </div>
            </div>
          </div>
        )}

        {(paymentStatus === "failed" || errorMessage) && (
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
                  {errorMessage ?? "Не удалось обработать платеж. Попробуйте еще раз."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Выберите способ оплаты
              </h1>
              <p className="text-gray-600">
                Получите доступ к курсу "{course.title}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setPaymentType("one-time")}
                disabled={paymentStatus === "processing"}
                className={`p-6 border-2 rounded-xl text-left transition ${
                  paymentType === "one-time"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${paymentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  ${course.priceUsd}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Полный доступ к курсу навсегда
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("subscription")}
                disabled={paymentStatus === "processing"}
                className={`p-6 border-2 rounded-xl text-left transition relative overflow-hidden ${
                  paymentType === "subscription"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${paymentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MVP
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
                    ${course.subscriptionPriceUsd}
                  </div>
                  <div className="text-gray-600">/месяц</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Доступ активируется после подтверждения платежа webhook-ом
                </p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Платежные данные
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={paymentStatus === "processing"}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={paymentStatus === "processing"}
                  />
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={paymentStatus === "processing"}
                  />
                </div>
                <input
                  type="text"
                  placeholder="IVAN PETROV"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={paymentStatus === "processing"}
                />

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paymentStatus === "processing" || paymentStatus === "success"}
                  className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    paymentStatus === "processing" || paymentStatus === "success"
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white"
                  }`}
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Создаем платеж и ждем webhook...
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
                        ? course.priceUsd
                        : course.subscriptionPriceUsd}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Итого к оплате
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {paymentType === "one-time" ? "Разовая оплата" : "Ежемесячная подписка"}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">Итого:</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        ${paymentType === "one-time" ? course.priceUsd : course.subscriptionPriceUsd}
                      </div>
                      {paymentType === "subscription" && (
                        <div className="text-sm text-gray-600">/месяц</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                После оплаты backend получает webhook, меняет статус платежа и автоматически выдает доступ к курсу.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
