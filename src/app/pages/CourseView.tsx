import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { mainCourse } from "../data/courseData";
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
  Circle,
  ShoppingCart,
} from "lucide-react";

type TabType = "overview" | "lessons" | "resources";

export function CourseView() {
  const { user, completeLesson, updateCurrentLesson } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("lessons");
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Вычисляем индекс текущего урока при загрузке
  useEffect(() => {
    if (user && user.hasAccess) {
      setSelectedLessonIndex(user.currentLesson);
    }
  }, [user]);

  if (!user) {
    navigate("/");
    return null;
  }

  // Функция для получения урока и его статуса
  const getLessonInfo = (globalIndex: number) => {
    let currentIndex = 0;
    for (const module of mainCourse.modules) {
      for (const lesson of module.lessons) {
        if (currentIndex === globalIndex) {
          const isCompleted = user.completedLessons.includes(globalIndex);
          const isLocked = !user.hasAccess || (user.completedLessons.length > 0 && globalIndex > Math.max(...user.completedLessons) + 1 && globalIndex > user.currentLesson);
          const isCurrent = globalIndex === user.currentLesson;
          
          return {
            lesson,
            isCompleted,
            isLocked,
            isCurrent,
          };
        }
        currentIndex++;
      }
    }
    return null;
  };

  const selectedLesson = getLessonInfo(selectedLessonIndex);

  const handleLessonClick = (globalIndex: number) => {
    const lessonInfo = getLessonInfo(globalIndex);
    if (!lessonInfo?.isLocked) {
      setSelectedLessonIndex(globalIndex);
      updateCurrentLesson(globalIndex);
      setIsPlaying(false);
    }
  };

  const handleMarkComplete = () => {
    completeLesson(selectedLessonIndex);
    
    // Автоматически переходим к следующему уроку, если он есть
    let currentIndex = 0;
    let totalLessons = 0;
    mainCourse.modules.forEach(m => totalLessons += m.lessons.length);
    
    if (selectedLessonIndex < totalLessons - 1) {
      setSelectedLessonIndex(selectedLessonIndex + 1);
      updateCurrentLesson(selectedLessonIndex + 1);
    }
  };

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
                  {mainCourse.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.hasAccess ? (
                <>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Share2 className="size-5 text-gray-600" />
                  </button>
                  {user.progress === 100 && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                      <Award className="size-4 inline mr-1" />
                      Получить сертификат
                    </button>
                  )}
                </>
              ) : (
                <Link
                  to="/purchase"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                >
                  <ShoppingCart className="size-4" />
                  Купить курс
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player / Lesson Content */}
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
              {user.hasAccess && selectedLesson && !selectedLesson.isLocked ? (
                <div className="text-center w-full h-full flex items-center justify-center">
                  {!isPlaying ? (
                    <>
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="inline-flex items-center justify-center size-20 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition cursor-pointer"
                      >
                        <PlayCircle className="size-10 text-white" />
                      </button>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white text-lg font-medium mb-1">
                          {selectedLesson.lesson.title}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {selectedLesson.lesson.duration}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-white text-center p-8">
                      <div className="mb-4">▶️ Видео воспроизводится...</div>
                      <p className="text-sm text-gray-300 max-w-lg mx-auto">
                        В реальном приложении здесь будет видео-плеер с интеграцией
                        Vimeo, YouTube или собственного видео-хостинга
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center size-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                    <Lock className="size-10 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    Урок заблокирован
                  </p>
                  <p className="text-gray-400">
                    {user.hasAccess
                      ? "Завершите предыдущие уроки, чтобы разблокировать этот"
                      : "Приобретите курс, чтобы получить доступ"}
                  </p>
                  {!user.hasAccess && (
                    <Link
                      to="/purchase"
                      className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Купить курс
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Lesson Controls */}
            {user.hasAccess && selectedLesson && !selectedLesson.isLocked && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {selectedLesson.lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedLesson.lesson.description}
                    </p>
                  </div>
                  {!selectedLesson.isCompleted ? (
                    <button
                      onClick={handleMarkComplete}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="size-5" />
                      Завершить урок
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="size-5" />
                      Завершено
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    Программа курса
                  </button>
                  {user.hasAccess && (
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
                  )}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        О курсе
                      </h3>
                      <p className="text-gray-600">{mainCourse.description}</p>
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
                  </div>
                )}

                {activeTab === "lessons" && (
                  <div className="space-y-4">
                    {mainCourse.modules.map((module, moduleIndex) => {
                      let globalIndex = 0;
                      // Вычисляем начальный индекс для этого модуля
                      for (let i = 0; i < moduleIndex; i++) {
                        globalIndex += mainCourse.modules[i].lessons.length;
                      }

                      return (
                        <div key={module.id} className="border border-gray-200 rounded-lg">
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900">
                              {module.title}
                            </h4>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const currentGlobalIndex = globalIndex + lessonIndex;
                              const lessonInfo = getLessonInfo(currentGlobalIndex);
                              const isSelected = selectedLessonIndex === currentGlobalIndex;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(currentGlobalIndex)}
                                  disabled={lessonInfo?.isLocked}
                                  className={`w-full p-4 flex items-center gap-4 text-left transition ${
                                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                                  } ${
                                    lessonInfo?.isLocked ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                >
                                  <div className="shrink-0">
                                    {lessonInfo?.isLocked ? (
                                      <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Lock className="size-4 text-gray-500" />
                                      </div>
                                    ) : lessonInfo?.isCompleted ? (
                                      <div className="size-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="size-5 text-green-600" />
                                      </div>
                                    ) : lessonInfo?.isCurrent ? (
                                      <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <PlayCircle className="size-5 text-blue-600" />
                                      </div>
                                    ) : (
                                      <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Circle className="size-5 text-gray-400" />
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
                                  {lessonInfo?.isCompleted && (
                                    <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                                      Завершено
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "resources" && user.hasAccess && (
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Конспект курса
                          </p>
                          <p className="text-sm text-gray-500">PDF • 5.2 MB</p>
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
                          <p className="text-sm text-gray-500">ZIP • 3.8 MB</p>
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

            {/* Comments */}
            {user.hasAccess && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="size-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Вопросы и обсуждение
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          Студент
                        </span>
                        <span className="text-sm text-gray-500">Вчера</span>
                      </div>
                      <p className="text-gray-600">
                        Отличное объяснение! Всё стало понятно
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <textarea
                    placeholder="Задайте вопрос или поделитесь мнением..."
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                О курсе
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Студентов</p>
                    <p className="font-semibold text-gray-900">
                      {mainCourse.students.toLocaleString()}
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
                      {mainCourse.duration}
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
                      {mainCourse.rating} / 5.0
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
                  {mainCourse.instructor.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {mainCourse.instructor}
                  </p>
                  <p className="text-sm text-gray-500">Senior Developer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Опытный разработчик с 10+ летним стажем в веб-разработке
              </p>
              {user.hasAccess && (
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Задать вопрос
                </button>
              )}
            </div>

            {/* Progress */}
            {user.hasAccess && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Ваш прогресс</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Завершено</span>
                    <span className="font-semibold">{user.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${user.progress}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Уроков пройдено</span>
                    <span className="font-semibold">
                      {user.completedLessons.length} /{" "}
                      {mainCourse.modules.reduce(
                        (acc, m) => acc + m.lessons.length,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
