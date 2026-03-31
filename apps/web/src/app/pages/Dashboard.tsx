import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  User,
  PlayCircle,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { formatDateLabel, getErrorMessage } from "../lib/formatters";
import { fetchDashboard, type DashboardResponse } from "../lib/lms-api";

export function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const nextDashboard = await fetchDashboard();
      setDashboard(nextDashboard);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Не удалось загрузить дашборд"));
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = Boolean(dashboard?.courses.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {dashboard?.profile.displayName ?? user.displayName}! 👋
          </h2>
          <p className="text-gray-600">
            {hasAccess
              ? "Продолжай обучение и достигай новых высот"
              : "Получи доступ к курсу и начни проходить MVP от первого урока до админки"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {errorMessage}
          </div>
        )}

        {!isLoading && !hasAccess && (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">
                Начните обучение прямо сейчас
              </h3>
              <p className="text-blue-100 text-sm">
                Выберите курс из каталога и получите доступ к урокам
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium shrink-0"
            >
              <BookOpen className="size-5" />
              Перейти в каталог
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-xl border border-gray-200 bg-white animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="size-6 text-blue-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboard?.stats.activeCourses ?? 0}
                </div>
                <div className="text-sm text-gray-600">Активных курса</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="size-6 text-purple-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboard?.stats.completedLessons ?? 0}
                </div>
                <div className="text-sm text-gray-600">Уроков завершено</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="size-6 text-green-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboard?.stats.studyHours ?? 0}
                </div>
                <div className="text-sm text-gray-600">Часов обучения</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Trophy className="size-6 text-orange-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboard?.stats.achievements ?? 0}
                </div>
                <div className="text-sm text-gray-600">Достижений</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Мои курсы
                  </h3>
                  <div className="space-y-4">
                    {dashboard?.courses.length ? (
                      dashboard.courses.map((course) => (
                        <div
                          key={course.enrollmentId}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {course.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {course.completedLessons} из {course.totalLessons} уроков • {course.timeLeft ?? "В процессе"}
                              </p>
                            </div>
                            {course.progress === 100 ? (
                              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle2 className="size-4" />
                                Завершен
                              </div>
                            ) : (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {course.progress}%
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  course.progress === 100 ? "bg-green-500" : "bg-blue-600"
                                } transition-all duration-300`}
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <PlayCircle className="size-4" />
                              {course.nextLesson ?? "Нет следующего урока"}
                            </div>
                            <Link
                              to={`/course/${course.courseSlug}`}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                              {course.progress === 100 ? "Повторить" : "Продолжить"}
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                        <p className="text-gray-500 mb-3">
                          У вас пока нет активных курсов.
                        </p>
                        <Link
                          to="/courses"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          <BookOpen className="size-4" />
                          Выбрать курс
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Недавняя активность
                  </h3>
                  <div className="space-y-4">
                    {dashboard?.recentActivity.length ? (
                      dashboard.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                            <Award className="size-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDateLabel(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">Активность пока не зафиксирована.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="size-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        {dashboard?.profile.displayName ?? user.displayName}
                      </h4>
                      <p className="text-blue-100 text-sm">
                        {dashboard?.profile.email ?? user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-100">Роль</span>
                      <span className="font-semibold">{dashboard?.profile.role ?? user.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-100">ID пользователя</span>
                      <span className="font-semibold text-xs">{user.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Достижения
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dashboard?.achievements.length ? (
                      dashboard.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="border border-gray-200 rounded-lg p-3 text-center hover:border-blue-300 transition"
                        >
                          <div className="text-3xl mb-2">{achievement.icon ?? "🏆"}</div>
                          <div className="text-xs font-semibold text-gray-900 mb-1">
                            {achievement.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {achievement.description}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-sm text-gray-500">
                        Достижения пока не начислены.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Учебный план
                    </h3>
                    <Calendar className="size-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {dashboard?.studyPlan.length ? (
                      dashboard.studyPlan.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-xs text-blue-600 font-semibold">
                              {item.weekday}
                            </div>
                            <div className="text-lg font-bold text-blue-600">{item.dayOfMonth}</div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">{item.timeRange}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">Учебный план пока не заполнен.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
