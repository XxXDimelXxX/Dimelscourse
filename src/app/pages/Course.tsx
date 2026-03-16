import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Code2,
  ChevronLeft,
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  MessageSquare,
  Users,
  Star,
  Clock,
  Award,
  Download,
  Share2,
} from "lucide-react";

export function Course() {
  const { courseId } = useParams();
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "resources">("lessons");

  const courseData = {
    fullstack: {
      title: "Full Stack Web Development",
      instructor: "Дмитрий Иванов",
      rating: 4.8,
      students: 5420,
      duration: "6 месяцев",
      modules: [
        {
          title: "Модуль 1: Основы HTML & CSS",
          lessons: [
            { title: "Введение в HTML", duration: "15 мин", completed: true },
            { title: "HTML теги и структура", duration: "20 мин", completed: true },
            { title: "CSS стили и селекторы", duration: "25 мин", completed: true },
            { title: "CSS Flexbox", duration: "30 мин", completed: true },
          ],
        },
        {
          title: "Модуль 2: JavaScript Основы",
          lessons: [
            { title: "Переменные и типы данных", duration: "20 мин", completed: true },
            { title: "Функции в JavaScript", duration: "25 мин", completed: true },
            { title: "Массивы и объекты", duration: "30 мин", completed: false },
            { title: "DOM манипуляции", duration: "35 мин", completed: false },
          ],
        },
        {
          title: "Модуль 3: React Fundamentals",
          lessons: [
            { title: "Введение в React", duration: "20 мин", completed: false },
            { title: "Компоненты и Props", duration: "25 мин", completed: false },
            { title: "State и useState", duration: "30 мин", completed: false },
            { title: "useEffect и Lifecycle", duration: "35 мин", completed: false },
          ],
        },
        {
          title: "Модуль 4: Backend с Node.js",
          lessons: [
            { title: "Настройка Node.js", duration: "15 мин", completed: false, locked: true },
            { title: "Express.js основы", duration: "25 мин", completed: false, locked: true },
            { title: "REST API создание", duration: "30 мин", completed: false, locked: true },
            { title: "База данных MongoDB", duration: "40 мин", completed: false, locked: true },
          ],
        },
      ],
    },
    python: {
      title: "Python для начинающих",
      instructor: "Анна Смирнова",
      rating: 4.9,
      students: 8230,
      duration: "3 месяца",
      modules: [
        {
          title: "Модуль 1: Основы Python",
          lessons: [
            { title: "Установка Python", duration: "10 мин", completed: true },
            { title: "Первая программа", duration: "15 мин", completed: true },
            { title: "Переменные и типы", duration: "20 мин", completed: true },
          ],
        },
      ],
    },
    datascience: {
      title: "Data Science & ML",
      instructor: "Петр Козлов",
      rating: 4.7,
      students: 3120,
      duration: "8 месяцев",
      modules: [
        {
          title: "Модуль 1: Введение в Data Science",
          lessons: [
            { title: "Что такое Data Science", duration: "20 мин", completed: true },
            { title: "Инструменты аналитика", duration: "25 мин", completed: true },
          ],
        },
      ],
    },
  };

  const course = courseData[courseId as keyof typeof courseData] || courseData.fullstack;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="size-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <Code2 className="size-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  {course.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="size-5 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Скачать сертификат
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 cursor-pointer hover:bg-white/20 transition">
                  <PlayCircle className="size-10 text-white" />
                </div>
                <p className="text-white text-lg font-medium">
                  {course.modules[0].lessons[activeLesson]?.title || "Урок"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Нажмите для воспроизведения
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="border-b border-gray-200">
                <div className="flex gap-6 px-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "overview"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Обзор
                  </button>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "lessons"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Уроки
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "resources"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Материалы
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        О курсе
                      </h3>
                      <p className="text-gray-600">
                        Этот курс предназначен для тех, кто хочет освоить современную веб-разработку
                        с нуля. Вы изучите все необходимые технологии: от основ HTML и CSS до продвинутых
                        концепций React и разработки серверной части на Node.js.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Чему вы научитесь
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600">
                            Создавать современные веб-приложения с React
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600">
                            Разрабатывать серверную часть с Node.js и Express
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600">
                            Работать с базами данных MongoDB
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600">
                            Применять лучшие практики разработки
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Требования
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="size-1.5 bg-gray-400 rounded-full shrink-0 mt-2" />
                          <span className="text-gray-600">
                            Базовые знания работы с компьютером
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="size-1.5 bg-gray-400 rounded-full shrink-0 mt-2" />
                          <span className="text-gray-600">
                            Желание учиться и развиваться
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "lessons" && (
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900">
                            {module.title}
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lessonIndex}
                              onClick={() => !lesson.locked && setActiveLesson(lessonIndex)}
                              disabled={lesson.locked}
                              className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition text-left ${
                                lesson.locked ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <div className="shrink-0">
                                {lesson.locked ? (
                                  <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Lock className="size-4 text-gray-500" />
                                  </div>
                                ) : lesson.completed ? (
                                  <div className="size-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="size-5 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <PlayCircle className="size-5 text-blue-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {lesson.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {lesson.duration}
                                </p>
                              </div>
                              {lesson.completed && (
                                <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Завершено
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Конспект модуля 1
                          </p>
                          <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <Download className="size-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Code2 className="size-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Примеры кода
                          </p>
                          <p className="text-sm text-gray-500">ZIP • 1.8 MB</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <Download className="size-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Дополнительные материалы
                          </p>
                          <p className="text-sm text-gray-500">PDF • 3.1 MB</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <Download className="size-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Обсуждение
                </h3>
                <span className="text-sm text-gray-500">(24)</span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Алексей Морозов
                      </span>
                      <span className="text-sm text-gray-500">2 дня назад</span>
                    </div>
                    <p className="text-gray-600">
                      Отличный курс! Все очень понятно объясняется. Особенно
                      понравился модуль про React.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="size-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Мария Соколова
                      </span>
                      <span className="text-sm text-gray-500">5 дней назад</span>
                    </div>
                    <p className="text-gray-600">
                      Спасибо за курс! Уже нашла первую работу благодаря
                      полученным знаниям 🎉
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <textarea
                  placeholder="Добавить комментарий..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Информация о курсе
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Студентов</p>
                    <p className="font-semibold text-gray-900">
                      {course.students.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Длительность</p>
                    <p className="font-semibold text-gray-900">
                      {course.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="size-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Рейтинг</p>
                    <p className="font-semibold text-gray-900">
                      {course.rating} / 5.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Сертификат</p>
                    <p className="font-semibold text-gray-900">Да</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Преподаватель
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-gray-500">Senior Developer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Опытный разработчик с 10+ летним стажем. Работал в крупных IT
                компаниях и создал более 50 успешных проектов.
              </p>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Связаться
              </button>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Ваш прогресс</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Завершено</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-[65%]" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">Уроков пройдено</span>
                  <span className="font-semibold">78 / 120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Осталось времени</span>
                  <span className="font-semibold">2 месяца</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
