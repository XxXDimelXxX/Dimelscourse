import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { mainCourse, getTotalLessons, getLessonByIndex } from "../data/courseData";
import {
  BookOpen,
  Code2,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  User,
  Settings,
  LogOut,
  PlayCircle,
  CheckCircle2,
  Trophy,
  Lock,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Если не авторизован, редирект на главную
  if (!user) {
    navigate("/");
    return null;
  }

  const totalLessons = getTotalLessons();
  const currentLesson = getLessonByIndex(user.currentLesson);

  const achievements = [
    { icon: "🏆", title: "Первый урок", description: "Начал обучение", unlocked: user.completedLessons.length > 0 },
    { icon: "🔥", title: "Неделя подряд", description: "7 дней активности", unlocked: user.completedLessons.length >= 5 },
    { icon: "⭐", title: "10 уроков", description: "Пройдено 10 уроков", unlocked: user.completedLessons.length >= 10 },
    { icon: "💎", title: "Половина пути", description: "50% курса", unlocked: user.progress >= 50 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dimel's School
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                Админка
              </Link>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings className="size-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            {user.hasAccess
              ? "Продолжай обучение и достигай новых высот"
              : "Приобрети курс и начни своё путешествие в мир программирования"}
          </p>
        </div>

        {/* No Access State */}
        {!user.hasAccess && (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="size-6" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  Доступ закрыт
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                {mainCourse.title}
              </h3>
              <p className="text-blue-100 mb-6 text-lg">
                {mainCourse.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  <span>{totalLessons} уроков</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5" />
                  <span>{mainCourse.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="size-5" />
                  <span>Сертификат</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/purchase"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium group"
                >
                  <ShoppingCart className="size-5" />
                  Купить курс от ${mainCourse.subscriptionPrice}/мес
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to={`/course/${mainCourse.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 transition border border-white/30 rounded-lg font-medium"
                >
                  Посмотреть программу
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Has Access - Stats and Course */}
        {user.hasAccess && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="size-6 text-blue-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {user.progress}%
                </div>
                <div className="text-sm text-gray-600">Прогресс курса</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="size-6 text-purple-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {user.completedLessons.length}
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
                  {totalLessons - user.completedLessons.length}
                </div>
                <div className="text-sm text-gray-600">Уроков осталось</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Trophy className="size-6 text-orange-600" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-sm text-gray-600">Достижений</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* My Course */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Мой курс
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {mainCourse.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.completedLessons.length} из {totalLessons} уроков
                        </p>
                      </div>
                      {user.progress === 100 ? (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircle2 className="size-4" />
                          Завершен
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {user.progress}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            user.progress === 100
                              ? "bg-green-500"
                              : "bg-blue-600"
                          } transition-all duration-300`}
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PlayCircle className="size-4" />
                        {currentLesson
                          ? `Следующий: ${currentLesson.title}`
                          : "Начните первый урок"}
                      </div>
                      <Link
                        to={`/course/${mainCourse.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        {user.progress === 0 ? "Начать" : user.progress === 100 ? "Повторить" : "Продолжить"}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Недавняя активность
                  </h3>
                  {user.completedLessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="size-12 mx-auto mb-3 text-gray-300" />
                      <p>Пока нет активности</p>
                      <p className="text-sm mt-1">Начните проходить уроки!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.completedLessons.slice(-3).reverse().map((lessonIndex) => {
                        const lesson = getLessonByIndex(lessonIndex);
                        return lesson ? (
                          <div key={lessonIndex} className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-lg shrink-0">
                              <CheckCircle2 className="size-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">
                                Урок завершен: "{lesson.title}"
                              </p>
                              <p className="text-sm text-gray-500">Недавно</p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="size-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{user.name}</h4>
                      <p className="text-blue-100 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-100">Статус</span>
                      <span className="font-semibold">
                        {user.role === "admin" ? "Администратор" : "Студент"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-100">Доступ к курсу</span>
                      <span className="font-semibold">
                        {user.hasAccess ? "Активен" : "Нет доступа"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Достижения
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 text-center transition ${
                          achievement.unlocked
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 opacity-50"
                        }`}
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <div className="text-xs font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {achievement.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                {user.hasAccess && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Следующие шаги
                    </h3>
                    <div className="space-y-3">
                      {currentLesson && (
                        <Link
                          to={`/course/${mainCourse.id}`}
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          <PlayCircle className="size-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {currentLesson.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {currentLesson.duration}
                            </p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
