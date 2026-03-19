import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BookOpen, Code2, Users, Award, ArrowRight, CheckCircle } from "lucide-react";

export function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы аутентификация
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
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

          {/* Right: Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center gap-2 group"
              >
                {isLoginMode ? "Войти" : "Зарегистрироваться"}
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

      {/* Courses Preview Section */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763568258299-0bac211f204e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBlZHVjYXRpb24lMjBvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NzM2ODkzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Web Development Course"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Популярный
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Full Stack Web Development
                </h3>
                <p className="text-gray-600 mb-4">
                  Полный курс по созданию современных веб-приложений с React и Node.js
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">6 месяцев • 120 уроков</span>
                  <span className="text-2xl font-bold text-blue-600">$299</span>
                </div>
                <Link
                  to="/course/fullstack"
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Подробнее
                </Link>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvdXJzZSUyMHN0dWRlbnQlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzM2ODkzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Python Programming Course"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Для начинающих
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Python для начинающих
                </h3>
                <p className="text-gray-600 mb-4">
                  Изучи основы программирования на самом популярном языке
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">3 месяца • 60 уроков</span>
                  <span className="text-2xl font-bold text-blue-600">$149</span>
                </div>
                <Link
                  to="/course/python"
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Подробнее
                </Link>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1660810731526-0720827cbd38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzM2MTg0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Data Science Course"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Продвинутый
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Science & ML
                </h3>
                <p className="text-gray-600 mb-4">
                  Освой анализ данных и машинное обучение от профессионалов
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">8 месяцев • 150 уроков</span>
                  <span className="text-2xl font-bold text-blue-600">$399</span>
                </div>
                <Link
                  to="/course/datascience"
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
