import { Link } from "react-router";
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
} from "lucide-react";

export function Dashboard() {
  const courses = [
    {
      id: "fullstack",
      title: "Full Stack Web Development",
      progress: 65,
      nextLesson: "React Hooks - useContext",
      totalLessons: 120,
      completedLessons: 78,
      timeLeft: "2 месяца",
    },
    {
      id: "python",
      title: "Python для начинающих",
      progress: 100,
      nextLesson: "Курс завершен",
      totalLessons: 60,
      completedLessons: 60,
      timeLeft: "Завершен",
    },
    {
      id: "datascience",
      title: "Data Science & ML",
      progress: 25,
      nextLesson: "Pandas - Data Manipulation",
      totalLessons: 150,
      completedLessons: 38,
      timeLeft: "6 месяцев",
    },
  ];

  const achievements = [
    { icon: "🏆", title: "Первый курс", description: "Завершил первый курс" },
    { icon: "🔥", title: "Неделя подряд", description: "7 дней активности" },
    { icon: "⭐", title: "100 уроков", description: "Пройдено 100 уроков" },
    { icon: "💎", title: "Отличник", description: "Все тесты на 90%+" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dimel's School
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings className="size-5 text-gray-600" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, Студент! 👋
          </h2>
          <p className="text-gray-600">
            Продолжай обучение и достигай новых высот
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="size-6 text-blue-600" />
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
            <div className="text-sm text-gray-600">Активных курса</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle2 className="size-6 text-purple-600" />
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">176</div>
            <div className="text-sm text-gray-600">Уроков завершено</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="size-6 text-green-600" />
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">127</div>
            <div className="text-sm text-gray-600">Часов обучения</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Trophy className="size-6 text-orange-600" />
              </div>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">Достижений</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Мои курсы
              </h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {course.completedLessons} из {course.totalLessons}{" "}
                          уроков • {course.timeLeft}
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

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            course.progress === 100
                              ? "bg-green-500"
                              : "bg-blue-600"
                          } transition-all duration-300`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PlayCircle className="size-4" />
                        {course.nextLesson}
                      </div>
                      <Link
                        to={`/course/${course.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        {course.progress === 100 ? "Повторить" : "Продолжить"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Недавняя активность
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg shrink-0">
                    <CheckCircle2 className="size-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Урок завершен: "React Hooks - useState"
                    </p>
                    <p className="text-sm text-gray-500">2 часа назад</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <Award className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Получено достижение: "100 уроков"
                    </p>
                    <p className="text-sm text-gray-500">Вчера</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                    <Trophy className="size-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Тест пройден на 95%: "JavaScript Основы"
                    </p>
                    <p className="text-sm text-gray-500">2 дня назад</p>
                  </div>
                </div>
              </div>
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
                  <h4 className="font-bold text-lg">Иван Петров</h4>
                  <p className="text-blue-100 text-sm">student@email.com</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Уровень</span>
                  <span className="font-semibold">Intermediate</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Рейтинг</span>
                  <span className="font-semibold">#127 из 10,000</span>
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
                    className="border border-gray-200 rounded-lg p-3 text-center hover:border-blue-300 transition"
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

            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Учебный план
                </h3>
                <Calendar className="size-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 font-semibold">
                      ПН
                    </div>
                    <div className="text-lg font-bold text-blue-600">17</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      React Advanced Patterns
                    </p>
                    <p className="text-xs text-gray-500">14:00 - 16:00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 font-semibold">
                      СР
                    </div>
                    <div className="text-lg font-bold text-gray-900">19</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Node.js Backend
                    </p>
                    <p className="text-xs text-gray-500">15:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
