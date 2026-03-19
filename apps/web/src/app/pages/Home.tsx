import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BookOpen, Code2, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  getAuthSession,
  loginUser,
  registerUser,
  saveAuthSession,
} from "../lib/auth";
import { fetchPublishedCourses, type CourseCard } from "../lib/lms-api";

function levelLabel(level: string): string {
  switch (level) {
    case "beginner":
      return "Для начинающих";
    case "advanced":
      return "Продвинутый";
    default:
      return "Популярный";
  }
}

function levelBadgeClass(level: string): string {
  switch (level) {
    case "beginner":
      return "bg-green-600";
    case "advanced":
      return "bg-purple-600";
    default:
      return "bg-blue-600";
  }
}

export function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthSession()) {
      navigate("/dashboard", { replace: true });
      return;
    }

    void loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      setCoursesError(null);
      const nextCourses = await fetchPublishedCourses();
      setCourses(nextCourses);
    } catch (error) {
      setCoursesError(
        error instanceof Error ? error.message : "Не удалось загрузить курсы",
      );
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isLoginMode && password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isLoginMode) {
        const session = await loginUser({ email, password });
        saveAuthSession(session);
      } else {
        await registerUser({
          email,
          displayName,
          password,
        });

        const session = await loginUser({ email, password });
        saveAuthSession(session);
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось выполнить запрос",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dimel's School
            </h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#courses" className="text-gray-600 hover:text-blue-600 transition">
              Курсы
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">
              О нас
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">
              Контакты
            </a>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              🚀 Начни карьеру в IT
            </div>
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Освой программирование с нуля
            </h2>
            <p className="text-xl text-gray-600">
              Практические курсы по веб-разработке, созданные экспертами индустрии.
              Получи востребованную профессию за 6 месяцев.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">50+ курсов</div>
                  <div className="text-sm text-gray-600">Для всех уровней</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="size-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">10,000+ студентов</div>
                  <div className="text-sm text-gray-600">Активное сообщество</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="size-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Сертификаты</div>
                  <div className="text-sm text-gray-600">После завершения</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="size-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Поддержка 24/7</div>
                  <div className="text-sm text-gray-600">Менторы онлайн</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2 px-4 rounded-md transition ${
                  isLoginMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2 px-4 rounded-md transition ${
                  !isLoginMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Регистрация
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ваше имя"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Подождите..."
                  : isLoginMode
                    ? "Войти"
                    : "Зарегистрироваться"}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </button>
            </form>

            {isLoginMode && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Забыли пароль?
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="courses" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Популярные курсы
            </h2>
            <p className="text-xl text-gray-600">
              Выбери направление и начни обучение уже сегодня
            </p>
          </div>

          {coursesError && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {coursesError}
            </div>
          )}

          {isLoadingCourses ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 rounded-xl border border-gray-200 bg-gray-50 animate-pulse"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
              В базе пока нет опубликованных курсов.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={course.previewImageUrl ?? undefined}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium ${levelBadgeClass(course.level)}`}>
                      {levelLabel(course.level)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {course.summary}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        {course.duration} • {course.lessonCount} уроков
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${course.priceUsd}
                      </span>
                    </div>
                    <Link
                      to={`/course/${course.slug}`}
                      className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="size-6 text-blue-400" />
                <span className="font-bold text-lg">Dimel's School</span>
              </div>
              <p className="text-gray-400 text-sm">
                Образовательная платформа для будущих IT-специалистов
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Курсы</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition">Mobile Development</a></li>
                <li><a href="#" className="hover:text-white transition">Data Science</a></li>
                <li><a href="#" className="hover:text-white transition">DevOps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">О нас</a></li>
                <li><a href="#" className="hover:text-white transition">Преподаватели</a></li>
                <li><a href="#" className="hover:text-white transition">Карьера</a></li>
                <li><a href="#" className="hover:text-white transition">Блог</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@dimelsschool.com</li>
                <li>Тел: +7 (999) 123-45-67</li>
                <li>Telegram: @dimelsschool</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 Dimel's School. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
