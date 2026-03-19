import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
import { getAuthSession } from "../lib/auth";
import {
  completeLesson,
  createCourseComment,
  fetchCourseComments,
  fetchCourseDetails,
  fetchCourseWorkspace,
  type CourseComment,
  type CourseDetailsResponse,
  type CourseWorkspaceResponse,
} from "../lib/lms-api";

function formatDurationMinutes(minutes: number): string {
  return `${minutes} мин`;
}

function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const session = getAuthSession();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "resources">("lessons");
  const [courseDetails, setCourseDetails] = useState<CourseDetailsResponse | null>(null);
  const [courseWorkspace, setCourseWorkspace] = useState<CourseWorkspaceResponse | null>(null);
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);

  useEffect(() => {
    if (!courseId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    void loadCourse(courseId);
  }, [courseId, navigate]);

  const loadCourse = async (slug: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [details, nextComments] = await Promise.all([
        fetchCourseDetails(slug),
        fetchCourseComments(slug),
      ]);

      setCourseDetails(details);
      setComments(nextComments);

      if (session) {
        try {
          const workspace = await fetchCourseWorkspace(slug, session.user.id);
          setCourseWorkspace(workspace);
        } catch {
          setCourseWorkspace(null);
        }
      } else {
        setCourseWorkspace(null);
      }

      const firstLessonId =
        details.modules
          .flatMap((module) => module.lessons)
          .sort((left, right) => left.position - right.position)[0]?.id ?? null;

      setActiveLessonId((current) => current ?? firstLessonId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось загрузить курс",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const course = courseWorkspace?.course ?? courseDetails;

  const modules = useMemo(() => {
    if (!course) {
      return [];
    }

    return course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        durationLabel:
          "durationMinutes" in lesson
            ? formatDurationMinutes(lesson.durationMinutes)
            : formatDurationMinutes(lesson.durationMinutes),
      })),
    }));
  }, [course]);

  const allLessons = useMemo(
    () =>
      modules
        .flatMap((module) => module.lessons)
        .sort((left, right) => left.position - right.position),
    [modules],
  );

  const activeLesson =
    allLessons.find((lesson) => lesson.id === activeLessonId) ?? allLessons[0] ?? null;

  const progress = courseWorkspace?.enrollment ?? null;

  const handleCompleteLesson = async () => {
    if (!courseId || !session || !activeLesson || !courseWorkspace) {
      return;
    }

    try {
      setIsCompletingLesson(true);
      await completeLesson(courseId, activeLesson.id, session.user.id);
      await loadCourse(courseId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось отметить урок",
      );
    } finally {
      setIsCompletingLesson(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!courseId || !session || !commentBody.trim()) {
      return;
    }

    try {
      setIsSubmittingComment(true);
      await createCourseComment(courseId, {
        userId: session.user.id,
        body: commentBody.trim(),
      });
      setCommentBody("");
      const nextComments = await fetchCourseComments(courseId);
      setComments(nextComments);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось отправить комментарий",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-16 rounded-xl bg-white border border-gray-100 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[32rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
            <div className="h-[32rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
          {errorMessage ?? "Курс не найден"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={session ? "/dashboard" : "/"}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="size-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <Code2 className="size-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="size-5 text-gray-600" />
              </button>
              {progress && (
                <button
                  type="button"
                  disabled={!activeLesson || isCompletingLesson}
                  onClick={handleCompleteLesson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60"
                >
                  {isCompletingLesson ? "Сохраняем..." : "Отметить урок"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <PlayCircle className="size-10 text-white" />
                </div>
                <p className="text-white text-lg font-medium">
                  {activeLesson?.title ?? "Урок"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {activeLesson ? formatDurationMinutes(activeLesson.durationMinutes) : "Видео пока недоступно"}
                </p>
              </div>
            </div>

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
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">О курсе</h3>
                      <p className="text-gray-600">
                        {course.description ?? course.summary}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Длительность</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.duration}</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Рейтинг</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.rating} / 5.0</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Студентов</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.studentsCount.toLocaleString("ru-RU")}</div>
                      </div>
                    </div>

                    {course.instructor && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Преподаватель</h3>
                        <p className="text-gray-900 font-medium">{course.instructor.fullName}</p>
                        <p className="text-sm text-gray-500">{course.instructor.title}</p>
                        {course.instructor.bio && (
                          <p className="text-gray-600 mt-3">{course.instructor.bio}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "lessons" && (
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => !lesson.locked && setActiveLessonId(lesson.id)}
                              disabled={Boolean((lesson as { locked?: boolean }).locked)}
                              className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition text-left ${
                                (lesson as { locked?: boolean }).locked ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <div className="shrink-0">
                                {(lesson as { locked?: boolean }).locked ? (
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
                                <p className="font-medium text-gray-900">{lesson.title}</p>
                                <p className="text-sm text-gray-500">
                                  {formatDurationMinutes(lesson.durationMinutes)}
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
                    {course.resources.length ? (
                      course.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="size-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{resource.title}</p>
                              <p className="text-sm text-gray-500">
                                {resource.type.toUpperCase()} {resource.fileSizeLabel ? `• ${resource.fileSizeLabel}` : ""}
                              </p>
                            </div>
                          </div>
                          <a
                            href={resource.fileUrl ?? "#"}
                            className={`p-2 rounded-lg transition ${
                              resource.fileUrl ? "hover:bg-gray-200" : "opacity-40 pointer-events-none"
                            }`}
                          >
                            <Download className="size-5 text-gray-600" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">Материалы пока не добавлены.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Обсуждение</h3>
                <span className="text-sm text-gray-500">({comments.length})</span>
              </div>

              <div className="space-y-4">
                {comments.length ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold">
                        {comment.author.displayName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {comment.author.displayName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDateLabel(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600">{comment.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Комментариев пока нет.</div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                {session ? (
                  <>
                    <textarea
                      value={commentBody}
                      onChange={(event) => setCommentBody(event.target.value)}
                      placeholder="Добавить комментарий..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        disabled={isSubmittingComment || !commentBody.trim()}
                        onClick={handleSubmitComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60"
                      >
                        {isSubmittingComment ? "Отправка..." : "Отправить"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    Чтобы писать комментарии и отмечать уроки, войдите в аккаунт.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
                      {course.studentsCount.toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Длительность</p>
                    <p className="font-semibold text-gray-900">{course.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="size-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Рейтинг</p>
                    <p className="font-semibold text-gray-900">{course.rating} / 5.0</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Сертификат</p>
                    <p className="font-semibold text-gray-900">
                      {"certificateAvailable" in course && course.certificateAvailable ? "Да" : "Нет данных"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {course.instructor && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Преподаватель</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {course.instructor.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{course.instructor.fullName}</p>
                    <p className="text-sm text-gray-500">{course.instructor.title}</p>
                  </div>
                </div>
                {course.instructor.bio && (
                  <p className="text-sm text-gray-600 mb-4">{course.instructor.bio}</p>
                )}
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">
                {progress ? "Ваш прогресс" : "Доступ к обучению"}
              </h3>
              {progress ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Прогресс курса</span>
                      <span>{progress.progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${progress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-blue-100">
                    <div>Завершено уроков: {progress.completedLessons} из {progress.totalLessons}</div>
                    <div>Следующий урок: {progress.nextLessonTitle ?? "Курс завершен"}</div>
                    <div>Статус: {progress.status}</div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-blue-100">
                  Авторизуйтесь и запишитесь на курс, чтобы видеть персональный прогресс.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
